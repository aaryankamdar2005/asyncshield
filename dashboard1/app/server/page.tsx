"use client";
import { useState } from "react";
import { Database, PlusCircle, Activity, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ServerDashboard() {
  const [repoName, setRepoName] = useState("");
  const [desc, setDesc] = useState("");

  const handleCreateRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", repoName);
    formData.append("description", desc);
    formData.append("owner", "Server_Admin_1");

    await fetch("http://localhost:8000/create_repo", {
      method: "POST",
      body: formData,
    });
    alert("Repository Created Successfully!");
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
                style={{ background: "var(--rose-soft)" }}
              >
                <Database className="h-4.5 w-4.5" style={{ color: "var(--rose)" }} />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                  Model Owner Dashboard
                </h1>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  Initialize and manage federated repos
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* CREATE REPO FORM */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--surface-3)",
            }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: "var(--rose-soft)" }}
              >
                <PlusCircle className="h-4 w-4" style={{ color: "var(--rose)" }} />
              </div>
              <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                Create New Repository
              </h2>
            </div>

            <form onSubmit={handleCreateRepo} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  Model Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg px-3.5 py-2.5 text-sm font-mono outline-none transition-colors placeholder:opacity-40"
                  style={{
                    background: "var(--surface-0)",
                    border: "1px solid var(--surface-3)",
                    color: "var(--text-primary)",
                  }}
                  placeholder="e.g. MNIST-V1-Global"
                  onChange={(e) => setRepoName(e.target.value)}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(244,63,94,0.4)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--surface-3)")}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  Description
                </label>
                <textarea
                  className="w-full resize-none rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:opacity-40"
                  style={{
                    background: "var(--surface-0)",
                    border: "1px solid var(--surface-3)",
                    color: "var(--text-primary)",
                  }}
                  rows={3}
                  placeholder="Detects handwritten digits..."
                  onChange={(e) => setDesc(e.target.value)}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(244,63,94,0.4)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--surface-3)")}
                />
              </div>

              {/* File Upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  Attach Golden Dataset (.zip)
                </label>
                <div
                  className="rounded-lg p-4"
                  style={{
                    background: "var(--surface-0)",
                    border: "1px dashed var(--surface-3)",
                  }}
                >
                  <input
                    type="file"
                    className="w-full cursor-pointer text-xs file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:px-4 file:py-2 file:text-xs file:font-medium file:transition-colors"
                    style={{
                      color: "var(--text-tertiary)",
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl py-3 text-sm font-bold tracking-wide transition-all duration-200 hover:brightness-110"
                style={{
                  background: "var(--rose)",
                  color: "#fff",
                }}
              >
                Initialize Repository
              </button>
            </form>
          </div>

          {/* ANALYTICS SECTION */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--surface-3)",
            }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: "var(--indigo-soft)" }}
              >
                <Activity className="h-4 w-4" style={{ color: "var(--indigo)" }} />
              </div>
              <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                Global Analytics
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {/* Stat Card */}
              <div
                className="flex items-center justify-between rounded-xl p-4"
                style={{
                  background: "var(--surface-0)",
                  border: "1px solid var(--surface-3)",
                }}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                    Total Active Repos
                  </span>
                  <span className="text-2xl font-bold font-mono" style={{ color: "var(--rose)" }}>
                    1
                  </span>
                </div>
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ background: "var(--rose-soft)" }}
                >
                  <Database className="h-5 w-5" style={{ color: "var(--rose)" }} />
                </div>
              </div>

              {/* Stat Card */}
              <div
                className="flex items-center justify-between rounded-xl p-4"
                style={{
                  background: "var(--surface-0)",
                  border: "1px solid var(--surface-3)",
                }}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                    Total Client Commits
                  </span>
                  <span className="text-2xl font-bold font-mono" style={{ color: "var(--indigo)" }}>
                    24
                  </span>
                </div>
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ background: "var(--indigo-soft)" }}
                >
                  <Activity className="h-5 w-5" style={{ color: "var(--indigo)" }} />
                </div>
              </div>

              {/* Graph Placeholder */}
              <div
                className="flex h-40 items-center justify-center rounded-xl"
                style={{
                  background: "var(--surface-0)",
                  border: "1px dashed var(--surface-3)",
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-1">
                    {[28, 44, 36, 52, 48, 64, 56].map((h, i) => (
                      <div
                        key={i}
                        className="w-3 rounded-sm"
                        style={{
                          height: `${h}px`,
                          background: `linear-gradient(to top, var(--indigo), rgba(99,102,241,0.3))`,
                          opacity: 0.4 + i * 0.08,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    Commit History Graph
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
