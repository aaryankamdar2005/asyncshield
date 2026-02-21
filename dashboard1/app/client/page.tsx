"use client";
import { useEffect, useState } from "react";
import { UploadCloud, Coins, Loader2, ArrowLeft, Box, Layers } from "lucide-react";
import Link from "next/link";

export default function ClientDashboard() {
  const [repos, setRepos] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/repos")
      .then((res) => res.json())
      .then((data) => setRepos(data));
  }, []);

  const handleUpload = async () => {
    if (!selectedRepo || !file) return alert("Select a repo and a .pth file!");

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("client_id", "Web_Node_77");
    formData.append("client_version", "1");
    formData.append("file", file);

    try {
      const res = await fetch(
        `http://localhost:8000/repos/${selectedRepo}/submit_update`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      if (data.status === "success") {
        alert(
          `Merged! Bounty: ${data.bounty} Tokens. Version is now v${data.version}`
        );
      } else {
        alert(`Rejected: ${data.message}`);
      }
    } catch {
      alert("Network Error: Is the backend running?");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: "var(--surface-0)", color: "var(--text-primary)" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-20 backdrop-blur-xl"
        style={{
          background: "rgba(3,3,5,0.8)",
          borderBottom: "1px solid var(--surface-3)",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
              style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ background: "var(--indigo-soft)" }}
              >
                <Layers className="h-4.5 w-4.5" style={{ color: "var(--indigo)" }} />
              </div>
              <div>
                <h1
                  className="text-lg font-bold tracking-tight font-mono"
                  style={{ color: "var(--indigo)" }}
                >
                  CONTRIBUTOR PORTAL
                </h1>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  ASYNC-SHIELD
                </p>
              </div>
            </div>
          </div>

          {/* Token Balance */}
          <div
            className="flex items-center gap-2.5 rounded-full px-5 py-2"
            style={{
              background: "var(--amber-soft)",
              border: "1px solid rgba(245,158,11,0.15)",
            }}
          >
            <Coins className="h-4 w-4" style={{ color: "var(--amber)" }} />
            <span className="text-sm font-bold font-mono" style={{ color: "var(--amber)" }}>
              450 TOKENS
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        {/* Section Label */}
        <div className="mb-6 flex items-center gap-2">
          <Box className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
            Available Repositories
          </span>
        </div>

        {/* Repo Cards */}
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <button
              key={repo.id}
              onClick={() => setSelectedRepo(repo.id)}
              className="rounded-2xl p-5 text-left transition-all duration-200"
              style={{
                background:
                  selectedRepo === repo.id
                    ? "var(--indigo-soft)"
                    : "var(--surface-1)",
                border: `1px solid ${
                  selectedRepo === repo.id
                    ? "rgba(99,102,241,0.4)"
                    : "var(--surface-3)"
                }`,
                boxShadow:
                  selectedRepo === repo.id
                    ? "0 0 0 1px rgba(99,102,241,0.15), 0 4px 20px rgba(99,102,241,0.08)"
                    : "none",
              }}
            >
              <h3
                className="mb-1.5 text-sm font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {repo.name}
              </h3>
              <p
                className="mb-4 line-clamp-2 text-xs leading-relaxed"
                style={{ color: "var(--text-tertiary)" }}
              >
                {repo.description}
              </p>
              <div
                className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--text-tertiary)" }}
              >
                <span className="font-mono">v{repo.version}</span>
                <span className="font-mono" style={{ color: "var(--indigo)" }}>
                  {repo.id}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Upload Zone */}
        {selectedRepo && (
          <div className="mx-auto max-w-xl">
            <div
              className="rounded-2xl p-8 text-center"
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--surface-3)",
              }}
            >
              <div
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ background: "var(--surface-2)" }}
              >
                <UploadCloud className="h-7 w-7" style={{ color: "var(--text-tertiary)" }} />
              </div>

              <h2
                className="mb-2 text-lg font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Submit .pth Commit
              </h2>
              <p
                className="mb-8 text-sm leading-relaxed"
                style={{ color: "var(--text-tertiary)" }}
              >
                Upload binary weights for validation against the Golden Set.
              </p>

              <div
                className="mb-8 rounded-xl p-4"
                style={{
                  background: "var(--surface-0)",
                  border: "1px dashed var(--surface-3)",
                }}
              >
                <input
                  type="file"
                  accept=".pth"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full cursor-pointer text-xs file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:px-4 file:py-2.5 file:text-xs file:font-medium file:transition-colors"
                  style={{
                    color: "var(--text-tertiary)",
                  }}
                />
              </div>

              <button
                onClick={handleUpload}
                disabled={isProcessing}
                className="flex w-full items-center justify-center gap-3 rounded-xl py-4 text-sm font-bold tracking-wide transition-all duration-200"
                style={{
                  background: isProcessing ? "var(--surface-2)" : "var(--indigo)",
                  color: isProcessing ? "var(--text-tertiary)" : "#fff",
                  cursor: isProcessing ? "not-allowed" : "pointer",
                  opacity: isProcessing ? 0.7 : 1,
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2
                      className="animate-spin"
                      style={{ width: 18, height: 18 }}
                    />
                    <span>VERIFYING ZERO-TRUST...</span>
                  </>
                ) : (
                  "PUSH TO GLOBAL BRAIN"
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
