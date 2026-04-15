import { useState } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft, CheckCircle, Clock, FileText, Upload, MessageCircle,
  Video, Calendar, Shield, Lock, ChevronDown, Plus, Download,
  AlertCircle, Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Mock case data ─────────────────────────────────────────────────────────
const CASE = {
  id: 'BRV-2026-0847',
  status: 'Active',
  title: 'Cancer Treatment Navigation',
  advocate: {
    id: 1,
    name: 'Dr. Sarah Mitchell',
    specialty: 'Cancer Care · BCPA Certified',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    responseTime: '< 2 hrs',
  },
  patient: { name: 'Jennifer M.', initials: 'JM' },
  startedAt: 'January 8, 2026',
  nextSession: {
    date: 'Thursday, April 10',
    time: '2:00 PM EST',
    type: 'Video call',
    joinUrl: '#',
  },
  sessionsCompleted: 6,
  docsShared: 12,
  lastContact: '2 days ago',
};

const TIMELINE = [
  {
    id: 1,
    date: 'Apr 3, 2026',
    title: 'Insurance appeal submitted',
    description: 'Appeal for PET scan denial drafted and submitted using NCI-criteria language. Expected response: 10–14 business days.',
    type: 'action' as const,
    status: 'pending',
    statusLabel: 'Pending · Est. Apr 17',
    author: 'Sarah',
  },
  {
    id: 2,
    date: 'Mar 28, 2026',
    title: 'Session 6 — Strategy review',
    description: 'Reviewed second opinion from Dana-Farber. Identified clinical trial eligibility. Sarah will contact trial coordinator this week.',
    type: 'session' as const,
    status: 'completed',
    author: 'Sarah + Jennifer',
  },
  {
    id: 3,
    date: 'Mar 20, 2026',
    title: 'Document uploaded',
    description: 'PathologyReport_March2026.pdf · Uploaded by you',
    type: 'document' as const,
    status: 'completed',
    author: 'Jennifer',
  },
  {
    id: 4,
    date: 'Mar 12, 2026',
    title: 'Second opinion secured',
    description: 'Dana-Farber appointment confirmed for March 28. Sarah coordinated direct transfer of all medical records.',
    type: 'win' as const,
    status: 'resolved',
    statusLabel: 'Resolved',
    author: 'Sarah',
  },
  {
    id: 5,
    date: 'Feb 18, 2026',
    title: 'Session 4 — Insurance appeal prep',
    description: 'Reviewed denial letter together. Drafted appeal strategy using peer-reviewed literature to establish medical necessity.',
    type: 'session' as const,
    status: 'completed',
    author: 'Sarah + Jennifer',
  },
  {
    id: 6,
    date: 'Jan 24, 2026',
    title: 'Session 2 — Action plan created',
    description: 'Identified three priority actions: second opinion referral, prior auth appeal, and billing error review.',
    type: 'session' as const,
    status: 'completed',
    author: 'Sarah + Jennifer',
  },
  {
    id: 7,
    date: 'Jan 8, 2026',
    title: 'Case opened',
    description: 'Introductory session completed. Reviewed pathology report and insurance documents. Navigation plan established.',
    type: 'start' as const,
    status: 'completed',
    author: 'Sarah',
  },
];

const DOCUMENTS = [
  { id: 1, name: 'InsuranceAppeal_PETScan.pdf', size: '248 KB', uploadedBy: 'Sarah', date: 'Apr 3', type: 'appeal' },
  { id: 2, name: 'PathologyReport_March2026.pdf', size: '1.2 MB', uploadedBy: 'You', date: 'Mar 20', type: 'medical' },
  { id: 3, name: 'DanaFarber_SecondOpinion.pdf', size: '892 KB', uploadedBy: 'Sarah', date: 'Mar 28', type: 'medical' },
  { id: 4, name: 'DenialLetter_Feb2026.pdf', size: '156 KB', uploadedBy: 'You', date: 'Feb 14', type: 'denial' },
  { id: 5, name: 'ActionPlan_Jan2026.pdf', size: '88 KB', uploadedBy: 'Sarah', date: 'Jan 24', type: 'plan' },
  { id: 6, name: 'InsuranceSummary_EOB.pdf', size: '342 KB', uploadedBy: 'You', date: 'Jan 10', type: 'billing' },
];

const NOTES = [
  { id: 1, author: 'Sarah', initials: 'SM', date: 'Apr 3', text: 'Appeal submitted. Key argument: NCI guidelines classify this scan as standard of care for Stage III diagnoses. If denied again, we escalate to external review. I\'ll follow up in 10 days.' },
  { id: 2, author: 'You', initials: 'JM', date: 'Mar 29', text: 'The Dana-Farber appointment went really well. Dr. Kapoor mentioned a FOLFOXIRI trial that might be a fit. Can you help me get the eligibility criteria from them?' },
  { id: 3, author: 'Sarah', initials: 'SM', date: 'Mar 29', text: 'I\'ll reach out to Dana-Farber\'s research coordinator today. In the meantime, review the trial summary I uploaded. The key eligibility cutoff is ECOG performance status ≤ 2.' },
];

type Tab = 'timeline' | 'documents' | 'notes';
type TimelineType = 'action' | 'session' | 'document' | 'win' | 'start';

const typeIcon: Record<TimelineType, string> = {
  action: '📋',
  session: '🎥',
  document: '📄',
  win: '✓',
  start: '🚀',
};

const typeColor: Record<TimelineType, string> = {
  action: 'bg-muted border-border',
  session: 'bg-primary border-primary',
  document: 'bg-muted border-border',
  win: 'bg-accent/20 border-accent',
  start: 'bg-muted border-border',
};

export default function CaseDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('timeline');
  const [noteInput, setNoteInput] = useState('');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">My cases</span>
            </button>
          </Link>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Lock className="w-3.5 h-3.5" />
            <span>HIPAA compliant</span>
            <span className="text-border">|</span>
            <Shield className="w-3.5 h-3.5" />
            <span>End-to-end encrypted</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 pb-16">

        {/* Case header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                {CASE.status}
              </span>
              <span className="text-xs text-muted-foreground">Case #{CASE.id}</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl text-foreground">{CASE.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">Started {CASE.startedAt}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Download className="w-4 h-4" />
              Export case file
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Advocate card */}
            <div className="bg-background border border-border rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-foreground">Your advocate</h2>
              <div className="flex items-center gap-3">
                <img
                  src={CASE.advocate.image}
                  alt={CASE.advocate.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <p className="font-semibold text-foreground text-sm">{CASE.advocate.name}</p>
                  <p className="text-xs text-muted-foreground">{CASE.advocate.specialty}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-book flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <MessageCircle className="w-4 h-4" />
                  Message
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 border border-border text-foreground text-sm font-medium py-2.5 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Calendar className="w-4 h-4" />
                  Schedule
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                Responds {CASE.advocate.responseTime}
              </div>
            </div>

            {/* Next session card */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 space-y-3">
              <h2 className="text-sm font-semibold text-primary">Upcoming session</h2>
              <div>
                <p className="font-semibold text-foreground">{CASE.nextSession.date}</p>
                <p className="text-sm text-muted-foreground">{CASE.nextSession.time} · {CASE.nextSession.type}</p>
              </div>
              <a
                href={CASE.nextSession.joinUrl}
                className="btn-book flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground text-sm font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Video className="w-4 h-4" />
                Join video call
              </a>
              <button className="w-full text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                Reschedule
              </button>
            </div>

            {/* Case stats */}
            <div className="bg-background border border-border rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-3">Case summary</h2>
              <div className="space-y-2.5 text-sm">
                {[
                  ['Sessions completed', `${CASE.sessionsCompleted}`],
                  ['Documents shared', `${CASE.docsShared}`],
                  ['Last contact', CASE.lastContact],
                  ['Started', CASE.startedAt],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rate session prompt */}
            <div className="bg-muted border border-border rounded-xl p-4">
              <p className="text-xs font-semibold text-foreground mb-1">How was Session 6?</p>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <button key={i} aria-label={`Rate ${i} stars`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                    <Star className="w-5 h-5 text-muted-foreground hover:fill-primary hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Ratings help Brivon verify outcomes and improve matching.</p>
            </div>
          </div>

          {/* ── Main content ───────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-0">

            {/* Tabs */}
            <div className="flex border-b border-border mb-6" role="tablist">
              {([
                ['timeline', 'Timeline'],
                ['documents', `Documents (${CASE.docsShared})`],
                ['notes', 'Notes'],
              ] as const).map(([tab, label]) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    activeTab === tab
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ── Timeline tab ─────────────────────────────────── */}
            {activeTab === 'timeline' && (
              <div className="space-y-0" role="tabpanel">
                {TIMELINE.map((event, idx) => {
                  const isLast = idx === TIMELINE.length - 1;
                  return (
                    <div key={event.id} className="flex gap-4">
                      {/* Left: dot + line */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className={cn(
                          "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 z-10",
                          typeColor[event.type],
                          event.type === 'session' ? "text-primary-foreground" : "text-foreground"
                        )}>
                          {event.type === 'win'
                            ? <CheckCircle className="w-4 h-4 text-accent" />
                            : typeIcon[event.type]
                          }
                        </div>
                        {!isLast && <div className="w-px flex-1 bg-border my-1" />}
                      </div>

                      {/* Right: content */}
                      <div className={cn("pb-6 flex-1 min-w-0", isLast && "pb-0")}>
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <p className="font-semibold text-sm text-foreground leading-snug">{event.title}</p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">{event.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-2">{event.description}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          {event.status === 'pending' && event.statusLabel && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted border border-border rounded-full text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {event.statusLabel}
                            </span>
                          )}
                          {event.status === 'resolved' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-full text-xs text-accent font-medium">
                              <CheckCircle className="w-3 h-3" />
                              {event.statusLabel}
                            </span>
                          )}
                          {event.type === 'action' && event.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-full text-xs text-amber-800">
                              <AlertCircle className="w-3 h-3" />
                              Action in progress
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Documents tab ────────────────────────────────── */}
            {activeTab === 'documents' && (
              <div role="tabpanel" className="space-y-4">
                {/* Upload zone */}
                <button className="w-full border-2 border-dashed border-border rounded-xl py-6 flex flex-col items-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group">
                  <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Upload a document</p>
                    <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 25 MB · Shared only with your advocate</p>
                  </div>
                </button>

                {/* Document list */}
                <div className="bg-background border border-border rounded-2xl overflow-hidden divide-y divide-border">
                  {DOCUMENTS.map(doc => (
                    <div key={doc.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/50 transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.size} · Uploaded by {doc.uploadedBy} · {doc.date}
                        </p>
                      </div>
                      <button
                        aria-label={`Download ${doc.name}`}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  All documents are end-to-end encrypted and accessible only to you and your advocate.
                </p>
              </div>
            )}

            {/* ── Notes tab ────────────────────────────────────── */}
            {activeTab === 'notes' && (
              <div role="tabpanel" className="space-y-5">
                {/* New note input */}
                <div className="bg-background border border-border rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                      {CASE.patient.initials}
                    </div>
                    <textarea
                      value={noteInput}
                      onChange={e => setNoteInput(e.target.value)}
                      placeholder="Add a note for Sarah, or something you want to remember..."
                      rows={3}
                      className="flex-1 px-3 py-2 border border-border rounded-xl bg-background text-sm text-foreground placeholder:text-muted-foreground resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  {noteInput.trim() && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => setNoteInput('')}
                        className="btn-book px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        Send note
                      </button>
                    </div>
                  )}
                </div>

                {/* Notes thread */}
                <div className="space-y-4">
                  {NOTES.map(note => (
                    <div key={note.id} className="flex gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                        note.author === 'You'
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground border border-border"
                      )}>
                        {note.initials}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-foreground">{note.author}</span>
                          <span className="text-xs text-muted-foreground">{note.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{note.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
