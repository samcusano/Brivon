import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft, CheckCircle, Star, Clock, Shield, RefreshCw, Lock,
  ChevronRight, AlertCircle, Zap,
  Scale, Receipt, Activity, Microscope, Pill, Stethoscope, Brain, HeartHandshake,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Condition categories ────────────────────────────────────────────────────
const CONDITIONS: { id: string; title: string; description: string; icon: LucideIcon; specialties: string[] }[] = [
  {
    id: 'insurance-denial',
    title: 'Insurance denial or appeal',
    description: 'A claim was denied, or you\'re fighting a coverage decision.',
    icon: Scale,
    specialties: ['Insurance & Billing', 'Patient Rights'],
  },
  {
    id: 'billing-dispute',
    title: 'Hospital or medical bill',
    description: 'A bill looks wrong, inflated, or you simply can\'t afford it.',
    icon: Receipt,
    specialties: ['Insurance & Billing', 'Hospital Navigation'],
  },
  {
    id: 'new-diagnosis',
    title: 'New or complex diagnosis',
    description: 'You\'ve just been diagnosed and need help understanding your options.',
    icon: Activity,
    specialties: ['Cancer Care', 'Patient Rights', 'Chronic Illness'],
  },
  {
    id: 'rare-disease',
    title: 'Rare or undiagnosed condition',
    description: 'Doctors aren\'t sure what\'s wrong, or you\'ve been misdiagnosed.',
    icon: Microscope,
    specialties: ['Rare Diseases', 'Patient Rights'],
  },
  {
    id: 'prior-auth',
    title: 'Medication or treatment access',
    description: 'You need a prior authorization approved or can\'t afford your medication.',
    icon: Pill,
    specialties: ['Insurance & Billing', 'Patient Rights', 'Chronic Illness'],
  },
  {
    id: 'second-opinion',
    title: 'Second opinion or specialist',
    description: 'You want another perspective, or need help finding the right doctor.',
    icon: Stethoscope,
    specialties: ['Cancer Care', 'Hospital Navigation', 'Patient Rights'],
  },
  {
    id: 'mental-health',
    title: 'Mental health access',
    description: 'Getting therapy, medication, or mental health coverage approved.',
    icon: Brain,
    specialties: ['Mental Health'],
  },
  {
    id: 'elder-care',
    title: 'Medicare or elder care',
    description: 'Making sense of Medicare, nursing home decisions, or caring for aging parents.',
    icon: HeartHandshake,
    specialties: ['Elder Care'],
  },
];

const URGENCY_OPTIONS = [
  { value: 'emergency', label: 'Urgent — I need help within 24–48 hours' },
  { value: 'soon', label: 'Soon — within the next week or two' },
  { value: 'planning', label: 'Planning ahead — no immediate deadline' },
];

// Advocate data for matched results (subset of marketplace data)
const ADVOCATES = [
  {
    id: 1,
    name: 'Dr. Sarah Mitchell',
    price: 150,
    image: '/assets/avatar1.png',
    rating: 5.0,
    reviews: 248,
    specialty: 'Cancer Care',
    responseTime: '< 2 hrs',
    nextAvailable: 'Tomorrow',
    avgSaved: '$14,200',
    specialties: ['Cancer Care', 'Patient Rights'],
  },
  {
    id: 2,
    name: 'Maria Rodriguez',
    price: 95,
    image: '/assets/avatar2.png',
    rating: 4.9,
    reviews: 187,
    specialty: 'Insurance & Billing',
    responseTime: '< 4 hrs',
    nextAvailable: 'Today',
    avgSaved: '$8,600',
    specialties: ['Insurance & Billing', 'Patient Rights'],
  },
  {
    id: 3,
    name: 'James Chen',
    price: 200,
    image: '/assets/avatar3.png',
    rating: 5.0,
    reviews: 156,
    specialty: 'Patient Rights',
    responseTime: '< 3 hrs',
    nextAvailable: 'Tomorrow',
    avgSaved: '$22,500',
    specialties: ['Patient Rights', 'Insurance & Billing', 'Rare Diseases'],
  },
  {
    id: 5,
    name: 'Robert Thompson',
    price: 125,
    image: '/assets/avatar5.png',
    rating: 5.0,
    reviews: 198,
    specialty: 'Hospital Navigation',
    responseTime: '< 1 hr',
    nextAvailable: 'Today',
    avgSaved: '$11,300',
    specialties: ['Hospital Navigation', 'Insurance & Billing'],
  },
  {
    id: 6,
    name: 'Lisa Park',
    price: 110,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    rating: 4.9,
    reviews: 167,
    specialty: 'Mental Health',
    responseTime: '< 3 hrs',
    nextAvailable: 'Tomorrow',
    avgSaved: '$4,200',
    specialties: ['Mental Health'],
  },
  {
    id: 8,
    name: 'Angela Foster',
    price: 140,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    rating: 5.0,
    reviews: 212,
    specialty: 'Elder Care',
    responseTime: '< 2 hrs',
    nextAvailable: 'Today',
    avgSaved: '$9,700',
    specialties: ['Elder Care'],
  },
  {
    id: 12,
    name: 'Jennifer Moore',
    price: 160,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    rating: 4.9,
    reviews: 189,
    specialty: 'Rare Diseases',
    responseTime: '< 4 hrs',
    nextAvailable: 'Tomorrow',
    avgSaved: '$12,600',
    specialties: ['Rare Diseases', 'Patient Rights'],
  },
  {
    id: 7,
    name: 'Michael Davis',
    price: 85,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    rating: 4.7,
    reviews: 143,
    specialty: 'Chronic Illness',
    responseTime: '< 4 hrs',
    nextAvailable: 'In 2 days',
    avgSaved: '$3,900',
    specialties: ['Chronic Illness', 'Patient Rights'],
  },
];

export default function MatchIntake() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [urgency, setUrgency] = useState<string>('');
  const [step1Notes, setStep1Notes] = useState<string>('');
  const [step2Notes, setStep2Notes] = useState<string>('');
  const [confirmReset, setConfirmReset] = useState(false);

  const toggleCondition = (id: string) => {
    setSelectedConditions(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  // Derive matched specialties from selected conditions
  const matchedSpecialties = useMemo(() => {
    const specialtySet = new Set<string>();
    selectedConditions.forEach(condId => {
      const cond = CONDITIONS.find(c => c.id === condId);
      cond?.specialties.forEach(s => specialtySet.add(s));
    });
    return specialtySet;
  }, [selectedConditions]);

  // Score and rank advocates by how many matched specialties they cover
  const matchedAdvocates = useMemo(() => {
    if (matchedSpecialties.size === 0) return ADVOCATES.slice(0, 4);
    return ADVOCATES
      .map(a => ({
        ...a,
        score: a.specialties.filter(s => matchedSpecialties.has(s)).length,
      }))
      .filter(a => a.score > 0)
      .sort((a, b) => b.score - a.score || b.rating - a.rating)
      .slice(0, 6);
  }, [matchedSpecialties]);

  const canProceedStep1 = selectedConditions.length > 0;
  const canProceedStep2 = urgency !== '';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to advocates</span>
            </button>
          </Link>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Lock className="w-3.5 h-3.5" />
            <span>Private &amp; HIPAA compliant</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 pb-20">

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>
              {step === 1 && 'Step 1 of 3 — Your situation'}
              {step === 2 && 'Step 2 of 3 — A bit more detail'}
              {step === 3 && 'Step 3 of 3 — Your matches'}
            </span>
            <span>~{step === 1 ? '60' : step === 2 ? '30' : '0'} seconds left</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
          <div className="flex mt-2 gap-0">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex-1 flex items-center gap-1">
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors",
                  s < step ? "bg-primary border-primary text-primary-foreground"
                  : s === step ? "border-primary text-primary bg-background"
                  : "border-border text-muted-foreground bg-background"
                )}>
                  {s < step ? <CheckCircle className="w-3 h-3" /> : s}
                </div>
                {s < 3 && <div className={cn("flex-1 h-px", s < step ? "bg-primary" : "bg-border")} />}
              </div>
            ))}
          </div>
        </div>

        {/* ── STEP 1: What's your situation? ────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-3xl text-foreground mb-2">What brings you here today?</h1>
              <p className="text-base text-muted-foreground">
                Choose everything that applies. We'll match you with advocates who've handled cases like yours.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CONDITIONS.map(cond => {
                const selected = selectedConditions.includes(cond.id);
                return (
                  <button
                    key={cond.id}
                    onClick={() => toggleCondition(cond.id)}
                    aria-pressed={selected}
                    className={cn(
                      "text-left p-4 rounded-xl border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:border-primary/40"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <cond.icon className={cn("w-4 h-4 flex-shrink-0", selected ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
                          <span className="font-semibold text-sm text-foreground">{cond.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{cond.description}</p>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors mt-0.5",
                        selected ? "bg-primary border-primary" : "border-border"
                      )}>
                        {selected && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* "Something else" */}
            <div>
              <label htmlFor="other-situation" className="block text-sm font-medium text-foreground mb-1.5">
                Something else? Describe it briefly.
              </label>
              <textarea
                id="other-situation"
                value={step1Notes}
                onChange={e => setStep1Notes(e.target.value)}
                placeholder="E.g. 'My husband has a rare autoimmune condition and we can't get anyone to coordinate his care...'"
                rows={3}
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-sm text-foreground placeholder:text-muted-foreground resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {!canProceedStep1 && (
              <p className="text-sm text-muted-foreground" role="status">
                Select at least one situation above to continue.
              </p>
            )}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className={cn(
                  "btn-book w-full sm:w-auto px-8 py-3 rounded-full font-semibold text-base transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex items-center justify-center gap-2",
                  canProceedStep1
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                Find my advocates <ChevronRight className="w-4 h-4" />
              </button>
              <Link href="/">
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                  Skip — browse all advocates
                </button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground">
              Your answers are private. We use them only to match you with the right advocate—never for advertising.
            </p>
          </div>
        )}

        {/* ── STEP 2: Tell us more ───────────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-3xl text-foreground mb-2">Tell us a bit more</h1>
              <p className="text-base text-muted-foreground">
                This helps us surface advocates who are available and experienced with your specific timeline.
              </p>
            </div>

            {/* Selected conditions summary */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="text-xs font-semibold text-primary mb-2">You're dealing with:</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedConditions.map(id => {
                  const cond = CONDITIONS.find(c => c.id === id);
                  return cond ? (
                    <span key={id} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background border border-primary/20 rounded-full text-xs font-medium text-foreground">
                      <cond.icon className="w-3 h-3 text-primary" aria-hidden="true" /> {cond.title}
                    </span>
                  ) : null;
                })}
                {step1Notes && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-background border border-primary/20 rounded-full text-xs font-medium text-foreground">
                    + your note
                  </span>
                )}
              </div>
            </div>

            {/* Urgency */}
            <fieldset>
              <legend className="text-sm font-semibold text-foreground mb-3">How urgent is this?</legend>
              <div className="space-y-2">
                {URGENCY_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                      urgency === opt.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={opt.value}
                      checked={urgency === opt.value}
                      onChange={() => setUrgency(opt.value)}
                      className="sr-only"
                    />
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors",
                      urgency === opt.value ? "border-primary" : "border-border"
                    )}>
                      {urgency === opt.value && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <span className={cn(
                      "text-sm",
                      urgency === opt.value ? "font-medium text-foreground" : "text-muted-foreground"
                    )}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Additional context */}
            <div>
              <label htmlFor="more-context" className="block text-sm font-medium text-foreground mb-1.5">
                Anything else we should know? <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <textarea
                id="more-context"
                value={step2Notes}
                onChange={e => setStep2Notes(e.target.value)}
                placeholder="E.g. state you're in, whether you need Spanish-speaking, in-person vs. remote..."
                rows={3}
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-sm text-foreground placeholder:text-muted-foreground resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {urgency === 'emergency' && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800 mb-0.5">For urgent situations</p>
                  <p className="text-sm text-amber-700">
                    We'll prioritize advocates with same-day availability. Some also offer emergency consults—look for the <strong>Available now</strong> badge on results.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-3 border border-border rounded-full text-sm font-medium text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceedStep2}
                className={cn(
                  "btn-book flex-1 sm:flex-none px-8 py-3 rounded-full font-semibold text-base transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex items-center justify-center gap-2",
                  canProceedStep2
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                See my matches <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Matched advocates ──────────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-3xl text-foreground mb-2">
                {matchedAdvocates.length > 0
                  ? `${matchedAdvocates.length} advocates matched`
                  : 'All advocates'}
              </h1>
              <p className="text-base text-muted-foreground">
                Ranked by how closely their expertise matches your situation. Every one offers a free intro call.
              </p>
            </div>

            {/* Match summary */}
            <div className="flex flex-wrap gap-1.5">
              {selectedConditions.map(id => {
                const cond = CONDITIONS.find(c => c.id === id);
                return cond ? (
                  <span key={id} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/5 border border-primary/20 rounded-full text-xs font-medium text-primary">
                    <cond.icon className="w-3 h-3" aria-hidden="true" /> {cond.title}
                  </span>
                ) : null;
              })}
            </div>
            <div className="pt-1">
              {confirmReset ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Clear all answers and start over?</span>
                  <button
                    onClick={() => { setStep(1); setSelectedConditions([]); setUrgency(''); setStep1Notes(''); setStep2Notes(''); setConfirmReset(false); }}
                    className="text-sm font-medium text-destructive hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                  >
                    Yes, start over
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmReset(true)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  Start over
                </button>
              )}
            </div>

            {/* Trust bar */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground py-3 border-y border-border">
              <span className="inline-flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> All vetted &amp; background-checked</span>
              <span className="inline-flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> 100% refund if we can't help</span>
              <span className="inline-flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> HIPAA compliant</span>
            </div>

            {/* Advocate cards */}
            <div className="space-y-4">
              {matchedAdvocates.map((advocate, idx) => (
                <Link key={advocate.id} href={`/advocate/${advocate.id}`}>
                  <div className={cn(
                    "advocate-card group block bg-background border rounded-2xl overflow-hidden cursor-pointer",
                    idx === 0 ? "border-primary/40" : "border-border"
                  )}>
                    {idx === 0 && (
                      <div className="bg-primary/5 border-b border-primary/20 px-4 py-2 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-semibold text-primary">Best match for your situation</span>
                      </div>
                    )}
                    <div className="flex gap-4 p-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={advocate.image}
                          alt={advocate.name}
                          loading="lazy"
                          decoding="async"
                          className="photo-spring w-20 h-20 rounded-full object-cover"
                        />
                        {advocate.nextAvailable === 'Today' || advocate.nextAvailable === 'Now' ? (
                          <span className="badge-available absolute -bottom-1 -right-1 bg-amber-100 text-amber-800 text-xs font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                            {advocate.nextAvailable === 'Now' && <Zap className="w-2.5 h-2.5" />}
                            {advocate.nextAvailable}
                          </span>
                        ) : null}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-foreground">{advocate.name}</span>
                            <CheckCircle className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                          </div>
                          <span className="text-lg font-bold text-foreground flex-shrink-0">${advocate.price}</span>
                        </div>

                        <p className="text-xs font-medium text-primary mb-1">{advocate.specialty}</p>

                        <div className="flex items-center gap-1.5 mb-2" aria-label={`${advocate.rating} out of 5 stars`}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("w-3 h-3", i < Math.floor(advocate.rating) ? "fill-foreground text-foreground" : "fill-muted text-muted")} aria-hidden="true" />
                          ))}
                          <span className="text-xs font-medium text-foreground ml-0.5">{advocate.rating}</span>
                          <span className="text-xs text-muted-foreground">({advocate.reviews})</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {advocate.responseTime}
                          </span>
                          <span className="text-border">·</span>
                          <span>Free intro call</span>
                          <span className="text-border">·</span>
                          <span>Avg. saved {advocate.avgSaved}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 border border-border rounded-full text-sm font-medium text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                ← Refine answers
              </button>
              <Link href="/">
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Browse all advocates instead
                </button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
