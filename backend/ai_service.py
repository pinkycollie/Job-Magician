"""
GCP Vertex AI Integration for MBTQ Lifecycle System

This module provides AI-powered analysis and automation for lifecycle items.
Uses Google's Gemini 2.5 Pro via Vertex AI for heavy compute workloads.

Setup:
1. Enable Vertex AI API in GCP Console
2. Create service account with Vertex AI User role
3. Set environment variables:
   - GOOGLE_CLOUD_PROJECT
   - GOOGLE_CLOUD_LOCATION (default: us-central1)
   - GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON)
"""

import os
import json
from typing import Optional
from dataclasses import dataclass

# Check if GCP dependencies are available
try:
    from google import genai
    from google.genai.types import GenerateContentConfig
    GCP_AVAILABLE = True
except ImportError:
    GCP_AVAILABLE = False

@dataclass
class AnalysisResult:
    """Result of AI lifecycle analysis."""
    recommended_stage: str
    confidence: float
    reasoning: str
    action_items: list[str]
    raw_response: Optional[str] = None

class LifecycleAIService:
    """AI service for analyzing and automating lifecycle progression."""
    
    STAGES = ["idea", "build", "grow", "managed", "sunset"]
    
    def __init__(self):
        self.client = None
        self.project = os.getenv("GOOGLE_CLOUD_PROJECT")
        self.location = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")
        
    def is_available(self) -> bool:
        """Check if GCP AI is configured and available."""
        return GCP_AVAILABLE and self.project is not None
    
    async def _get_client(self):
        """Get or create the Vertex AI client."""
        if self.client is None:
            if not self.is_available():
                raise RuntimeError(
                    "GCP AI not available. Install google-genai and set "
                    "GOOGLE_CLOUD_PROJECT environment variable."
                )
            self.client = genai.Client(
                vertexai=True,
                project=self.project,
                location=self.location
            )
        return self.client
    
    async def analyze_item(self, item: dict) -> AnalysisResult:
        """
        Analyze a lifecycle item and recommend next stage.
        
        Args:
            item: Lifecycle item with title, stage, data, metrics
            
        Returns:
            AnalysisResult with recommendation and confidence
        """
        client = await self._get_client()
        
        prompt = self._build_analysis_prompt(item)
        
        response = await client.aio.models.generate_content(
            model="gemini-2.5-pro",
            contents=prompt,
            config=GenerateContentConfig(
                temperature=0.2,
                max_output_tokens=1024,
                response_mime_type="application/json"
            )
        )
        
        return self._parse_analysis_response(response.text)
    
    def _build_analysis_prompt(self, item: dict) -> str:
        """Build the analysis prompt for Gemini."""
        current_stage = item.get("stage", "idea")
        current_idx = self.STAGES.index(current_stage) if current_stage in self.STAGES else 0
        
        possible_stages = self.STAGES[current_idx:]  # Can only progress forward
        
        return f"""
You are an expert product lifecycle analyst. Analyze this item and recommend
whether it should progress to the next stage.

## Item Details
- Title: {item.get('title', 'Unknown')}
- Current Stage: {current_stage}
- Workflow: {item.get('workflow_id', 'default')}
- Custom Data: {json.dumps(item.get('data', {}))}
- Metrics: {json.dumps(item.get('metrics', {}))}
- Created: {item.get('created_at', 'Unknown')}

## Lifecycle Stages
1. idea - Initial concept, needs validation
2. build - Active development, building MVP
3. grow - Launched, focusing on growth
4. managed - Mature, optimizing and maintaining
5. sunset - Declining, planning retirement

## Current Position
The item is at stage "{current_stage}" (position {current_idx + 1} of 5).
Possible next stages: {possible_stages}

## Analysis Requirements
1. Evaluate readiness for the next stage based on available data
2. Consider if current stage work is complete
3. Identify blockers or missing requirements
4. Provide specific action items

## Response Format (JSON only)
{{
    "recommended_stage": "{possible_stages[0] if len(possible_stages) > 0 else current_stage}",
    "confidence": 0.0,
    "reasoning": "Brief explanation of your analysis",
    "action_items": ["Specific action 1", "Specific action 2"]
}}

Respond with valid JSON only. Set confidence between 0.0 and 1.0.
Use confidence > 0.7 only if you have strong evidence for progression.
"""

    def _parse_analysis_response(self, response_text: str) -> AnalysisResult:
        """Parse the AI response into structured result."""
        try:
            data = json.loads(response_text)
            return AnalysisResult(
                recommended_stage=data.get("recommended_stage", "idea"),
                confidence=float(data.get("confidence", 0.0)),
                reasoning=data.get("reasoning", "No reasoning provided"),
                action_items=data.get("action_items", []),
                raw_response=response_text
            )
        except (json.JSONDecodeError, KeyError) as e:
            # Return low-confidence result on parse error
            return AnalysisResult(
                recommended_stage="idea",
                confidence=0.0,
                reasoning=f"Failed to parse AI response: {str(e)}",
                action_items=["Review AI integration", "Check response format"],
                raw_response=response_text
            )
    
    async def should_auto_progress(self, item: dict, threshold: float = 0.7) -> tuple[bool, AnalysisResult]:
        """
        Determine if item should automatically progress to next stage.
        
        Args:
            item: Lifecycle item to analyze
            threshold: Minimum confidence for auto-progression
            
        Returns:
            Tuple of (should_progress, analysis_result)
        """
        analysis = await self.analyze_item(item)
        should_progress = (
            analysis.confidence >= threshold and 
            analysis.recommended_stage != item.get("stage")
        )
        return should_progress, analysis


# Mock service for when GCP is not available
class MockAIService:
    """Mock AI service for development without GCP."""
    
    def is_available(self) -> bool:
        return True
    
    async def analyze_item(self, item: dict) -> AnalysisResult:
        """Return mock analysis based on simple heuristics."""
        current_stage = item.get("stage", "idea")
        stages = ["idea", "build", "grow", "managed", "sunset"]
        current_idx = stages.index(current_stage) if current_stage in stages else 0
        
        # Simple heuristic: recommend next stage with medium confidence
        next_stage = stages[min(current_idx + 1, len(stages) - 1)]
        
        return AnalysisResult(
            recommended_stage=next_stage,
            confidence=0.5,
            reasoning=f"Mock analysis: Item '{item.get('title')}' could progress from {current_stage} to {next_stage}.",
            action_items=[
                f"Review {current_stage} stage completion criteria",
                f"Prepare for {next_stage} stage requirements",
                "Enable GCP AI for real analysis"
            ]
        )
    
    async def should_auto_progress(self, item: dict, threshold: float = 0.7) -> tuple[bool, AnalysisResult]:
        analysis = await self.analyze_item(item)
        return False, analysis  # Mock never auto-progresses


def get_ai_service() -> LifecycleAIService | MockAIService:
    """Get the appropriate AI service based on configuration."""
    service = LifecycleAIService()
    if service.is_available():
        return service
    return MockAIService()
