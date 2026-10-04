"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getItems,
  createItem,
  updateStage,
  getAIStatus,
  analyzeItem,
  autoProgressItem,
  type LifecycleItem,
  type AIStatus,
  type AIAnalysis,
} from "@/lib/api";

const STAGES = ["idea", "build", "grow", "managed", "sunset"];
const STAGE_COLORS: Record<string, string> = {
  idea: "#e0e0e0",
  build: "#ffeb99",
  grow: "#99ccff",
  managed: "#99ff99",
  sunset: "#ff9999",
};

export default function LifecyclePage() {
  const [items, setItems] = useState<LifecycleItem[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [aiStatus, setAIStatus] = useState<AIStatus | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<
    Record<string, AIAnalysis>
  >({});

  async function load() {
    try {
      setError("");
      const data = await getItems();
      setItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load items");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // Check AI status on mount
    getAIStatus()
      .then(setAIStatus)
      .catch(() => setAIStatus(null));
  }, []);

  async function handleAnalyze(itemId: string) {
    try {
      setError("");
      setAnalyzingId(itemId);
      const result = await analyzeItem(itemId);
      setAnalysisResults((prev) => ({
        ...prev,
        [itemId]: result.analysis,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze item");
    } finally {
      setAnalyzingId(null);
    }
  }

  async function handleAutoProgress(itemId: string) {
    try {
      setError("");
      setAnalyzingId(itemId);
      const result = await autoProgressItem(itemId, 0.7);
      if (result.progressed) {
        await load();
      } else {
        // Show the analysis even if not progressed
        setAnalysisResults((prev) => ({
          ...prev,
          [itemId]: {
            recommended_stage: result.to_stage || "",
            confidence: result.confidence,
            reasoning: result.reasoning || "",
            action_items: result.action_items || [],
          },
        }));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to auto-progress item"
      );
    } finally {
      setAnalyzingId(null);
    }
  }

  async function handleCreate() {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    try {
      setError("");
      await createItem(title);
      setTitle("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create item");
    }
  }

  async function handleUpdateStage(itemId: string, stage: string) {
    try {
      setError("");
      await updateStage(itemId, stage);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update stage");
    }
  }

  return (
    <main style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ marginBottom: "30px" }}>
        <Link href="/">
          <button
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              backgroundColor: "#f0f0f0",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              marginBottom: "20px",
            }}
          >
            &larr; Back
          </button>
        </Link>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <h1 style={{ margin: 0 }}>Lifecycle Dashboard</h1>
          {aiStatus && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                backgroundColor: aiStatus.available ? "#e6ffe6" : "#fff3e6",
                border: `1px solid ${aiStatus.available ? "#00cc00" : "#ffaa00"}`,
                borderRadius: "20px",
                fontSize: "13px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: aiStatus.available ? "#00cc00" : "#ffaa00",
                }}
              />
              <span>
                AI: {aiStatus.available ? aiStatus.model : "Mock Mode"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New idea or product..."
          onKeyPress={(e) => {
            if (e.key === "Enter") handleCreate();
          }}
          style={{
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            flex: 1,
            minWidth: "200px",
          }}
        />
        <button
          onClick={handleCreate}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Create
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#ffcccc",
            color: "#cc0000",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading items...</p>
      ) : items.length === 0 ? (
        <p style={{ color: "#999" }}>No items yet. Create one to get started!</p>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
                backgroundColor: STAGE_COLORS[item.stage] || "#f9f9f9",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ marginBottom: "15px" }}>
                <h3 style={{ margin: "0 0 5px 0" }}>{item.title}</h3>
                <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
                  Current Stage: <strong>{item.stage.toUpperCase()}</strong>
                </p>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {STAGES.map((stage) => (
                  <button
                    key={stage}
                    onClick={() => handleUpdateStage(item.id, stage)}
                    disabled={item.stage === stage}
                    style={{
                      padding: "8px 12px",
                      fontSize: "13px",
                      backgroundColor:
                        item.stage === stage ? "#0070f3" : "#f0f0f0",
                      color: item.stage === stage ? "white" : "#333",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      cursor: item.stage === stage ? "default" : "pointer",
                      opacity: item.stage === stage ? 1 : 0.7,
                      textTransform: "capitalize",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {stage}
                  </button>
                ))}
              </div>

              {/* AI Actions */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "12px",
                  paddingTop: "12px",
                  borderTop: "1px solid rgba(0,0,0,0.1)",
                }}
              >
                <button
                  onClick={() => handleAnalyze(item.id)}
                  disabled={analyzingId === item.id}
                  style={{
                    padding: "6px 12px",
                    fontSize: "12px",
                    backgroundColor: "#6366f1",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: analyzingId === item.id ? "wait" : "pointer",
                    opacity: analyzingId === item.id ? 0.7 : 1,
                  }}
                >
                  {analyzingId === item.id ? "Analyzing..." : "AI Analyze"}
                </button>
                <button
                  onClick={() => handleAutoProgress(item.id)}
                  disabled={analyzingId === item.id || item.stage === "sunset"}
                  style={{
                    padding: "6px 12px",
                    fontSize: "12px",
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor:
                      analyzingId === item.id || item.stage === "sunset"
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      analyzingId === item.id || item.stage === "sunset"
                        ? 0.5
                        : 1,
                  }}
                >
                  Auto Progress
                </button>
              </div>

              {/* AI Analysis Results */}
              {analysisResults[item.id] && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "12px",
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    borderRadius: "6px",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                    fontSize: "13px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <strong style={{ color: "#6366f1" }}>AI Analysis</strong>
                    <span
                      style={{
                        padding: "2px 8px",
                        backgroundColor:
                          analysisResults[item.id].confidence > 0.7
                            ? "#10b981"
                            : analysisResults[item.id].confidence > 0.4
                              ? "#f59e0b"
                              : "#ef4444",
                        color: "white",
                        borderRadius: "10px",
                        fontSize: "11px",
                      }}
                    >
                      {Math.round(analysisResults[item.id].confidence * 100)}%
                      confidence
                    </span>
                  </div>
                  <p style={{ margin: "0 0 8px 0" }}>
                    <strong>Recommendation:</strong> Move to{" "}
                    <em>
                      {analysisResults[item.id].recommended_stage.toUpperCase()}
                    </em>
                  </p>
                  <p style={{ margin: "0 0 8px 0", color: "#555" }}>
                    {analysisResults[item.id].reasoning}
                  </p>
                  {analysisResults[item.id].action_items.length > 0 && (
                    <div>
                      <strong>Action Items:</strong>
                      <ul style={{ margin: "4px 0 0 0", paddingLeft: "20px" }}>
                        {analysisResults[item.id].action_items.map(
                          (action, i) => (
                            <li key={i} style={{ color: "#555" }}>
                              {action}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {item.data && Object.keys(item.data).length > 0 && (
                <div
                  style={{
                    marginTop: "15px",
                    padding: "10px",
                    backgroundColor: "rgba(0,0,0,0.05)",
                    borderRadius: "4px",
                    fontSize: "13px",
                  }}
                >
                  <strong>Data:</strong>
                  <pre
                    style={{
                      margin: "5px 0 0 0",
                      overflow: "auto",
                      fontSize: "12px",
                    }}
                  >
                    {JSON.stringify(item.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
