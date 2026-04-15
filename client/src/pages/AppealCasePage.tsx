import { useRoute, Link } from 'wouter';
import { useState } from 'react';
import {
  ArrowLeft, ArrowRight, AlertTriangle, CheckCircle, Clock,
  FileText, Phone, Mail, ExternalLink, Lock, Shield,
  ChevronRight, Send, AlertCircle, User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Shared appeal list (sorted by urgency for prev/next) ───────────────────
const APPEALS = [
  { id: 1, employee: 'Elena Torres',  type: 'Prior Authorization', service: 'PET Scan — Full Body',                  carrier: 'BCBS', denialDate: 'Mar 15, 2026', deadline: 'Apr 25, 2026', daysLeft: 22, status: 'In progress', advocate: 'Dr. Sarah Mitchell', priority: 'high'   },
  { id: 2, employee: 'Marcus Webb',   type: 'Claim Appeal',         service: 'ER Visit — Out-of-network facility fee', carrier: 'BCBS', denialDate: 'Mar 28, 2026', deadline: 'May 10, 2026', daysLeft: 37, status: 'Draft',       advocate: 'Maria Rodriguez',    priority: 'medium' },
  { id: 3, employee: 'David Kim',     type: 'External Review',      service: 'Immunotherapy — 6-cycle course',         carrier: 'BCBS', denialDate: 'Feb 12, 2026', deadline: 'Apr 8, 2026',  daysLeft: 5,  status: 'Submitted',  advocate: 'James Chen',          priority: 'urgent' },
  { id: 4, employee: 'Priya Nair',    type: 'Prior Authorization',  service: 'Enzyme replacement therapy',            carrier: 'BCBS', denialDate: 'Mar 30, 2026', deadline: 'May 14, 2026', daysLeft: 41, status: 'Draft',       advocate: 'Jennifer Moore',      priority: 'medium' },
];

// ── Per-case detail data ───────────────────────────────────────────────────
type ChecklistItem  = { id: number; text: string; done: boolean };
type ActivityEntry  = { date: string; author: string; text: string };
type AdvocateInfo   = { name: string; phone: string; email: string; responseTime: string };
type InsurerInfo    = { name: string; phone: string; fax: string; portal: string };

type CaseDetail = {
  denialReason:         string;
  denialSource:         string;
  hipaa:                'signed' | 'pending' | 'not-started';
  draft:                string;
  checklist:            ChecklistItem[];
  activity:             ActivityEntry[];
  advocate:             AdvocateInfo;
  insurer:              InsurerInfo;
  submittedOn?:         string;
  submittedTo?:         string;
  submissionRef?:       string;
};

const CASE_DETAILS: Record<number, CaseDetail> = {
  1: {
    denialReason:   '"Medical necessity not established for PET scan — Full Body. Submitted documentation does not support the requested imaging as medically necessary per InterQual criteria for the patient\'s documented diagnosis."',
    denialSource:   'BCBS EOB — Mar 15, 2026',
    hipaa:          'signed',
    draft:          'Re: Appeal of Prior Authorization Denial — PET Scan (Full Body)\nDate of Denial: March 15, 2026\nMember: Elena Torres · Auth #: PA-2026-88142\n\nDear BCBS Medical Review Team,\n\nWe are writing to formally appeal the denial of prior authorization for a full-body PET scan for Elena Torres, whose oncologist has documented clinical findings that meet InterQual Level-of-Care criteria for whole-body metabolic imaging.\n\n[PENDING — attach updated oncology notes from Dr. Patel before submitting]',
    checklist: [
      { id: 1, text: 'Updated oncology notes from Dr. Patel (Mar 2026)',    done: false },
      { id: 2, text: 'Letter of medical necessity — on file',                done: true  },
      { id: 3, text: 'BCBS denial letter (PA-2026-88142)',                   done: true  },
      { id: 4, text: 'Patient HIPAA authorization',                          done: true  },
    ],
    activity: [
      { date: 'Apr 2, 2026',  author: 'Dr. Sarah Mitchell', text: 'Requested updated oncology notes from Dr. Patel\'s office. Expected by Apr 5.' },
      { date: 'Mar 28, 2026', author: 'Dr. Sarah Mitchell', text: 'Letter of medical necessity received. Draft appeal ~70% complete.' },
      { date: 'Mar 15, 2026', author: 'System',             text: 'Denial received from BCBS. 180-day appeal window opened.' },
    ],
    advocate: { name: 'Dr. Sarah Mitchell', phone: '(617) 555-0198', email: 'sarah.mitchell@brivon.com', responseTime: '< 2 hrs' },
    insurer:  { name: 'BCBS Appeals Unit',  phone: '1-800-262-2583', fax: '1-800-504-0072',             portal: 'provider.bcbs.com' },
  },
  2: {
    denialReason:   '"Facility fee for out-of-network emergency services billed at out-of-network rate. Under the No Surprises Act, the facility fee is subject to the qualifying payment amount (QPA). Member balance billing dispute must be initiated within 30 days of the explanation of benefits."',
    denialSource:   'BCBS EOB — Mar 28, 2026',
    hipaa:          'signed',
    draft:          '',
    checklist: [
      { id: 1, text: 'Itemized hospital bill (requested from billing dept)',      done: false },
      { id: 2, text: 'Original EOB from BCBS (Mar 28, 2026)',                     done: true  },
      { id: 3, text: 'NSA independent dispute resolution eligibility check',      done: false },
      { id: 4, text: 'Patient HIPAA authorization',                               done: true  },
    ],
    activity: [
      { date: 'Apr 1, 2026',  author: 'Maria Rodriguez', text: 'This is a No Surprises Act balance billing issue. Requesting itemized bill to verify charges before drafting.' },
      { date: 'Mar 28, 2026', author: 'System',           text: 'Case opened. Denial received from BCBS.' },
    ],
    advocate: { name: 'Maria Rodriguez',       phone: '(617) 555-0231', email: 'maria.rodriguez@brivon.com', responseTime: '< 4 hrs' },
    insurer:  { name: 'BCBS Claims Resolution', phone: '1-800-262-2583', fax: '1-800-504-0072',              portal: 'provider.bcbs.com' },
  },
  3: {
    denialReason:   '"Medical necessity not established. The requested immunotherapy regimen (6-cycle course) does not meet BCBS coverage criteria under Clinical Policy 8A-20. Submitted documentation does not establish that immunotherapy is first-line therapy for the documented diagnosis."',
    denialSource:   'BCBS EOB — Feb 12, 2026',
    hipaa:          'signed',
    draft:          'Re: External Review Request — Immunotherapy (6-cycle course)\nMember: David Kim · Ref: EXT-REV-2026-44291\nDenial Date: February 12, 2026\n\nThis external review request disputes BCBS\'s denial of immunotherapy on grounds of medical necessity. The denial cites Policy 8A-20, however three peer-reviewed studies (NEJM 2024, JCO 2023, Lancet Oncology 2024) establish immunotherapy as standard first-line care for the documented diagnosis. The treating oncologist\'s letter of medical necessity, attached hereto, provides individualized clinical rationale that directly rebuts each ground of denial.',
    checklist:      [],
    submittedOn:    'March 31, 2026',
    submittedTo:    'BCBS External Review Unit — fax 1-800-504-0112 (confirmed received)',
    submissionRef:  'EXT-REV-2026-44291',
    activity: [
      { date: 'Mar 31, 2026', author: 'James Chen', text: 'External review request submitted and confirmed received by BCBS. Ref: EXT-REV-2026-44291. Decision required by April 8.' },
      { date: 'Mar 25, 2026', author: 'James Chen', text: 'Appeal letter finalized with supporting oncology literature. BCBS Clinical Policy 8A-20 directly addressed across 3 peer-reviewed citations.' },
      { date: 'Feb 12, 2026', author: 'System',     text: 'Denial received. External review request filed directly — James confirmed internal appeal not required for this denial type.' },
    ],
    advocate: { name: 'James Chen',          phone: '(617) 555-0187', email: 'james.chen@brivon.com', responseTime: '< 2 hrs' },
    insurer:  { name: 'BCBS External Review', phone: '1-800-262-2583 ext. 4', fax: '1-800-504-0112', portal: 'provider.bcbs.com/external-review' },
  },
  4: {
    denialReason:   '"Prior authorization denied. Enzyme replacement therapy does not meet BCBS coverage criteria under Clinical Policy 42-B (Enzyme Replacement Therapy for Lysosomal Storage Disorders). Required documentation not received: genetic testing confirming diagnosis, baseline functional assessment, and specialist attestation of medical necessity."',
    denialSource:   'BCBS EOB — Mar 30, 2026',
    hipaa:          'signed',
    draft:          '',
    checklist: [
      { id: 1, text: 'Genetic testing results confirming diagnosis',           done: false },
      { id: 2, text: 'Baseline functional assessment from specialist',         done: false },
      { id: 3, text: 'Specialist letter of medical necessity',                 done: false },
      { id: 4, text: 'BCBS Clinical Policy 42-B analysis (rebuttal points)',   done: true  },
      { id: 5, text: 'Patient HIPAA authorization',                            done: true  },
    ],
    activity: [
      { date: 'Apr 2, 2026',  author: 'Jennifer Moore', text: 'BCBS requires 3 documents not yet in hand. Contacted Dr. Kapoor\'s office for genetic test results and functional assessment. Estimated turnaround: 1–2 weeks.' },
      { date: 'Mar 30, 2026', author: 'System',          text: 'Case opened. Denial received from BCBS.' },
    ],
    advocate: { name: 'Jennifer Moore',    phone: '(617) 555-0264', email: 'jennifer.moore@brivon.com', responseTime: '< 3 hrs' },
    insurer:  { name: 'BCBS Prior Auth',   phone: '1-800-262-2583 ext. 2', fax: '1-800-504-0072',     portal: 'provider.bcbs.com/priorauth' },
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────
function HipaaStatus({ status }: { status: CaseDetail['hipaa'] }) {
  if (status === 'signed') return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent">
      <CheckCircle className="w-3.5 h-3.5" /> Authorization signed
    </span>
  );
  if (status === 'pending') return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
      <Clock className="w-3.5 h-3.5" /> Authorization pending
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive">
      <AlertCircle className="w-3.5 h-3.5" /> Authorization not signed — advocates cannot access records
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function AppealCasePage() {
  const [, params] = useRoute('/employer/appeals/:id');
  const id     = parseInt(params?.id ?? '0');
  const appeal = APPEALS.find(a => a.id === id);
  const detail = CASE_DETAILS[id];
  const [draftText, setDraftText] = useState(detail?.draft ?? '');
  const [note, setNote]           = useState('');

  if (!appeal || !detail) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="font-semibold text-foreground mb-1">Case not found</p>
          <Link href="/employer" className="text-sm text-primary hover:underline">← Back to appeals</Link>
        </div>
      </div>
    );
  }

  const sorted  = [...APPEALS].sort((a, b) => a.daysLeft - b.daysLeft);
  const idx     = sorted.findIndex(a => a.id === id);
  const prev    = idx > 0              ? sorted[idx - 1] : null;
  const next    = idx < sorted.length - 1 ? sorted[idx + 1] : null;

  const isUrgent = appeal.daysLeft <= 7;
  const isWarn   = appeal.daysLeft <= 21 && !isUrgent;

  const pendingItems   = detail.checklist.filter(c => !c.done).length;
  const canSubmit      = appeal.status === 'Draft' && pendingItems === 0 && draftText.trim().length > 50;

  return (
    <div className="min-h-screen bg-background">

      {/* ── Topbar ── */}
      <header className="h-14 border-b border-border sticky top-0 bg-background z-10 flex items-center gap-3 px-8">
        <Link href="/employer?tab=appeals" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm flex-shrink-0">
          <ArrowLeft className="w-4 h-4" /> Appeals
        </Link>

        <ChevronRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />

        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="text-sm text-muted-foreground flex-shrink-0">{appeal.employee}</span>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0" />
          <span className="font-semibold text-foreground text-sm truncate">{appeal.service}</span>
          <span className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0",
            appeal.status === 'Submitted'   ? "bg-accent/10 text-accent border-accent/20"
            : appeal.status === 'In progress' ? "bg-primary/10 text-primary border-primary/20"
            : "bg-muted text-muted-foreground border-border"
          )}>
            {appeal.status}
          </span>
          {isUrgent && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-destructive text-white flex-shrink-0">
              <AlertTriangle className="w-3 h-3" /> {appeal.daysLeft}d left
            </span>
          )}
        </div>

        {/* Prev / next */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {prev ? (
            <Link href={`/employer/appeals/${prev.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground border border-border hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> {prev.employee}
            </Link>
          ) : <div className="w-24" />}
          {next && (
            <Link href={`/employer/appeals/${next.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground border border-border hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {next.employee} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-8 py-6 flex gap-8 items-start">

        {/* ── Main ── */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Urgent banner */}
          {isUrgent && (
            <div className="flex items-start gap-3 px-4 py-3.5 bg-destructive/5 border border-destructive/30 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {appeal.daysLeft} days until deadline — {appeal.deadline}
                </p>
                {appeal.status === 'Submitted' && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    If BCBS does not issue a decision by {appeal.deadline}, request an immediate escalation to independent external review. James Chen should initiate this proactively.
                  </p>
                )}
              </div>
              {appeal.status === 'Submitted' && (
                <button className="flex items-center gap-1.5 text-xs font-semibold text-destructive border border-destructive/30 px-3 py-1.5 rounded-lg hover:bg-destructive/10 transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  Escalate to external review <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* ── DRAFT: checklist + editor ── */}
          {appeal.status === 'Draft' && (
            <>
              {/* Filing checklist */}
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-muted border-b border-border flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">Required before filing</h2>
                  <span className="text-xs text-muted-foreground">
                    {detail.checklist.filter(c => c.done).length} of {detail.checklist.length} ready
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {detail.checklist.map(item => (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                        item.done ? "bg-accent border-accent" : "border-muted-foreground/30"
                      )}>
                        {item.done && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <span className={cn("text-sm", item.done ? "text-muted-foreground line-through" : "text-foreground")}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Letter editor */}
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-muted border-b border-border flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" /> Appeal letter
                  </h2>
                  <span className="text-xs text-muted-foreground">{draftText.length > 0 ? 'Draft' : 'Not started'}</span>
                </div>
                <textarea
                  value={draftText}
                  onChange={e => setDraftText(e.target.value)}
                  placeholder="Start drafting the appeal letter here…"
                  className="w-full px-4 py-4 text-sm text-foreground font-mono leading-relaxed bg-background resize-none focus:outline-none min-h-[280px] placeholder:text-muted-foreground/50"
                />
                <div className="px-4 py-3 border-t border-border flex items-center justify-between bg-muted">
                  {pendingItems > 0 ? (
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      {pendingItems} required item{pendingItems > 1 ? 's' : ''} still outstanding
                    </p>
                  ) : (
                    <p className="text-xs text-accent flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> All items ready
                    </p>
                  )}
                  <button
                    disabled={!canSubmit}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      canSubmit
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    <Send className="w-3.5 h-3.5" /> Submit appeal
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── IN PROGRESS: outstanding + draft preview ── */}
          {appeal.status === 'In progress' && (
            <>
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-muted border-b border-border">
                  <h2 className="text-sm font-semibold text-foreground">Outstanding items</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">What's blocking this from being filed</p>
                </div>
                <div className="divide-y divide-border">
                  {detail.checklist.filter(c => !c.done).length === 0 ? (
                    <div className="px-4 py-4 text-sm text-muted-foreground">Nothing outstanding — check activity log.</div>
                  ) : detail.checklist.map(item => !item.done && (
                    <div key={item.id} className="flex items-start gap-3 px-4 py-3">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {draftText && (
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="px-4 py-3 bg-muted border-b border-border flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" /> Current draft
                    </h2>
                    <span className="text-xs text-muted-foreground">Read only</span>
                  </div>
                  <pre className="px-4 py-4 text-sm text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap bg-background">{draftText}</pre>
                </div>
              )}
            </>
          )}

          {/* ── SUBMITTED: confirmation + timeline ── */}
          {appeal.status === 'Submitted' && detail.submittedOn && (
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-3.5 bg-accent/5 border-b border-accent/20 flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Appeal submitted — {detail.submittedOn}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{detail.submittedTo}</p>
                </div>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Reference number</p>
                  <p className="text-sm font-mono font-medium text-foreground">{detail.submissionRef}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Insurer decision due</p>
                  <p className={cn("text-sm font-semibold", isUrgent ? "text-destructive" : isWarn ? "text-amber-700" : "text-foreground")}>
                    {appeal.deadline}
                  </p>
                </div>
              </div>
              {draftText && (
                <>
                  <div className="border-t border-border px-4 py-3 bg-muted flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" /> Submitted letter
                    </h2>
                  </div>
                  <pre className="px-4 py-4 text-sm text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap bg-background">{draftText}</pre>
                </>
              )}
            </div>
          )}

          {/* ── Activity log ── */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-muted border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Activity log</h2>
            </div>
            <div className="divide-y divide-border">
              {detail.activity.map((entry, i) => (
                <div key={i} className="flex gap-3 px-4 py-3">
                  <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-semibold text-muted-foreground flex-shrink-0 mt-0.5">
                    {entry.author === 'System' ? '⚙' : entry.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-xs font-medium text-foreground">{entry.author}</span>
                      <span className="text-xs text-muted-foreground">{entry.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-snug">{entry.text}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Add note */}
            <div className="border-t border-border px-4 py-3 flex gap-3 items-end">
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add a note…"
                rows={2}
                className="flex-1 px-3 py-2 text-sm bg-muted border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/50"
              />
              <button
                disabled={!note.trim()}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring flex-shrink-0",
                  note.trim() ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <Send className="w-3.5 h-3.5" /> Post
              </button>
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="w-72 flex-shrink-0 space-y-4">

          {/* Case metadata */}
          <div className="border border-border rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground">Case details</h3>
            {[
              ['Type',     appeal.type],
              ['Carrier',  appeal.carrier],
              ['Denied',   appeal.denialDate],
              ['Deadline', appeal.deadline],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-3 text-sm">
                <span className="text-muted-foreground flex-shrink-0">{label}</span>
                <span className={cn(
                  "font-medium text-right",
                  label === 'Deadline' && isUrgent ? "text-destructive" : "text-foreground"
                )}>{value}</span>
              </div>
            ))}
            <div className="pt-1">
              <HipaaStatus status={detail.hipaa} />
            </div>
          </div>

          {/* Denial reason */}
          <div className="border border-border rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> Denial reason
            </h3>
            <p className="text-xs text-foreground leading-relaxed italic">{detail.denialReason}</p>
            <p className="text-xs text-muted-foreground">{detail.denialSource}</p>
          </div>

          {/* Advocate */}
          <div className="border border-border rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground">Advocate</h3>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">
                {detail.advocate.name.split(' ').filter((_, i, arr) => i === 0 || i === arr.length - 1).map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{detail.advocate.name}</p>
                <p className="text-xs text-muted-foreground">Responds {detail.advocate.responseTime}</p>
              </div>
            </div>
            <div className="space-y-2">
              <a href={`mailto:${detail.advocate.email}`} className="flex items-center gap-2 text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" /> {detail.advocate.email}
              </a>
              <a href={`tel:${detail.advocate.phone}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" /> {detail.advocate.phone}
              </a>
            </div>
          </div>

          {/* Insurer contact */}
          <div className="border border-border rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Insurer contact
            </h3>
            <p className="text-sm font-medium text-foreground">{detail.insurer.name}</p>
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" /> {detail.insurer.phone}
              </p>
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="w-3.5 h-3.5 flex-shrink-0" /> Fax: {detail.insurer.fax}
              </p>
              <a href="#" className="flex items-center gap-2 text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" /> {detail.insurer.portal}
              </a>
            </div>
          </div>

          {/* Lock note */}
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground px-1">
            <Lock className="w-3 h-3 flex-shrink-0" /> Case files are HIPAA-encrypted and accessible only to authorized advocates.
          </p>

        </div>
      </div>
    </div>
  );
}
