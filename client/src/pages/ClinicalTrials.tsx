import React, { useState } from 'react';
import { Link } from 'wouter';
import {
  Search, Bookmark, ExternalLink, MapPin, Phone, Mail,
  ChevronDown, ChevronUp, SlidersHorizontal, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Mock data ──────────────────────────────────────────────────────────────

const TRIALS = [
  {
    nct: 'NCT04528719',
    title: 'A Phase III Study of Pembrolizumab Plus Chemotherapy vs. Chemotherapy Alone in Previously Untreated Advanced NSCLC',
    phase: 'III' as const,
    sponsor: 'Merck',
    sponsorType: 'Industry' as const,
    status: 'Recruiting' as const,
    description:
      'This trial evaluates the combination of pembrolizumab (Keytruda) with standard platinum-based chemotherapy in patients newly diagnosed with stage IIIB or IV non-small cell lung cancer. The study aims to determine if the combination improves overall survival compared to chemotherapy alone.',
    eligibility: [
      'Confirmed diagnosis of stage IIIB/IV NSCLC',
      'No prior systemic treatment for metastatic disease',
      'Exclude: active autoimmune disease requiring systemic treatment',
    ],
    locations: ['Boston, MA', 'Houston, TX', 'Los Angeles, CA'],
    coordinator: { name: 'Linda Marsh, RN', email: 'lmarsh@trial-merck.com' },
    saved: false,
  },
  {
    nct: 'NCT04892615',
    title: 'CAR-T Cell Therapy for Relapsed or Refractory Diffuse Large B-Cell Lymphoma (DLBCL): STELLAR-2 Trial',
    phase: 'II' as const,
    sponsor: 'NCI',
    sponsorType: 'NIH' as const,
    status: 'Recruiting' as const,
    description:
      'STELLAR-2 investigates a next-generation CAR-T cell construct targeting CD19 in adults with DLBCL who have relapsed after at least two prior lines of therapy. The primary endpoint is complete response rate at 3 months.',
    eligibility: [
      'Age ≥ 18 with confirmed DLBCL diagnosis',
      'Relapsed or refractory after ≥ 2 prior therapies including anti-CD20',
      'Exclude: active CNS lymphoma or prior allogeneic stem cell transplant',
    ],
    locations: ['Philadelphia, PA', 'Seattle, WA'],
    coordinator: { name: 'Dr. Kevin Osei', email: 'kosei@nci.nih.gov' },
    saved: false,
  },
  {
    nct: 'NCT05103241',
    title: 'Trastuzumab Deruxtecan vs. Physician\'s Choice Chemotherapy in HER2-Low Breast Cancer (DESTINY-Breast06)',
    phase: 'III' as const,
    sponsor: 'AstraZeneca',
    sponsorType: 'Industry' as const,
    status: 'Active, not recruiting' as const,
    description:
      'This trial compares the antibody-drug conjugate trastuzumab deruxtecan to standard physician-selected chemotherapy in patients with HER2-low expression metastatic breast cancer who have received prior endocrine therapy. The primary endpoint is progression-free survival.',
    eligibility: [
      'Metastatic breast cancer with HER2-low IHC 1+ or IHC 2+/ISH−',
      'At least one prior hormone therapy in metastatic setting',
      'Exclude: prior treatment with any anti-HER2 therapy',
    ],
    locations: ['New York, NY', 'Chicago, IL', 'Dallas, TX'],
    coordinator: { name: 'Rachel Nguyen', email: 'rnguyen@az-trials.com' },
    saved: false,
  },
  {
    nct: 'NCT05207891',
    title: 'Olaparib Maintenance Therapy in BRCA1/2-Mutated Ovarian Cancer After Complete Response to Platinum Chemotherapy',
    phase: 'II' as const,
    sponsor: 'Pfizer',
    sponsorType: 'Industry' as const,
    status: 'Enrolling by invitation' as const,
    description:
      'This study evaluates olaparib as maintenance therapy in patients with BRCA1 or BRCA2 germline mutations who have achieved complete or partial response to first-line platinum-based chemotherapy for advanced ovarian cancer.',
    eligibility: [
      'Confirmed germline BRCA1/2 pathogenic variant',
      'Stage III or IV epithelial ovarian, fallopian tube, or primary peritoneal cancer',
      'Exclude: prior PARP inhibitor treatment',
    ],
    locations: ['Baltimore, MD', 'Nashville, TN'],
    coordinator: { name: 'Sara Levine, NP', email: 'slevine@pfizer-oncology.com' },
    saved: false,
  },
  {
    nct: 'NCT05015842',
    title: 'Nivolumab + Ipilimumab vs. Standard of Care in Mismatch Repair-Deficient Colorectal Cancer (CHECKMATE-8HW)',
    phase: 'III' as const,
    sponsor: 'Bristol-Myers Squibb',
    sponsorType: 'Industry' as const,
    status: 'Recruiting' as const,
    description:
      'CHECKMATE-8HW evaluates dual checkpoint inhibition with nivolumab and ipilimumab compared to physician-selected chemotherapy or single-agent immunotherapy as first-line treatment in patients with MMR-deficient or MSI-high metastatic colorectal cancer.',
    eligibility: [
      'Confirmed MMR-deficient or MSI-high unresectable/metastatic CRC',
      'No prior chemotherapy or immunotherapy for metastatic disease',
      'Exclude: active inflammatory bowel disease or prior immune-related adverse events grade ≥ 3',
    ],
    locations: ['San Francisco, CA', 'Minneapolis, MN', 'Atlanta, GA'],
    coordinator: { name: 'Tom Clarke', email: 'tclarke@bms-trials.com' },
    saved: false,
  },
  {
    nct: 'NCT05388162',
    title: 'Luspatercept for Anemia in Myelofibrosis: A Randomized Phase II/III Study',
    phase: 'II' as const,
    sponsor: 'Mayo Clinic / Academic Consortium',
    sponsorType: 'Academic' as const,
    status: 'Recruiting' as const,
    description:
      'This multi-center academic trial tests luspatercept, an erythroid maturation agent, for the treatment of anemia in patients with myelofibrosis who are receiving ruxolitinib. The primary endpoint is transfusion independence at 24 weeks.',
    eligibility: [
      'Diagnosis of primary or secondary myelofibrosis per WHO 2022 criteria',
      'On stable dose of ruxolitinib for ≥ 12 weeks with ongoing anemia (Hgb < 10 g/dL)',
      'Exclude: prior treatment with any erythroid maturation agent',
    ],
    locations: ['Rochester, MN', 'Jacksonville, FL'],
    coordinator: { name: 'Dr. Anita Patel', email: 'apatel@mayo.edu' },
    saved: false,
  },
];

const TREATMENT_STAGES = [
  'Newly diagnosed',
  'Currently in treatment',
  'Treatment completed',
  'Relapsed/Refractory',
];

const PHASES = ['I', 'II', 'III', 'IV'] as const;
const STATUSES = ['Recruiting', 'Active, not recruiting', 'Enrolling by invitation'] as const;
const SPONSOR_TYPES = ['Industry', 'NIH', 'Academic'] as const;

type Phase = typeof PHASES[number];
type TrialStatus = typeof STATUSES[number];
type SponsorType = typeof SPONSOR_TYPES[number];

// ── Helpers ────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: TrialStatus }) {
  const styles: Record<TrialStatus, string> = {
    'Recruiting': 'bg-accent/10 text-accent border-accent/20',
    'Active, not recruiting': 'bg-amber-50 text-amber-800 border-amber-200',
    'Enrolling by invitation': 'bg-primary/10 text-primary border-primary/20',
  };
  return (
    <span className={cn('inline-flex px-2.5 py-0.5 border rounded-full text-xs font-medium', styles[status])}>
      {status}
    </span>
  );
}

function PhaseBadge({ phase }: { phase: Phase }) {
  return (
    <span className="inline-flex px-2 py-0.5 bg-muted border border-border rounded-full text-xs font-semibold text-foreground">
      Phase {phase}
    </span>
  );
}

// ── Trial card ─────────────────────────────────────────────────────────────

function TrialCard({ trial, onSave }: { trial: typeof TRIALS[0]; onSave: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-background border border-border rounded-2xl p-5 space-y-4">
      {/* Header row */}
      <div className="flex flex-wrap items-start gap-2 justify-between">
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">{trial.nct}</span>
            <PhaseBadge phase={trial.phase} />
            <StatusBadge status={trial.status} />
          </div>
          <h3 className="text-sm font-semibold text-foreground leading-snug">{trial.title}</h3>
          <p className="text-xs text-muted-foreground">Sponsor: {trial.sponsor}</p>
        </div>
        <button
          onClick={onSave}
          className={cn(
            'flex-shrink-0 p-2 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            trial.saved
              ? 'bg-primary/10 border-primary/20 text-primary'
              : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground',
          )}
          aria-label={trial.saved ? 'Unsave trial' : 'Save trial'}
        >
          <Bookmark className={cn('w-4 h-4', trial.saved ? 'fill-primary' : '')} />
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground">{trial.description}</p>

      {/* Expanded details */}
      {expanded && (
        <div className="space-y-4 pt-2 border-t border-border">
          {/* Eligibility */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Key eligibility criteria</p>
            <ul className="space-y-1.5">
              {trial.eligibility.map((crit, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <div className={cn('w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0', crit.toLowerCase().startsWith('exclude') ? 'bg-destructive' : 'bg-accent')} />
                  {crit}
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Locations</p>
            <div className="flex flex-wrap gap-2">
              {trial.locations.map(loc => (
                <span key={loc} className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" /> {loc}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trial coordinator</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-foreground">
              <span className="font-medium">{trial.coordinator.name}</span>
              <a
                href={`mailto:${trial.coordinator.email}`}
                className="flex items-center gap-1 text-primary text-xs hover:underline"
              >
                <Mail className="w-3 h-3" /> {trial.coordinator.email}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          onClick={() => setExpanded(v => !v)}
          className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline focus-visible:outline-none"
        >
          {expanded ? 'Show less' : 'View full details'}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <a
          href={`https://clinicaltrials.gov/study/${trial.nct}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground border border-border px-3 py-1.5 rounded-full hover:border-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          ClinicalTrials.gov <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

// ── Filter sidebar ─────────────────────────────────────────────────────────

interface Filters {
  phases: Phase[];
  statuses: TrialStatus[];
  sponsorTypes: SponsorType[];
}

function FilterSidebar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  function togglePhase(p: Phase) {
    const next = filters.phases.includes(p)
      ? filters.phases.filter(x => x !== p)
      : [...filters.phases, p];
    onChange({ ...filters, phases: next });
  }
  function toggleStatus(s: TrialStatus) {
    const next = filters.statuses.includes(s)
      ? filters.statuses.filter(x => x !== s)
      : [...filters.statuses, s];
    onChange({ ...filters, statuses: next });
  }
  function toggleSponsorType(t: SponsorType) {
    const next = filters.sponsorTypes.includes(t)
      ? filters.sponsorTypes.filter(x => x !== t)
      : [...filters.sponsorTypes, t];
    onChange({ ...filters, sponsorTypes: next });
  }

  return (
    <aside className="space-y-6">
      {/* Phase */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground">Phase</p>
        {PHASES.map(p => (
          <label key={p} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.phases.includes(p)}
              onChange={() => togglePhase(p)}
              className="w-4 h-4 accent-primary rounded"
            />
            <span className="text-sm text-foreground">Phase {p}</span>
          </label>
        ))}
      </div>

      {/* Status */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground">Status</p>
        {STATUSES.map(s => (
          <label key={s} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.statuses.includes(s)}
              onChange={() => toggleStatus(s)}
              className="w-4 h-4 accent-primary rounded"
            />
            <span className="text-sm text-foreground">{s}</span>
          </label>
        ))}
      </div>

      {/* Distance (mock slider) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Distance</p>
          <span className="text-xs text-muted-foreground">≤ 50 mi</span>
        </div>
        <input
          type="range"
          min={10}
          max={500}
          defaultValue={50}
          step={10}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>10 mi</span>
          <span>500 mi</span>
        </div>
      </div>

      {/* Sponsor type */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground">Sponsor type</p>
        {SPONSOR_TYPES.map(t => (
          <label key={t} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.sponsorTypes.includes(t)}
              onChange={() => toggleSponsorType(t)}
              className="w-4 h-4 accent-primary rounded"
            />
            <span className="text-sm text-foreground">{t}</span>
          </label>
        ))}
      </div>
    </aside>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function ClinicalTrials() {
  const [diagnosis, setDiagnosis] = useState('');
  const [stage, setStage] = useState('');
  const [age, setAge] = useState('');
  const [zip, setZip] = useState('');
  const [filters, setFilters] = useState<Filters>({ phases: [], statuses: [], sponsorTypes: [] });
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  function toggleSaved(nct: string) {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(nct)) next.delete(nct);
      else next.add(nct);
      return next;
    });
  }

  // Apply filters
  const filteredTrials = TRIALS.filter(t => {
    if (filters.phases.length > 0 && !filters.phases.includes(t.phase)) return false;
    if (filters.statuses.length > 0 && !filters.statuses.includes(t.status)) return false;
    if (filters.sponsorTypes.length > 0 && !filters.sponsorTypes.includes(t.sponsorType)) return false;
    return true;
  });

  const activeFilterCount =
    filters.phases.length + filters.statuses.length + filters.sponsorTypes.length;

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/">
            <span className="font-display text-xl font-bold text-foreground cursor-pointer hover:opacity-80 transition-opacity">
              Brivon
            </span>
          </Link>
          <span className="text-border">|</span>
          <span className="text-sm text-muted-foreground">Clinical Trial Finder</span>
        </div>
      </header>

      {/* Search form */}
      <div className="bg-muted/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-balance">Find clinical trials</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Search thousands of active trials matched to your diagnosis and location. All trials are sourced from ClinicalTrials.gov and updated weekly.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Diagnosis or condition"
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <select
              value={stage}
              onChange={e => setStage(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Treatment stage</option>
              {TREATMENT_STAGES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={e => setAge(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <input
                type="text"
                placeholder="ZIP code"
                value={zip}
                onChange={e => setZip(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring flex items-center justify-center gap-2">
              <Search className="w-4 h-4" /> Find trials
            </button>
          </div>
        </div>
      </div>

      {/* Results area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Filter sidebar — desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 bg-background border border-border rounded-2xl p-5">
              <p className="font-semibold text-sm text-foreground mb-4">Filters</p>
              <FilterSidebar filters={filters} onChange={setFilters} />
            </div>
          </aside>

          {/* Main results */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Results header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {filteredTrials.length} trial{filteredTrials.length !== 1 ? 's' : ''} found
                </p>
                {activeFilterCount > 0 && (
                  <p className="text-xs text-muted-foreground">{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active</p>
                )}
              </div>

              {/* Mobile filter toggle */}
              <button
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 border border-border rounded-full text-sm font-medium text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setShowFilters(true)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground rounded-full text-[10px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Trial cards */}
            {filteredTrials.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-sm">
                No trials match the selected filters. Try removing some filters.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTrials.map(trial => (
                  <TrialCard
                    key={trial.nct}
                    trial={{ ...trial, saved: savedIds.has(trial.nct) }}
                    onSave={() => toggleSaved(trial.nct)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setShowFilters(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-80 bg-background border-l border-border p-5 overflow-y-auto lg:hidden">
            <div className="flex items-center justify-between mb-6">
              <p className="font-semibold text-foreground">Filters</p>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <FilterSidebar filters={filters} onChange={setFilters} />
            <div className="mt-8 pt-4 border-t border-border">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-primary text-primary-foreground px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Show {filteredTrials.length} result{filteredTrials.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
