import { Trophy, Medal, Award } from "lucide-react";

export interface Contributor {
  client: string;
  bounty: number;
}

export default function LeaderboardTable({ data }: { data: Contributor[] }) {
  const sortedData = [...data].sort((a, b) => b.bounty - a.bounty);

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--surface-3)",
      }}
    >
      {/* Header */}
      <div
        className="mb-5 flex items-center gap-3 pb-4"
        style={{ borderBottom: "1px solid var(--surface-3)" }}
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: "var(--amber-soft)" }}
        >
          <Trophy className="h-4 w-4" style={{ color: "var(--amber)" }} />
        </div>
        <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
          Top Contributors
        </h2>
      </div>

      <div className="custom-scrollbar flex max-h-[500px] flex-col gap-2.5 overflow-y-auto pr-1">
        {sortedData.length === 0 && (
          <div
            className="flex items-center justify-center rounded-xl py-10 text-sm italic"
            style={{
              background: "var(--surface-0)",
              border: "1px dashed var(--surface-3)",
              color: "var(--text-tertiary)",
            }}
          >
            No bounties awarded yet. Be the first!
          </div>
        )}

        {sortedData.map((user, idx) => {
          const rankStyles =
            idx === 0
              ? { bg: "var(--amber-soft)", border: "rgba(245,158,11,0.2)" }
              : idx === 1
              ? { bg: "rgba(148,148,168,0.06)", border: "rgba(148,148,168,0.15)" }
              : idx === 2
              ? { bg: "rgba(234,88,12,0.06)", border: "rgba(234,88,12,0.15)" }
              : { bg: "var(--surface-0)", border: "var(--surface-3)" };

          return (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl p-3.5 transition-colors duration-200"
              style={{
                background: rankStyles.bg,
                border: `1px solid ${rankStyles.border}`,
              }}
            >
              <div className="flex items-center gap-3.5">
                {/* Rank */}
                <div className="flex h-6 w-6 items-center justify-center">
                  {idx === 0 ? (
                    <Trophy className="h-4.5 w-4.5" style={{ color: "var(--amber)" }} />
                  ) : idx === 1 ? (
                    <Medal className="h-4.5 w-4.5" style={{ color: "var(--text-secondary)" }} />
                  ) : idx === 2 ? (
                    <Award className="h-4.5 w-4.5" style={{ color: "#ea580c" }} />
                  ) : (
                    <span className="font-mono text-xs" style={{ color: "var(--text-tertiary)" }}>
                      #{idx + 1}
                    </span>
                  )}
                </div>

                <span
                  className={`font-mono text-sm ${idx < 3 ? "font-bold" : ""}`}
                  style={{ color: idx < 3 ? "var(--text-primary)" : "var(--text-secondary)" }}
                >
                  {user.client}
                </span>
              </div>

              <span
                className={`font-mono font-bold ${idx === 0 ? "text-base" : "text-sm"}`}
                style={{ color: idx === 0 ? "var(--amber)" : "rgba(245,158,11,0.7)" }}
              >
                {user.bounty}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
