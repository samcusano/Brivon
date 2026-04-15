import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  CheckCircle, Clock, Shield, AlertTriangle, Check,
  Award, GraduationCap, Sparkles, ChevronRight, Mail,
  MessageSquare, Send, X, Edit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type AppStatus = 'under_review' | 'needs_info' | 'approved' | 'rejected';

const APPLICANT = {
  name: 'Marcus Webb',
  submittedAt: 'Today at 2:41 PM',
  overallScore: 91,
  recommendation: 'Strong application. Likely to be approved pending registry confirmation.',
};

const ADMIN_REQUEST = {
  from: 'Maya Torres',
  role: 'Brivon Verification Team',
  date: 'Today at 4:15 PM',
  message: "Thanks for applying, Marcus. Everything looks strong. One thing to clarify before we approve: your BCPA certificate shows an expiry of 'Jun 27' — can you confirm this means June 2027? You can reply here or re-upload a clearer scan of the document.",
};

const AUDIT_ITEMS = [
  {
    id: 'bcpa',
    label: 'Board Certified Patient Advocate (BCPA)',
    icon: Award,
    certNumber: 'BCPA-3847',
    issuer: 'Patient Advocate Certification Board',
    expiry: 'June 2027',
    checks: [
      { label: 'Document extracted', status: 'pass' },
      { label: 'Cert number format valid', status: 'pass' },
      { label: 'Entered data matches document', status: 'pass' },
      { label: 'PACB registry lookup', status: 'pending' },
    ],
    flag: "Expiry on document reads 'Jun 27' — interpreted as June 2027. Please confirm.",
    confidence: 93,
  },
  {
    id: 'rn',
    label: 'Registered Nurse (RN)',
    icon: GraduationCap,
    certNumber: 'RN-0091834',
    issuer: 'State Board of Registered Nursing',
    expiry: 'October 2026',
    checks: [
      { label: 'Document extracted', status: 'pass' },
      { label: 'License number format valid', status: 'pass' },
      { label: 'Entered data matches document', status: 'pass' },
      { label: 'State board license lookup', status: 'pending' },
    ],
    flag: null,
    confidence: 97,
  },
  {
    id: 'eo',
    label: 'E&O Insurance — HPSO Professional Liability',
    icon: Shield,
    certNumber: null,
    issuer: 'HPSO Professional Liability',
    expiry: 'March 2027',
    checks: [
      { label: 'Policy document extracted', status: 'pass' },
      { label: 'Carrier name verified', status: 'pass' },
      { label: 'Coverage meets minimum ($500K)', status: 'pass' },
      { label: 'Policy active status', status: 'pass' },
    ],
    flag: null,
    confidence: 99,
  },
];

const TIMELINE = [
  { step: 1, label: 'Application submitted', description: 'Received and queued for review.', done: true },
  { step: 2, label: 'AI audit', description: 'Documents extracted, registry checks running.', done: true },
  { step: 3, label: 'Human review', description: 'A Brivon team member reviews and approves.', done: false, active: true },
  { step: 4, label: 'Profile live', description: 'Your verified profile becomes visible to patients.', done: false },
];

function ConfidenceBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full", score >= 90 ? "bg-primary" : score >= 75 ? "bg-amber-400" : "bg-red-400")}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-medium text-muted-foreground w-8 text-right">{score}%</span>
    </div>
  );
}

// ─── State-specific banners ───────────────────────────────────────────────────

function UnderReviewBanner() {
  return (
    <div className="text-center mb-10">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Clock className="w-6 h-6 text-primary" />
      </div>
      <h1 className="font-display text-2xl font-semibold text-foreground mb-2">Application received</h1>
      <p className="text-sm text-muted-foreground">Submitted {APPLICANT.submittedAt} · Estimated review: 1–2 business days</p>
      <p className="text-sm text-muted-foreground mt-1">We'll email you at every step. Your profile stays hidden until approved.</p>
    </div>
  );
}

function NeedsInfoBanner({ onResponseSent }: { onResponseSent: () => void }) {
  const [response, setResponse] = useState('');
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!response.trim()) return;
    setSent(true);
    setTimeout(onResponseSent, 1500);
  }

  return (
    <div className="mb-8">
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-semibold text-amber-800">The review team has a question for you</span>
        </div>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-amber-800">
            {ADMIN_REQUEST.from.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-sm font-medium text-foreground">{ADMIN_REQUEST.from}</span>
              <span className="text-xs text-muted-foreground">{ADMIN_REQUEST.role} · {ADMIN_REQUEST.date}</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{ADMIN_REQUEST.message}</p>
          </div>
        </div>

        {!sent ? (
          <div className="ml-11 space-y-2">
            <textarea
              value={response}
              onChange={e => setResponse(e.target.value)}
              placeholder="Type your reply…"
              rows={3}
              className="w-full px-3 py-2 text-sm bg-white border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none placeholder:text-muted-foreground"
            />
            <div className="flex justify-end">
              <Button size="sm" onClick={handleSend} disabled={!response.trim()}>
                <Send className="w-3.5 h-3.5 mr-1.5" /> Send reply
              </Button>
            </div>
          </div>
        ) : (
          <div className="ml-11 flex items-center gap-2 text-sm text-primary">
            <Check className="w-4 h-4" /> Reply sent — the team will follow up shortly.
          </div>
        )}
      </div>
    </div>
  );
}

function ApprovedBanner() {
  return (
    <div className="mb-8">
      <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg text-center">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-primary" />
        </div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-2">You're approved!</h2>
        <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
          Your profile is now live on the Brivon marketplace. Patients can find and book you — let's get your portal set up.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/advocate-portal">
            <Button>
              Go to your advocate portal <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link href="/advocate/1">
            <Button variant="outline">
              Preview your profile
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-4 p-4 border border-border rounded-lg">
        <p className="text-sm font-medium text-foreground mb-3">Next steps to complete your profile</p>
        <div className="space-y-2.5">
          {[
            'Set your availability so patients can book sessions',
            'Add a case study or outcome example',
            'Connect your calendar for automatic scheduling',
            'Review and respond to your first patient inquiry',
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <div className="w-5 h-5 rounded-full border-2 border-border flex items-center justify-center flex-shrink-0 text-xs text-muted-foreground">{i + 1}</div>
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function RejectedBanner() {
  const [, navigate] = useLocation();
  return (
    <div className="mb-8">
      <div className="p-5 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-3 mb-4">
          <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground mb-1">Application not approved</h2>
            <p className="text-sm text-muted-foreground">Reviewed by Maya Torres, Brivon Verification · Today at 5:02 PM</p>
          </div>
        </div>
        <div className="ml-8 space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Reason</p>
            <p className="text-sm text-muted-foreground">Your BCPA certificate (cert #BCPA-3847) could not be verified in the PACB registry. The number may be entered incorrectly, or the certificate may have expired.</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-2">What to fix before resubmitting</p>
            <div className="space-y-1.5">
              {[
                'Confirm your BCPA certificate number — check the physical certificate carefully',
                'If your BCPA has expired, renew with PACB before reapplying',
                'Re-upload a clear, unobstructed scan of the certificate',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-4 h-4 rounded-full border border-muted-foreground/40 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px]">{i + 1}</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => navigate('/onboard')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg hover:bg-foreground/90 transition-colors"
          >
            <Edit className="w-3.5 h-3.5" /> Revise and resubmit
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingStatus() {
  const [appStatus, setAppStatus] = useState<AppStatus>('under_review');
  const flags = AUDIT_ITEMS.filter(item => item.flag);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-display font-semibold text-foreground">Brivon</Link>
          <span className="text-sm text-muted-foreground">Application status</span>
        </div>
      </header>

      {/* Demo state switcher */}
      <div className="bg-muted/40 border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-2 flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Demo state:</span>
          {(['under_review', 'needs_info', 'approved', 'rejected'] as AppStatus[]).map(s => (
            <button
              key={s}
              onClick={() => setAppStatus(s)}
              className={cn(
                "text-xs px-2.5 py-1 rounded-full border transition-colors",
                appStatus === s ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {s === 'under_review' ? 'Under review' : s === 'needs_info' ? 'Info requested' : s === 'approved' ? 'Approved' : 'Rejected'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {appStatus === 'under_review' && (
          <>
            <UnderReviewBanner />
            <div className="flex justify-end mb-6 -mt-6">
              <Link href="/onboard" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors underline">
                <Edit className="w-3 h-3" /> Edit application
              </Link>
            </div>
          </>
        )}
        {appStatus === 'needs_info' && (
          <>
            <NeedsInfoBanner onResponseSent={() => setAppStatus('under_review')} />
            <div className="flex justify-end mb-2">
              <Link href="/onboard" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors underline">
                <Edit className="w-3 h-3" /> Edit application
              </Link>
            </div>
          </>
        )}
        {appStatus === 'approved' && <ApprovedBanner />}
        {appStatus === 'rejected' && <RejectedBanner />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI audit results */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">AI audit results</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Overall confidence</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  {APPLICANT.overallScore}/100
                </span>
              </div>
            </div>

            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm">
              <span className="font-medium text-foreground">AI note: </span>
              <span className="text-muted-foreground">{APPLICANT.recommendation}</span>
            </div>

            {flags.length > 0 && appStatus !== 'approved' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-700">{flags.length} item to confirm</span>
                </div>
                {flags.map(item => (
                  <p key={item.id} className="text-xs text-amber-700">{item.flag}</p>
                ))}
              </div>
            )}

            {AUDIT_ITEMS.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                    </div>
                    {item.flag && appStatus !== 'approved' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />}
                    {appStatus === 'approved' && <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />}
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
                    {item.certNumber && (
                      <div><p className="text-muted-foreground mb-0.5">Cert / license #</p><p className="font-medium">{item.certNumber}</p></div>
                    )}
                    <div><p className="text-muted-foreground mb-0.5">Issuer</p><p className="font-medium">{item.issuer}</p></div>
                    <div><p className="text-muted-foreground mb-0.5">Expiry</p><p className="font-medium">{item.expiry}</p></div>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    {item.checks.map((c, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {(c.status === 'pass' || appStatus === 'approved')
                          ? <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          : <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
                        <span className={cn("text-xs", (c.status === 'pass' || appStatus === 'approved') ? "text-foreground" : "text-muted-foreground")}>
                          {c.label}
                        </span>
                        {c.status === 'pending' && appStatus !== 'approved' && (
                          <span className="ml-auto text-xs text-muted-foreground">in progress</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <ConfidenceBar score={appStatus === 'approved' ? 100 : item.confidence} />
                  {item.flag && appStatus !== 'approved' && (
                    <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
                      <span className="font-medium">Flag: </span>{item.flag}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">What happens next</h3>
              <div className="space-y-4">
                {TIMELINE.map((item, idx) => {
                  const isDone = item.done || appStatus === 'approved';
                  const isActive = item.active && appStatus !== 'approved';
                  return (
                    <div key={item.step} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold",
                          isDone && "bg-primary text-primary-foreground",
                          isActive && "border-2 border-primary text-primary",
                          !isDone && !isActive && "border-2 border-border text-muted-foreground"
                        )}>
                          {isDone ? <Check className="w-3.5 h-3.5" /> : item.step}
                        </div>
                        {idx < TIMELINE.length - 1 && (
                          <div className={cn("w-px mt-1", isDone ? "bg-primary" : "bg-border")} style={{ minHeight: 16 }} />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className={cn("text-xs font-medium", isActive ? "text-primary" : isDone ? "text-foreground" : "text-muted-foreground")}>
                          {item.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">Questions?</h3>
              <p className="text-xs text-muted-foreground mb-3">Our advocate success team responds within a few hours on business days.</p>
              <a href="mailto:advocates@brivon.com" className="flex items-center gap-2 text-xs text-primary hover:underline">
                <Mail className="w-3.5 h-3.5" /> advocates@brivon.com
              </a>
            </div>

            <Link href="/admin/review" className="flex items-center justify-between px-3 py-2.5 border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors group">
              <span>Brivon staff? Review queue</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
