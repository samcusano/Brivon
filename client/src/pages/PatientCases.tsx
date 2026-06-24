import { Link } from 'wouter';
import {
  AlertCircle, Calendar, CheckCircle, ChevronRight,
  FileText, MessageCircle, Plus, Shield, Video, Phone, Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CASES, type PatientCase } from '@/data/mockCases';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusStyle(status: PatientCase['status'], label: string) {
  if (status === 'resolved') return 'bg-emerald-100 text-emerald-700';
  if (label.toLowerCase().includes('appeal') || label.toLowerCase().includes('pending'))
    return 'bg-amber-100 text-amber-700';
  return 'bg-primary/10 text-primary';
}

function statusDot(status: PatientCase['status'], label: string) {
  if (status === 'resolved') return 'bg-emerald-500';
  if (label.toLowerCase().includes('appeal') || label.toLowerCase().includes('pending'))
    return 'bg-amber-500';
  return 'bg-primary';
}

function sessionIcon(type: string) {
  if (type === 'Phone call') return <Phone className="w-3.5 h-3.5" />;
  return <Video className="w-3.5 h-3.5" />;
}

// ─── Needs attention strip ────────────────────────────────────────────────────

function NeedsAttentionStrip() {
  const urgent = CASES.filter(c => c.status === 'active' && c.urgentAction);
  if (urgent.length === 0) return null;

  return (
    <div className="border border-amber-200 bg-amber-50/80 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <p className="text-sm font-semibold text-foreground">Needs your attention</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {urgent.map(c => (
          <Link key={c.id} href={`/my-cases/${c.id}`}>
            <a className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-amber-200 rounded-lg text-sm hover:border-amber-400 hover:shadow-sm transition-[border-color,box-shadow] group">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
              <span className="text-foreground">{c.urgentAction}</span>
              <span className="text-amber-600/60 text-xs font-medium">· {c.title}</span>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Case card ────────────────────────────────────────────────────────────────

function CaseCard({ c }: { c: PatientCase }) {
  const isResolved = c.status === 'resolved';

  return (
    <Link href={`/my-cases/${c.id}`}>
      <a className={cn(
        "block border rounded-2xl overflow-hidden hover:shadow-md transition-[box-shadow,opacity] group",
        isResolved ? "border-border bg-card opacity-75 hover:opacity-100" : "border-border bg-card",
      )}>
        {/* Top: advocate + status */}
        <div className="flex items-start gap-3 px-5 pt-5 pb-4">
          <img
            src={c.advocate.image}
            alt={c.advocate.name}
            className="w-11 h-11 rounded-full object-cover flex-shrink-0 outline outline-1 -outline-offset-1 outline-black/10"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[13px] font-semibold text-foreground leading-tight">{c.advocate.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{c.advocate.specialty}</p>
              </div>
              <span className={cn(
                "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0",
                statusStyle(c.status, c.statusLabel)
              )}>
                {!isResolved && <span className={cn("w-1.5 h-1.5 rounded-full inline-block", statusDot(c.status, c.statusLabel))} />}
                {isResolved && <CheckCircle className="w-3 h-3" />}
                {c.statusLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Case title + description */}
        <div className="px-5 pb-4 border-t border-border pt-4">
          <p className="text-sm font-semibold text-foreground mb-1">{c.title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{c.description}</p>
        </div>

        {/* Last message from advocate */}
        {!isResolved && (
          <div className="mx-5 mb-4 p-3 bg-muted/50 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-0.5">Latest from {c.advocate.name.split(' ')[0]}</p>
            <p className="text-xs text-foreground leading-relaxed line-clamp-2 italic">"{c.advocate.lastMessage}"</p>
          </div>
        )}

        {/* Stats + next session */}
        <div className="px-5 pb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{c.sessionsCompleted} sessions</span>
            <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/40" />
            <span>{c.docsShared} docs</span>
            {c.nextSession && (
              <>
                <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/40" />
                <span className="flex items-center gap-1 text-primary font-medium">
                  {sessionIcon(c.nextSession.type)}
                  {c.nextSession.date}
                </span>
              </>
            )}
          </div>
          <span className="flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View case <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </a>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PatientCases() {
  const activeCases = CASES.filter(c => c.status === 'active');
  const resolvedCases = CASES.filter(c => c.status === 'resolved');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <a className="font-display font-semibold text-foreground">Brivon</a>
            </Link>
            <span className="text-border">·</span>
            <span className="text-sm text-muted-foreground">My Cases</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-[11px]">
                JM
              </div>
              Jennifer M.
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Page title */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Your Cases</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {activeCases.length} active · {resolvedCases.length} resolved
            </p>
          </div>
          <Link href="/marketplace">
            <a className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
              <Plus className="w-4 h-4" />
              Find an advocate
            </a>
          </Link>
        </div>

        {/* Needs attention */}
        <NeedsAttentionStrip />

        {/* Active cases */}
        {activeCases.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Active · {activeCases.length}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCases.map(c => <CaseCard key={c.id} c={c} />)}
            </div>
          </div>
        )}

        {/* Resolved cases */}
        {resolvedCases.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Resolved · {resolvedCases.length}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resolvedCases.map(c => <CaseCard key={c.id} c={c} />)}
            </div>
          </div>
        )}

        {/* Trust footer */}
        <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-3.5 h-3.5" />
          All cases protected by Brivon's advocate guarantee
        </div>
      </div>
    </div>
  );
}
