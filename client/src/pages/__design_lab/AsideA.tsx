/**
 * Aside Direction A — Editorial Pull Quote
 *
 * Denial reason is the headline — large serif blockquote with terracotta
 * left border, copy button always visible. Patient becomes a name + pill
 * cluster, no label/value rows anywhere. Sections breathe with warm borders.
 */

import { useState } from "react";
import { Copy, Check, Clock } from "lucide-react";
import { mockCases } from "./fixtures";

const c = mockCases[0];

const PLAN_LABELS: Record<string, string> = {
  medicare: "Medicare",
  medicare_advantage: "Medicare Advantage",
  medicaid: "Medicaid",
  employer: "Employer plan",
  marketplace: "ACA Marketplace",
  other: "Other",
};

export function AsideA() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(c.denialReason);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="w-80 flex flex-col h-[600px] border border-[hsl(30_18%_78%)] rounded-2xl overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fbf3eb 0%, #f6e1ca22 100%)" }}
    >
      {/* Patient identity */}
      <div className="px-6 pt-6 pb-5 border-b border-[hsl(30_18%_80%)]">
        <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 text-xl font-semibold flex items-center justify-center mb-4">
          {initials(c.patientName)}
        </div>
        <h2 className="font-heading text-xl font-semibold text-foreground leading-tight mb-2.5">
          {c.patientName}
        </h2>
        <div className="flex flex-wrap gap-1.5">
          <Pill>{PLAN_LABELS[c.planType] ?? c.planType}</Pill>
          <Pill>{c.insurerName}</Pill>
          {c.denialDate && <Pill muted>Denied {c.denialDate}</Pill>}
        </div>
      </div>

      {/* Denial reason — the hero */}
      <div className="px-6 py-5 border-b border-[hsl(30_18%_80%)]">
        <span className="text-[10px] font-semibold text-foreground/40 uppercase tracking-widest block mb-3">
          Denial reason
        </span>
        <blockquote className="font-heading text-[15px] font-semibold italic text-foreground leading-relaxed border-l-[3px] border-primary pl-4">
          "{c.denialReason}"
        </blockquote>
        <button
          onClick={copy}
          className="mt-3 flex items-center gap-1.5 text-xs text-foreground/40 hover:text-primary transition-colors"
        >
          {copied ? (
            <Check className="w-3 h-3 text-primary" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
          {copied ? "Copied" : "Copy denial language"}
        </button>
      </div>

      {/* Denied service */}
      <div
        className="px-6 py-4 border-b border-[hsl(30_18%_80%)]"
        style={{ background: "rgba(246,225,202,0.35)" }}
      >
        <span className="text-[10px] font-semibold text-foreground/40 uppercase tracking-widest block mb-1.5">
          Denied service
        </span>
        <p className="text-sm font-medium text-foreground">{c.deniedItem}</p>
      </div>

      {/* Clinical context */}
      {c.additionalContext && (
        <div className="px-6 py-4 border-b border-[hsl(30_18%_80%)] flex-1">
          <span className="text-[10px] font-semibold text-foreground/40 uppercase tracking-widest block mb-2">
            Clinical context
          </span>
          <p className="text-sm text-foreground/65 leading-relaxed">
            {c.additionalContext}
          </p>
        </div>
      )}

      {/* Timestamp */}
      <div className="px-6 py-4 mt-auto">
        {c.appealLetterGeneratedAt && (
          <div className="flex items-center gap-1.5 text-xs text-foreground/35">
            <Clock className="w-3 h-3" />
            Letter generated 2h ago
          </div>
        )}
      </div>
    </div>
  );
}

function Pill({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span
      className={`text-xs px-2.5 py-0.5 rounded-full border ${
        muted
          ? "border-[hsl(30_18%_82%)] text-foreground/40 bg-transparent"
          : "border-[hsl(30_18%_73%)] bg-[rgba(246,225,202,0.55)] text-foreground/60"
      }`}
    >
      {children}
    </span>
  );
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}
