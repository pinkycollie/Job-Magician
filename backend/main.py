import os
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from pydantic import BaseModel
from typing import Optional
from ai_service import get_ai_service, AnalysisResult

app = FastAPI(
    title="MBTQ Lifecycle API",
    description="Lifecycle management with optional GCP AI integration",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Optional[Client] = None

def get_supabase() -> Client:
    global supabase
    if supabase is None:
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise HTTPException(
                status_code=500,
                detail="Supabase credentials not configured. Set SUPABASE_URL and SUPABASE_KEY environment variables."
            )
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    return supabase

# Models
class LifecycleItemCreate(BaseModel):
    title: str
    workflow_id: Optional[str] = "default"
    data: Optional[dict] = {}

class LifecycleItemUpdate(BaseModel):
    id: str
    stage: str

# Routes
@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/lifecycle/create")
def create_lifecycle_item(payload: LifecycleItemCreate):
    try:
        client = get_supabase()
        result = client.table("lifecycle_items").insert({
            "title": payload.title,
            "stage": "idea",
            "workflow_id": payload.workflow_id,
            "data": payload.data
        }).execute()
        return result.data[0] if result.data else result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/lifecycle/update-stage")
def update_stage(payload: LifecycleItemUpdate):
    try:
        client = get_supabase()
        result = client.table("lifecycle_items").update({
            "stage": payload.stage
        }).eq("id", payload.id).execute()
        return result.data[0] if result.data else result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/lifecycle/list")
def list_lifecycle_items():
    try:
        client = get_supabase()
        result = client.table("lifecycle_items").select("*").order("created_at", desc=True).execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# AI-Powered Endpoints (GCP Vertex AI)

@app.get("/ai/status")
def ai_status():
    """Check if AI service is available."""
    service = get_ai_service()
    return {
        "available": service.is_available(),
        "provider": "gcp-vertex-ai" if service.is_available() else "mock",
        "model": "gemini-2.5-pro" if service.is_available() else "mock"
    }


@app.post("/lifecycle/analyze/{item_id}")
async def analyze_lifecycle_item(item_id: str):
    """
    AI analysis of a lifecycle item.
    Returns recommended next stage with confidence and reasoning.
    """
    try:
        client = get_supabase()
        result = client.table("lifecycle_items").select("*").eq("id", item_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Item not found")
        
        item = result.data[0]
        service = get_ai_service()
        analysis = await service.analyze_item(item)
        
        return {
            "item": item,
            "analysis": {
                "recommended_stage": analysis.recommended_stage,
                "confidence": analysis.confidence,
                "reasoning": analysis.reasoning,
                "action_items": analysis.action_items
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/lifecycle/auto-progress/{item_id}")
async def auto_progress_item(item_id: str, threshold: float = 0.7):
    """
    AI-driven automatic stage progression.
    Only progresses if confidence exceeds threshold.
    """
    try:
        client = get_supabase()
        result = client.table("lifecycle_items").select("*").eq("id", item_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Item not found")
        
        item = result.data[0]
        service = get_ai_service()
        should_progress, analysis = await service.should_auto_progress(item, threshold)
        
        if should_progress:
            # Update the item with AI recommendation
            updated = client.table("lifecycle_items").update({
                "stage": analysis.recommended_stage,
                "data": {
                    **item.get("data", {}),
                    "last_ai_analysis": {
                        "confidence": analysis.confidence,
                        "reasoning": analysis.reasoning,
                        "action_items": analysis.action_items
                    }
                }
            }).eq("id", item_id).execute()
            
            return {
                "progressed": True,
                "from_stage": item["stage"],
                "to_stage": analysis.recommended_stage,
                "confidence": analysis.confidence,
                "item": updated.data[0] if updated.data else None
            }
        
        return {
            "progressed": False,
            "current_stage": item["stage"],
            "recommended_stage": analysis.recommended_stage,
            "confidence": analysis.confidence,
            "threshold": threshold,
            "reasoning": analysis.reasoning,
            "action_items": analysis.action_items
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


async def _batch_analyze_items(items: list[dict]):
    """Background task for batch analysis."""
    service = get_ai_service()
    results = []
    for item in items:
        try:
            analysis = await service.analyze_item(item)
            results.append({
                "item_id": item["id"],
                "analysis": {
                    "recommended_stage": analysis.recommended_stage,
                    "confidence": analysis.confidence
                }
            })
        except Exception as e:
            results.append({
                "item_id": item["id"],
                "error": str(e)
            })
    return results


@app.post("/lifecycle/batch-analyze")
async def batch_analyze(background_tasks: BackgroundTasks):
    """
    Queue batch analysis for all lifecycle items.
    Runs in background for heavy workloads.
    """
    try:
        client = get_supabase()
        result = client.table("lifecycle_items").select("*").execute()
        items = result.data
        
        if not items:
            return {"status": "no_items", "count": 0}
        
        # Add to background tasks
        background_tasks.add_task(_batch_analyze_items, items)
        
        return {
            "status": "queued",
            "items_count": len(items),
            "message": "Batch analysis started in background"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
