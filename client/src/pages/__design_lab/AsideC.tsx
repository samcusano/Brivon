/**
 * Aside Direction C — Narrative Prose
 *
 * Zero labels. All case information is rendered as flowing human sentences —
 * reads like a case brief, not a form. The denial reason surfaces as a serif
 * blockquote embedded within the narrative. Copy always accessible below.
 * Feels like a well-written intake summary a lawyer would hand you.
 */

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { mockCases } from "./fixtures";

const c = mockCases[0];

const PLAN_LABELS: Record<string, string> = {
  medicare: "Medicare",
  medicare_advantage: "Medicare Advantage",
  medicaid: "Medicaid",
  employer: "an employer plan",
  marketplace: "an ACA Marketplace plan",
  other: "a health plan",
};

export function AsideC() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(c.denialReason);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="w-72 flex flex-col h-[600px] border border-[hsl(30_18%_78%)] rounded-2xl overflow-y-auto"
      style={{ background: "linear-gradient(to bottom, #fbf3eb, #f6e1ca18)" }}
    >
      <div className="px-6 pt-6 pb-6 space-y-6">
        {/* Patient prose paragraph */}
        <div>
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold flex items-center justify-center mb-4">
            {initials(c.patientName)}
          </div>
          <p className="text-sm text-foreground/60 leading-[1.75]">
            <span className="font-heading font-semibold text-foreground text-[15px]">
              {c.patientName}
            </span>{" "}
            is enrolled in{" "}
            <span className="font-medium text-foreground/80">
              {PLAN_LABELS[c.planType] ?? "a health plan"}
            </span>{" "}
            through{" "}
            <span className="font-medium text-foreground/80">{c.insurerName}</span>
            {c.denialDate
              ? `. Her request was denied on ${formatDate(c.denialDate)}.`
              : "."}
          </p>
        </div>

        {/* Denial context + blockquote */}
        <div className="border-t border-[hsl(30_18%_80%)] pt-5">
          <p className="text-sm text-foreground/60 leading-[1.75] mb-4">
            {c.insurerName} denied coverage of{" "}
            <span className="font-medium text-foreground/80">{c.deniedItem}</span>{" "}
            citing:
          </p>

          <blockquote className="font-heading text-[15px] font-semibold italic text-foreground leading-relaxed border-l-[3px] border-primary pl-4 mb-3">
            "{c.denialReason}"
          </blockquote>

          <button
            onClick={copy}
            className="flex items-center gap-1.5 text-xs text-foreground/35 hover:text-primary transition-colors"
          >
            {copied ? (
              <Check className="w-3 h-3 text-primary" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            {copied ? "Copied" : "Copy denial language"}
          </button>
        </div>

        {/* Clinical context as a prose note */}
        {c.additionalContext && (
          <div className="border-t border-[hsl(30_18%_80%)] pt-5">
            <p className="text-sm text-foreground/60 leading-[1.75]">
              <span className="font-medium text-foreground/75">
                Clinical context:{" "}
              </span>
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

function formatDate(d: string) {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}
