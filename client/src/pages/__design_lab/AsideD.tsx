/**
 * Aside Direction D — Focused Accordion
 *
 * Denial reason is the always-visible hero — large, prominent, nothing competing.
 * Patient, Insurer & denial details, and Clinical context live in collapsible
 * sections below. Clinical context is open by default as the most useful context
 * for drafting a response. Progressive disclosure gives space to what matters most.
 */

import { useState } from "react";
import { ChevronDown, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockCases } from "./fixtures";

const c = mockCases[0];

export function AsideD() {
  const [open, setOpen] = useState<Set<string>>(new Set(["clinical"]));
  const [copied, setCopied] = useState(false);

  const toggle = (key: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const copy = async () => {
    await navigator.clipboard.writeText(c.denialReason);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="w-80 flex flex-col h-[600px] border border-[hsl(30_18%_78%)] rounded-2xl overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #f6e1ca, #fbf3eb)" }}
    >
      {/* Hero — denial reason, always visible */}
      <div className="px-6 pt-6 pb-5 border-b-2 border-[hsl(14_55%_38%_/_0.18)] shrink-0">
        <span className="text-[10px] font-semibold text-primary/55 uppercase tracking-widest block mb-3">
          Denial reason
        </span>
        <blockquote className="font-heading text-lg font-semibold italic text-foreground leading-snug">
          "{c.denialReason}"
        </blockquote>
        <div className="flex items-center justify-between mt-3.5">
          <p className="text-xs text-foreground/40 truncate pr-3">
            <span className="font-medium text-foreground/55">{c.insurerName}</span>
            {" · "}
            {c.deniedItem}
          </p>
          <button
            onClick={copy}
            className="flex items-center gap-1 text-xs text-foreground/40 hover:text-primary transition-colors shrink-0"
          >
            {copied ? (
              <Check className="w-3 h-3 text-primary" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Accordion sections */}
      <div className="flex-1 overflow-y-auto">
        <AccordionSection
          label="Patient"
          isOpen={open.has("patient")}
          onToggle={() => toggle("patient")}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold flex items-center justify-center shrink-0">
              {initials(c.patientName)}
            </div>
            <div>
              <p className="font-heading font-semibold text-foreground text-sm leading-tight">
                {c.patientName}
              </p>
              <p className="text-xs text-foreground/45 mt-0.5">{c.patientEmail}</p>
            </div>
          </div>
          <InfoPair label="Plan type" value="Employer plan" />
        </AccordionSection>

        <AccordionSection
          label="Insurer & denial"
          isOpen={open.has("insurer")}
          onToggle={() => toggle("insurer")}
        >
          <InfoPair label="Insurer" value={c.insurerName} />
          {c.denialDate && <InfoPair label="Denial date" value={c.denialDate} />}
          <InfoPair label="Denied service" value={c.deniedItem} />
        </AccordionSection>

        {c.additionalContext && (
          <AccordionSection
            label="Clinical context"
            isOpen={open.has("clinical")}
            onToggle={() => toggle("clinical")}
          >
            <p className="text-sm text-foreground/65 leading-relaxed">
              {c.additionalContext}
            </p>
          </AccordionSection>
        )}
      </div>
    </div>
  );
}

function AccordionSection({
  label,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[hsl(30_18%_80%)]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-3.5 text-left transition-colors hover:bg-foreground/[0.03]"
      >
        <span className="text-sm font-medium text-foreground/65">{label}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-foreground/35 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-4 space-y-2.5">{children}</div>
      )}
    </div>
  );
}

function InfoPair({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-foreground/40 shrink-0 pt-px">{label}</span>
      <span className="text-xs text-foreground/75 text-right">{value}</span>
    </div>
  );
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}
