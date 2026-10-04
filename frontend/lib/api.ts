const API = "/api";

export interface LifecycleItem {
  id: string;
  title: string;
  stage: string;
  workflow_id: string;
  data: Record<string, any>;
  created_at: string;
}

export async function getItems(): Promise<LifecycleItem[]> {
  const res = await fetch(`${API}/lifecycle/list`);
  if (!res.ok) throw new Error("Failed to fetch items");
  return res.json();
}

export async function createItem(title: string, workflow_id?: string) {
  const res = await fetch(`${API}/lifecycle/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, workflow_id: workflow_id || "default" }),
  });
  if (!res.ok) throw new Error("Failed to create item");
  return res.json();
}

export async function updateStage(id: string, stage: string) {
  const res = await fetch(`${API}/lifecycle/update-stage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, stage }),
  });
  if (!res.ok) throw new Error("Failed to update stage");
  return res.json();
}

// AI-Powered Endpoints (GCP Vertex AI)

export interface AIAnalysis {
  recommended_stage: string;
  confidence: number;
  reasoning: string;
  action_items: string[];
}

export interface AIStatus {
  available: boolean;
  provider: string;
  model: string;
}

export async function getAIStatus(): Promise<AIStatus> {
  const res = await fetch(`${API}/ai/status`);
  if (!res.ok) throw new Error("Failed to get AI status");
  return res.json();
}

export async function analyzeItem(
  id: string
): Promise<{ item: LifecycleItem; analysis: AIAnalysis }> {
  const res = await fetch(`${API}/lifecycle/analyze/${id}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to analyze item");
  return res.json();
}

export async function autoProgressItem(
  id: string,
  threshold: number = 0.7
): Promise<{
  progressed: boolean;
  from_stage?: string;
  to_stage?: string;
  confidence: number;
  reasoning?: string;
  action_items?: string[];
}> {
  const res = await fetch(
    `${API}/lifecycle/auto-progress/${id}?threshold=${threshold}`,
    { method: "POST" }
  );
  if (!res.ok) throw new Error("Failed to auto-progress item");
  return res.json();
}

export async function batchAnalyze(): Promise<{
  status: string;
  items_count: number;
  message?: string;
}> {
  const res = await fetch(`${API}/lifecycle/batch-analyze`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to start batch analysis");
  return res.json();
}
