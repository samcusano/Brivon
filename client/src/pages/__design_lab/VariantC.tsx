/**
 * Variant C — Two-Column Card Grid
 *
 * Why: Cases displayed as rich cards in a 2-column grid — more spatial and
 * Apple-like. Each card exposes the patient, insurer, and denial reason at a
 * glance without opening a detail view. Narrow icon-only sidebar keeps context
 * without consuming space.
 */

import { useState } from "react";
import {
  Shield,
  AlertCircle,
  CheckCircle2,
  Trophy,
  XCircle,
  Inbox,
  Clock,
  Building2,
  FileText,
  MessageSquareQuote,
} from "lucide-react";
import { mockCases, timeAgo, initials, type MockCase } from "./fixtures";

type Filter = "all" | "ready" | "approved" | "won" | "lost";

const NAV: { key: Filter; icon: React.ReactNode; label: string }[] = [
  { key: "all", icon: <Inbox className="w-5 h-5" />, label: "All" },
  { key: "ready", icon: <AlertCircle className="w-5 h-5" />, label: "Review" },
  { key: "approved", icon: <CheckCircle2 className="w-5 h-5" />, label: "Approved" },
  { key: "won", icon: <Trophy className="w-5 h-5" />, label: "Won" },
  { key: "lost", icon: <XCircle className="w-5 h-5" />, label: "Lost" },
];

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  ready: { label: "Needs review", className: "bg-amber-100 text-amber-700" },
  approved: { label: "Approved", className: "bg-primary/10 text-primary" },
  won: { label: "Won", className: "bg-green-100 text-green-700" },
  lost: { label: "Lost", className: "bg-red-100 text-red-600" },
  generating: { label: "Generating", className: "bg-blue-100 text-blue-700" },
  submitted: { label: "Submitted", className: "bg-green-100 text-green-700" },
};

function CaseCard({ c }: { c: MockCase }) {
  const s = STATUS_LABEL[c.status] ?? { label: c.status, className: "bg-muted text-muted-foreground" };
  return (
    <div
      className={`rounded-2xl border bg-white cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden ${
        c.status === "ready" ? "border-amber-200 ring-1 ring-amber-200/60" : "border-border"
      }`}
    >
      {/* Top: primary info */}
      <div className="flex items-start justify-between gap-2 p-4 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-10 h-10 rounded-full text-sm font-semibold flex items-center justify-center shrink-0 ${
              c.status === "ready"
                ? "bg-amber-100 text-amber-700"
                : c.status === "won"
                ? "bg-green-100 text-green-700"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {initials(c.patientName)}
          </div>
          <div className="min-w-0">
            <p className="font-heading font-semibold text-sm text-foreground leading-tight truncate">
              {c.patientName}
            </p>
            {c.appealLetterGeneratedAt && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <Clock className="w-3 h-3" />
                {timeAgo(new Date(c.appealLetterGeneratedAt))}
              </div>
            )}
          </div>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${s.className}`}>
          {s.label}
        </span>
      </div>

      {/* Denial reason callout */}
      <div className="mx-4 mb-3 bg-amber-50/70 rounded-xl px-3 py-2">
        <p className="text-xs text-muted-foreground italic leading-relaxed line-clamp-2">
          "{c.denialReason}"
        </p>
      </div>

      {/* Bottom metadata strip */}
      <div className="flex items-stretch border-t border-border/50 bg-muted/10">
        <CMetaCell label="Denied service" icon={<FileText className="w-3 h-3" />} value={c.deniedItem} grow />
        <div className="w-px bg-border/50 shrink-0" />
        <CMetaCell label="Insurer" icon={<Building2 className="w-3 h-3" />} value={c.insurerName} />
      </div>
    </div>
  );
}

function CMetaCell({
  label,
  icon,
  value,
  grow,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  grow?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-0.5 px-3 py-2 ${grow ? "flex-1 min-w-0" : "shrink-0"}`}>
      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider leading-none">
        {label}
      </span>
      <div className={`flex items-center gap-1 text-xs text-foreground/75 ${grow ? "min-w-0" : ""}`}>
        <span className="text-muted-foreground shrink-0">{icon}</span>
        <span className={grow ? "truncate" : ""}>{value}</span>
      </div>
    </div>
  );
}

export function VariantC() {
  const [filter, setFilter] = useState<Filter>("ready");

  const filtered = filter === "all" ? mockCases : mockCases.filter((c) => c.status === filter);
  const count = (k: Filter) =>
    k === "all" ? mockCases.length : mockCases.filter((c) => c.status === k).length;

  return (
    <div className="flex h-[580px] rounded-2xl overflow-hidden border border-border bg-background shadow-sm">
      {/* Icon sidebar */}
      <aside className="w-16 shrink-0 flex flex-col items-center py-5 gap-1 border-r border-border/40"
        style={{ background: "hsl(35 30% 94%)" }}>
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center mb-4">
          <Shield className="w-4 h-4 text-primary-foreground" />
        </div>
        {NAV.map((item) => {
          const active = filter === item.key;
          const n = count(item.key);
          return (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              title={item.label}
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-white/70 hover:text-foreground"
              }`}
            >
              {item.icon}
              {n > 0 && item.key === "ready" && !active && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {n}
                </span>
              )}
            </button>
          );
        })}
      </aside>

      {/* Grid content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-border/40 shrink-0">
          <h1 className="font-heading text-xl font-semibold tracking-tight">
            {NAV.find((n) => n.key === filter)?.label === "Review"
              ? "Needs Review"
              : NAV.find((n) => n.key === filter)?.label ?? "Cases"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} cases</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Inbox className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No cases here</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((c) => (
                <CaseCard key={c.id} c={c} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
