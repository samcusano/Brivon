/**
 * Variant D — Dashboard-First Layout
 *
 * Why: Leads with a greeting and four large stat cards so the advocate gets
 * an immediate situational picture before reviewing cases. "Needs Review"
 * is the primary section — presented prominently with its own header and
 * urgency framing. Other case groups live in collapsible sections below.
 */

import { useState } from "react";
import {
  Shield,
  AlertCircle,
  CheckCircle2,
  Trophy,
  XCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  Building2,
  FileText,
  MessageSquareQuote,
} from "lucide-react";
import { mockCases, timeAgo, initials, type MockCase } from "./fixtures";

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  ready: { label: "Needs review", badgeClass: "bg-amber-100 text-amber-700", dotClass: "bg-amber-400" },
  approved: { label: "Approved", badgeClass: "bg-primary/10 text-primary", dotClass: "bg-primary" },
  won: { label: "Won", badgeClass: "bg-green-100 text-green-700", dotClass: "bg-green-500" },
  lost: { label: "Lost", badgeClass: "bg-red-100 text-red-600", dotClass: "bg-red-400" },
  generating: { label: "Generating", badgeClass: "bg-blue-100 text-blue-700", dotClass: "bg-blue-400" },
  submitted: { label: "Submitted", badgeClass: "bg-green-100 text-green-700", dotClass: "bg-green-500" },
};

function MiniCaseRow({ c }: { c: MockCase }) {
  const cfg = STATUS_CONFIG[c.status];
  return (
    <button className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-colors group">
      <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground text-xs font-semibold flex items-center justify-center shrink-0">
        {initials(c.patientName)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{c.patientName}</p>
        <p className="text-xs text-muted-foreground truncate">{c.deniedItem}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {c.appealLetterGeneratedAt && (
          <span className="text-xs text-muted-foreground hidden group-hover:block">
            {timeAgo(new Date(c.appealLetterGeneratedAt))}
          </span>
        )}
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${cfg?.badgeClass ?? "bg-muted text-muted-foreground"}`}>
          {cfg?.label ?? c.status}
        </span>
      </div>
    </button>
  );
}

function Section({
  title,
  cases,
  defaultOpen = false,
  accent,
}: {
  title: string;
  cases: MockCase[];
  defaultOpen?: boolean;
  accent?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  if (cases.length === 0) return null;
  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {accent && <div className={`w-2 h-2 rounded-full ${accent}`} />}
          <span className="font-medium text-sm text-foreground">{title}</span>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full font-medium">
            {cases.length}
          </span>
        </div>
        {open ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="px-2 py-2 space-y-0.5 bg-background">
          {cases.map((c) => (
            <MiniCaseRow key={c.id} c={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function DMetaCell({
  label,
  icon,
  value,
  italic,
  grow,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  italic?: boolean;
  grow?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-0.5 px-3.5 py-2.5 ${grow ? "flex-1 min-w-0" : "shrink-0"}`}>
      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider leading-none">
        {label}
      </span>
      <div className={`flex items-center gap-1.5 text-sm text-foreground/75 ${grow ? "min-w-0" : ""}`}>
        <span className="text-muted-foreground shrink-0">{icon}</span>
        <span className={`${italic ? "italic" : ""} ${grow ? "truncate" : ""}`}>{value}</span>
      </div>
    </div>
  );
}

export function VariantD() {
  const readyCases = mockCases.filter((c) => c.status === "ready");
  const approvedCases = mockCases.filter((c) => c.status === "approved");
  const wonCases = mockCases.filter((c) => c.status === "won");
  const lostCases = mockCases.filter((c) => c.status === "lost");

  const stats = [
    {
      icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
      value: readyCases.length,
      label: "Needs Review",
      bg: "bg-amber-50",
      border: "border-amber-200",
      valueClass: "text-amber-700",
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-primary" />,
      value: approvedCases.length,
      label: "Approved",
      bg: "bg-primary/5",
      border: "border-primary/20",
      valueClass: "text-primary",
    },
    {
      icon: <Trophy className="w-5 h-5 text-green-600" />,
      value: wonCases.length,
      label: "Won",
      bg: "bg-green-50",
      border: "border-green-200",
      valueClass: "text-green-700",
    },
    {
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      value: lostCases.length,
      label: "Lost",
      bg: "bg-red-50",
      border: "border-red-200",
      valueClass: "text-red-600",
    },
  ];

  return (
    <div className="flex flex-col h-[580px] rounded-2xl overflow-hidden border border-border bg-background shadow-sm">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border/40 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-semibold text-base">Appeal</span>
          <span className="text-muted-foreground text-sm">/ Advocate Portal</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Nurse Advocate</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* Greeting */}
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Good morning
          </h1>
          <p className="text-muted-foreground mt-0.5">
            You have <span className="text-amber-600 font-semibold">{readyCases.length} letters</span> waiting for review.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`rounded-2xl border ${s.border} ${s.bg} px-4 py-3.5 flex flex-col gap-2`}
            >
              {s.icon}
              <div>
                <p className={`text-2xl font-bold leading-none ${s.valueClass}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Priority queue — always open */}
        {readyCases.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <h2 className="font-heading font-semibold text-base">Needs Review</h2>
              <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full">
                {readyCases.length}
              </span>
            </div>
            <div className="space-y-2">
              {readyCases.map((c) => (
                <button
                  key={c.id}
                  className="w-full text-left rounded-2xl border border-amber-200 bg-white hover:shadow-sm transition-all group overflow-hidden"
                >
                  {/* Top row */}
                  <div className="flex items-center gap-3 px-4 pt-3.5 pb-3">
                    <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold flex items-center justify-center shrink-0">
                      {initials(c.patientName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-sm text-foreground truncate">
                        {c.patientName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {c.appealLetterGeneratedAt && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {timeAgo(new Date(c.appealLetterGeneratedAt))}
                        </div>
                      )}
                      <span className="text-xs text-amber-600 font-medium group-hover:underline">
                        Review →
                      </span>
                    </div>
                  </div>

                  {/* Metadata strip */}
                  <div className="flex items-stretch border-t border-amber-100 bg-amber-50/40">
                    <DMetaCell label="Denied service" icon={<FileText className="w-3.5 h-3.5" />} value={c.deniedItem} />
                    <div className="w-px bg-amber-100 shrink-0" />
                    <DMetaCell label="Insurer" icon={<Building2 className="w-3.5 h-3.5" />} value={c.insurerName} />
                    <div className="w-px bg-amber-100 shrink-0" />
                    <DMetaCell label="Denial reason" icon={<MessageSquareQuote className="w-3.5 h-3.5" />} value={`"${c.denialReason}"`} italic grow />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Other sections */}
        <div className="space-y-3">
          <Section title="Approved" cases={approvedCases} accent="bg-primary" />
          <Section title="Won" cases={wonCases} accent="bg-green-500" />
          <Section title="Lost" cases={lostCases} accent="bg-red-400" />
        </div>
      </div>
    </div>
  );
}
