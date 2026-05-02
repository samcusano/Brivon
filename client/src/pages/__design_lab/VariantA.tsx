/**
 * Variant A — Refined Sidebar
 *
 * Why: Evolution of the current design. Keeps the familiar sidebar + content
 * structure but dramatically elevates quality: serif patient names, warm sidebar
 * background, left-border urgency on "Needs Review" cards, polished avatar initials.
 */

import { useState } from "react";
import {
  Shield,
  Clock,
  AlertCircle,
  CheckCircle2,
  Trophy,
  XCircle,
  Inbox,
  ChevronRight,
  Building2,
  FileText,
  MessageSquareQuote,
} from "lucide-react";
import { mockCases, timeAgo, initials, type MockCase } from "./fixtures";

type Filter = "all" | "ready" | "approved" | "won" | "lost";

const NAV: { key: Filter; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "All cases", icon: <Inbox className="w-4 h-4" /> },
  { key: "ready", label: "Needs review", icon: <AlertCircle className="w-4 h-4" /> },
  { key: "approved", label: "Approved", icon: <CheckCircle2 className="w-4 h-4" /> },
  { key: "won", label: "Won", icon: <Trophy className="w-4 h-4" /> },
  { key: "lost", label: "Lost", icon: <XCircle className="w-4 h-4" /> },
];

function StatusPill({ status }: { status: MockCase["status"] }) {
  const map: Record<string, string> = {
    ready: "bg-amber-100 text-amber-700",
    approved: "bg-primary/10 text-primary",
    won: "bg-green-100 text-green-700",
    lost: "bg-red-100 text-red-600",
    generating: "bg-blue-100 text-blue-700",
    submitted: "bg-green-100 text-green-700",
  };
  const labels: Record<string, string> = {
    ready: "Needs review",
    approved: "Approved",
    won: "Won",
    lost: "Lost",
    generating: "Generating",
    submitted: "Submitted",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] ?? "bg-muted text-muted-foreground"}`}>
      {labels[status] ?? status}
    </span>
  );
}

function AMetaCell({
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
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider leading-none">
        {label}
      </span>
      <div className={`flex items-center gap-1.5 text-sm text-foreground/75 ${grow ? "min-w-0" : ""}`}>
        <span className="text-muted-foreground shrink-0">{icon}</span>
        <span className={`${italic ? "italic" : ""} ${grow ? "truncate" : ""}`}>{value}</span>
      </div>
    </div>
  );
}

export function VariantA() {
  const [filter, setFilter] = useState<Filter>("ready");
  const filtered = filter === "all" ? mockCases : mockCases.filter((c) => c.status === filter);

  const count = (k: Filter) =>
    k === "all" ? mockCases.length : mockCases.filter((c) => c.status === k).length;

  return (
    <div className="flex h-[580px] rounded-2xl overflow-hidden border border-border bg-background shadow-sm">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col" style={{ background: "hsl(35 30% 94%)" }}>
        {/* Brand */}
        <div className="px-4 pt-5 pb-4 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-heading font-semibold leading-none">Appeal</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Advocate Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-2.5 mb-3">
            Queue
          </p>
          {NAV.map((item) => {
            const n = count(item.key);
            const active = filter === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-sm transition-all ${
                  active
                    ? "bg-primary text-primary-foreground font-medium shadow-sm"
                    : "text-foreground/70 hover:bg-white/60 hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </span>
                {n > 0 && (
                  <span
                    className={`text-xs font-semibold min-w-[18px] text-center ${
                      active
                        ? "text-primary-foreground/70"
                        : item.key === "ready"
                        ? "text-amber-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {n}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Profile footer */}
        <div className="px-3 py-3 border-t border-border/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center">
              NA
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">Nurse Advocate</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <p className="text-[11px] text-muted-foreground">Available</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border/40 shrink-0 bg-background/70">
          <h1 className="font-heading text-xl font-semibold tracking-tight">
            {NAV.find((n) => n.key === filter)?.label ?? "Cases"}
          </h1>
          {filter === "ready" && count("ready") > 0 && (
            <p className="text-sm text-amber-600 mt-0.5 font-medium">
              {count("ready")} {count("ready") === 1 ? "letter" : "letters"} awaiting your review
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Inbox className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No cases in this queue</p>
            </div>
          ) : (
            filtered.map((c) => (
              <button
                key={c.id}
                className={`w-full text-left rounded-xl border bg-white hover:shadow-sm transition-all group overflow-hidden ${
                  c.status === "ready"
                    ? "border-amber-200 border-l-[3px] border-l-amber-400 hover:border-amber-300"
                    : "border-border hover:border-primary/25"
                }`}
              >
                {/* Top row: avatar + name + status + time */}
                <div className="flex items-center gap-3.5 px-4 pt-3.5 pb-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                      c.status === "ready"
                        ? "bg-amber-100 text-amber-700"
                        : c.status === "won"
                        ? "bg-green-100 text-green-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {initials(c.patientName)}
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="font-heading font-semibold text-foreground text-sm truncate">
                      {c.patientName}
                    </span>
                    <StatusPill status={c.status} />
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
                <div className="flex items-stretch border-t border-border/40 bg-muted/10">
                  <AMetaCell label="Denied service" icon={<FileText className="w-3.5 h-3.5" />} value={c.deniedItem} />
                  <div className="w-px bg-border/40 shrink-0" />
                  <AMetaCell label="Insurer" icon={<Building2 className="w-3.5 h-3.5" />} value={c.insurerName} />
                  <div className="w-px bg-border/40 shrink-0" />
                  <AMetaCell label="Denial reason" icon={<MessageSquareQuote className="w-3.5 h-3.5" />} value={`"${c.denialReason}"`} italic grow />
                </div>
              </button>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
