import { useState, type ReactNode } from 'react';
import { Link, useParams } from 'wouter';
import {
  ArrowLeft,
  ArrowRight,
  Star,
  CheckCircle,
  Shield,
  ShieldCheck,
  Clock,
  MessageCircle,
  Video,
  Calendar,
  BadgeCheck,
  HelpCircle,
  TrendingUp,
  MapPin,
  Languages,
  Briefcase,
  GraduationCap,
  FileCheck,
  Handshake,
  XCircle,
  ChevronDown,
  AlertCircle,
  RefreshCw,
  Lock,
  ExternalLink,
  Scale,
  BookOpen,
  FileText,
  Quote,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const advocatesData: Record<string, any> = {
  '1': {
    id: 1,
    name: 'Dr. Sarah Mitchell',
    title: 'Your oncologist won\'t tell you what treatment actually costs. Sarah will — 22 years in oncology, entirely on your side.',
    price: 150,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    rating: 5.0,
    reviews: 248,
    specialty: 'Cancer Care',
    location: 'Boston, MA',
    languages: ['English', 'Spanish'],
    responseTime: 'Usually responds within 2 hours',
    credentials: [
      { type: 'certification', label: 'Board Certified Patient Advocate (BCPA)', verified: true, certNumber: 'BCPA-2891', expiry: 'March 2027', issuer: 'Patient Advocate Certification Board' },
      { type: 'education', label: 'RN, MSN — Johns Hopkins School of Nursing', verified: true, certNumber: 'MA-RN-0048221', expiry: 'January 2027', issuer: 'Massachusetts Board of Registration in Nursing' },
      { type: 'experience', label: '22 years oncology nursing experience', verified: false },
    ],
    pullQuote: "I became an advocate because I believe everyone deserves a champion in their corner—someone who listens, explains, and stands beside you when the path feels uncertain.",
    about: [
      {
        heading: 'My background',
        text: 'After 22 years as an oncology nurse at Dana-Farber Cancer Institute, I know firsthand how overwhelming a cancer diagnosis can be. The medical system moves fast, the terminology is confusing, and you\'re making life-changing decisions while processing the hardest news of your life.',
      },
      {
        heading: 'How I work',
        text: 'I attend appointments, ask the questions you didn\'t know to ask, coordinate between your specialists, and make sure you understand every option before making decisions.',
      },
      {
        heading: 'My promise',
        text: 'You\'re not just a patient number—you\'re a person with a story, and I\'m here to make sure your voice is heard loud and clear.',
      },
    ],
    whatToExpect: [
      'A brief questionnaire so I can understand your story before we meet',
      'A video call where we talk through your situation—at your pace, in your words',
      'A clear, written summary of your options and recommended next steps',
      'Help preparing the right questions for your medical team',
      '7 days of follow-up messaging—because questions don\'t stop when the call ends',
    ],
    stats: {
      patientsHelped: 1250,
      avgRating: 5.0,
      responseRate: 98,
      yearsExperience: 22,
    },
    availability: {
      nextAvailable: 'Tomorrow',
      slots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
    },
    reviewsList: [
      {
        id: 1,
        name: 'Jennifer M.',
        date: 'November 2025',
        rating: 5,
        text: 'Sarah was a lifeline during my breast cancer diagnosis. She helped me understand my pathology report, connected me with a clinical trial I never would have found, and sat with me during my most difficult appointments. Worth every penny.',
        condition: 'Breast Cancer',
        verified: true,
      },
      {
        id: 2,
        name: 'Michael R.',
        date: 'October 2025',
        rating: 5,
        text: 'When my dad was diagnosed with lung cancer, we were lost. Sarah helped us get a second opinion at Memorial Sloan Kettering and caught a staging error that changed his treatment plan. She literally saved his life.',
        condition: 'Lung Cancer',
        verified: true,
      },
      {
        id: 3,
        name: 'Amanda K.',
        date: 'September 2025',
        rating: 5,
        text: 'Finally someone who actually listens and explains things in plain English. Sarah helped me navigate insurance denials and got my immunotherapy approved after two rejections. She knows how to work the system.',
        condition: 'Lymphoma',
        verified: true,
      },
      {
        id: 4,
        name: 'David L.',
        date: 'August 2025',
        rating: 4,
        text: 'Sarah was very knowledgeable and helped me understand my options. The only reason I\'m giving 4 stars is scheduling was a bit tricky due to her popularity. Once we connected, the experience was excellent.',
        condition: 'Prostate Cancer',
        verified: true,
      },
    ],
    outcomeStats: {
      appealsApproved: { value: '87%', label: 'Insurance appeals approved' },
      avgTimeSaved: { value: '12 hrs', label: 'Avg. time saved per patient' },
      secondOpinions: { value: '156', label: 'Second opinions coordinated' },
    },
    caseStudy: {
      patient: 'Maria, 55',
      condition: 'Stage III Colorectal Cancer',
      challenge: 'Diagnosed at a community hospital with limited oncology resources. Insurance denied PET scan and second opinion at a cancer center.',
      timeline: [
        { day: 'Day 1', title: 'Free intro call', description: 'Reviewed Maria\'s pathology report and identified that her case qualified for a National Cancer Institute-designated center referral.' },
        { day: 'Day 3', title: 'Action plan created', description: 'Drafted appeal for PET scan denial using medical necessity criteria. Contacted Dana-Farber\'s patient access team directly.' },
        { day: 'Day 12', title: 'Insurance appeal won', description: 'PET scan approved. Second opinion revealed a clinical trial Maria qualified for—not available at her original hospital.' },
        { day: 'Day 21', title: 'Treatment started', description: 'Maria began clinical trial at Dana-Farber. Applied for and received $8,400 in travel assistance through hospital charity program.' },
      ],
      outcome: 'Maria\'s treatment plan changed completely based on the second opinion. She\'s now 14 months into a clinical trial with excellent response.',
      savedAmount: '$14,800',
      advocacyCost: '$450 (3 sessions)',
    },
    fit: {
      bestFor: [
        'Make sense of new or complex diagnoses',
        'Coordinate between multiple specialists',
        'Understand treatment options and trade-offs',
        'Fight insurance denials and appeals',
        'Attend appointments and take notes',
      ],
      boundaries: [
        'Give medical advice or recommend treatments',
        'Replace your medical team',
        'Handle legal malpractice cases',
        'Make decisions for you',
      ],
    },
    faq: [
      {
        question: 'Do you attend appointments with me?',
        answer: 'Yes! I can join virtually or in-person (within Boston metro area). I take notes, ask questions you might not think of, and help you process everything afterward.'
      },
      {
        question: 'How quickly can we start working together?',
        answer: 'Usually within 48 hours. After our intro call, I\'ll send an intake questionnaire, review your medical records, and schedule our first strategy session.'
      },
      {
        question: 'Do you communicate with my doctors directly?',
        answer: 'With your written permission, absolutely. I can call your care team, clarify treatment plans, and coordinate between specialists on your behalf.'
      },
      {
        question: 'What if I can\'t afford your full rate?',
        answer: 'I keep 2-3 sliding scale spots open each month for patients with financial hardship. Let\'s talk about it on our intro call—I\'ll be honest about what I can offer.'
      },
    ],
    vetting: {
      onPlatformSince: 'April 2024',
      lastReVerification: 'January 2026',
      complaintsReceived: 0,
    },
    continuingEducation: {
      lastCompleted: 'December 2025',
      hours: 24,
      topic: 'Oncology Treatment Advances & Insurance Policy Updates',
    },
    eoInsurance: {
      carrier: 'HPSO Professional Liability',
      coverageAmount: '$1M / $3M',
      verified: true,
    },
    verificationLinks: {
      bcpa: 'https://pacboard.org/verify',
      nursingLicense: 'https://www.mass.gov/orgs/board-of-registration-in-nursing',
    },
    verifiedOutcomes: [
      {
        id: 1,
        patient: 'Jennifer M.',
        condition: 'Breast Cancer',
        date: 'November 2025',
        rating: 5,
        text: 'Sarah helped me understand my pathology report, connected me with a clinical trial I never would have found, and sat with me during my most difficult appointments. Worth every penny.',
        outcome: 'Clinical trial secured at Dana-Farber',
        savedAmount: '$14,800',
      },
      {
        id: 2,
        patient: 'Michael R.',
        condition: 'Lung Cancer',
        date: 'October 2025',
        rating: 5,
        text: 'When my dad was diagnosed, we were lost. Sarah got us a second opinion at Memorial Sloan Kettering and caught a staging error that changed his treatment plan completely.',
        outcome: 'Staging error corrected, treatment changed',
        savedAmount: '$22,100',
      },
      {
        id: 3,
        patient: 'Amanda K.',
        condition: 'Lymphoma',
        date: 'September 2025',
        rating: 5,
        text: 'Sarah helped me fight insurance denials and got my immunotherapy approved after two rejections. She knows how to work the system.',
        outcome: '2 denials overturned, treatment approved',
        savedAmount: '$9,400',
      },
      {
        id: 4,
        patient: 'David L.',
        condition: 'Prostate Cancer',
        date: 'August 2025',
        rating: 4,
        text: 'Very knowledgeable and helped me understand my options. Scheduling was tricky due to her popularity, but once connected the experience was excellent.',
        outcome: 'Second opinion coordinated, treatment plan optimized',
        savedAmount: '$6,200',
      },
      {
        id: 5,
        patient: 'Christine B.',
        condition: 'Breast Cancer',
        date: 'July 2025',
        rating: 5,
        text: 'Sarah caught a billing error in my EOBs worth over $3,000 and negotiated a payment plan I could actually afford. She also found a patient assistance program that covered my co-pays.',
        outcome: 'Billing error corrected, assistance program secured',
        savedAmount: '$8,300',
      },
      {
        id: 6,
        patient: 'Thomas W.',
        condition: 'Lung Cancer',
        date: 'June 2025',
        rating: 5,
        text: 'My dad\'s oncologist was moving too fast. Sarah slowed everything down, got us a second opinion, and made sure we understood every option before making any decisions.',
        outcome: 'Second opinion secured, clinical trial identified',
        savedAmount: '$31,500',
      },
    ],
  },
};

const advocateImages: Record<string, string> = {
  '1':  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
  '2':  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
  '3':  'https://images.unsplash.com/photo-1622253694242-abeb37a33e97?w=400&h=400&fit=crop&crop=face',
  '4':  'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face',
  '5':  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
  '6':  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&crop=face',
  '7':  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face',
  '8':  'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=400&h=400&fit=crop&crop=face',
  '9':  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
  '10': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
  '11': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
  '12': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
};

const defaultAdvocate = advocatesData['1'];

// Pill — the shared verified-badge style used across the profile.
function Pill({ icon: Icon, children }: { icon: any; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-card border border-primary/20 px-2.5 py-1 text-xs font-semibold text-primary">
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      {children}
    </span>
  );
}

const credentialIcon = (type: string) =>
  type === 'certification' ? BadgeCheck : type === 'education' ? GraduationCap : Briefcase;

export default function AdvocateDetail() {
  const params = useParams();
  const advocateId = params.id || '1';
  const advocate = {
    ...(advocatesData[advocateId] || defaultAdvocate),
    image: advocateImages[advocateId] ?? (advocatesData[advocateId] || defaultAdvocate).image,
  };

  const [selectedOption, setSelectedOption] = useState<'intro' | 'consultation'>('consultation');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [outcomeCondition, setOutcomeCondition] = useState<string>('All');

  const conditions = ['All', ...Array.from(new Set<string>(advocate.verifiedOutcomes.map((o: any) => o.condition as string)))];
  const filteredOutcomes = outcomeCondition === 'All'
    ? advocate.verifiedOutcomes
    : advocate.verifiedOutcomes.filter((o: any) => o.condition === outcomeCondition);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to advocates</span>
            </button>
          </Link>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Lock className="w-3.5 h-3.5" />
            <span>HIPAA compliant</span>
            <span className="text-border">|</span>
            <Shield className="w-3.5 h-3.5" />
            <span>100% money-back guarantee</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 pb-28 lg:pb-8">
        {/* ── Warm editorial hero ───────────────────────────── */}
        <div className="relative bg-gradient-to-br from-primary/[0.10] via-primary/[0.05] to-card rounded-3xl border border-border px-6 sm:px-10 pt-10 pb-8 mb-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <img
              src={advocate.image}
              alt={advocate.name}
              loading="lazy"
              decoding="async"
              className="w-32 h-32 rounded-full object-cover outline outline-1 -outline-offset-1 outline-black/10 ring-4 ring-card shadow-sm flex-shrink-0"
            />
            <div className="text-center sm:text-left hero-entrance">
              <Pill icon={ShieldCheck}>Verified advocate</Pill>
              <h1 className="font-display text-4xl sm:text-5xl leading-[1.04] text-foreground text-balance mt-3" data-testid="text-advocate-name">
                {advocate.name}
              </h1>
              <p className="text-muted-foreground mt-1.5">{advocate.specialty} · {advocate.stats.yearsExperience} years on your side</p>

              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-sm">
                <span className="inline-flex items-center gap-1 font-semibold text-foreground" aria-label={`${advocate.rating} out of 5 stars, ${advocate.reviews} reviews`}>
                  <Star className="w-4 h-4 fill-primary text-primary" aria-hidden="true" />
                  <span className="tabular-nums">{advocate.rating}</span>
                  <span className="text-muted-foreground font-normal">({advocate.reviews} reviews)</span>
                </span>
                <span className="text-border">|</span>
                <span className="inline-flex items-center gap-1 text-muted-foreground"><MapPin className="w-4 h-4" />{advocate.location}</span>
                <span className="text-border">|</span>
                <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="w-4 h-4" />{advocate.responseTime}</span>
                <span className="text-border">|</span>
                <span className="inline-flex items-center gap-1 text-muted-foreground"><Languages className="w-4 h-4" />{advocate.languages.join(', ')}</span>
              </div>

              {/* Trust bar — pills aligned to the name */}
              <div className="mt-5 flex flex-wrap justify-center sm:justify-start gap-2">
                <Pill icon={BadgeCheck}>BCPA verified</Pill>
                <Pill icon={GraduationCap}>Licensed RN, MSN</Pill>
                <Pill icon={ShieldCheck}>E&O insured</Pill>
                <Pill icon={CheckCircle}>{advocate.vetting?.complaintsReceived} complaints since {advocate.vetting?.onPlatformSince}</Pill>
                <Pill icon={TrendingUp}>{advocate.stats.patientsHelped.toLocaleString()}+ patients helped</Pill>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-14">

            {/* About */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-5">About me</h2>

              {/* Pull quote — centered tinted card */}
              <figure className="rounded-2xl bg-primary/5 border border-primary/15 px-6 py-8 text-center mb-6">
                <Quote className="w-7 h-7 text-primary/40 mx-auto" />
                <blockquote className="font-display text-2xl leading-snug text-foreground text-balance mt-2">
                  {advocate.pullQuote}
                </blockquote>
              </figure>

              {/* Structured blocks */}
              <div className="space-y-5 max-w-prose">
                {advocate.about.map((block: any, idx: number) => (
                  <p key={idx} className="text-[15px] text-muted-foreground leading-relaxed text-pretty">
                    <span className="font-semibold text-foreground">{block.heading}. </span>
                    {block.text}
                  </p>
                ))}
              </div>
            </section>

            {/* What happens after you book */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                What happens after you book
              </h2>
              <div>
                {[
                  { title: 'Engagement agreement + HIPAA authorization', text: 'You\'ll receive a clear written agreement defining scope, fees, and duration — plus a HIPAA authorization form so I can communicate with your providers on your behalf. You control exactly who I can contact.' },
                  { title: 'Intake questionnaire + document review', text: 'A brief questionnaire so I understand your story before we meet. Upload any documents you have — I\'ll review everything before our first call so we don\'t waste a minute.' },
                  { title: 'Our session (video, phone, or in-person)', text: 'We talk through your situation at your pace. I\'ll explain options and start building your action plan.' },
                  { title: 'Written summary + 7 days of follow-up (included)', text: 'Clear action plan within 24 hours. Message me anytime for 7 days after.', done: true },
                ].map((step, i, arr) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                        step.done ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'
                      )}>
                        {step.done ? <CheckCircle className="w-4 h-4" /> : i + 1}
                      </div>
                      {i < arr.length - 1 && <div className="w-px flex-1 bg-border my-1" />}
                    </div>
                    <div className="pb-5">
                      <p className="text-sm font-semibold text-foreground">{step.title}</p>
                      <p className="text-base text-muted-foreground text-pretty">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Not satisfied? Full refund within 7 days, no questions asked. <a href="#" className="underline hover:text-foreground transition-colors">View refund policy</a>.</p>
            </section>

            {/* Verified credentials */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Verified credentials
              </h2>
              <div className="space-y-2 mb-4">
                {advocate.credentials.map((cred: any, idx: number) => {
                  const Icon = credentialIcon(cred.type);
                  return cred.verified ? (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/15 rounded-xl">
                      <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{cred.label}</span>
                          <Pill icon={ShieldCheck}>Verified by Brivon</Pill>
                        </div>
                        {(cred.certNumber || cred.expiry) && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {cred.certNumber && <span>{cred.certNumber}</span>}
                            {cred.certNumber && cred.expiry && <span className="mx-1.5">·</span>}
                            {cred.expiry && <span>Expires {cred.expiry}</span>}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div key={idx} className="flex items-center gap-3 px-4 py-3 bg-muted border border-border rounded-xl">
                      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-foreground/70">{cred.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-muted border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-xs font-semibold text-foreground/80">Verify independently</p>
                  </div>
                  <div className="space-y-1">
                    {advocate.verificationLinks?.bcpa && (
                      <a href={advocate.verificationLinks.bcpa} target="_blank" rel="noopener noreferrer" className="block text-xs text-muted-foreground hover:text-foreground transition-colors underline">PACB certification lookup</a>
                    )}
                    {advocate.verificationLinks?.nursingLicense && (
                      <a href={advocate.verificationLinks.nursingLicense} target="_blank" rel="noopener noreferrer" className="block text-xs text-muted-foreground hover:text-foreground transition-colors underline">MA nursing license board</a>
                    )}
                  </div>
                </div>
                {advocate.continuingEducation && (
                  <div className="p-3 bg-muted border border-border rounded-lg">
                    <div className="flex items-center gap-2 mb-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                      <p className="text-xs font-semibold text-foreground/80">Continuing education</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{advocate.continuingEducation.hours} hours completed ({advocate.continuingEducation.lastCompleted})</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{advocate.continuingEducation.topic}</p>
                  </div>
                )}
                {advocate.eoInsurance && (
                  <div className="p-3 bg-muted border border-border rounded-lg">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                      <p className="text-xs font-semibold text-foreground/80">E&O insurance</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{advocate.eoInsurance.carrier}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Coverage: {advocate.eoInsurance.coverageAmount}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Results */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Results
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.values(advocate.outcomeStats).map((stat: any, idx: number) => (
                  <div key={idx} className="p-4 bg-primary/5 border border-primary/15 rounded-2xl text-center">
                    <div className="font-display text-2xl sm:text-3xl text-foreground tabular-nums">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1 leading-tight">{stat.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-3 text-pretty">Stats are self-reported by the advocate and audited by Brivon quarterly. 13% of insurance appeals were denied on final review — not every case can be won, and I'll tell you upfront if yours is unlikely to succeed.</p>
            </section>

            {/* Verified Outcomes */}
            {advocate.verifiedOutcomes && (
              <section>
                <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                  <h2 className="font-display text-2xl text-foreground flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Verified outcomes
                  </h2>
                  <Pill icon={ShieldCheck}>Brivon-audited quarterly</Pill>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Real results from verified patients. Identities anonymized with written consent.
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {conditions.map((c: string) => (
                    <button
                      key={c}
                      onClick={() => setOutcomeCondition(c)}
                      aria-pressed={outcomeCondition === c}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        outcomeCondition === c
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'bg-muted text-muted-foreground hover:bg-muted/70'
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredOutcomes.map((outcome: any) => (
                    <div key={outcome.id} className="bg-background border border-border rounded-2xl p-5 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm flex-shrink-0">
                          {outcome.patient.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-sm text-foreground">{outcome.patient}</span>
                            <Pill icon={CheckCircle}>Verified</Pill>
                          </div>
                          <div className="text-xs text-muted-foreground">{outcome.condition} · {outcome.date}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5" role="img" aria-label={`${outcome.rating} out of 5 stars`}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn('w-3.5 h-3.5', i < outcome.rating ? 'fill-primary text-primary' : 'fill-muted text-muted')} aria-hidden="true" />
                        ))}
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed italic">"{outcome.text}"</p>

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-1.5 text-xs text-foreground/80">
                          <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span className="font-medium">{outcome.outcome}</span>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <div className="text-xs text-muted-foreground">Saved</div>
                          <div className="text-sm font-bold text-foreground tabular-nums">{outcome.savedAmount}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* What I handle / Outside my scope */}
            <section className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="font-display text-xl text-foreground mb-3 flex items-center gap-2">
                    <Handshake className="w-5 h-5 text-primary" />
                    I'll handle this for you
                  </h2>
                  <div className="space-y-2">
                    {advocate.fit?.bestFor?.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-display text-xl text-foreground mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    Outside my scope
                  </h2>
                  <div className="space-y-2">
                    {advocate.fit?.boundaries?.map((boundary: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-muted-foreground">
                        <XCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{boundary}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground/80 text-pretty">Advocacy is powerful—but it's not magic. I can navigate, negotiate, and fight for you, but I can't guarantee specific medical outcomes or legal results. I'll always be upfront about what's realistic.</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-muted border border-border rounded-xl">
                <Scale className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground/80 mb-1">Conflict of interest disclosure</p>
                  <p className="text-sm text-muted-foreground text-pretty">I do not receive referral fees, commissions, or incentives from any provider, specialist, hospital, or clinical trial I recommend. Every recommendation is based solely on what I believe is best for you. <a href="#" className="underline hover:text-foreground transition-colors">Read Brivon's conflict of interest policy</a>.</p>
                </div>
              </div>
            </section>

            {/* Case Study */}
            {advocate.caseStudy && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-primary" />
                  Case walkthrough (anonymized)
                </h2>
                <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6">
                  <div className="flex items-start gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-muted-foreground">{advocate.caseStudy.patient.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{advocate.caseStudy.patient} — {advocate.caseStudy.condition}</p>
                      <p className="text-sm text-muted-foreground text-pretty">{advocate.caseStudy.challenge}</p>
                    </div>
                  </div>

                  <div>
                    {advocate.caseStudy.timeline.map((step: any, idx: number) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                            idx === advocate.caseStudy.timeline.length - 1
                              ? 'bg-accent text-accent-foreground'
                              : 'bg-primary text-primary-foreground'
                          )}>
                            {idx === advocate.caseStudy.timeline.length - 1
                              ? <CheckCircle className="w-3.5 h-3.5" />
                              : step.day.replace('Day ', '')}
                          </div>
                          {idx < advocate.caseStudy.timeline.length - 1 && (
                            <div className="w-px flex-1 bg-border my-1" />
                          )}
                        </div>
                        <div className="pb-5">
                          <p className="text-sm font-semibold text-foreground">{step.day} — {step.title}</p>
                          <p className="text-sm text-muted-foreground text-pretty">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 pt-4 border-t border-primary/15 flex items-center justify-between flex-wrap gap-2">
                    <p className="text-lg font-bold text-foreground">
                      Patient saved: <span className="text-primary tabular-nums">{advocate.caseStudy.savedAmount}</span>
                    </p>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Cost of advocacy</p>
                      <p className="text-sm font-semibold text-foreground/80">{advocate.caseStudy.advocacyCost}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* FAQ */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                Frequently asked questions
              </h2>
              <div className="divide-y divide-border border-t border-border">
                {advocate.faq?.map((item: any, idx: number) => (
                  <div key={idx}>
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      aria-expanded={expandedFaq === idx}
                      aria-controls={`faq-panel-${idx}`}
                      className="w-full flex items-center justify-between py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                    >
                      <h3 className="font-semibold text-foreground pr-4">{item.question}</h3>
                      <ChevronDown className={cn('w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform', expandedFaq === idx && 'rotate-180')} />
                    </button>
                    {expandedFaq === idx && (
                      <p id={`faq-panel-${idx}`} className="text-base text-muted-foreground pb-4 text-pretty">{item.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section id="reviews">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1 font-display text-2xl text-foreground">
                  <Star className="w-6 h-6 fill-primary text-primary" />
                  {advocate.rating}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-lg text-muted-foreground">{advocate.reviews} reviews</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mb-6 pb-6 border-b border-border">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-primary" />
                  All reviews are from verified patients who completed at least one session through Brivon.
                </span>
                <a href="#" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors underline">
                  Also read reviews on Trustpilot <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {advocate.reviewsList.map((review: any) => (
                  <div key={review.id} className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-foreground">{review.name}</span>
                          {review.verified && <Pill icon={CheckCircle}>Verified</Pill>}
                        </div>
                        <div className="text-sm text-muted-foreground">{review.condition} · {review.date}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5" role="img" aria-label={`${review.rating} out of 5 stars`}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn('w-3 h-3', i < review.rating ? 'fill-primary text-primary' : 'fill-muted text-muted')} aria-hidden="true" />
                      ))}
                    </div>

                    <p className="text-base text-muted-foreground leading-relaxed text-pretty">{review.text}</p>
                  </div>
                ))}
              </div>

              <button
                className="mt-8 px-6 py-3 border border-border rounded-xl font-semibold text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                data-testid="button-show-all-reviews"
              >
                Show all {advocate.reviews} reviews
              </button>
            </section>

          </div>

          {/* Booking Sidebar — desktop only */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-card border border-border rounded-2xl p-5 shadow-lg space-y-3">
              <button
                onClick={() => setSelectedOption('intro')}
                data-selected={selectedOption === 'intro'}
                className={cn(
                  'w-full p-4 rounded-xl border-2 text-left cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  selectedOption === 'intro' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                )}
                data-testid="option-intro-call"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Intro call</span>
                  <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">Free</span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">30 min to tell me what's going on</p>
              </button>

              <button
                onClick={() => setSelectedOption('consultation')}
                data-selected={selectedOption === 'consultation'}
                className={cn(
                  'w-full p-4 rounded-xl border-2 text-left cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  selectedOption === 'consultation' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                )}
                data-testid="option-consultation"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Full consultation</span>
                  <span className="font-semibold text-foreground tabular-nums">${advocate.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">60 min + written plan + 7 days follow-up</p>
              </button>

              <div className="rounded-xl bg-muted/50 px-3 py-2.5">
                <div className="text-xs text-muted-foreground">Next available</div>
                <div className="text-sm font-semibold text-foreground">{advocate.availability.nextAvailable}</div>
              </div>

              <button
                className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 font-semibold inline-flex items-center justify-center gap-2 transition-transform active:scale-[0.98] hover:bg-primary/90"
                data-testid="button-book-now"
              >
                {selectedOption === 'intro' ? 'Schedule free intro call' : `Book for $${advocate.price}`}
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-xs text-muted-foreground">
                {selectedOption === 'intro' ? 'No payment required' : "You won't be charged until after your session"} · HSA / FSA eligible
              </p>

              <div className="pt-4 border-t border-border space-y-2.5">
                {[
                  { icon: RefreshCw, t: '100% money-back guarantee (7 days)' },
                  { icon: FileText, t: 'Written engagement agreement upfront' },
                  { icon: Lock, t: 'HIPAA compliant & end-to-end encrypted' },
                  { icon: Shield, t: 'E&O (malpractice) insured' },
                  { icon: Video, t: 'Private, secure video calls' },
                  { icon: MessageCircle, t: '7 days of follow-up included' },
                ].map(({ icon: Icon, t }) => (
                  <div key={t} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground text-center text-pretty">Financial hardship? Ask about sliding scale pricing during your free intro call.</p>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Sticky mobile booking CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div className="flex-shrink-0">
            <p className="text-xs text-muted-foreground">From</p>
            <p className="text-lg font-bold text-foreground">${advocate.price}<span className="text-sm font-normal text-muted-foreground"> / session</span></p>
          </div>
          <div className="flex gap-2">
            <button
              aria-label="Schedule free intro call"
              className="border border-border text-foreground/80 px-4 py-2.5 text-sm font-semibold rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Free intro
            </button>
            <button
              aria-label={`Book full consultation for $${advocate.price}`}
              className="bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Book now
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
            <a href="#" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Code of ethics</a>
            <span className="text-border">·</span>
            <a href="#" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Complaint process</a>
            <span className="text-border">·</span>
            <a href="#" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Privacy policy</a>
            <span className="text-border">·</span>
            <a href="#" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Terms</a>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Brivon, Inc. · Advocacy services do not constitute legal or medical advice.</p>
        </div>
      </footer>
    </div>
  );
}
