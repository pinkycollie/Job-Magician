# MBTQ Technology Reference Guide

## Platform Overview (2026)

This document references the latest documentation for Vercel, Next.js, Deno, and GCP AI
to guide architectural decisions for the MBTQ Lifecycle System.

---

## 1. Vercel (Frontend + Edge)

### Key Updates (2026)

- **Fluid Compute**: Edge Middleware and Edge Functions now run on unified Vercel Functions
- **Multi-Runtime Support**: Node.js and Edge runtimes under one system
- **Edge Functions Deprecated**: Use Vercel Functions with Node.js runtime for new projects
- **Execution Limits**: 300s max for Edge runtime, must start response within 25s for streaming

### Configuration

```json
// vercel.json - Multi-service setup
{
  "experimentalServices": {
    "frontend": {
      "entrypoint": "frontend",
      "routePrefix": "/"
    },
    "backend": {
      "entrypoint": "backend",
      "routePrefix": "/api"
    }
  }
}
```

### Best Practices

1. **Use Node.js runtime** for full API support (not Edge)
2. **Route Middleware** (`proxy.ts`) for auth/redirects at edge
3. **Fluid compute** handles concurrency automatically
4. **Set Framework Preset to "Services"** in deployment settings

### Environment Variables

```bash
# Required for Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key

# Optional for GCP AI
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
```

---

## 2. Next.js 16 (Frontend Framework)

### Key Updates

- **Turbopack**: Now default bundler, stable
- **React Compiler**: Stable support via `reactCompiler` in next.config.ts
- **Async APIs**: `params`, `searchParams`, `headers`, `cookies` must be awaited
- **proxy.ts**: Replaces middleware.ts (backwards compatible)
- **Cache Components**: New `"use cache"` directive for explicit caching

### Server Actions (Stable)

```typescript
// app/actions/lifecycle.ts
"use server"

export async function createLifecycleItem(formData: FormData) {
  const title = formData.get("title") as string
  
  const response = await fetch(`${process.env.API_URL}/lifecycle/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  })
  
  return response.json()
}
```

### Route Handlers

```typescript
// app/api/lifecycle/route.ts
export async function GET() {
  const response = await fetch(`${process.env.BACKEND_URL}/lifecycle/list`)
  return Response.json(await response.json())
}

export async function POST(request: Request) {
  const body = await request.json()
  const response = await fetch(`${process.env.BACKEND_URL}/lifecycle/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
  return Response.json(await response.json())
}
```

### Caching (Next.js 16)

```typescript
// Use built-in cacheLife profiles
import { revalidateTag } from "next/cache"

// Revalidate with SWR behavior
revalidateTag("lifecycle-items", "max")

// Or custom revalidation time
revalidateTag("lifecycle-items", { revalidate: 3600 })

// updateTag for read-your-writes in Server Actions
import { updateTag } from "next/cache"
updateTag("lifecycle-items")
```

### Cache Components

```typescript
// Enable in next.config.ts
const nextConfig = {
  cacheComponents: true,
}

// Then use "use cache" directive
export async function LifecycleList() {
  "use cache"
  const items = await fetchLifecycleItems()
  return <ItemsList items={items} />
}
```

---

## 3. Deno (Alternative Runtime / Edge)

### Deno Deploy (2026)

- **V2 API**: Migrate from v1 by July 20, 2026
- **New Console**: console.deno.com
- **Config as Code**: `deno.json` / `deno.jsonc`
- **MicroVMs**: Programmatic provisioning via SDK

### Deno KV (Key-Value Database)

```typescript
// deno.json
{
  "name": "mbtq-deno",
  "version": "1.0.0",
  "exports": "./main.ts",
  "tasks": {
    "dev": "deno run --allow-net --allow-env --unstable-kv main.ts"
  }
}
```

```typescript
// main.ts - Deno + Oak + KV
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts"

const kv = await Deno.openKv()
const app = new Application()
const router = new Router()

// List lifecycle items
router.get("/lifecycle/list", async (ctx) => {
  const items = []
  const entries = kv.list({ prefix: ["lifecycle"] })
  for await (const entry of entries) {
    items.push(entry.value)
  }
  ctx.response.body = items
})

// Create lifecycle item
router.post("/lifecycle/create", async (ctx) => {
  const body = await ctx.request.body.json()
  const id = crypto.randomUUID()
  const item = {
    id,
    title: body.title,
    stage: "idea",
    workflow_id: body.workflow_id || "default",
    data: body.data || {},
    created_at: new Date().toISOString()
  }
  await kv.set(["lifecycle", id], item)
  ctx.response.body = item
})

// Update stage
router.post("/lifecycle/update-stage", async (ctx) => {
  const body = await ctx.request.body.json()
  const key = ["lifecycle", body.id]
  const entry = await kv.get(key)
  if (!entry.value) {
    ctx.response.status = 404
    ctx.response.body = { error: "Item not found" }
    return
  }
  const updated = { ...entry.value, stage: body.stage }
  await kv.set(key, updated)
  ctx.response.body = updated
})

app.use(router.routes())
app.use(router.allowedMethods())

console.log("Deno server running on http://localhost:8000")
await app.listen({ port: 8000 })
```

### Deno Deploy SDK

```typescript
// Programmatic deployment management
import { DenoDeployClient } from "npm:@deno/deploy-api"

const client = new DenoDeployClient({
  token: Deno.env.get("DENO_DEPLOY_TOKEN")
})

// List apps
const apps = await client.apps.list({ organizationId: "your-org" })

// Create app
const app = await client.apps.create({
  organizationId: "your-org",
  name: "mbtq-lifecycle"
})
```

### Node.js Compatibility (Deno KV)

```typescript
// Use from Node.js via npm
import { openKv } from "@deno/kv"

const kv = await openKv("https://api.deno.com/databases/<id>/connect")
```

---

## 4. GCP AI Backend (Heavy Compute)

### Architecture for Heavy Workloads

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        MBTQ LIFECYCLE SYSTEM                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────┐ │
│  │   Vercel    │───▶│  Cloud Run  │───▶│      Vertex AI             │ │
│  │  Frontend   │    │  FastAPI    │    │  (Heavy AI Processing)     │ │
│  │  + Edge     │    │  (Light)    │    │                            │ │
│  └─────────────┘    └─────────────┘    │  - Gemini 2.5 Pro          │ │
│                                         │  - Batch Prediction        │ │
│                                         │  - Provisioned Throughput  │ │
│                                         │  - GPU Jobs                │ │
│                                         └─────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Cloud Run (FastAPI for AI Workloads)

```dockerfile
# Dockerfile for Cloud Run
FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Run with gunicorn for production
CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8080"]
```

```python
# requirements.txt for Cloud Run + Vertex AI
fastapi
uvicorn
gunicorn
google-cloud-aiplatform
google-genai
supabase
```

### Vertex AI Integration (Python)

```python
# backend/ai_service.py
import os
from google import genai
from google.genai.types import GenerateContentConfig, SafetySetting

# Initialize client for Vertex AI
client = genai.Client(
    vertexai=True,
    project=os.getenv("GOOGLE_CLOUD_PROJECT"),
    location=os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")
)

async def analyze_lifecycle_stage(item: dict) -> dict:
    """Use Gemini to analyze and recommend next stage."""
    
    prompt = f"""
    Analyze this lifecycle item and recommend the next stage:
    
    Title: {item['title']}
    Current Stage: {item['stage']}
    Data: {item.get('data', {})}
    Metrics: {item.get('metrics', {})}
    
    Stages: idea → build → grow → managed → sunset
    
    Respond with JSON:
    {{
        "recommended_stage": "...",
        "confidence": 0.0-1.0,
        "reasoning": "...",
        "action_items": ["..."]
    }}
    """
    
    response = await client.aio.models.generate_content(
        model="gemini-2.5-pro",
        contents=prompt,
        config=GenerateContentConfig(
            temperature=0.2,
            max_output_tokens=1024,
        )
    )
    
    return response.text

async def batch_analyze_items(items: list[dict]) -> list[dict]:
    """Batch process multiple items (use for heavy workloads)."""
    
    # For large batches, use Vertex AI Batch Prediction
    # This is more cost-effective than real-time calls
    
    from google.cloud import aiplatform
    
    aiplatform.init(
        project=os.getenv("GOOGLE_CLOUD_PROJECT"),
        location=os.getenv("GOOGLE_CLOUD_LOCATION")
    )
    
    # Create batch prediction job
    batch_prediction_job = aiplatform.BatchPredictionJob.create(
        job_display_name="lifecycle-analysis-batch",
        model_name="publishers/google/models/gemini-2.5-pro",
        instances_format="jsonl",
        predictions_format="jsonl",
        gcs_source=f"gs://{os.getenv('GCS_BUCKET')}/batch-input.jsonl",
        gcs_destination_prefix=f"gs://{os.getenv('GCS_BUCKET')}/batch-output/",
    )
    
    return batch_prediction_job
```

### FastAPI + Vertex AI Endpoints

```python
# backend/main.py additions for AI
from fastapi import BackgroundTasks
from ai_service import analyze_lifecycle_stage, batch_analyze_items

@app.post("/lifecycle/analyze")
async def analyze_item(item_id: str):
    """Real-time AI analysis of single item."""
    client = get_supabase()
    result = client.table("lifecycle_items").select("*").eq("id", item_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Item not found")
    
    analysis = await analyze_lifecycle_stage(result.data[0])
    return {"item": result.data[0], "analysis": analysis}

@app.post("/lifecycle/batch-analyze")
async def batch_analyze(background_tasks: BackgroundTasks):
    """Queue batch analysis for all items (heavy workload)."""
    client = get_supabase()
    items = client.table("lifecycle_items").select("*").execute()
    
    # Run in background for heavy processing
    background_tasks.add_task(batch_analyze_items, items.data)
    
    return {"status": "queued", "items_count": len(items.data)}

@app.post("/lifecycle/auto-progress")
async def auto_progress_item(item_id: str):
    """AI-driven automatic stage progression."""
    client = get_supabase()
    result = client.table("lifecycle_items").select("*").eq("id", item_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Item not found")
    
    item = result.data[0]
    analysis = await analyze_lifecycle_stage(item)
    
    # Parse AI recommendation
    import json
    recommendation = json.loads(analysis)
    
    if recommendation["confidence"] > 0.7:
        # Auto-progress if high confidence
        updated = client.table("lifecycle_items").update({
            "stage": recommendation["recommended_stage"],
            "data": {
                **item.get("data", {}),
                "ai_analysis": recommendation
            }
        }).eq("id", item_id).execute()
        
        return {"progressed": True, "item": updated.data[0]}
    
    return {"progressed": False, "recommendation": recommendation}
```

### Provisioned Throughput (Production)

```python
# For guaranteed capacity in production
# Configure in GCP Console or via API

from google.cloud import aiplatform

# Reserve throughput for consistent performance
endpoint = aiplatform.Endpoint.create(
    display_name="mbtq-lifecycle-endpoint",
    project=os.getenv("GOOGLE_CLOUD_PROJECT"),
    location=os.getenv("GOOGLE_CLOUD_LOCATION"),
)

# Deploy with provisioned throughput
model = aiplatform.Model("publishers/google/models/gemini-2.5-pro")
endpoint.deploy(
    model=model,
    min_replica_count=1,
    max_replica_count=10,
    traffic_percentage=100,
    # Enable autoscaling
    autoscaling_target_cpu_utilization=70,
)
```

---

## 5. Recommended Architecture

### Development (Current MVP)

```
Vercel (Frontend + Backend)
    │
    ├── Next.js 16 (frontend/)
    │   └── Server Actions + Route Handlers
    │
    ├── FastAPI (backend/)
    │   └── Supabase queries
    │
    └── Supabase (database)
```

### Production (With AI)

```
Vercel                     GCP
┌────────────────┐        ┌─────────────────────────────┐
│  Next.js 16    │        │  Cloud Run                  │
│  (Frontend)    │───────▶│  FastAPI + Vertex AI SDK    │
│                │        │                             │
│  proxy.ts      │        │  ┌─────────────────────┐   │
│  (Auth/Routes) │        │  │  Vertex AI          │   │
└────────────────┘        │  │  - Gemini 2.5       │   │
                          │  │  - Batch Jobs       │   │
                          │  │  - Provisioned TPU  │   │
                          │  └─────────────────────┘   │
                          └─────────────────────────────┘
                                       │
                          ┌────────────┴────────────┐
                          │                         │
                    ┌─────▼─────┐           ┌──────▼──────┐
                    │ Supabase  │           │ Cloud       │
                    │ (Primary) │           │ Storage     │
                    │           │           │ (Batch I/O) │
                    └───────────┘           └─────────────┘
```

### Alternative: Deno Deploy (Edge-First)

```
Deno Deploy                     GCP (Heavy Compute)
┌────────────────────────┐     ┌─────────────────────┐
│  Deno + Oak            │     │  Cloud Run          │
│  (API Server)          │────▶│  (AI Processing)    │
│                        │     │                     │
│  Deno KV               │     │  Vertex AI          │
│  (Fast Reads/Writes)   │     │  (Heavy Analysis)   │
└────────────────────────┘     └─────────────────────┘
```

---

## 6. Environment Variables Summary

```bash
# Supabase (Required)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key

# GCP AI (For heavy compute)
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Optional: GCS for batch processing
GCS_BUCKET=mbtq-lifecycle-data

# Deno Deploy (If using)
DENO_DEPLOY_TOKEN=your-token
DENO_KV_ACCESS_TOKEN=your-kv-token
```

---

## 7. Quick Reference Links

### Vercel
- Functions: https://vercel.com/docs/functions
- Edge Runtime: https://vercel.com/docs/functions/runtimes/edge
- Fluid Compute: https://vercel.com/docs/functions/configuring-functions/concurrency

### Next.js 16
- Release Notes: https://nextjs.org/blog/next-16
- Server Actions: https://nextjs.org/docs/app/api-reference/next-config-js/serverActions
- Route Handlers: https://nextjs.org/docs/app/guides/backend-for-frontend

### Deno
- Deploy V2: https://docs.deno.com/deploy/early-access
- KV Database: https://docs.deno.com/kv/manual
- Migration Guide: https://docs.deno.com/deploy/migration_guide

### GCP AI
- Vertex AI SDK: https://cloud.google.com/vertex-ai/generative-ai/docs/sdks/overview
- Cloud Run: https://cloud.google.com/run/docs
- Batch Prediction: https://cloud.google.com/vertex-ai/docs/predictions/batch-prediction
- Provisioned Throughput: https://cloud.google.com/vertex-ai/docs/predictions/configure-compute

---

## 8. Migration Path

### Phase 1: Current MVP (Vercel + Supabase)
- FastAPI backend on Vercel Functions
- Next.js frontend
- Supabase database

### Phase 2: Add AI (GCP)
1. Deploy FastAPI to Cloud Run
2. Add Vertex AI SDK
3. Implement `/lifecycle/analyze` endpoint
4. Keep frontend on Vercel

### Phase 3: Scale (Optional)
- Provisioned Throughput for consistent AI performance
- Batch Prediction for large-scale analysis
- Deno KV for edge caching (optional)

---

*Last updated: May 2026*
*Based on: Vercel, Next.js 16, Deno Deploy V2, GCP Vertex AI*
