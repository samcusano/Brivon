import { useState } from 'react';
import { Link } from 'wouter';
import {
  CheckCircle, AlertTriangle, Clock, Award, GraduationCap, Shield,
  Check, ChevronDown, ChevronUp, Sparkles, X, MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type AppStatus = 'pending' | 'approved' | 'rejected' | 'needs_info';
type CheckResult = 'pass' | 'fail' | 'pending';

type CredAudit = {
  label: string;
  certNumber: string | null;
  issuer: string;
  expiry: string;
  confidence: number;
  checks: { label: string; status: CheckResult }[];
  flag: string | null;
};

type Application = {
  id: string;
  name: string;
  specialty: string;
  submittedAt: string;
  aiScore: number;
  flags: number;
  recommendation: 'approve' | 'review' | 'hold';
  status: AppStatus;
  credentials: CredAudit[];
  aiSummary: string;
  reviewNote: string;
};

const APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    name: 'Marcus Webb',
    specialty: 'Oncology, Insurance Appeals',
    submittedAt: '2 hours ago',
    aiScore: 91,
    flags: 1,
    recommendation: 'approve',
    status: 'pending',
    aiSummary: 'Strong application. BCPA and RN credentials extracted successfully with high confidence. One minor flag on expiry date format. Registry checks are in progress.',
    reviewNote: '',
    credentials: [
      {
        label: 'Board Certified Patient Advocate (BCPA)',
        certNumber: 'BCPA-3847',
        issuer: 'Patient Advocate Certification Board',
        expiry: 'June 2027',
        confidence: 93,
        checks: [
          { label: 'Document extracted', status: 'pass' },
          { label: 'Cert number format valid', status: 'pass' },
          { label: 'Entered data matches document', status: 'pass' },
          { label: 'PACB registry lookup', status: 'pending' },
        ],
        flag: "Expiry on document reads 'Jun 27' — interpreted as June 2027. Confirm before approving.",
      },
      {
        label: 'Registered Nurse (RN)',
        certNumber: 'RN-0091834',
        issuer: 'State Board of Registered Nursing',
        expiry: 'October 2026',
        confidence: 97,
        checks: [
          { label: 'Document extracted', status: 'pass' },
          { label: 'License number format valid', status: 'pass' },
          { label: 'Entered data matches document', status: 'pass' },
          { label: 'State board license lookup', status: 'pending' },
        ],
        flag: null,
      },
      {
        label: 'E&O — HPSO Professional Liability',
        certNumber: null,
        issuer: 'HPSO Professional Liability',
        expiry: 'March 2027',
        confidence: 99,
        checks: [
          { label: 'Policy document extracted', status: 'pass' },
          { label: 'Carrier verified', status: 'pass' },
          { label: 'Coverage meets minimum', status: 'pass' },
          { label: 'Policy active', status: 'pass' },
        ],
        flag: null,
      },
    ],
  },
  {
    id: 'app-2',
    name: 'Priya Nair',
    specialty: 'Rare Disease, Pediatrics',
    submittedAt: 'Yesterday',
    aiScore: 78,
    flags: 2,
    recommendation: 'review',
    status: 'pending',
    aiSummary: 'BCPA extracted with moderate confidence. Two flags: cert number on document differs from what was entered, and E&O coverage amount is below the required $500K minimum. Human review required.',
    reviewNote: '',
    credentials: [
      {
        label: 'Board Certified Patient Advocate (BCPA)',
        certNumber: 'BCPA-1142',
        issuer: 'Patient Advocate Certification Board',
        expiry: 'August 2026',
        confidence: 74,
        checks: [
          { label: 'Document extracted', status: 'pass' },
          { label: 'Cert number format valid', status: 'pass' },
          { label: 'Entered data matches document', status: 'fail' },
          { label: 'PACB registry lookup', status: 'pending' },
        ],
        flag: "Entered cert # is BCPA-1142 but document shows BCPA-1412. Likely a transposition error — request correction.",
      },
      {
        label: 'E&O — Proliability',
        certNumber: null,
        issuer: 'Proliability (Mercer)',
        expiry: 'November 2026',
        confidence: 71,
        checks: [
          { label: 'Policy document extracted', status: 'pass' },
          { label: 'Carrier verified', status: 'pass' },
          { label: 'Coverage meets minimum', status: 'fail' },
          { label: 'Policy active', status: 'pass' },
        ],
        flag: "Coverage amount is $250K per occurrence — below Brivon's $500K minimum. Applicant must upgrade before approval.",
      },
    ],
  },
  {
    id: 'app-3',
    name: 'Tom Garrison',
    specialty: 'Chronic Illness',
    submittedAt: '3 days ago',
    aiScore: 65,
    flags: 4,
    recommendation: 'hold',
    status: 'pending',
    aiSummary: 'Low-confidence application. BCPA document could not be read clearly — appears to be a photo of a printed certificate with poor lighting. Health coach certification is unrecognized. No E&O document uploaded. Recommend holding and requesting resubmission.',
    reviewNote: '',
    credentials: [
      {
        label: 'Board Certified Patient Advocate (BCPA)',
        certNumber: null,
        issuer: 'Unknown',
        expiry: 'Unknown',
        confidence: 42,
        checks: [
          { label: 'Document extracted', status: 'fail' },
          { label: 'Cert number format valid', status: 'pending' },
          { label: 'Entered data matches document', status: 'pending' },
          { label: 'PACB registry lookup', status: 'pending' },
        ],
        flag: "Document unreadable — poor image quality. Request a clear scan or PDF.",
      },
      {
        label: 'Health Coach Certification',
        certNumber: 'HCC-98121',
        issuer: 'Institute for Integrative Nutrition',
        expiry: 'Ongoing',
        confidence: 60,
        checks: [
          { label: 'Document extracted', status: 'pass' },
          { label: 'Cert number format valid', status: 'pass' },
          { label: 'Issuer recognized by Brivon', status: 'fail' },
          { label: 'Registry lookup', status: 'fail' },
        ],
        flag: "IIN health coach certification is not on Brivon's recognized credential list. Mark as self-reported only.",
      },
    ],
  },
  {
    id: 'app-4',
    name: 'Lisa Chen',
    specialty: 'Mental Health, Chronic Illness',
    submittedAt: '4 days ago',
    aiScore: 97,
    flags: 0,
    recommendation: 'approve',
    status: 'approved',
    aiSummary: 'Exceptional application. All credentials extracted with high confidence. LCSW and RN verified against state registries. E&O coverage exceeds minimum. No flags.',
    reviewNote: 'Approved. Strong credentials across the board.',
    credentials: [
      {
        label: 'Social Worker (LCSW)',
        certNumber: 'LCSW-44821',
        issuer: 'Board of Behavioral Sciences',
        expiry: 'July 2027',
        confidence: 98,
        checks: [
          { label: 'Document extracted', status: 'pass' },
          { label: 'License number format valid', status: 'pass' },
          { label: 'Entered data matches document', status: 'pass' },
          { label: 'State board lookup', status: 'pass' },
        ],
        flag: null,
      },
    ],
  },
];

const SCORE_COLORS: Record<string, string> = {
  high: 'bg-primary/10 text-primary',
  mid: 'bg-amber-100 text-amber-700',
  low: 'bg-red-100 text-red-700',
};

const REC_STYLES: Record<Application['recommendation'], string> = {
  approve: 'bg-primary/10 text-primary border-primary/20',
  review: 'bg-amber-100 text-amber-700 border-amber-200',
  hold: 'bg-red-100 text-red-700 border-red-200',
};

const REC_LABELS: Record<Application['recommendation'], string> = {
  approve: 'Approve',
  review: 'Needs review',
  hold: 'Hold — issues found',
};

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? SCORE_COLORS.high : score >= 75 ? SCORE_COLORS.mid : SCORE_COLORS.low;
  return <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", color)}>{score}/100</span>;
}

function ConfidenceBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full", score >= 90 ? "bg-primary" : score >= 70 ? "bg-amber-400" : "bg-red-400")}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-7 text-right">{score}%</span>
    </div>
  );
}

function StatusChip({ status }: { status: AppStatus }) {
  const styles: Record<AppStatus, string> = {
    pending: 'bg-muted text-muted-foreground',
    approved: 'bg-primary/10 text-primary',
    rejected: 'bg-red-100 text-red-700',
    needs_info: 'bg-amber-100 text-amber-700',
  };
  const labels: Record<AppStatus, string> = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    needs_info: 'Info requested',
  };
  return <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", styles[status])}>{labels[status]}</span>;
}

export default function AdminReview() {
  const [apps, setApps] = useState<Application[]>(APPLICATIONS);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [emailSent, setEmailSent] = useState<{ id: string; message: string } | null>(null);

  function updateStatus(id: string, status: AppStatus) {
    const app = apps.find(a => a.id === id);
    setApps(prev => prev.map(a => a.id === id ? { ...a, status, reviewNote: notes[id] ?? '' } : a));
    setExpanded(null);
    const messages: Record<AppStatus, string> = {
      approved: `Approval email sent to ${app?.name}`,
      needs_info: `Info request sent to ${app?.name}`,
      rejected: `Rejection email sent to ${app?.name}`,
      pending: '',
    };
    const msg = messages[status];
    if (msg) {
      setEmailSent({ id, message: msg });
      setTimeout(() => setEmailSent(null), 3500);
    }
  }

  const pending = apps.filter(a => a.status === 'pending').length;
  const approvedToday = apps.filter(a => a.status === 'approved').length;
  const visible = filter === 'all' ? apps : filter === 'pending' ? apps.filter(a => a.status === 'pending') : apps.filter(a => a.status === 'approved');

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-display font-semibold text-foreground">Brivon</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium text-foreground">Advocate review queue</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">{pending} pending</span>
            <span>{approvedToday} approved</span>
          </div>
        </div>
      </header>

      {emailSent && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-foreground text-background rounded-lg shadow-lg text-sm font-medium animate-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-primary flex-shrink-0" />
          {emailSent.message}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-display font-semibold text-foreground">Review queue</h1>
            <p className="text-sm text-muted-foreground mt-0.5">AI audit results are shown for each application. Review flags before approving.</p>
          </div>
          <div className="flex items-center gap-2">
            {(['pending', 'approved', 'all'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                  filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:border-primary/50"
                )}
              >
                {f === 'all' ? 'All' : f === 'pending' ? 'Pending' : 'Approved'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {visible.map(app => (
            <div key={app.id} className="border border-border rounded-lg overflow-hidden">
              {/* Row */}
              <div
                className="flex items-center gap-4 px-4 py-3.5 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpanded(expanded === app.id ? null : app.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-foreground">{app.name}</span>
                    <StatusChip status={app.status} />
                    {app.status === 'pending' && (
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", REC_STYLES[app.recommendation])}>
                        AI: {REC_LABELS[app.recommendation]}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{app.specialty} · Submitted {app.submittedAt}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-0.5">AI score</p>
                    <ScoreBadge score={app.aiScore} />
                  </div>
                  {app.flags > 0 && (
                    <div className="flex items-center gap-1 text-xs text-amber-600">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {app.flags} flag{app.flags > 1 ? 's' : ''}
                    </div>
                  )}
                  {expanded === app.id
                    ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  }
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === app.id && (
                <div className="border-t border-border p-4 space-y-5 bg-muted/10">

                  {/* AI summary */}
                  <div className="flex gap-2 p-3 bg-background border border-border rounded-lg">
                    <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{app.aiSummary}</p>
                  </div>

                  {/* Credentials */}
                  <div className="space-y-3">
                    {app.credentials.map((cred, idx) => (
                      <div key={idx} className={cn("border rounded-lg p-3", cred.flag ? "border-amber-200 bg-amber-50/50" : "border-border bg-background")}>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-xs font-semibold text-foreground">{cred.label}</span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {cred.flag && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                            <ConfidenceBar score={cred.confidence} />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                          {cred.certNumber && (
                            <div>
                              <p className="text-muted-foreground">Cert #</p>
                              <p className="font-medium">{cred.certNumber}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-muted-foreground">Issuer</p>
                            <p className="font-medium">{cred.issuer}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Expiry</p>
                            <p className="font-medium">{cred.expiry}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1 mb-2">
                          {cred.checks.map((c, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs">
                              {c.status === 'pass' && <Check className="w-3 h-3 text-primary flex-shrink-0" />}
                              {c.status === 'fail' && <X className="w-3 h-3 text-red-500 flex-shrink-0" />}
                              {c.status === 'pending' && <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                              <span className={cn(c.status === 'fail' ? "text-red-600" : c.status === 'pending' ? "text-muted-foreground" : "text-foreground")}>
                                {c.label}
                              </span>
                            </div>
                          ))}
                        </div>
                        {cred.flag && (
                          <p className="text-xs text-amber-700 bg-amber-100 border border-amber-200 rounded px-2 py-1.5">{cred.flag}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Review note + actions */}
                  {app.status === 'pending' && (
                    <div className="space-y-3 pt-2 border-t border-border">
                      <div>
                        <label className="text-xs font-medium text-foreground block mb-1.5">Review note (sent to applicant if requesting info)</label>
                        <textarea
                          value={notes[app.id] ?? ''}
                          onChange={e => setNotes(n => ({ ...n, [app.id]: e.target.value }))}
                          placeholder="Optional note for the applicant…"
                          rows={2}
                          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none placeholder:text-muted-foreground"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => updateStatus(app.id, 'approved')}>
                          <Check className="w-3.5 h-3.5 mr-1.5" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateStatus(app.id, 'needs_info')}>
                          <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Request info
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => updateStatus(app.id, 'rejected')}>
                          <X className="w-3.5 h-3.5 mr-1.5" /> Reject
                        </Button>
                      </div>
                    </div>
                  )}

                  {app.status !== 'pending' && app.reviewNote && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Review note: </span>{app.reviewNote}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
