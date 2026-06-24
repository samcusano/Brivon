import { useState, useRef } from 'react';
import { Link, useParams } from 'wouter';
import {
  ArrowLeft, Check, CheckCircle, Download, FileText,
  MessageCircle, Phone, Shield, Upload, Video, Clock,
  AlertCircle, ArrowRight, Star, AlertTriangle, History,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCaseById, type CaseDocument, type CaseNote, type PatientCase, type SessionRecord } from '@/data/mockCases';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSaved(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : `$${n}`;
}

function totalSaved(outcomes: PatientCase['outcomes']) {
  return outcomes.reduce((sum, o) => sum + (o.savedAmount ?? 0), 0);
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function StatusBadge({ label, status }: { label: string; status: PatientCase['status'] }) {
  const isResolved = status === 'resolved';
  const isPending = !isResolved && (label.toLowerCase().includes('appeal') || label.toLowerCase().includes('pending'));
  return (
    <span className={cn(
      "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
      isResolved ? "bg-emerald-100 text-emerald-700" :
      isPending ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"
    )}>
      {isResolved
        ? <CheckCircle className="w-3 h-3" />
        : <span className={cn("w-1.5 h-1.5 rounded-full", isPending ? "bg-amber-500" : "bg-primary")} />
      }
      {label}
    </span>
  );
}

function DocRow({ doc }: { doc: CaseDocument }) {
  return (
    <div className="flex items-center gap-3 py-2.5 group hover:bg-muted/40 -mx-4 px-4 transition-colors rounded-lg">
      <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">{doc.name}</p>
        <p className="text-xs text-muted-foreground">{doc.by} · {doc.date} · {doc.size}</p>
      </div>
      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-muted rounded-md">
        <Download className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    </div>
  );
}

function NoteItem({ note, patientInitials }: { note: CaseNote; patientInitials: string }) {
  const isAdvocate = note.initials !== patientInitials;
  return (
    <div className={cn("flex gap-3 mb-3", !isAdvocate && "flex-row-reverse")}>
      <div className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0",
        isAdvocate ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
      )}>
        {note.initials}
      </div>
      <div className={cn("max-w-[80%]", !isAdvocate && "items-end")}>
        <div className={cn(
          "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isAdvocate ? "bg-muted text-foreground rounded-tl-sm" : "bg-primary text-primary-foreground rounded-tr-sm"
        )}>
          {note.text}
        </div>
        <p className={cn("text-[11px] text-muted-foreground mt-1", !isAdvocate && "text-right")}>{note.date}</p>
      </div>
    </div>
  );
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star className={cn(
            "w-6 h-6 transition-colors",
            i <= (hovered || value) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
          )} />
        </button>
      ))}
    </div>
  );
}

// ─── Kanban columns ───────────────────────────────────────────────────────────

function ResolvedColumn({ c }: { c: PatientCase }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle className="w-4 h-4 text-emerald-600" />
        <p className="text-sm font-semibold text-foreground">Resolved</p>
        <span className="text-xs text-muted-foreground bg-muted rounded-full px-2">{c.outcomes.length}</span>
      </div>
      {c.outcomes.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground">No resolved items yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {c.outcomes.map(o => (
            <div key={o.id} className="border border-emerald-200 bg-emerald-50/80 rounded-xl p-3.5">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-tight">{o.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{o.desc}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-emerald-600 font-medium">{o.date}</p>
                    {o.savedAmount && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                        {formatSaved(o.savedAmount)} saved
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InProgressColumn({ c }: { c: PatientCase }) {
  const urgencyColor = (u: string) =>
    u === 'high' ? 'border-amber-300 bg-amber-50/80' :
    u === 'medium' ? 'border-border bg-card' : 'border-border bg-card';
  const dotColor = (u: string) =>
    u === 'high' ? 'bg-amber-500' :
    u === 'medium' ? 'bg-primary' : 'bg-muted-foreground/40';

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-amber-600" />
        <p className="text-sm font-semibold text-foreground">In Progress</p>
        <span className="text-xs text-muted-foreground bg-muted rounded-full px-2">{c.inProgress.length}</span>
      </div>
      {c.inProgress.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground">Nothing in progress</p>
        </div>
      ) : (
        <div className="space-y-2">
          {c.inProgress.map(item => (
            <div key={item.id} className={cn("border rounded-xl p-3.5", urgencyColor(item.urgency))}>
              <div className="flex items-start gap-2">
                <div className={cn("w-2 h-2 rounded-full flex-shrink-0 mt-1.5", dotColor(item.urgency))} />
                <div>
                  <p className="text-sm font-medium text-foreground leading-tight">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  {item.urgency === 'high' && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-medium mt-1.5">
                      <AlertCircle className="w-3 h-3" /> Needs attention
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NextStepsColumn({ c }: { c: PatientCase }) {
  const typeIcon = (type: string) => {
    if (type === 'session') return <Video className="w-3.5 h-3.5 text-primary" />;
    if (type === 'upload') return <Upload className="w-3.5 h-3.5 text-muted-foreground" />;
    return <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm font-semibold text-foreground">Next Steps</p>
        <span className="text-xs text-muted-foreground bg-muted rounded-full px-2">{c.nextSteps.length}</span>
      </div>
      {c.nextSteps.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground">No next steps yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {c.nextSteps.map(step => (
            <div key={step.id} className="border border-border bg-card rounded-xl p-3.5">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex-shrink-0">{typeIcon(step.type)}</div>
                <div>
                  <p className="text-sm font-medium text-foreground leading-tight">{step.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                  {step.type === 'upload' && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-primary font-medium mt-1.5">
                      <Upload className="w-3 h-3" /> Upload in Documents tab
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SessionHistoryList({ sessions }: { sessions: SessionRecord[] }) {
  if (sessions.length === 0) {
    return (
      <div className="py-8 text-center">
        <History className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No sessions recorded yet</p>
      </div>
    );
  }
  return (
    <div className="space-y-0">
      {[...sessions].reverse().map((s, i) => (
        <div key={s.id} className="flex gap-3 py-3.5 border-b border-border last:border-0">
          <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
              {s.type === 'Video call'
                ? <Video className="w-3.5 h-3.5 text-muted-foreground" />
                : <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              }
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">#{sessions.length - i}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-sm font-medium text-foreground">{s.type}</p>
              <span className="text-xs text-muted-foreground">·</span>
              <p className="text-xs text-muted-foreground">{s.date}</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.summary}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Not found ────────────────────────────────────────────────────────────────

function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-semibold text-foreground mb-2">Case not found</p>
        <p className="text-sm text-muted-foreground mb-4">This case doesn't exist or you don't have access.</p>
        <Link href="/my-cases">
          <a className="text-sm text-primary font-medium hover:underline">← Back to all cases</a>
        </Link>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PatientCaseDashboard() {
  const params = useParams<{ id: string }>();
  const c = getCaseById(params.id);

  const [activeTab, setActiveTab] = useState<'notes' | 'documents' | 'sessions'>('notes');
  const [noteInput, setNoteInput] = useState('');
  const [localNotes, setLocalNotes] = useState<CaseNote[]>(() => c?.notes ?? []);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!c) return <NotFound />;

  const firstName = c.advocate.name.split(' ').pop()!;
  const patientInitials = 'JM';
  const saved = totalSaved(c.outcomes);

  const handleSend = () => {
    if (!noteInput.trim()) return;
    const newNote: CaseNote = {
      id: Date.now(),
      author: 'You',
      initials: patientInitials,
      date: 'Just now',
      text: noteInput.trim(),
    };
    setLocalNotes(prev => [...prev, newNote]);
    setNoteInput('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) setUploadedFiles(prev => [...prev, ...files.map(f => f.name)]);
    e.target.value = '';
  };

  const allDocuments: CaseDocument[] = [
    ...c.documents,
    ...uploadedFiles.map((name, i) => ({
      id: 9000 + i,
      name,
      size: '—',
      by: 'You',
      date: 'Just now',
    })),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/my-cases">
            <a className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
              All cases
            </a>
          </Link>

          <span className="text-border">·</span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground truncate">{c.title}</p>
              <StatusBadge label={c.statusLabel} status={c.status} />
            </div>
          </div>

          {c.status === 'active' && (
            <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-colors flex-shrink-0">
              <MessageCircle className="w-3.5 h-3.5" />
              Message {firstName}
            </button>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-6">

        {/* Urgent action banner */}
        {c.urgentAction && (
          <div className="flex items-start gap-3 p-4 border border-amber-300 bg-amber-50 rounded-xl mb-5">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900">Action needed</p>
              <p className="text-sm text-amber-800 mt-0.5">{c.urgentAction}</p>
            </div>
          </div>
        )}

        {/* Advocate row */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={c.advocate.image}
            alt={c.advocate.name}
            className="w-10 h-10 rounded-full object-cover outline outline-1 -outline-offset-1 outline-black/10 flex-shrink-0"
          />
          <div>
            <p className="text-sm font-semibold text-foreground">{c.advocate.name}</p>
            <p className="text-xs text-muted-foreground">
              {c.advocate.specialty} · Started {c.startedAt} · Responds {c.advocate.responseTime}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
            <span>{c.sessionsCompleted} sessions</span>
            <span>{c.docsShared} documents</span>
            {saved > 0 && (
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <DollarSign className="w-3.5 h-3.5" />
                {formatSaved(saved)} saved
              </span>
            )}
          </div>
        </div>

        {/* Case description */}
        <p className="text-sm text-muted-foreground mb-5 pl-[52px]">{c.description}</p>

        {/* Next session banner */}
        {c.nextSession && (
          <div className="flex items-center gap-3 p-4 border border-primary/20 bg-primary/5 rounded-xl mb-5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              {c.nextSession.type === 'Phone call'
                ? <Phone className="w-4 h-4 text-primary" />
                : <Video className="w-4 h-4 text-primary" />
              }
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Next session — {c.nextSession.date}</p>
              <p className="text-xs text-muted-foreground">{c.nextSession.time} · {c.nextSession.type} with {c.advocate.name}</p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-primary/30 text-primary text-xs font-medium rounded-md hover:bg-primary/5 transition-colors flex-shrink-0">
              {c.nextSession.type === 'Phone call' ? <Phone className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
              Join
            </button>
          </div>
        )}

        {/* Resolved case banner */}
        {c.status === 'resolved' && (
          <div className="flex items-center gap-3 p-4 border border-emerald-200 bg-emerald-50/80 rounded-xl mb-5">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">This case is resolved</p>
              <p className="text-xs text-muted-foreground">All goals were achieved. Documents and notes are preserved below.</p>
            </div>
          </div>
        )}

        {/* Three-column kanban */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <ResolvedColumn c={c} />
          <InProgressColumn c={c} />
          <NextStepsColumn c={c} />
        </div>

        {/* Documents + Notes + Sessions tabs */}
        <div className="border border-border rounded-2xl overflow-hidden">
          <div className="flex border-b border-border bg-muted/20">
            {(['notes', 'documents', 'sessions'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-3 text-sm font-medium transition-colors",
                  activeTab === tab
                    ? "bg-background text-foreground border-b-2 border-primary -mb-px"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab === 'notes'
                  ? `Messages with ${firstName}`
                  : tab === 'sessions'
                  ? `Sessions (${c.sessionHistory.length})`
                  : 'Documents'}
              </button>
            ))}
          </div>

          <div className="p-4">
            {/* Messages tab */}
            {activeTab === 'notes' && (
              <div>
                {localNotes.length === 0 ? (
                  <div className="py-8 text-center">
                    <MessageCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No messages yet — say hello to {firstName}.</p>
                  </div>
                ) : (
                  <div className="mb-4 space-y-0.5">
                    {localNotes.map(n => (
                      <NoteItem key={n.id} note={n} patientInitials={patientInitials} />
                    ))}
                  </div>
                )}

                {c.status === 'active' ? (
                  <div className="flex gap-2 pt-3 border-t border-border">
                    <input
                      value={noteInput}
                      onChange={e => setNoteInput(e.target.value)}
                      placeholder={`Message ${firstName}...`}
                      className="flex-1 px-4 py-2.5 text-sm bg-muted/50 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                    />
                    <button
                      onClick={handleSend}
                      className="w-9 h-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 hover:bg-primary/90 transition-colors disabled:opacity-40"
                      disabled={!noteInput.trim()}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-border text-center">
                    <p className="text-xs text-muted-foreground">This case is closed — messaging is no longer available.</p>
                  </div>
                )}
              </div>
            )}

            {/* Documents tab */}
            {activeTab === 'documents' && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                {c.status === 'active' && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-sm text-primary font-medium mb-4 hover:underline"
                  >
                    <Upload className="w-4 h-4" /> Upload a document
                  </button>
                )}
                {allDocuments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No documents yet</p>
                ) : (
                  allDocuments.map(doc => <DocRow key={doc.id} doc={doc} />)
                )}
              </div>
            )}

            {/* Sessions tab */}
            {activeTab === 'sessions' && (
              <SessionHistoryList sessions={c.sessionHistory} />
            )}
          </div>
        </div>

        {/* Post-resolution review */}
        {c.status === 'resolved' && (
          <div className="mt-5 border border-border rounded-2xl p-5">
            {reviewSubmitted ? (
              <div className="flex items-center gap-2 text-sm text-emerald-700">
                <CheckCircle className="w-4 h-4" />
                Thanks for your review — it helps other patients find the right advocate.
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold text-foreground mb-1">How did {firstName} do?</p>
                <p className="text-xs text-muted-foreground mb-3">Your review helps other patients find the right advocate.</p>
                <StarRating value={userRating} onChange={setUserRating} />
                {userRating > 0 && (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={reviewText}
                      onChange={e => setReviewText(e.target.value)}
                      placeholder={`Share your experience with ${firstName}...`}
                      rows={3}
                      className="w-full px-3.5 py-2.5 text-sm bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                    />
                    <button
                      onClick={() => setReviewSubmitted(true)}
                      className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Submit review
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Trust footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-3.5 h-3.5" />
          Case #{c.id} · Protected by Brivon's advocate guarantee
        </div>
      </div>
    </div>
  );
}
