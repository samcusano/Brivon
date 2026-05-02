/**
 * Aside Direction B — Argument Sides
 *
 * Two color zones split by a "vs" divider: "Their argument" (terracotta-tinted,
 * denial reason dominates) and "Your case" (cream, patient + clinical as prose).
 * Frames the advocate's mental model — you're building a counter-argument.
 * Denial language is click-to-copy. Denied item shown as a warm inset card.
 */

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { mockCases } from "./fixtures";

const c = mockCases[0];

export function AsideB() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(c.denialReason);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-72 flex flex-col h-[600px] border border-[hsl(30_18%_78%)] rounded-2xl overflow-hidden">
      {/* Zone 1 — Their argument */}
      <div
        className="px-5 pt-5 pb-5"
        style={{ background: "rgba(180,90,50,0.07)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-semibold text-primary/65 uppercase tracking-widest">
            Their argument
          </span>
          <button
            onClick={copy}
            className="flex items-center gap-1 text-[11px] text-primary/50 hover:text-primary transition-colors"
          >
            {copied ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <blockquote className="font-heading text-[15px] font-semibold italic text-foreground leading-relaxed">
          "{c.denialReason}"
        </blockquote>

        <div className="mt-3.5 pt-3.5 border-t border-primary/12 flex items-center gap-1.5 text-xs text-foreground/45">
          <span className="font-medium text-foreground/60">{c.insurerName}</span>
          {c.denialDate && (
            <>
              <span className="text-foreground/30">·</span>
              <span>Denied {c.denialDate}</span>
            </>
          )}
        </div>
      </div>

      {/* Divider */}
      <div
        className="flex items-center gap-3 px-5 py-2.5 border-y border-[hsl(30_18%_80%)]"
        style={{ background: "rgba(246,225,202,0.25)" }}
      >
        <div className="h-px flex-1 bg-[hsl(30_18%_80%)]" />
        <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">
          vs
        </span>
        <div className="h-px flex-1 bg-[hsl(30_18%_80%)]" />
      </div>

      {/* Zone 2 — Your case */}
      <div
        className="px-5 pt-4 pb-5 flex-1 overflow-y-auto"
        style={{ background: "#fbf3eb" }}
      >
        <span className="text-[10px] font-semibold text-foreground/40 uppercase tracking-widest block mb-3.5">
          Your case
        </span>

        {/* Patient identity */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold flex items-center justify-center shrink-0">
            {initials(c.patientName)}
          </div>
          <div>
            <p className="font-heading font-semibold text-foreground text-sm leading-tight">
              {c.patientName}
            </p>
            <p className="text-xs text-foreground/45 mt-0.5">{c.patientEmail}</p>
          </div>
        </div>

        {/* Denied item as inset card */}
        <div
          className="mb-4 px-3.5 py-3 rounded-xl border border-[hsl(30_18%_82%)]"
          style={{ background: "rgba(246,225,202,0.5)" }}
        >
          <p className="text-[10px] font-semibold text-foreground/40 uppercase tracking-wider mb-1">
            Denied service
          </p>
          <p className="text-sm font-medium text-foreground">{c.deniedItem}</p>
        </div>

        {/* Clinical context as prose */}
        {c.additionalContext && (
          <div>
            <p className="text-[10px] font-semibold text-foreground/40 uppercase tracking-wider mb-1.5">
              Clinical context
            </p>
            <p className="text-sm text-foreground/65 leading-relaxed">
              {c.additionalContext}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}
