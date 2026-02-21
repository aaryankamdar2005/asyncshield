import { GitCommit, AlertTriangle, CheckCircle2 } from "lucide-react";

export interface CommitProps {
  client: string;
  status: string;
  reason?: string;
  version_bump?: string;
  bounty: number;
}

export default function CommitCard({ commit }: { commit: CommitProps }) {
  const isRejected = commit.status.includes("Rejected");

  return (
    <div
      className="group rounded-xl p-4 transition-all duration-200"
      style={{
        background: isRejected ? "rgba(229,72,77,0.06)" : "var(--surface-1)",
        border: `1px solid ${isRejected ? "rgba(229,72,77,0.2)" : "var(--surface-3)"}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = isRejected
          ? "rgba(229,72,77,0.35)"
          : "rgba(99,102,241,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isRejected
          ? "rgba(229,72,77,0.2)"
          : "var(--surface-3)";
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
              style={{
                background: isRejected ? "rgba(229,72,77,0.12)" : "var(--indigo-soft)",
              }}
            >
              {isRejected ? (
                <AlertTriangle className="h-3.5 w-3.5" style={{ color: "var(--destructive)" }} />
              ) : (
                <GitCommit className="h-3.5 w-3.5" style={{ color: "var(--indigo)" }} />
              )}
            </div>

            <span className="font-mono text-sm" style={{ color: "var(--text-secondary)" }}>
              {commit.client}
            </span>

            {/* Status Badge */}
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
              style={{
                background: isRejected ? "rgba(229,72,77,0.12)" : "var(--emerald-soft)",
                color: isRejected ? "#e5484d" : "var(--emerald)",
                border: `1px solid ${isRejected ? "rgba(229,72,77,0.2)" : "rgba(16,185,129,0.2)"}`,
              }}
            >
              {commit.status}
            </span>
          </div>

          {/* Commit Message */}
          <p
            className="mt-2.5 flex items-center gap-2 pl-10 text-sm"
            style={{ color: "var(--text-tertiary)" }}
          >
            {isRejected ? commit.reason : `Successfully merged: ${commit.version_bump}`}
            {!isRejected && (
              <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "rgba(16,185,129,0.6)" }} />
            )}
          </p>
        </div>

        {/* Bounty Reward */}
        {commit.bounty > 0 && (
          <div className="flex flex-col items-end gap-1">
            <div
              className="rounded-lg px-3 py-1.5 font-mono text-sm font-bold"
              style={{
                background: "var(--amber-soft)",
                color: "var(--amber)",
                border: "1px solid rgba(245,158,11,0.15)",
              }}
            >
              +{commit.bounty}
            </div>
            <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
              Bounty
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
