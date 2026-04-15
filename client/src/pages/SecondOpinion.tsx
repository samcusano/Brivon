import React, { useState } from 'react';
import { Link } from 'wouter';
import {
  ChevronRight, ChevronLeft, CheckCircle, UploadCloud, FileText,
  ArrowRight, Stethoscope, Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Types ──────────────────────────────────────────────────────────────────

interface FormState {
  // Step 1
  conditionName: string;
  diagnosisDate: string;
  treatmentPlan: string;
  physicianSpecialty: string;
  // Step 2
  reviewRequest: string;
  commonQuestions: string[];
  // Step 3
  // (mock upload — no actual files)
  // Step 4 — review, no extra state
}

const SPECIALTIES = [
  'Oncology', 'Cardiology', 'Neurology', 'Orthopedics', 'Rare Disease', 'Other',
];

const COMMON_QUESTIONS = [
  'Is this the right diagnosis?',
  'Are there better treatment options?',
  'Should I consider a clinical trial?',
  'Is surgery necessary?',
  'Am I getting the right dosage?',
];

const MOCK_UPLOADED_FILES = [
  { name: 'Pathology_Report_2026-02-15.pdf', size: '1.2 MB', type: 'Pathology report' },
  { name: 'MRI_Scan_Results.pdf', size: '4.8 MB', type: 'Imaging results' },
];

const UPLOAD_CATEGORIES = [
  'Pathology reports',
  'Imaging results (MRI, CT, X-ray)',
  'Lab work',
  'Treatment summary',
];

const STEPS = ['Your diagnosis', 'Your questions', 'Upload records', 'Review & submit'];

// ── Step indicator ─────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${((current + 1) / STEPS.length) * 100}%` }}
        />
      </div>
      {/* Step labels */}
      <div className="hidden sm:flex items-center justify-between">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors',
                i < current
                  ? 'bg-primary border-primary text-primary-foreground'
                  : i === current
                    ? 'border-primary text-primary bg-background'
                    : 'border-border text-muted-foreground bg-background',
              )}
            >
              {i < current ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span
              className={cn(
                'text-xs font-medium',
                i === current ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      {/* Mobile: just show "Step X of Y" */}
      <p className="sm:hidden text-sm text-muted-foreground text-center">
        Step {current + 1} of {STEPS.length} — <span className="font-medium text-foreground">{STEPS[current]}</span>
      </p>
    </div>
  );
}

// ── Confirmed state ────────────────────────────────────────────────────────

function ConfirmationScreen({ refNum }: { refNum: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 space-y-6">
      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-accent" />
      </div>
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold text-foreground">Request submitted!</h2>
        <p className="text-muted-foreground max-w-md">
          Your second opinion request has been received. An expert specialist will review your case and reach out within the estimated timeframe.
        </p>
      </div>
      <div className="bg-muted rounded-2xl px-8 py-5 space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Case reference number</p>
        <p className="font-display text-xl font-bold text-foreground">{refNum}</p>
      </div>
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>Estimated turnaround: <strong className="text-foreground">5–7 business days</strong></span>
      </div>
      <Link href="/cases">
        <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          Track your case <ArrowRight className="w-4 h-4" />
        </button>
      </Link>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function SecondOpinion() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [caseRef] = useState(() => `BRV-${Math.floor(100000 + Math.random() * 900000)}`);

  const [form, setForm] = useState<FormState>({
    conditionName: '',
    diagnosisDate: '',
    treatmentPlan: '',
    physicianSpecialty: '',
    reviewRequest: '',
    commonQuestions: [],
  });

  function updateForm(key: keyof FormState, value: string | string[]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function toggleQuestion(q: string) {
    setForm(prev => ({
      ...prev,
      commonQuestions: prev.commonQuestions.includes(q)
        ? prev.commonQuestions.filter(x => x !== q)
        : [...prev.commonQuestions, q],
    }));
  }

  function handleNext() {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else setSubmitted(true);
  }

  function handleBack() {
    if (step > 0) setStep(s => s - 1);
  }

  const canProceed = (() => {
    if (step === 0) return form.conditionName.trim().length > 0;
    if (step === 1) return form.reviewRequest.trim().length > 0 || form.commonQuestions.length > 0;
    return true;
  })();

  // Specialist recommendation based on specialty
  const specialistRec = form.physicianSpecialty
    ? `Based on your diagnosis, we recommend an ${form.physicianSpecialty} specialist`
    : 'We will match you with the most relevant specialist';

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center">
          <Link href="/">
            <span className="font-display text-xl font-bold text-foreground cursor-pointer hover:opacity-80 transition-opacity">
              Brivon
            </span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">

        {submitted ? (
          <ConfirmationScreen refNum={caseRef} />
        ) : (
          <div className="space-y-8">

            {/* Page title */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Stethoscope className="w-4 h-4" />
                <span>Second Opinion Request</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                Get an expert second opinion
              </h1>
            </div>

            {/* Step indicator */}
            <StepIndicator current={step} />

            {/* Step content */}
            <div className="bg-background border border-border rounded-2xl p-5 sm:p-8">

              {/* ── Step 1: Your diagnosis ── */}
              {step === 0 && (
                <div className="space-y-5">
                  <h2 className="font-display text-lg font-semibold text-foreground">Your diagnosis</h2>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Condition name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Stage II Non-Hodgkin Lymphoma"
                      value={form.conditionName}
                      onChange={e => updateForm('conditionName', e.target.value)}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Diagnosis date</label>
                    <input
                      type="date"
                      value={form.diagnosisDate}
                      onChange={e => updateForm('diagnosisDate', e.target.value)}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Current treatment plan</label>
                    <textarea
                      rows={4}
                      placeholder="Describe the treatment your doctor has recommended or that you are currently undergoing..."
                      value={form.treatmentPlan}
                      onChange={e => updateForm('treatmentPlan', e.target.value)}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Treating physician specialty</label>
                    <select
                      value={form.physicianSpecialty}
                      onChange={e => updateForm('physicianSpecialty', e.target.value)}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select a specialty...</option>
                      {SPECIALTIES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* ── Step 2: Your questions ── */}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="font-display text-lg font-semibold text-foreground">Your questions</h2>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      What specifically do you want the expert to review?
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Describe your concerns, questions, or what you're hoping to get clarity on..."
                      value={form.reviewRequest}
                      onChange={e => updateForm('reviewRequest', e.target.value)}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">Common questions (select all that apply)</p>
                    {COMMON_QUESTIONS.map(q => {
                      const checked = form.commonQuestions.includes(q);
                      return (
                        <label key={q} className="flex items-center gap-3 cursor-pointer group">
                          <div
                            className={cn(
                              'w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 transition-colors',
                              checked
                                ? 'bg-primary border-primary'
                                : 'border-border group-hover:border-primary/50',
                            )}
                            onClick={() => toggleQuestion(q)}
                          >
                            {checked && <CheckCircle className="w-3.5 h-3.5 text-primary-foreground" />}
                          </div>
                          <span className="text-sm text-foreground">{q}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Step 3: Upload records ── */}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="font-display text-lg font-semibold text-foreground">Upload your records</h2>
                  <p className="text-sm text-muted-foreground">
                    Upload relevant medical records to help the expert give you the most accurate second opinion.
                    All files are encrypted and HIPAA-compliant.
                  </p>

                  {/* Upload area */}
                  <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center gap-3 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <UploadCloud className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Drop files here, or <span className="text-primary">browse</span></p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, JPEG, PNG, DICOM — up to 50 MB each</p>
                    </div>
                  </div>

                  {/* What to include */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Suggested record types</p>
                    <ul className="space-y-1.5">
                      {UPLOAD_CATEGORIES.map(cat => (
                        <li key={cat} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 flex-shrink-0" />
                          {cat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pre-uploaded files */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Uploaded files</p>
                    {MOCK_UPLOADED_FILES.map((f) => (
                      <div
                        key={f.name}
                        className="flex items-center gap-3 px-4 py-3 bg-muted rounded-xl"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{f.name}</p>
                          <p className="text-xs text-muted-foreground">{f.type} · {f.size}</p>
                        </div>
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 4: Review & submit ── */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="font-display text-lg font-semibold text-foreground">Review & submit</h2>

                  {/* Summary sections */}
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-xl space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Diagnosis</p>
                      <p className="text-sm font-semibold text-foreground">
                        {form.conditionName || <span className="text-muted-foreground italic">Not specified</span>}
                      </p>
                      {form.diagnosisDate && (
                        <p className="text-xs text-muted-foreground">Diagnosed: {form.diagnosisDate}</p>
                      )}
                      {form.physicianSpecialty && (
                        <p className="text-xs text-muted-foreground">Treated by: {form.physicianSpecialty} specialist</p>
                      )}
                    </div>

                    {form.treatmentPlan && (
                      <div className="p-4 bg-muted rounded-xl space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Current treatment plan</p>
                        <p className="text-sm text-foreground">{form.treatmentPlan}</p>
                      </div>
                    )}

                    <div className="p-4 bg-muted rounded-xl space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Questions for expert</p>
                      {form.reviewRequest && (
                        <p className="text-sm text-foreground">{form.reviewRequest}</p>
                      )}
                      {form.commonQuestions.length > 0 && (
                        <ul className="space-y-1 mt-1">
                          {form.commonQuestions.map(q => (
                            <li key={q} className="flex items-center gap-2 text-sm text-foreground">
                              <CheckCircle className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                              {q}
                            </li>
                          ))}
                        </ul>
                      )}
                      {!form.reviewRequest && form.commonQuestions.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">No questions added</p>
                      )}
                    </div>

                    <div className="p-4 bg-muted rounded-xl space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Uploaded records</p>
                      {MOCK_UPLOADED_FILES.map(f => (
                        <p key={f.name} className="text-sm text-foreground">{f.name}</p>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-3">
                    <Stethoscope className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">Specialist recommendation</p>
                      <p className="text-sm text-muted-foreground">{specialistRec}</p>
                    </div>
                  </div>

                  {/* Turnaround */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>Estimated turnaround: <strong className="text-foreground">5–7 business days</strong></span>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handleBack}
                disabled={step === 0}
                className={cn(
                  'inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  step === 0
                    ? 'text-muted-foreground cursor-not-allowed opacity-40'
                    : 'bg-muted text-foreground hover:bg-muted/80',
                )}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={cn(
                  'inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  !canProceed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90',
                )}
              >
                {step === STEPS.length - 1 ? 'Submit for review' : 'Next'}
                {step < STEPS.length - 1 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
