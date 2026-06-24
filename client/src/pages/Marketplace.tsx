import { useState, useMemo, useEffect } from 'react';
import { Link } from 'wouter';
import {
  CheckCircle, Star, ShieldCheck, Clock,
  RefreshCw, Lock, Zap, Building2, Shield, AlertTriangle,
  ExternalLink, FileText, Scale, TrendingUp, ChevronDown,
  ArrowUpDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { HalfCircleCaregivers } from '@/components/HalfCircleCaregivers';

const advocates = [
  {
    id: 1,
    name: 'Dr. Sarah Mitchell',
    title: 'Your oncologist won\'t tell you what treatment actually costs. Sarah will—and she\'ll show you how the system marks up every scan, every drug, every "facility fee."',
    price: 150,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    rating: 5.0,
    reviews: 248,
    specialty: 'Cancer Care',
    responseTime: '< 2 hrs',
    responseMinutes: 120,
    nextAvailable: 'Tomorrow',
    avgSaved: '$14,200',
  },
  {
    id: 2,
    name: 'Maria Rodriguez',
    title: 'Hablas español? Your insurance company is counting on the language barrier to deny your claim. Maria speaks both languages—and the language of appeals that win.',
    price: 95,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
    rating: 4.9,
    reviews: 187,
    specialty: 'Insurance & Billing',
    responseTime: '< 4 hrs',
    responseMinutes: 240,
    nextAvailable: 'Today',
    avgSaved: '$8,600',
  },
  {
    id: 3,
    name: 'James Chen',
    title: 'Most advocates won\'t tell you when your case is weak. James will—because he\'d rather save you $5K in legal fees than string you along. Former healthcare attorney, now on your side.',
    price: 200,
    image: 'https://images.unsplash.com/photo-1622253694242-abeb37a33e97?w=400&h=400&fit=crop&crop=face',
    rating: 5.0,
    reviews: 156,
    specialty: 'Patient Rights',
    responseTime: '< 3 hrs',
    responseMinutes: 180,
    nextAvailable: 'Tomorrow',
    avgSaved: '$22,500',
  },
  {
    id: 4,
    name: 'Dr. Emily Watson',
    title: 'Nobody talks about what it does to YOU—the parent. The guilt, the second-guessing, the 2am spirals. Emily fights the system so you can just be Mom or Dad.',
    price: 175,
    image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face',
    rating: 4.8,
    reviews: 134,
    specialty: 'Pediatric Care',
    responseTime: '< 2 hrs',
    responseMinutes: 120,
    nextAvailable: 'Today',
    avgSaved: '$6,800',
  },
  {
    id: 5,
    name: 'Robert Thompson',
    title: 'Former hospital insider. He knows how the system works—and makes sure it works for you.',
    price: 125,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    rating: 5.0,
    reviews: 198,
    specialty: 'Hospital Navigation',
    responseTime: '< 1 hr',
    responseMinutes: 60,
    nextAvailable: 'Today',
    avgSaved: '$11,300',
  },
  {
    id: 6,
    name: 'Lisa Park',
    title: 'Insurers deny mental health claims at twice the rate of physical ones. Lisa disputes them — and wins.',
    price: 110,
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&crop=face',
    rating: 4.9,
    reviews: 167,
    specialty: 'Mental Health',
    responseTime: '< 3 hrs',
    responseMinutes: 180,
    nextAvailable: 'Tomorrow',
    avgSaved: '$4,200',
  },
  {
    id: 7,
    name: 'Michael Davis',
    title: 'The system is built for acute patients. Michael fights for everyone it wasn\'t.',
    price: 85,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face',
    rating: 4.7,
    reviews: 143,
    specialty: 'Chronic Illness',
    responseTime: '< 4 hrs',
    responseMinutes: 240,
    nextAvailable: 'In 2 days',
    avgSaved: '$3,900',
  },
  {
    id: 8,
    name: 'Angela Foster',
    title: 'No one tells families what Medicare covers until after the bill arrives. Angela does.',
    price: 140,
    image: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=400&h=400&fit=crop&crop=face',
    rating: 5.0,
    reviews: 212,
    specialty: 'Elder Care',
    responseTime: '< 2 hrs',
    responseMinutes: 120,
    nextAvailable: 'Today',
    avgSaved: '$9,700',
  },
  {
    id: 9,
    name: 'Dr. Kevin Patel',
    title: 'Emergency rooms bill from 4 separate providers. Most patients never know to dispute them. Kevin does.',
    price: 190,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
    rating: 4.9,
    reviews: 178,
    specialty: 'Emergency Care',
    responseTime: '< 30 min',
    responseMinutes: 30,
    nextAvailable: 'Now',
    avgSaved: '$7,100',
  },
  {
    id: 10,
    name: 'Susan Williams',
    title: 'Insurance companies hide the ball in the fine print. Susan reads every line — and fights for what you\'re owed.',
    price: 100,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    rating: 4.8,
    reviews: 156,
    specialty: 'Insurance & Billing',
    responseTime: '< 3 hrs',
    responseMinutes: 180,
    nextAvailable: 'Tomorrow',
    avgSaved: '$5,400',
  },
  {
    id: 11,
    name: 'David Kim',
    title: 'Insurance companies',

    price: 160,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    rating: 5.0,
    reviews: 234,
    specialty: 'Insurance & Billing',
    responseTime: '< 2 hrs',
    responseMinutes: 120,
    nextAvailable: 'Today',
    avgSaved: '$18,900',
  },
  {
    id: 12,
    name: 'Jennifer Moore',
    title: 'Rare disease patients wait an average of 4 years for a diagnosis. Jennifer cuts that down.',
    price: 160,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    rating: 4.9,
    reviews: 189,
    specialty: 'Rare Diseases',
    responseTime: '< 4 hrs',
    responseMinutes: 240,
    nextAvailable: 'Tomorrow',
    avgSaved: '$12,600',
  },
];

const specialties = ['All', ...Array.from(new Set(advocates.map(a => a.specialty)))];

const trustCards = [
  {
    icon: ShieldCheck,
    title: 'Rigorously vetted',
    summary: 'Only 12% of applicants pass. Background checks, credential verification, panel interviews, and a signed code of ethics.',
    details: [
      'All advocates carry E&O (malpractice) insurance',
      'Annual continuing education required',
      'Re-verified every 12 months',
    ],
    link: { text: 'Read our code of ethics', href: '#' },
  },
  {
    icon: RefreshCw,
    title: '100% money-back guarantee',
    summary: 'Full refund within 7 days, no questions asked. If your advocate drops the ball, we reassign you free.',
    details: [
      'Clear escalation path: email, phone, or live chat',
      'Avg. complaint resolution: 48 hours',
      'Independent review board for disputes',
    ],
    link: { text: 'Read our complaint process', href: '#' },
  },
  {
    icon: Lock,
    title: 'HIPAA compliant & encrypted',
    summary: 'End-to-end encryption. You control access. Request full data deletion anytime.',
    details: [
      'Signed BAA (Business Associate Agreement) on file',
      'SOC 2 Type II audited infrastructure',
      '72-hour breach notification policy',
    ],
    link: { text: 'Read our data policy', href: '#' },
  },
];

// Face crop coordinates: [cx, cy] as fractions of image width/height.
// 5 people in the park scene (left to right). cx/cy = face center.
const PARK_CROPS: Array<[number, number]> = [
  [0.15, 0.13], // man standing far left (near pole)
  [0.23, 0.25], // girl kicking ball
  [0.405, 0.38], // boy running center
  [0.76, 0.20], // woman right
  [0.83, 0.18], // man teal polo far right
];

function extractFaces(src: string): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const cropPx = iw * 0.07; //
      const urls = PARK_CROPS.map(([cx, cy]) => {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(
          img,
          cx * iw - cropPx / 2,
          cy * ih - cropPx / 2,
          cropPx, cropPx,
          0, 0, 200, 200,
        );
        return canvas.toDataURL('image/jpeg', 0.9);
      });
      resolve(urls);
    };
    img.onerror = () => resolve([]);
    img.src = src;
  });
}

export default function Marketplace() {
  const [activeSpecialty, setActiveSpecialty] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [expandedTrust, setExpandedTrust] = useState<number | null>(null);
  const [parkFaces, setParkFaces] = useState<string[]>([]);

  useEffect(() => {
    extractFaces('/park-scene.png').then(setParkFaces);
  }, []);

  const filteredAdvocates = useMemo(() => {
    let result = activeSpecialty === 'All'
      ? advocates
      : advocates.filter(a => a.specialty === activeSpecialty);

    switch (sortBy) {
      case 'price-low': return [...result].sort((a, b) => a.price - b.price);
      case 'price-high': return [...result].sort((a, b) => b.price - a.price);
      case 'rating': return [...result].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      case 'response': return [...result].sort((a, b) => a.responseMinutes - b.responseMinutes);
      default: return result;
    }
  }, [activeSpecialty, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-display text-foreground" data-testid="logo">Brivon</h1>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#advocates" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm" data-testid="nav-browse">Find an advocate</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm" data-testid="nav-how">How it works</a>
              <a href="#trust" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm">Why Brivon</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
          <a href="#login" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm">Log in</a>

          </div>
        </div>
      </header>
    {/* Caregiver arc — faces form a half-circle, title reveals */}
      <HalfCircleCaregivers
        heroImageSrc="/park-scene.png"
        headshotSrcs={parkFaces}
        headPositions={PARK_CROPS}
        heroTitle={
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4 leading-tight text-balance" data-testid="hero-title">
            This moment shouldn't cost you $40,000.
          </h2>
        }
        title="For the caregivers who do it all"
        subtitle="We connect you with verified advocates who know the system's tricks — and use them against it."
      >
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground mt-4 mb-6">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-muted-foreground" /> All advocates verified & background-checked</span>
          <span className="inline-flex items-center gap-1.5"><RefreshCw className="w-4 h-4 text-muted-foreground" /> 100% refund if we can't help</span>
          <span className="inline-flex items-center gap-1.5"><Lock className="w-4 h-4 text-muted-foreground" /> HIPAA compliant</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href="#advocates" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            Find your advocate
          </a>
          <a href="#how-it-works" className="border border-border text-foreground/80 px-6 py-3 rounded-full font-medium hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            Take the 2-min assessment
          </a>
        </div>
      </HalfCircleCaregivers>
      {/* How It Works */}
      <section id="how-it-works" className="bg-muted border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="text-center mb-10">
            <h3 className="font-display text-3xl text-foreground mb-3">From overwhelmed to in-control</h3>
            <p className="text-muted-foreground">Three steps. Clear guidance. Real accountability.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 steps-entrance">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-background border-2 border-border flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-foreground">1</span>
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">Tell us what's going on</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Browse by specialty or take our 2-minute assessment. We'll match you with someone who's handled cases like yours.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-background border-2 border-border flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-foreground">2</span>
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">Free intro call—no pressure</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every advocate offers a free 15-minute call. They'll be honest about whether they can help.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-background border-2 border-border flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-foreground">3</span>
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">They fight. You heal.</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your advocate handles calls, paperwork, and appeals. You get a written plan and 7 days of follow-up support.
              </p>
            </div>
          </div>
          <p className="text-center mt-8 text-xs text-muted-foreground">No charge until after your session. Cancel anytime.</p>
        </div>
      </section>

      {/* Advocate Cards — #2 filters + sort, #5 differentiation */}
      <div id="advocates" className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-display text-2xl text-foreground" data-testid="section-title">Advocates ready to help</h3>
            {(activeSpecialty !== 'All' || sortBy !== 'default') && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {filteredAdvocates.length} {filteredAdvocates.length === 1 ? 'advocate' : 'advocates'}
                {activeSpecialty !== 'All' && <> · <span className="font-medium text-foreground">{activeSpecialty}</span></>}
                {sortBy !== 'default' && <> · Sorted: {sortBy === 'price-low' ? 'Price low–high' : sortBy === 'price-high' ? 'Price high–low' : sortBy === 'rating' ? 'Highest rated' : 'Fastest response'}</>}
                <button onClick={() => { setActiveSpecialty('All'); setSortBy('default'); }} className="ml-2 underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Clear</button>
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort advocates"
              className="text-sm text-muted-foreground bg-transparent border border-border rounded-lg px-3 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="default">Recommended</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="rating">Highest rated</option>
              <option value="response">Fastest response</option>
            </select>
          </div>
        </div>

        {/* Specialty filter chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setActiveSpecialty(spec)}
              data-active={activeSpecialty === spec}
              className={cn(
                "filter-chip min-h-[44px] px-3.5 py-2.5 rounded-full text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                activeSpecialty === spec
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/50/80"
              )}
            >
              {spec}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mb-6 text-xs text-muted-foreground">
          <span>Prices shown are per 60-min session</span>
          <span className="text-border">·</span>
          <span>Most patients book 1–3 sessions (median total: $300)</span>
          <span className="text-border">·</span>
          <span className="text-muted-foreground font-medium">HSA / FSA eligible</span>
        </div>

        {/* Persistent trust bar — visible while browsing cards */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-5 py-3 border-y border-border text-sm text-muted-foreground sm:hidden">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Verified & background-checked</span>
          <span className="inline-flex items-center gap-1.5"><RefreshCw className="w-4 h-4" /> 100% refund if we can't help</span>
          <span className="inline-flex items-center gap-1.5"><Lock className="w-4 h-4" /> HIPAA compliant</span>
        </div>

        {filteredAdvocates.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-2">No advocates found for "{activeSpecialty}"</p>
            <button onClick={() => setActiveSpecialty('All')} className="text-sm text-foreground underline hover:no-underline">Show all advocates</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredAdvocates.map((advocate) => (
              <Link key={advocate.id} href={`/advocate/${advocate.id}`}>
                <div
                  className="advocate-card group relative bg-background border border-border rounded-2xl overflow-hidden cursor-pointer"
                  data-testid={`card-advocate-${advocate.id}`}
                >
                  {/* Badges */}
                  <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-end">
                    {advocate.rating === 5.0 && (
                      <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                        Top rated
                      </span>
                    )}
                    {advocate.nextAvailable === 'Now' && (
                      <span className="badge-available bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Zap className="w-3 h-3" strokeWidth={2} />
                        Available now
                      </span>
                    )}
                    {advocate.nextAvailable === 'Today' && advocate.rating !== 5.0 && (
                      <span className="badge-available bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                      Today
                      </span>
                    )}
                  </div>

                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={advocate.image}
                      alt={advocate.name}
                      loading="lazy"
                      decoding="async"
                      className="photo-spring w-full h-full object-cover outline outline-1 -outline-offset-1 outline-black/10"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground" data-testid={`text-name-${advocate.id}`}>{advocate.name}</h4>
                      <CheckCircle className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                    </div>

                    <p className="text-xs text-primary font-medium mb-2">{advocate.specialty}</p>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3" data-testid={`text-title-${advocate.id}`}>
                      {advocate.title}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-lg font-bold text-foreground" data-testid={`text-price-${advocate.id}`}>
                        ${advocate.price}
                      </span>
                      <div className="flex items-center gap-1.5" aria-label={`${advocate.rating} out of 5 stars, ${advocate.reviews} reviews`}>
                        <Star className="w-3.5 h-3.5 fill-foreground text-foreground" aria-hidden="true" />
                        <span className="text-sm font-medium text-foreground">{advocate.rating}</span>
                        <span className="text-sm text-muted-foreground">({advocate.reviews})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        {advocate.responseTime}
                      </span>
                      <span className="text-border">·</span>
                      <span>Free intro call</span>
                      {advocate.avgSaved && (
                        <>
                          <span className="text-border">·</span>
                          <span>Avg. saved {advocate.avgSaved}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Hospital vs Brivon Comparison */}
      <section id="comparison" className="bg-muted border-y border-border">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h3 className="font-display text-3xl text-foreground mb-3">"Can't the hospital give me an advocate for free?"</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">They can. But hospital advocates work for the hospital. Brivon advocates work for you.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Hospital Patient Advocate</h4>
                  <p className="text-xs text-muted-foreground">Free, but limited</p>
                </div>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2 text-muted-foreground">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Employed by the hospital—their loyalty is split</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Won't help you dispute a bill from their own employer</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Limited to that hospital—can't coordinate across providers</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Usually overloaded—50+ patients at a time</span>
                </li>
              </ul>
            </div>
            <div className="bg-background border-2 border-primary rounded-xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Your Brivon Advocate</h4>
                  <p className="text-xs text-muted-foreground">Independent. On your side. Period.</p>
                </div>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2 text-foreground/80">
                  <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Works only for you</strong>—zero conflicts of interest</span>
                </li>
                <li className="flex items-start gap-2 text-foreground/80">
                  <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>Will dispute bills, fight denials, and challenge the system</span>
                </li>
                <li className="flex items-start gap-2 text-foreground/80">
                  <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>Coordinates across all your providers and specialists</span>
                </li>
                <li className="flex items-start gap-2 text-foreground/80">
                  <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>5-10 active patients max—you get real attention</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h3 className="font-display text-3xl text-foreground mb-3">What a $300 advocate saved — $62,800</h3>
          <p className="text-muted-foreground">A real case (anonymized). Two denials, $67,000 on the table, 18 days to resolution.</p>
        </div>
        <div className="bg-primary/5 border border-border rounded-xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-muted-foreground">R</span>
            </div>
            <div>
              <p className="font-semibold text-foreground">Rachel, 42 — Breast cancer diagnosis</p>
              <p className="text-sm text-muted-foreground">Facing a $67,000 treatment bill and two insurance denials</p>
            </div>
          </div>
          <div className="space-y-0">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                <div className="w-px h-full bg-border my-1"></div>
              </div>
              <div className="pb-6">
                <p className="text-sm font-semibold text-foreground">Day 1 — Free intro call</p>
                <p className="text-sm text-muted-foreground">Advocate reviewed denial letters and identified three errors in the insurance company's reasoning.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                <div className="w-px h-full bg-border my-1"></div>
              </div>
              <div className="pb-6">
                <p className="text-sm font-semibold text-foreground">Day 3 — Bill audit + appeal drafted</p>
                <p className="text-sm text-muted-foreground">Found $18K in duplicate charges and "facility fees." Drafted appeal citing specific policy language.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="checkpoint-resolved w-8 h-8 rounded-full bg-amber-600 text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="pb-2">
                <p className="text-sm font-semibold text-foreground">Day 18 — Resolved</p>
                <p className="text-sm text-muted-foreground">Appeal approved. Patient assistance covered another $31K. Out-of-pocket: $67,000 → $4,200.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">
                <span className="savings-original">$67,000</span>
                <span className="savings-result text-foreground"> → </span>
                <span className="savings-result savings-highlight">$4,200</span>
              </p>
              <p className="text-sm text-muted-foreground">Total savings: $62,800</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Cost of advocacy</p>
              <p className="text-lg font-semibold text-foreground">$300 (2 sessions)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety — #4 progressive disclosure */}
      <section id="trust" className="bg-muted border-y border-border">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="text-center mb-3">
            <h3 className="font-display text-3xl text-foreground mb-3">Why trust Brivon</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm">Patient advocacy is an unregulated industry — anyone can call themselves an advocate. We built Brivon to fill that gap with real accountability.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-8 mt-6">
            <span className="inline-flex items-center gap-1.5 font-medium"><TrendingUp className="w-4 h-4 text-muted-foreground" /> 82% of cases resolved favorably</span>
            <span className="text-border">·</span>
            <span>18% referred out or unresolvable — we're honest about the odds</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 steps-entrance">
            {trustCards.map((card, idx) => (
              <div key={idx} className="bg-background border border-border rounded-xl p-5">
                <card.icon className="w-6 h-6 text-foreground/80 mb-3" />
                <h4 className="font-semibold text-foreground mb-2">{card.title}</h4>
                <p className="text-sm text-muted-foreground">{card.summary}</p>

                <button
                  onClick={() => setExpandedTrust(expandedTrust === idx ? null : idx)}
                  aria-expanded={expandedTrust === idx}
                  className="inline-flex items-center gap-1 min-h-[44px] text-xs text-muted-foreground hover:text-foreground mt-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  {expandedTrust === idx ? 'Less detail' : 'More detail'}
                  <ChevronDown className={cn("w-3 h-3 chevron-spring", expandedTrust === idx && "rotate-180")} />
                </button>

                <div className="accordion-wrapper" data-open={expandedTrust === idx}>
                  <div className="accordion-inner">
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <ul className="space-y-1.5 text-sm text-muted-foreground mb-3">
                        {card.details.map((detail, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                      <a href={card.link.href} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                        <FileText className="w-3 h-3" />
                        {card.link.text}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-background border border-border rounded-xl">
            <div className="flex items-start gap-3">
              <Scale className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Zero conflicts of interest</p>
                <p className="text-sm text-muted-foreground">Brivon advocates never receive referral fees, kickbacks, or commissions from providers, specialists, or clinical trials they recommend. <a href="#" className="underline hover:text-foreground transition-colors">Read our conflict of interest policy</a>.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who's behind Brivon */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="text-center mb-8">
          <h3 className="font-display text-3xl text-foreground mb-3">Who's behind Brivon</h3>
          <p className="text-muted-foreground">Real people, not a faceless platform.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/5 border border-primary/20/60 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-primary/70">JR</span>
            </div>
            <p className="font-semibold text-foreground">Dr. Jessica Reeves</p>
            <p className="text-sm text-muted-foreground">Co-founder & CEO</p>
            <p className="text-xs text-muted-foreground mt-1">Former patient advocate. 15 years in healthcare navigation.</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/5 border border-primary/20/60 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-primary/70">MT</span>
            </div>
            <p className="font-semibold text-foreground">Marcus Torres</p>
            <p className="text-sm text-muted-foreground">Co-founder & CTO</p>
            <p className="text-xs text-muted-foreground mt-1">Former healthcare CTO. Built HIPAA-compliant systems for 10+ years.</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/5 border border-primary/20/60 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-primary/70">AK</span>
            </div>
            <p className="font-semibold text-foreground">Dr. Amara Kessler</p>
            <p className="text-sm text-muted-foreground">Chief Medical Advisor</p>
            <p className="text-xs text-muted-foreground mt-1">Board-certified internist. Chairs our advocate review board.</p>
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <p className="text-center text-xs text-muted-foreground mb-5">As featured in</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <a href="#" className="text-xl font-bold text-foreground tracking-tight opacity-40 hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm">Forbes Health</a>
            <a href="#" className="text-xl font-bold text-foreground tracking-tight opacity-40 hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm">NPR</a>
            <a href="#" className="text-xl font-bold text-foreground tracking-tight opacity-40 hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm">HealthAffairs</a>
            <a href="#" className="text-xl font-bold text-foreground tracking-tight opacity-40 hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm">STAT News</a>
            <a href="#" className="text-xl font-bold text-foreground tracking-tight opacity-40 hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm">The Atlantic</a>
          </div>
        </div>
      </section>

      {/* Footer — #9 simplified */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground mb-4">
            <a href="#" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Privacy policy</a>
            <a href="#" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Terms of service</a>
            <a href="#" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Code of ethics</a>
            <a href="#" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Complaint process</a>
            <a href="#" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Data & deletion</a>
            <a href="#" className="inline-flex items-center gap-1 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Trustpilot <ExternalLink className="w-3 h-3" /></a>
            <a href="#" className="inline-flex items-center gap-1 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">BBB <ExternalLink className="w-3 h-3" /></a>
          </div>
          <p className="text-center text-xs text-muted-foreground">© 2026 Brivon, Inc. · Not a law firm, medical provider, or insurance company.</p>
        </div>
      </footer>
    </div>
  );
}
