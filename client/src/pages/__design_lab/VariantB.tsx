/**
 * Variant B — Horizontal Segmented Nav
 *
 * Why: Eliminates the sidebar entirely — filters live in a horizontal pill-segment
 * control (iOS-style), giving the case list full width. A top stats bar surfaces
 * key numbers at a glance. Wider cards expose more information per row.
 */

import { useState } from "react";
import { Shield, Clock, AlertCircle, CheckCircle2, Trophy, XCircle, Building2, FileText, MessageSquareQuote, ChevronRight } from "lucide-react";
import { mockCases, timeAgo, initials, type MockCase } from "./fixtures";

type Filter = "all" | "ready" | "approved" | "won" | "lost";

const TABS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ready", label: "Needs Review" },
  { key: "approved", label: "Approved" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
];

function StatusDot({ status }: { status: MockCase["status"] }) {
  const colors: Record<string, string> = {
    ready: "bg-amber-400",
    approved: "bg-primary",
    won: "bg-green-500",
    lost: "bg-red-400",
    generating: "bg-blue-400",
    submitted: "bg-green-500",
  };
  return <span className={`w-2 h-2 rounded-full shrink-0 ${colors[status] ?? "bg-muted-foreground"}`} />;
}

function BMetaCell({
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

export function VariantB() {
  const [filter, setFilter] = useState<Filter>("ready");

  const count = (k: Filter) =>
    k === "all" ? mockCases.length : mockCases.filter((c) => c.status === k).length;

  const filtered = filter === "all" ? mockCases : mockCases.filter((c) => c.status === filter);

  const stats = [
    { label: "Needs Review", value: count("ready"), color: "text-amber-600", bg: "bg-amber-50", icon: <AlertCircle className="w-4 h-4 text-amber-500" /> },
    { label: "Approved", value: count("approved"), color: "text-primary", bg: "bg-primary/5", icon: <CheckCircle2 className="w-4 h-4 text-primary" /> },
    { label: "Won", value: count("won"), color: "text-green-700", bg: "bg-green-50", icon: <Trophy className="w-4 h-4 text-green-600" /> },
    { label: "Lost", value: count("lost"), color: "text-red-600", bg: "bg-red-50", icon: <XCircle className="w-4 h-4 text-red-500" /> },
  ];

  return (
    <div className="flex flex-col h-[580px] rounded-2xl overflow-hidden border border-border bg-background shadow-sm">
      {/* Header */}
      <header className="px-6 pt-5 pb-4 border-b border-border/40 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <span className="font-heading font-semibold text-base leading-none">Appeal</span>
              <span className="text-muted-foreground text-sm ml-1.5">/ Advocate Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Nurse Advocate</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {stats.map((s) => (
            <div key={s.label} className={`rounded-xl ${s.bg} px-3 py-2.5 flex items-center gap-2`}>
              {s.icon}
              <div>
                <p className={`text-lg font-bold leading-none ${s.color}`}>{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Segmented control */}
        <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
          {TABS.map((tab) => {
            const n = count(tab.key);
            const active = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-lg transition-all ${
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {n > 0 && (
                  <span
                    className={`text-[10px] font-semibold ${
                      active ? (tab.key === "ready" ? "text-amber-600" : "text-foreground") : "text-muted-foreground"
                    }`}
                  >
                    {n}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-border bg-white hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer group overflow-hidden"
          >
            {/* Top row */}
            <div className="flex items-center gap-3 px-4 pt-3.5 pb-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                {initials(c.patientName)}
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <StatusDot status={c.status} />
                <span className="font-heading font-semibold text-sm text-foreground truncate">
                  {c.patientName}
                </span>
                {c.status === "ready" && (
                  <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full shrink-0">
                    Review needed
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {c.appealLetterGeneratedAt && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {timeAgo(new Date(c.appealLetterGeneratedAt))}
                  </div>
                )}
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </div>
            </div>

            {/* Bottom metadata strip */}
            <div className="flex items-stretch border-t border-border/50 bg-muted/15">
              <BMetaCell label="Denied service" icon={<FileText className="w-3.5 h-3.5" />} value={c.deniedItem} />
              <div className="w-px bg-border/50 shrink-0" />
              <BMetaCell label="Insurer" icon={<Building2 className="w-3.5 h-3.5" />} value={c.insurerName} />
              <div className="w-px bg-border/50 shrink-0" />
              <BMetaCell label="Denial reason" icon={<MessageSquareQuote className="w-3.5 h-3.5" />} value={`"${c.denialReason}"`} italic grow />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
