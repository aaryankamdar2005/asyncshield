"use client";
import { useRouter } from "next/navigation";
import { Web3HeroAnimated } from "@/components/ui/AnimatedWeb3Hero";
import { Shield, Server, Users } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Animated Template */}
      <div className="absolute inset-0 z-0">
        <Web3HeroAnimated />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        {/* Badge */}
        <div
          className="mb-6 flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium backdrop-blur-md"
          style={{
            background: "rgba(10,10,15,0.6)",
            border: "1px solid var(--surface-3)",
            color: "var(--text-secondary)",
          }}
        >
          <Shield className="h-3.5 w-3.5" style={{ color: "var(--rose)" }} />
          <span>Zero-Trust Federated Learning</span>
        </div>

        {/* Heading */}
        <h1
          className="mb-4 max-w-2xl text-center font-sans text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl text-balance"
          style={{ color: "var(--text-primary)" }}
        >
          Async-Shield
        </h1>
        <p
          className="mb-12 max-w-lg text-center text-base leading-relaxed md:text-lg text-pretty"
          style={{ color: "var(--text-secondary)" }}
        >
          Decentralized model training with cryptographic verification and
          token-based bounty incentives.
        </p>

        {/* Portal Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <button
            onClick={() => router.push("/server")}
            className="group relative flex items-center gap-3 rounded-xl px-8 py-4 font-semibold backdrop-blur-md transition-all duration-300 hover:scale-[1.03]"
            style={{
              background: "var(--rose-soft)",
              border: "1px solid rgba(244,63,94,0.3)",
              color: "var(--text-primary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(244,63,94,0.25)";
              e.currentTarget.style.borderColor = "rgba(244,63,94,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--rose-soft)";
              e.currentTarget.style.borderColor = "rgba(244,63,94,0.3)";
            }}
          >
            <Server className="h-5 w-5" style={{ color: "var(--rose)" }} />
            <span>Login as Model Owner</span>
          </button>

          <button
            onClick={() => router.push("/client")}
            className="group relative flex items-center gap-3 rounded-xl px-8 py-4 font-semibold backdrop-blur-md transition-all duration-300 hover:scale-[1.03]"
            style={{
              background: "var(--indigo-soft)",
              border: "1px solid rgba(99,102,241,0.3)",
              color: "var(--text-primary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(99,102,241,0.25)";
              e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--indigo-soft)";
              e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
            }}
          >
            <Users className="h-5 w-5" style={{ color: "var(--indigo)" }} />
            <span>Login as Contributor</span>
          </button>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-8 h-px w-48 opacity-30"
          style={{
            background: "linear-gradient(to right, transparent, var(--rose), var(--indigo), transparent)",
          }}
        />
      </div>
    </div>
  );
}
