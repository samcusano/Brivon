import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Check, CheckCircle, Award, GraduationCap, Shield, Heart,
  Activity, Sparkles, Upload, Plus, X, AlertTriangle,
  Loader2, ExternalLink, BookOpen, Clock, ChevronRight, Edit3,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// ─── Constants ────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 'basics', label: 'About you' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'practice', label: 'Practice & services' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'review', label: 'Review & submit' },
];

const QUICK_CERTS = [
  { value: 'Board Certified Patient Advocate (BCPA)', short: 'BCPA', hint: 'BCPA-####', icon: Award },
  { value: 'Registered Nurse (RN)', short: 'RN', hint: 'e.g. RN-0091834', icon: GraduationCap },
  { value: 'Social Worker (LCSW)', short: 'LCSW', hint: 'LCSW-#####', icon: Heart },
  { value: 'Nurse Practitioner (NP)', short: 'NP', hint: 'NP-######', icon: Activity },
  { value: '_other', short: 'Other', hint: '', icon: Award },
];

const SPECIALTIES = [
  'Oncology', 'Rare Disease', 'Insurance Appeals', 'Mental Health',
  'Pediatrics', 'Cardiology', 'Chronic Illness', 'End-of-Life Care',
  'Surgical Navigation', 'Medication Management',
];

const LANGUAGES = ['English', 'Spanish', 'Mandarin', 'French', 'Portuguese', 'Arabic', 'Tagalog'];
const SESSION_TYPES = ['Video call', 'Phone call', 'In-person', 'Appointment accompaniment', 'Async messaging'];

const SESSION_TYPE_BENCHMARKS: Record<string, string> = {
  'Video call': 'Typically $120–$160/hr',
  'Phone call': 'Typically $110–$150/hr',
  'In-person': 'Typically $140–$200/hr',
  'Appointment accompaniment': 'Typically $150–$225/hr',
  'Async messaging': 'Typically $500–$1,500/mo flat',
};

const MOCK_EXTRACTED: Record<string, { certNumber: string; issuer: string; expiry: string }> = {
  'Board Certified Patient Advocate (BCPA)': { certNumber: 'BCPA-3847', issuer: 'Patient Advocate Certification Board', expiry: 'June 2027' },
  'Registered Nurse (RN)': { certNumber: 'RN-0091834', issuer: 'State Board of Registered Nursing', expiry: 'October 2026' },
  'Social Worker (LCSW)': { certNumber: 'LCSW-44821', issuer: 'Board of Behavioral Sciences', expiry: 'July 2027' },
  'Nurse Practitioner (NP)': { certNumber: 'NP-0038821', issuer: 'American Association of Nurse Practitioners', expiry: 'May 2027' },
};

// ─── Types ────────────────────────────────────────────────────────────────────

type UploadState = 'idle' | 'uploading' | 'reading' | 'done' | 'later';
type EoMode = 'have' | 'getting' | null;
type BioMode = 'guided' | 'direct';
type AiMsg = { text: string; type: 'info' | 'success' | 'warning' };
type Pkg = {
  id: string;
  name: string;
  description: string;
  price: string;
  billingType: 'flat' | 'monthly';
  deliveryDays: string;
  includes: [string, string, string];
};

type CredEntry = {
  id: string;
  type: string;
  customType: string;
  certNumber: string;
  expiry: string;
  uploadState: UploadState;
  extracted?: { certNumber: string; issuer: string; expiry: string };
};

type Form = {
  email: string;
  firstName: string; lastName: string; headline: string; location: string; languages: string[];
  photoUploaded: boolean;
  credentials: CredEntry[];
  specialties: string[]; yearsExperience: string;
  bioMode: BioMode; bioWhere: string; bioWho: string; bioWhat: string; bioDirect: string;
  sessionTypes: string[];
  rates: Record<string, string>;
  rateTypes: Record<string, 'hr' | 'flat'>;
  eoMode: EoMode; eoCarrier: string; eoCoverage: string; eoUploaded: boolean; eoGettingAck: boolean;
  packages: Pkg[];
  tosAccepted: boolean;
};

const DEFAULT_FORM: Form = {
  email: '',
  firstName: '', lastName: '', headline: '', location: '', languages: ['English'],
  photoUploaded: false,
  credentials: [],
  specialties: [], yearsExperience: '',
  bioMode: 'guided', bioWhere: '', bioWho: '', bioWhat: '', bioDirect: '',
  sessionTypes: [], rates: {}, rateTypes: {},
  eoMode: null, eoCarrier: '', eoCoverage: '', eoUploaded: false, eoGettingAck: false,
  packages: [],
  tosAccepted: false,
};

const STORAGE_KEY = 'brivon-advocate-onboarding';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadFromStorage(): Form | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_FORM, ...JSON.parse(raw) } : null;
  } catch { return null; }
}

function calcProgress(form: Form): number {
  let score = 0;
  if (form.email) score += 5;
  if (form.firstName && form.lastName) score += 10;
  if (form.headline) score += 5;
  if (form.photoUploaded) score += 5;
  if (form.credentials.length > 0) score += 10;
  if (form.credentials.some(c => c.uploadState === 'done' || c.uploadState === 'later')) score += 10;
  if (form.specialties.length > 0) score += 10;
  const bioFilled = form.bioMode === 'guided' ? (form.bioWhere && form.bioWho) : form.bioDirect;
  if (bioFilled) score += 10;
  if (form.sessionTypes.length > 0) score += 5;
  if (Object.values(form.rates).some(r => r)) score += 5;
  if (form.eoMode === 'have' && form.eoCarrier) score += 10;
  if (form.eoMode === 'have' && form.eoUploaded) score += 10;
  if (form.eoMode === 'getting' && form.eoGettingAck) score += 10;
  if (form.tosAccepted) score += 5;
  return Math.min(score, 100);
}

function sectionComplete(id: string, form: Form): boolean {
  switch (id) {
    case 'basics': return !!(form.email && form.firstName && form.lastName && form.headline);
    case 'credentials': return form.credentials.length > 0 && form.credentials.every(c => c.uploadState !== 'idle');
    case 'practice': return form.specialties.length > 0 && !!(form.bioMode === 'guided' ? form.bioWhere : form.bioDirect);
    case 'insurance': return form.eoMode === 'getting' ? form.eoGettingAck : !!(form.eoMode === 'have' && form.eoCarrier);
    case 'review': return form.tosAccepted;
    default: return false;
  }
}

function assembleBio(form: Form): string {
  const parts: string[] = [];
  if (form.bioWhere) parts.push(`After working at ${form.bioWhere}`);
  if (form.bioWho) parts.push(form.bioWhere ? `, I specialize in supporting ${form.bioWho}` : `I specialize in supporting ${form.bioWho}`);
  if (form.bioWhat) parts.push(`. Working with me means ${form.bioWhat}`);
  else if (parts.length) parts.push('.');
  return parts.join('');
}


let _uid = 0;

// ─── Shared UI ────────────────────────────────────────────────────────────────

function FieldLabel({ children, note, required, optional }: {
  children: React.ReactNode; note?: string; required?: boolean; optional?: boolean;
}) {
  return (
    <div className="mb-1.5">
      <label className="text-sm font-medium text-foreground flex items-baseline gap-1.5">
        {children}
        {required && <span className="text-red-500 text-xs leading-none">*</span>}
        {optional && <span className="text-xs font-normal text-muted-foreground">optional</span>}
      </label>
      {note && <p className="text-xs text-muted-foreground mt-0.5">{note}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, className }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string;
}) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn("w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors placeholder:text-muted-foreground", className)}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors placeholder:text-muted-foreground resize-none"
    />
  );
}

function PillToggle({ options, selected, onToggle, max }: {
  options: string[]; selected: string[]; onToggle: (v: string) => void; max?: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = selected.includes(opt);
        const disabled = !active && !!max && selected.length >= max;
        return (
          <button
            key={opt}
            onClick={() => !disabled && onToggle(opt)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              active && "bg-primary text-primary-foreground border-primary",
              !active && !disabled && "border-border text-foreground hover:border-primary/50",
              disabled && "opacity-40 cursor-not-allowed border-border text-muted-foreground"
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function SectionHeader({ id, title, subtitle, complete }: {
  id: string; title: string; subtitle: string; complete: boolean;
}) {
  return (
    <div id={id} className="flex items-start justify-between mb-6 pt-2">
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      {complete && (
        <span className="flex items-center gap-1 text-xs text-primary font-medium flex-shrink-0 mt-1">
          <Check className="w-3.5 h-3.5" /> Complete
        </span>
      )}
    </div>
  );
}

// ─── Section: About you ───────────────────────────────────────────────────────

function SectionBasics({ form, setField, toggle, showErrors }: {
  form: Form;
  setField: (k: keyof Form, v: any) => void;
  toggle: (k: 'languages' | 'specialties' | 'sessionTypes', v: string) => void;
  showErrors: boolean;
}) {
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const [photoState, setPhotoState] = useState<'idle' | 'uploading' | 'done'>(form.photoUploaded ? 'done' : 'idle');

  function simulatePhotoUpload() {
    setPhotoState('uploading');
    setTimeout(() => {
      setPhotoState('done');
      setField('photoUploaded', true);
    }, 1200);
  }

  return (
    <div className="space-y-5">
      <SectionHeader id="basics" title="About you" subtitle="This is what patients see on your public profile." complete={sectionComplete('basics', form)} />

      {/* Photo + name row */}
      <div className="flex items-start gap-5">
        <div className="flex-shrink-0">
          <FieldLabel>Photo</FieldLabel>
          <div className="flex flex-col items-center gap-2">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center overflow-hidden border-2",
              photoState === 'done' ? "border-primary" : "border-border bg-muted"
            )}>
              {photoState === 'uploading' && <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />}
              {photoState === 'done' && (
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face" alt="Profile" className="w-full h-full object-cover" />
              )}
              {photoState === 'idle' && <Upload className="w-5 h-5 text-muted-foreground" />}
            </div>
            {photoState !== 'done' ? (
              <button onClick={simulatePhotoUpload} disabled={photoState === 'uploading'} className="text-xs text-primary hover:text-primary/80 transition-colors disabled:opacity-50">
                {photoState === 'uploading' ? 'Uploading…' : 'Upload photo'}
              </button>
            ) : (
              <button onClick={() => { setPhotoState('idle'); setField('photoUploaded', false); }} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Change
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel required>First name</FieldLabel>
              <TextInput value={form.firstName} onChange={v => setField('firstName', v)} placeholder="Sarah"
                className={cn(showErrors && !form.firstName && "border-red-400 focus:ring-red-300")} />
              {showErrors && !form.firstName && <p className="text-xs text-red-600 mt-1">Required.</p>}
            </div>
            <div>
              <FieldLabel required>Last name</FieldLabel>
              <TextInput value={form.lastName} onChange={v => setField('lastName', v)} placeholder="Mitchell"
                className={cn(showErrors && !form.lastName && "border-red-400 focus:ring-red-300")} />
              {showErrors && !form.lastName && <p className="text-xs text-red-600 mt-1">Required.</p>}
            </div>
          </div>
          <div>
            <FieldLabel required>Email address</FieldLabel>
            <TextInput
              value={form.email}
              onChange={v => setField('email', v)}
              placeholder="sarah@mitchelladvocacy.com"
              className={cn(showErrors && !emailValid && "border-red-400 focus:ring-red-300")}
            />
            {showErrors && !form.email && <p className="text-xs text-red-600 mt-1">Email is required.</p>}
            {showErrors && form.email && !emailValid && <p className="text-xs text-red-600 mt-1">Enter a valid email address.</p>}
            {(!showErrors || emailValid) && <p className="text-xs text-muted-foreground mt-1">Used for application updates and patient inquiries. Not shown publicly.</p>}
          </div>
        </div>
      </div>

      <div>
        <FieldLabel required note="1–2 sentences. Lead with what you help patients through, not just your title.">Headline</FieldLabel>
        <TextArea
          value={form.headline}
          onChange={v => setField('headline', v)}
          placeholder="20+ years in oncology. I translate the chaos into a clear path forward — and stand beside you every step."
          rows={2}
        />
        <p className="text-xs text-muted-foreground mt-1">{form.headline.length}/160</p>
        {showErrors && !form.headline && <p className="text-xs text-red-600 mt-1">Required.</p>}
      </div>
      <div>
        <FieldLabel optional note="City, State — shown on your profile">Location</FieldLabel>
        <TextInput value={form.location} onChange={v => setField('location', v)} placeholder="Boston, MA" className="max-w-xs" />
      </div>
      <div>
        <FieldLabel optional note="English is pre-selected — add any others you're fluent in">Languages spoken</FieldLabel>
        <PillToggle options={LANGUAGES} selected={form.languages} onToggle={v => toggle('languages', v)} />
      </div>
    </div>
  );
}

// ─── Section: Credentials ─────────────────────────────────────────────────────

function CredentialCard({ cred, updateCred, removeCred, simulateUpload }: {
  cred: CredEntry;
  updateCred: (id: string, u: Partial<CredEntry>) => void;
  removeCred: (id: string) => void;
  simulateUpload: (id: string, type: string) => void;
}) {
  const isOther = cred.type === '_other';
  const hint = QUICK_CERTS.find(c => c.value === cred.type)?.hint ?? '';

  return (
    <div className="border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">
          {cred.type && cred.type !== '_other' ? cred.type : 'New credential'}
        </span>
        <button onClick={() => removeCred(cred.id)} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Type cards */}
      {!cred.type && (
        <div>
          <FieldLabel>What type of credential is this?</FieldLabel>
          <div className="grid grid-cols-5 gap-2">
            {QUICK_CERTS.map(cert => {
              const Icon = cert.icon;
              return (
                <button
                  key={cert.value}
                  onClick={() => updateCred(cred.id, { type: cert.value })}
                  className="flex flex-col items-center gap-1.5 p-2.5 border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors text-center"
                >
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">{cert.short}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {cred.type && (
        <>
          {isOther && (
            <div>
              <FieldLabel>Credential name</FieldLabel>
              <TextInput
                value={cred.customType}
                onChange={v => updateCred(cred.id, { customType: v })}
                placeholder="e.g. Health Coach Certification (IIN)"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Certificate / license number</FieldLabel>
              <TextInput
                value={cred.certNumber}
                onChange={v => updateCred(cred.id, { certNumber: v })}
                placeholder={hint || 'Enter number'}
              />
              {hint && <p className="text-xs text-muted-foreground mt-1">Format: {hint}</p>}
            </div>
            <div>
              <FieldLabel>Expiry date</FieldLabel>
              <TextInput value={cred.expiry} onChange={v => updateCred(cred.id, { expiry: v })} placeholder="Month YYYY" />
            </div>
          </div>

          {/* Upload area */}
          <div>
            <FieldLabel note="PDF or image of the certificate">Document</FieldLabel>
            {cred.uploadState === 'idle' && (
              <div className="space-y-2">
                <button
                  onClick={() => simulateUpload(cred.id, cred.type)}
                  className="w-full border-2 border-dashed border-border rounded-lg p-3 text-sm flex items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4" /> Upload certificate
                </button>
                <button
                  onClick={() => updateCred(cred.id, { uploadState: 'later' })}
                  className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
                >
                  I don't have the file handy — I'll upload it later
                </button>
              </div>
            )}
            {(cred.uploadState === 'uploading' || cred.uploadState === 'reading') && (
              <div className="border border-border rounded-lg p-3 flex items-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-primary flex-shrink-0" />
                {cred.uploadState === 'uploading' ? 'Uploading…' : 'Reading and extracting credential data…'}
              </div>
            )}
            {cred.uploadState === 'done' && cred.extracted && (
              <div className="border border-primary/20 bg-primary/5 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Check className="w-3.5 h-3.5" /> Document read
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div><p className="text-muted-foreground mb-0.5">Cert #</p><p className="font-medium">{cred.extracted.certNumber}</p></div>
                  <div><p className="text-muted-foreground mb-0.5">Issuer</p><p className="font-medium">{cred.extracted.issuer}</p></div>
                  <div><p className="text-muted-foreground mb-0.5">Expiry</p><p className="font-medium">{cred.extracted.expiry}</p></div>
                </div>
              </div>
            )}
            {cred.uploadState === 'later' && (
              <div className="border border-amber-200 bg-amber-50 rounded-lg p-3 flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-amber-700">Upload pending — your profile won't be verified until the document is received.</p>
                  <button onClick={() => updateCred(cred.id, { uploadState: 'idle' })} className="text-xs text-amber-700 underline mt-0.5">Upload now</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function SectionCredentials({ form, addCredential, updateCred, removeCred, simulateUpload, showErrors }: {
  form: Form;
  addCredential: () => void;
  updateCred: (id: string, u: Partial<CredEntry>) => void;
  removeCred: (id: string) => void;
  simulateUpload: (id: string, type: string) => void;
  showErrors: boolean;
}) {
  return (
    <div className="space-y-4">
      <SectionHeader id="credentials" title="Credentials" subtitle="Add each certification, license, or degree. Upload the document and we'll extract and verify the details." complete={sectionComplete('credentials', form)} />
      {form.credentials.length === 0 ? (
        <div className={cn("border-2 border-dashed rounded-lg p-8 text-center", showErrors ? "border-red-300 bg-red-50/50" : "border-border")}>
          <Award className={cn("w-8 h-8 mx-auto mb-2", showErrors ? "text-red-400" : "text-muted-foreground")} />
          <p className={cn("text-sm mb-1", showErrors ? "text-red-600 font-medium" : "text-muted-foreground")}>
            {showErrors ? "At least one credential is required." : "No credentials added yet. Start with your most important one."}
          </p>
          {showErrors && <p className="text-xs text-muted-foreground mb-3">Add your BCPA, nursing license, or other professional credential.</p>}
          <Button variant="outline" size="sm" onClick={addCredential} className={cn(showErrors && "border-red-300")}><Plus className="w-3.5 h-3.5 mr-1.5" />Add credential</Button>
        </div>
      ) : (
        <>
          {form.credentials.map(cred => (
            <CredentialCard key={cred.id} cred={cred} updateCred={updateCred} removeCred={removeCred} simulateUpload={simulateUpload} />
          ))}
          <button onClick={addCredential} className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors">
            <Plus className="w-4 h-4" /> Add another credential
          </button>
        </>
      )}
    </div>
  );
}

// ─── Section: Practice & services ────────────────────────────────────────────

function SectionPractice({ form, setField, toggle }: {
  form: Form;
  setField: (k: keyof Form, v: any) => void;
  toggle: (k: 'languages' | 'specialties' | 'sessionTypes', v: string) => void;
}) {
  const bioPreview = assembleBio(form);

  return (
    <div className="space-y-6">
      <SectionHeader id="practice" title="Practice & services" subtitle="Help us match you to the right patients and set clear expectations." complete={sectionComplete('practice', form)} />

      <div>
        <FieldLabel optional note="Select up to 5 — be specific, they drive patient matches">Specialty areas</FieldLabel>
        <PillToggle options={SPECIALTIES} selected={form.specialties} onToggle={v => toggle('specialties', v)} max={5} />
      </div>

      <div>
        <FieldLabel optional>Years of experience</FieldLabel>
        <TextInput value={form.yearsExperience} onChange={v => setField('yearsExperience', v)} placeholder="e.g. 12" className="max-w-[120px]" />
      </div>

      {/* Bio section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <FieldLabel>Your story</FieldLabel>
          <button
            onClick={() => {
              if (form.bioMode === 'guided') {
                setField('bioDirect', bioPreview || '');
                setField('bioMode', 'direct');
              } else {
                setField('bioMode', 'guided');
              }
            }}
            className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
          >
            <Edit3 className="w-3 h-3" />
            {form.bioMode === 'guided' ? 'Write my own' : 'Use guided prompts'}
          </button>
        </div>

        {form.bioMode === 'guided' ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Where did you work before becoming an advocate?</label>
              <TextInput value={form.bioWhere} onChange={v => setField('bioWhere', v)} placeholder="e.g. Dana-Farber Cancer Institute, 22 years" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Who do you typically help?</label>
              <TextInput value={form.bioWho} onChange={v => setField('bioWho', v)} placeholder="e.g. patients newly diagnosed with cancer" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">What changes for patients who work with you?</label>
              <TextInput value={form.bioWhat} onChange={v => setField('bioWhat', v)} placeholder="e.g. they understand their options and stop feeling lost" />
            </div>
            {bioPreview && (
              <div className="p-3 bg-muted/50 border border-border rounded-lg">
                <p className="text-xs text-muted-foreground mb-1 font-medium">Preview</p>
                <p className="text-sm text-foreground italic">{bioPreview}</p>
              </div>
            )}
          </div>
        ) : (
          <TextArea
            value={form.bioDirect}
            onChange={v => setField('bioDirect', v)}
            placeholder="Write your background and how you work in your own words…"
            rows={5}
          />
        )}
      </div>

      {/* Services */}
      <div className="pt-4 border-t border-border space-y-5">
        <p className="text-sm font-medium text-foreground">How you work</p>
        <div>
          <FieldLabel optional note="Select all that apply — you'll set a rate for each one below">Session types you offer</FieldLabel>
          <PillToggle options={SESSION_TYPES} selected={form.sessionTypes} onToggle={v => toggle('sessionTypes', v)} />
        </div>
        {form.sessionTypes.length > 0 && (
          <div>
            <FieldLabel note="Each session type can have its own rate and billing model">Rates</FieldLabel>
            <div className="space-y-2">
              {form.sessionTypes.map(type => {
                const rateType = (form.rateTypes[type] ?? 'hr') as 'hr' | 'flat';
                const hint = SESSION_TYPE_BENCHMARKS[type];
                return (
                  <div key={type} className="flex items-center gap-3 px-3 py-2.5 border border-border rounded-lg">
                    <span className="text-sm text-foreground flex-1">{type}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">$</span>
                      <input
                        value={form.rates[type] ?? ''}
                        onChange={e => setField('rates', { ...form.rates, [type]: e.target.value })}
                        placeholder={rateType === 'flat' ? '500' : '150'}
                        className="w-20 px-2 py-1.5 text-sm text-right bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <select
                        value={rateType}
                        onChange={e => setField('rateTypes', { ...form.rateTypes, [type]: e.target.value as 'hr' | 'flat' })}
                        className="text-xs border border-border rounded px-2 py-1.5 bg-background text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="hr">/ hr</option>
                        <option value="flat">flat</option>
                      </select>
                    </div>
                    {hint && (
                      <span className="text-xs text-muted-foreground hidden sm:inline w-44 text-right">{hint}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Package pricing */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-1.5">
            <div>
              <p className="text-sm font-medium text-foreground">Packages <span className="text-xs font-normal text-muted-foreground ml-1">optional</span></p>
              <p className="text-xs text-muted-foreground mt-0.5">Bundle a defined scope of work at a flat price — converts better than hourly alone.</p>
            </div>
          </div>
          {form.packages.map((pkg, idx) => (
            <div key={pkg.id} className="border border-border rounded-lg p-4 space-y-3 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Package {idx + 1}</span>
                <button
                  onClick={() => setField('packages', form.packages.filter(p => p.id !== pkg.id))}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <FieldLabel>Package name</FieldLabel>
                  <TextInput
                    value={pkg.name}
                    onChange={v => setField('packages', form.packages.map(p => p.id === pkg.id ? { ...p, name: v } : p))}
                    placeholder="e.g. Insurance Appeal Filing"
                  />
                </div>
                <div className="col-span-2">
                  <FieldLabel note="One sentence — what does the patient walk away with?">What's included</FieldLabel>
                  {([0, 1, 2] as const).map(i => (
                    <input
                      key={i}
                      value={pkg.includes[i]}
                      onChange={e => {
                        const next: [string, string, string] = [...pkg.includes] as [string, string, string];
                        next[i] = e.target.value;
                        setField('packages', form.packages.map(p => p.id === pkg.id ? { ...p, includes: next } : p));
                      }}
                      placeholder={['Review denial letter and identify grounds', 'Draft and submit appeal letter', 'Follow up with insurer within 5 business days'][i]}
                      className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 mb-1.5 placeholder:text-muted-foreground"
                    />
                  ))}
                </div>
                <div>
                  <FieldLabel>Price</FieldLabel>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">$</span>
                    <TextInput
                      value={pkg.price}
                      onChange={v => setField('packages', form.packages.map(p => p.id === pkg.id ? { ...p, price: v } : p))}
                      placeholder="350"
                    />
                    <select
                      value={pkg.billingType}
                      onChange={e => setField('packages', form.packages.map(p => p.id === pkg.id ? { ...p, billingType: e.target.value as 'flat' | 'monthly' } : p))}
                      className="text-xs border border-border rounded px-2 py-2 bg-background text-muted-foreground focus:outline-none"
                    >
                      <option value="flat">one-time</option>
                      <option value="monthly">/ month</option>
                    </select>
                  </div>
                </div>
                <div>
                  <FieldLabel note="e.g. 5 business days">Typical delivery</FieldLabel>
                  <TextInput
                    value={pkg.deliveryDays}
                    onChange={v => setField('packages', form.packages.map(p => p.id === pkg.id ? { ...p, deliveryDays: v } : p))}
                    placeholder="5 business days"
                  />
                </div>
              </div>
            </div>
          ))}
          {form.packages.length < 4 && (
            <button
              onClick={() => setField('packages', [...form.packages, {
                id: String(++_uid), name: '', description: '', price: '', billingType: 'flat' as const,
                deliveryDays: '', includes: ['', '', ''],
              }])}
              className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors mt-2"
            >
              <Plus className="w-4 h-4" /> Add package
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Section: Insurance ───────────────────────────────────────────────────────

function SectionInsurance({ form, setField, simulateEoUpload, showErrors }: {
  form: Form;
  setField: (k: keyof Form, v: any) => void;
  simulateEoUpload: () => void;
  showErrors: boolean;
}) {
  return (
    <div className="space-y-5">
      <SectionHeader id="insurance" title="E&O insurance" subtitle="Errors & Omissions coverage is required to practice on Brivon. Minimum: $500K per occurrence." complete={sectionComplete('insurance', form)} />

      {!form.eoMode && (
        <>
          <div className={cn("grid grid-cols-2 gap-3", showErrors && "ring-1 ring-red-300 rounded-lg p-1 -m-1")}>
            <button
              onClick={() => setField('eoMode', 'have')}
              className="p-4 border-2 border-border rounded-lg text-left hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              <Shield className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm font-medium text-foreground">I have E&O coverage</p>
              <p className="text-xs text-muted-foreground mt-0.5">I'll upload my current policy document</p>
            </button>
            <button
              onClick={() => setField('eoMode', 'getting')}
              className="p-4 border-2 border-border rounded-lg text-left hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              <BookOpen className="w-5 h-5 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-foreground">I don't have coverage yet</p>
              <p className="text-xs text-muted-foreground mt-0.5">I'll get a policy before my profile goes live</p>
            </button>
          </div>
          {showErrors && <p className="text-xs text-red-600">Required — select one of the options above.</p>}
        </>
      )}

      {form.eoMode === 'have' && (
        <div className="space-y-4">
          <button onClick={() => setField('eoMode', null)} className="text-xs text-muted-foreground hover:text-foreground underline">← Change</button>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Insurance carrier</FieldLabel>
              <TextInput value={form.eoCarrier} onChange={v => setField('eoCarrier', v)} placeholder="HPSO Professional Liability" />
            </div>
            <div>
              <FieldLabel optional>Coverage amount</FieldLabel>
              <TextInput value={form.eoCoverage} onChange={v => setField('eoCoverage', v)} placeholder="$1M / $3M" />
            </div>
          </div>
          <div>
            <FieldLabel optional note="Current declarations page or certificate of insurance">Policy document</FieldLabel>
            {!form.eoUploaded ? (
              <button
                onClick={simulateEoUpload}
                className="w-full border-2 border-dashed border-border rounded-lg p-3 text-sm flex items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
              >
                <Upload className="w-4 h-4" /> Upload policy document
              </button>
            ) : (
              <div className="border border-primary/20 bg-primary/5 rounded-lg p-3 flex items-center gap-3">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Policy document verified</p>
                  <p className="text-xs text-muted-foreground">Carrier and coverage confirmed. Policy appears active.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {form.eoMode === 'getting' && (
        <div className="space-y-4">
          <button onClick={() => setField('eoMode', null)} className="text-xs text-muted-foreground hover:text-foreground underline">← Change</button>
          <div className="p-4 bg-muted/50 border border-border rounded-lg space-y-3">
            <p className="text-sm font-medium text-foreground">Getting coverage</p>
            <p className="text-sm text-muted-foreground">Most patient advocates use HPSO — policies start around $320/yr for $1M/$3M coverage.</p>
            <a
              href="https://www.hpso.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Visit HPSO to get a quote
            </a>
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.eoGettingAck}
              onChange={e => setField('eoGettingAck', e.target.checked)}
              className="mt-0.5 accent-primary"
            />
            <span className="text-sm text-foreground">
              I'll submit my policy document within 30 days of approval. I understand my profile won't be visible until it's received.
            </span>
          </label>
        </div>
      )}
    </div>
  );
}

// ─── AI Panel ─────────────────────────────────────────────────────────────────

function AiPanel({ form, aiLog }: { form: Form; aiLog: AiMsg[] }) {
  const checks = [
    { label: 'Identity', done: !!(form.firstName && form.lastName) },
    { label: 'Credentials', done: form.credentials.some(c => c.uploadState === 'done' || c.uploadState === 'later') },
    { label: 'Practice profile', done: form.specialties.length > 0 },
    { label: 'E&O insurance', done: form.eoMode === 'getting' ? form.eoGettingAck : !!(form.eoMode === 'have' && form.eoCarrier) },
  ];

  return (
    <div className="sticky top-20 space-y-3">
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="px-3 py-2.5 border-b border-border bg-muted/30 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">AI Verification</span>
        </div>
        <div className="p-3 space-y-2">
          {checks.map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={cn(
                "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0",
                item.done ? "bg-primary" : "border-2 border-border"
              )}>
                {item.done && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
              </div>
              <span className={cn("text-xs", item.done ? "text-foreground" : "text-muted-foreground")}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {aiLog.length > 0 && (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="px-3 py-2 border-b border-border bg-muted/30">
            <span className="text-xs font-semibold text-foreground">Notes</span>
          </div>
          <div className="p-3 space-y-2 max-h-72 overflow-y-auto">
            {aiLog.map((msg, i) => (
              <div key={i} className={cn(
                "flex gap-2 text-xs rounded-md p-2",
                msg.type === 'success' && "bg-primary/5 border border-primary/15",
                msg.type === 'warning' && "bg-amber-50 border border-amber-200",
                msg.type === 'info' && "bg-muted/50 border border-border"
              )}>
                {msg.type === 'success' && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />}
                {msg.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />}
                {msg.type === 'info' && <Sparkles className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />}
                <p className="text-muted-foreground leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section nav ─────────────────────────────────────────────────────────────

// ─── Section: Review & submit ─────────────────────────────────────────────────

function SectionReview({ form, setField }: {
  form: Form;
  setField: (k: keyof Form, v: any) => void;
}) {
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  type FieldRow = {
    label: string;
    required: boolean;
    filled: boolean;
    display: string;
    section: string;
    note?: string;
  };

  const fields: FieldRow[] = [
    {
      label: 'Email', required: true, section: 'basics',
      filled: !!form.email && emailValid,
      display: form.email || 'Not provided',
    },
    {
      label: 'Name', required: true, section: 'basics',
      filled: !!(form.firstName && form.lastName),
      display: [form.firstName, form.lastName].filter(Boolean).join(' ') || 'Not provided',
    },
    {
      label: 'Headline', required: true, section: 'basics',
      filled: !!form.headline,
      display: form.headline ? (form.headline.length > 60 ? form.headline.slice(0, 60) + '…' : form.headline) : 'Not provided',
    },
    {
      label: 'Photo', required: false, section: 'basics',
      filled: form.photoUploaded,
      display: form.photoUploaded ? 'Uploaded' : 'Not uploaded',
    },
    {
      label: 'Credentials', required: true, section: 'credentials',
      filled: form.credentials.length > 0,
      display: form.credentials.length
        ? `${form.credentials.length} added · ${form.credentials.filter(c => c.uploadState === 'done').length} document${form.credentials.filter(c => c.uploadState === 'done').length !== 1 ? 's' : ''} uploaded`
        : 'None added',
    },
    {
      label: 'Specialties', required: false, section: 'practice',
      filled: form.specialties.length > 0,
      display: form.specialties.length ? form.specialties.join(', ') : 'Not selected',
      note: 'Improves patient matching',
    },
    {
      label: 'Bio', required: false, section: 'practice',
      filled: !!(form.bioMode === 'guided' ? form.bioWhere : form.bioDirect),
      display: (form.bioMode === 'guided' ? form.bioWhere : form.bioDirect) ? 'Added' : 'Not written',
    },
    {
      label: 'Session types', required: false, section: 'practice',
      filled: form.sessionTypes.length > 0,
      display: form.sessionTypes.length ? form.sessionTypes.join(', ') : 'None selected',
    },
    {
      label: 'Packages', required: false, section: 'practice',
      filled: form.packages.length > 0,
      display: form.packages.length ? `${form.packages.length} package${form.packages.length > 1 ? 's' : ''}` : 'None added',
    },
    {
      label: 'E&O insurance', required: true, section: 'insurance',
      filled: form.eoMode !== null,
      display: form.eoMode === 'have'
        ? (form.eoCarrier || 'Carrier not entered')
        : form.eoMode === 'getting'
        ? 'Getting coverage'
        : 'Not selected',
    },
  ];

  const missingRequired = fields.filter(f => f.required && !f.filled);
  const allRequiredDone = missingRequired.length === 0;

  function scrollTo(section: string) {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="space-y-5">
      <SectionHeader id="review" title="Review & submit" subtitle="Check everything before your application goes to the Brivon team." complete={form.tosAccepted && allRequiredDone} />

      {/* Status summary */}
      {allRequiredDone ? (
        <div className="flex items-center gap-2.5 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="text-sm text-foreground font-medium">All required fields complete. Ready to submit.</p>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-foreground">
            <span className="font-medium text-red-700">{missingRequired.length} required {missingRequired.length === 1 ? 'field' : 'fields'} missing</span>
            <span className="text-muted-foreground ml-1">— click any row to go back and fill it in.</span>
          </p>
        </div>
      )}

      {/* Field checklist */}
      <div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
        {fields.map(f => {
          const isError = f.required && !f.filled;
          const isEmpty = !f.required && !f.filled;
          return (
            <button
              key={f.label}
              onClick={() => scrollTo(f.section)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors text-left group"
            >
              {/* Status icon */}
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                isError && "bg-red-100 border border-red-300",
                !isError && f.filled && "bg-primary",
                isEmpty && "bg-muted border border-border"
              )}>
                {isError && <X className="w-3 h-3 text-red-500" />}
                {f.filled && <Check className="w-3 h-3 text-primary-foreground" />}
                {isEmpty && <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />}
              </div>

              {/* Label */}
              <div className="flex items-center gap-1.5 w-32 flex-shrink-0">
                <span className={cn("text-xs font-medium", isError ? "text-red-700" : "text-muted-foreground")}>{f.label}</span>
                {f.required
                  ? <span className="text-red-500 text-[10px] leading-none">*</span>
                  : <span className="text-[10px] text-muted-foreground/60 font-normal">opt</span>
                }
              </div>

              {/* Value */}
              <span className={cn(
                "text-sm flex-1 truncate",
                isError ? "text-red-600 italic" : f.filled ? "text-foreground" : "text-muted-foreground/60 italic"
              )}>
                {f.display}
              </span>

              {/* Note + arrow */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {f.note && !f.filled && <span className="text-xs text-muted-foreground hidden sm:inline">{f.note}</span>}
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          );
        })}
      </div>

      {/* ToS */}
      <label className={cn(
        "flex items-start gap-3 cursor-pointer p-4 border rounded-lg transition-colors",
        form.tosAccepted ? "border-primary/20 bg-primary/5" : "border-border hover:bg-muted/30"
      )}>
        <input
          type="checkbox"
          checked={form.tosAccepted}
          onChange={e => setField('tosAccepted', e.target.checked)}
          className="mt-0.5 accent-primary"
        />
        <span className="text-sm text-foreground leading-relaxed">
          I confirm that all information is accurate and complete. I've read and agree to the{' '}
          <a href="/terms" target="_blank" className="text-primary underline" onClick={e => e.stopPropagation()}>Terms of Service</a> and{' '}
          <a href="/privacy" target="_blank" className="text-primary underline" onClick={e => e.stopPropagation()}>Privacy Policy</a>.{' '}
          <span className="text-red-500 text-xs font-medium">*</span>
        </span>
      </label>
    </div>
  );
}

// ─── Section nav ─────────────────────────────────────────────────────────────

function SectionNav({ form, active }: { form: Form; active: string }) {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="sticky top-20 space-y-1">
      {SECTIONS.map(s => {
        const done = sectionComplete(s.id, form);
        return (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors text-left",
              active === s.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <div className={cn(
              "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0",
              done ? "bg-primary" : "border-2 border-current opacity-40"
            )}>
              {done && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
            </div>
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdvocateOnboarding() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState<Form>(() => loadFromStorage() ?? DEFAULT_FORM);
  const [savedState, setSavedState] = useState<'idle' | 'saved'>('idle');
  const [showErrors, setShowErrors] = useState(false);
  const [activeSection, setActiveSection] = useState('basics');
  const [aiLog, setAiLog] = useState<AiMsg[]>([
    { type: 'info', text: "Welcome. I'll audit your application as you fill it out — flagging anything before it reaches the review team." },
  ]);

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
        setSavedState('saved');
        setTimeout(() => setSavedState('idle'), 2000);
      } catch {}
    }, 800);
    return () => clearTimeout(timer);
  }, [form]);

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  function setField(k: keyof Form, v: any) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function toggle(k: 'languages' | 'specialties' | 'sessionTypes', val: string) {
    setForm(f => ({
      ...f,
      [k]: (f[k] as string[]).includes(val)
        ? (f[k] as string[]).filter(x => x !== val)
        : [...(f[k] as string[]), val],
    }));
  }

  function addCredential() {
    const id = String(++_uid);
    setForm(f => ({
      ...f,
      credentials: [...f.credentials, { id, type: '', customType: '', certNumber: '', expiry: '', uploadState: 'idle' as UploadState }],
    }));
  }

  function updateCred(id: string, updates: Partial<CredEntry>) {
    setForm(f => ({ ...f, credentials: f.credentials.map(c => c.id === id ? { ...c, ...updates } : c) }));
  }

  function removeCred(id: string) {
    setForm(f => ({ ...f, credentials: f.credentials.filter(c => c.id !== id) }));
  }

  function simulateUpload(id: string, certType: string) {
    updateCred(id, { uploadState: 'uploading' });
    setTimeout(() => {
      updateCred(id, { uploadState: 'reading' });
      setTimeout(() => {
        const extracted = MOCK_EXTRACTED[certType] ?? {
          certNumber: `CERT-${Math.floor(Math.random() * 9000) + 1000}`,
          issuer: 'Issuing Organization',
          expiry: 'December 2026',
        };
        updateCred(id, { uploadState: 'done', extracted });
        setAiLog(prev => [...prev, {
          type: 'success',
          text: `Document read. Found cert #${extracted.certNumber} from ${extracted.issuer}, expiring ${extracted.expiry}. I'll cross-check with the registry.`,
        }]);
      }, 1200);
    }, 800);
  }

  function simulateEoUpload() {
    setTimeout(() => {
      setForm(f => ({ ...f, eoUploaded: true }));
      setAiLog(prev => [...prev, {
        type: 'success',
        text: 'E&O policy processed. Carrier and coverage amount confirmed. Policy appears active.',
      }]);
    }, 1500);
  }

  const progress = calcProgress(form);

  function handleSubmit() {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    const basicsOk = emailValid && form.firstName && form.lastName && form.headline;
    const credsOk = form.credentials.length > 0;
    const eoOk = form.eoMode !== null;
    if (!basicsOk || !credsOk || !eoOk || !form.tosAccepted) {
      setShowErrors(true);
      if (!basicsOk) document.getElementById('basics')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else if (!credsOk) document.getElementById('credentials')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else if (!eoOk) document.getElementById('insurance')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else document.getElementById('review')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    navigate('/onboard/status');
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-display font-semibold text-foreground">Brivon</Link>
          <div className="flex items-center gap-4">
            {savedState === 'saved' && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Check className="w-3 h-3" /> Saved
              </span>
            )}
            <span className="text-sm text-muted-foreground">Advocate application</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
        {/* Left: section nav */}
        <div className="w-44 flex-shrink-0 hidden lg:block">
          <SectionNav form={form} active={activeSection} />
        </div>

        {/* Center: scrollable form */}
        <div className="flex-1 min-w-0 space-y-12">
          <SectionBasics form={form} setField={setField} toggle={toggle} showErrors={showErrors} />
          <div className="border-t border-border" />
          <SectionCredentials form={form} addCredential={addCredential} updateCred={updateCred} removeCred={removeCred} simulateUpload={simulateUpload} showErrors={showErrors} />
          <div className="border-t border-border" />
          <SectionPractice form={form} setField={setField} toggle={toggle} />
          <div className="border-t border-border" />
          <SectionInsurance form={form} setField={setField} simulateEoUpload={simulateEoUpload} showErrors={showErrors} />
          <div className="border-t border-border" />
          <SectionReview form={form} setField={setField} />
        </div>

        {/* Right: AI panel */}
        <div className="w-72 flex-shrink-0 hidden lg:block">
          <AiPanel form={form} aiLog={aiLog} />
        </div>
      </div>

      {/* Sticky submit bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
          <div className="flex-1 flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden max-w-xs">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{progress}% complete</span>
          </div>
          <Button onClick={handleSubmit} disabled={!form.tosAccepted || progress < 30}>
            Submit application <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
