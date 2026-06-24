import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  Clock,
  ChevronRight,
  Inbox,
  BarChart3,
  Building2,
  FileText,
  MessageSquareQuote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppealCase } from "@shared/schema";
import AdvocateCaseDetail from "./AdvocateCaseDetail";
import AdvocateAnalytics from "./AdvocateAnalytics";

type CaseFilter = "all" | "ready" | "approved" | "won" | "lost";
type View = "cases" | "analytics";

const CASE_FILTERS: { key: CaseFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ready", label: "Needs Review" },
  { key: "approved", label: "Approved" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
];

const STATUS_PILL: Record<string, string> = {
  ready: "bg-amber-100 text-amber-700",
  approved: "bg-primary/12 text-primary",
  won: "bg-green-100 text-green-700",
  lost: "bg-red-50 text-red-600",
  generating: "bg-blue-50 text-blue-600",
  submitted: "bg-green-100 text-green-700",
  draft: "bg-muted text-muted-foreground",
};

const STATUS_LABEL: Record<string, string> = {
  ready: "Needs review",
  approved: "Approved",
  won: "Won",
  lost: "Lost",
  generating: "Generating",
  submitted: "Submitted",
  draft: "Draft",
};

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AdvocatePortal() {
  const [view, setView] = useState<View>("cases");
  const [caseFilter, setCaseFilter] = useState<CaseFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: cases = [], isLoading } = useQuery<AppealCase[]>({
    queryKey: ["/api/advocate/cases", caseFilter === "all" ? "" : caseFilter],
    queryFn: async () => {
      const url =
        caseFilter === "all"
          ? "/api/advocate/cases"
          : `/api/advocate/cases?status=${caseFilter}`;
      const res = await fetch(url);
      return res.json();
    },
    refetchInterval: 8000,
    enabled: view !== "analytics",
  });

  const { data: allCases = [] } = useQuery<AppealCase[]>({
    queryKey: ["/api/advocate/cases"],
    queryFn: async () => {
      const res = await fetch("/api/advocate/cases");
      return res.json();
    },
  });

  const countByStatus = (s: string) =>
    allCases.filter((c) => c.status === s).length;

  const selected = cases.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(160deg, hsl(42 30% 97%) 0%, hsl(38 22% 95%) 100%)" }}>
      {/* Dark sidebar */}
      <aside className="w-56 shrink-0 flex flex-col border-r border-sidebar-border sticky top-0 h-screen bg-sidebar text-sidebar-foreground">
        {/* Brand */}
        <div className="px-5 pt-6 pb-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <Scale className="w-4 h-4 text-sidebar-primary" strokeWidth={1.5} />
            <div>
              <p className="font-heading font-semibold text-base leading-none text-sidebar-foreground">
                Appeal
              </p>
              <p className="text-[10px] text-sidebar-foreground/40 mt-0.5 font-sans uppercase tracking-wider">Advocate Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <button
            onClick={() => { setView("cases"); setSelectedId(null); }}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
              view === "cases"
                ? "bg-sidebar-accent text-sidebar-foreground font-semibold"
                : "text-sidebar-foreground/50 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
            )}
          >
            <span className="flex items-center gap-2.5">
              <Inbox className="w-3.5 h-3.5" strokeWidth={1.5} />
              Cases
            </span>
            {allCases.length > 0 && (
              <span className={cn(
                "text-xs font-semibold tabular-nums",
                view === "cases" ? "text-sidebar-primary" : "text-sidebar-foreground/30"
              )}>
                {allCases.length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setView("analytics"); setSelectedId(null); }}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
              view === "analytics"
                ? "bg-sidebar-accent text-sidebar-foreground font-semibold"
                : "text-sidebar-foreground/50 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
            )}
          >
            <BarChart3 className="w-3.5 h-3.5" strokeWidth={1.5} />
            Analytics
          </button>
        </nav>

        {/* Status counts — quick glance */}
        <div className="px-4 py-3 border-t border-sidebar-border space-y-1.5">
          {[
            { label: "Needs review", count: countByStatus("ready"), color: "text-amber-400" },
            { label: "Won", count: countByStatus("won"), color: "text-green-400" },
          ].map(({ label, count, color }) => (
            <div key={label} className="flex items-center justify-between text-xs">
              <span className="text-sidebar-foreground/40">{label}</span>
              <span className={cn("font-semibold tabular-nums", color)}>{count}</span>
            </div>
          ))}
        </div>

        {/* Profile */}
        <div className="px-4 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent text-sidebar-primary text-xs font-bold flex items-center justify-center shrink-0 font-sans">
              NA
            </div>
            <div>
              <p className="text-sm font-semibold text-sidebar-foreground leading-tight">Nurse Advocate</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <p className="text-[10px] text-sidebar-foreground/40 font-sans">Available</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-0">
        {view === "analytics" && (
          <div className="flex-1 overflow-y-auto">
            <AdvocateAnalytics />
          </div>
        )}

        {view === "cases" && (
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key="detail"
                className="flex-1"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              >
                <AdvocateCaseDetail
                  appealCase={selected}
                  onBack={() => setSelectedId(null)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="list"
                className="flex-1 flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {/* Page heading + filters */}
                <div className="px-7 pt-7 pb-5 shrink-0 border-b border-border/50">
                  <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground mb-4">
                    Cases
                  </h1>
                  <div className="flex items-center gap-1">
                    {CASE_FILTERS.map((f) => {
                      const n = f.key === "all" ? allCases.length : countByStatus(f.key);
                      const active = caseFilter === f.key;
                      return (
                        <button
                          key={f.key}
                          onClick={() => setCaseFilter(f.key)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors",
                            active
                              ? "bg-foreground/8 text-foreground"
                              : "text-foreground/45 hover:text-foreground hover:bg-foreground/5"
                          )}
                        >
                          {f.label}
                          {n > 0 && (
                            <span className={cn(
                              "tabular-nums",
                              active ? "text-primary" : "text-foreground/30"
                            )}>
                              {n}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Case list */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
                  {isLoading ? (
                    <>
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-[88px] rounded-lg animate-pulse bg-muted/50"
                        />
                      ))}
                    </>
                  ) : cases.length === 0 ? (
                    <div className="text-center py-20 text-foreground/35">
                      <Inbox className="w-7 h-7 mx-auto mb-2.5 opacity-50" strokeWidth={1.5} />
                      <p className="text-sm">No cases in this queue</p>
                    </div>
                  ) : (
                    cases.map((c) => (
                      <CaseRow
                        key={c.id}
                        appealCase={c}
                        onClick={() => setSelectedId(c.id)}
                      />
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}

function CaseRow({ appealCase, onClick }: { appealCase: AppealCase; onClick: () => void }) {
  const age = appealCase.appealLetterGeneratedAt
    ? timeAgo(new Date(appealCase.appealLetterGeneratedAt))
    : null;

  const statusClass = STATUS_PILL[appealCase.status] ?? "bg-muted text-muted-foreground";
  const statusLabel = STATUS_LABEL[appealCase.status] ?? appealCase.status;

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-lg hover:bg-foreground/4 border border-transparent hover:border-border transition-colors group"
    >
      <div className="flex items-center gap-4 px-4 py-3.5">
        <div className="w-9 h-9 rounded-full bg-muted text-foreground/60 text-xs font-bold flex items-center justify-center shrink-0 font-sans">
          {initials(appealCase.patientName)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-heading font-semibold text-foreground text-[15px] truncate">
              {appealCase.patientName}
            </span>
            <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-sm shrink-0 font-sans", statusClass)}>
              {statusLabel}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-foreground/45">
            <span className="flex items-center gap-1 truncate">
              <FileText className="w-3 h-3 shrink-0" strokeWidth={1.5} />
              <span className="truncate">{appealCase.deniedItem}</span>
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Building2 className="w-3 h-3" strokeWidth={1.5} />
              {appealCase.insurerName}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {age && (
            <span className="text-xs text-foreground/30 font-sans tabular-nums">{age}</span>
          )}
          <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-primary transition-colors" />
        </div>
      </div>

      {/* Denial reason strip */}
      <div className="mx-3 mb-3 px-3.5 py-2 bg-muted/40 rounded-md border border-border/60">
        <div className="flex items-start gap-2 text-xs text-foreground/50">
          <MessageSquareQuote className="w-3.5 h-3.5 shrink-0 mt-0.5" strokeWidth={1.5} />
          <span className="italic truncate">"{appealCase.denialReason}"</span>
        </div>
      </div>
    </button>
  );
}
