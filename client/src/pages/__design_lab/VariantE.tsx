/**
 * Variant E — Premium Warmth (Apple-forward)
 *
 * Why: Leans fully into the project's warm earth palette and Source Serif 4
 * headings. Full-bleed cream background, no white "cards" — cases float as
 * borderless rows separated by generous spacing. A prominent serif heading,
 * large patient avatars with colored initials, and a rich left-panel profile
 * create a human, premium feel. Closest to an Apple Health / Mail aesthetic.
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

const AVATAR_COLORS: Record<string, string> = {
  ready: "bg-amber-100 text-amber-800",
  approved: "bg-primary/15 text-primary",
  won: "bg-green-100 text-green-800",
  lost: "bg-red-50 text-red-700",
  generating: "bg-blue-50 text-blue-700",
  submitted: "bg-green-100 text-green-800",
};

const STATUS_DOT: Record<string, string> = {
  ready: "bg-amber-400",
  approved: "bg-primary",
  won: "bg-green-500",
  lost: "bg-red-400",
  generating: "bg-blue-400",
  submitted: "bg-green-500",
};

const STATUS_LABEL: Record<string, string> = {
  ready: "Needs review",
  approved: "Approved",
  won: "Won",
  lost: "Lost",
  generating: "Generating",
  submitted: "Submitted",
};

const NAV: { key: Filter; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "All Cases", icon: <Inbox className="w-4 h-4" /> },
  { key: "ready", label: "Needs Review", icon: <AlertCircle className="w-4 h-4" /> },
  { key: "approved", label: "Approved", icon: <CheckCircle2 className="w-4 h-4" /> },
  { key: "won", label: "Won", icon: <Trophy className="w-4 h-4" /> },
  { key: "lost", label: "Lost", icon: <XCircle className="w-4 h-4" /> },
];

function EMetaCell({
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
      <span className="text-[10px] font-medium text-foreground/45 uppercase tracking-wider leading-none">
        {label}
      </span>
      <div className={`flex items-center gap-1.5 text-sm text-foreground/70 ${grow ? "min-w-0" : ""}`}>
        <span className="text-foreground/40 shrink-0">{icon}</span>
        <span className={`${italic ? "italic" : ""} ${grow ? "truncate" : ""}`}>{value}</span>
      </div>
    </div>
  );
}

export function VariantE() {
  const [filter, setFilter] = useState<Filter>("ready");

  const count = (k: Filter) =>
    k === "all" ? mockCases.length : mockCases.filter((c) => c.status === k).length;

  const filtered = filter === "all" ? mockCases : mockCases.filter((c) => c.status === filter);

  return (
    <div
      className="flex h-[580px] rounded-2xl overflow-hidden border border-[hsl(30_18%_80%)] shadow-md"
      style={{ background: "linear-gradient(to bottom, #f6e1ca, #fbf3eb)" }}
    >
      {/* Left sidebar */}
      <aside
        className="w-60 shrink-0 flex flex-col border-r border-[hsl(30_18%_80%)]"
        style={{ background: "rgba(246, 225, 202, 0.7)", backdropFilter: "blur(8px)" }}
      >
        {/* Brand */}
        <div className="px-5 pt-6 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-primary shadow flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-heading font-semibold text-base leading-none text-foreground">
                Appeal
              </p>
              <p className="text-xs text-foreground/50 mt-0.5">Advocate Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = filter === item.key;
            const n = count(item.key);
            return (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm transition-all ${
                  active
                    ? "bg-foreground/10 text-foreground font-semibold shadow-sm"
                    : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  {item.icon}
                  {item.label}
                </span>
                {n > 0 && (
                  <span
                    className={`text-xs font-semibold min-w-5 text-center ${
                      item.key === "ready" && !active
                        ? "text-amber-700"
                        : active
                        ? "text-foreground/70"
                        : "text-foreground/40"
                    }`}
                  >
                    {n}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Profile */}
        <div className="px-4 py-4 border-t border-[hsl(30_18%_80%)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary text-sm font-semibold flex items-center justify-center">
              NA
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Nurse Advocate</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <p className="text-xs text-foreground/50">Available</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Page heading */}
        <div className="px-7 pt-6 pb-5 shrink-0">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            {filter === "all"
              ? "All Cases"
              : filter === "ready"
              ? "Needs Review"
              : filter === "approved"
              ? "Approved"
              : filter === "won"
              ? "Won"
              : "Lost"}
          </h1>
          {filter === "ready" && count("ready") > 0 ? (
            <p className="text-sm text-amber-700 mt-1 font-medium">
              {count("ready")} {count("ready") === 1 ? "letter requires" : "letters require"} your attention
            </p>
          ) : (
            <p className="text-sm text-foreground/50 mt-1">{filtered.length} cases</p>
          )}
        </div>

        {/* Case list */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-foreground/40">
              <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No cases in this queue</p>
            </div>
          ) : (
            filtered.map((c) => (
              <button
                key={c.id}
                className="w-full text-left rounded-2xl hover:bg-foreground/5 transition-all group overflow-hidden border border-transparent hover:border-foreground/10"
              >
                {/* Top row */}
                <div className="flex items-center gap-4 px-4 pt-4 pb-3">
                  <div
                    className={`w-11 h-11 rounded-full text-base font-semibold flex items-center justify-center shrink-0 ${
                      AVATAR_COLORS[c.status] ?? "bg-muted text-muted-foreground"
                    }`}
                  >
                    {initials(c.patientName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-semibold text-foreground truncate">
                        {c.patientName}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className={`w-2 h-2 rounded-full ${STATUS_DOT[c.status] ?? "bg-muted-foreground"}`} />
                        <span className="text-xs text-foreground/60">
                          {STATUS_LABEL[c.status] ?? c.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {c.appealLetterGeneratedAt && (
                      <div className="flex items-center gap-1 text-xs text-foreground/40">
                        <Clock className="w-3 h-3" />
                        {timeAgo(new Date(c.appealLetterGeneratedAt))}
                      </div>
                    )}
                    <ChevronRight className="w-4 h-4 text-foreground/25 group-hover:text-primary transition-colors" />
                  </div>
                </div>

                {/* Metadata strip — warm tinted */}
                <div className="flex items-stretch mx-3 mb-3 rounded-xl overflow-hidden border border-[hsl(30_18%_82%)] bg-[rgba(246,225,202,0.45)]">
                  <EMetaCell label="Denied service" icon={<FileText className="w-3.5 h-3.5" />} value={c.deniedItem} />
                  <div className="w-px bg-[hsl(30_18%_82%)] shrink-0" />
                  <EMetaCell label="Insurer" icon={<Building2 className="w-3.5 h-3.5" />} value={c.insurerName} />
                  <div className="w-px bg-[hsl(30_18%_82%)] shrink-0" />
                  <EMetaCell label="Denial reason" icon={<MessageSquareQuote className="w-3.5 h-3.5" />} value={`"${c.denialReason}"`} italic grow />
                </div>
              </button>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
