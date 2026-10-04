import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>MBTQ Lifecycle System</h1>
      <p>Track and manage your product through its complete lifecycle.</p>
      <p>Stages: Idea → Build → Grow → Managed → Sunset</p>
      <Link href="/lifecycle">
        <button
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
          Open Dashboard
        </button>
      </Link>
    </main>
  );
}
