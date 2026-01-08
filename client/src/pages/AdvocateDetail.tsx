import React, { useState } from 'react';
import { Link, useParams } from 'wouter';
import { 
  ArrowLeft, 
  Star, 
  CheckCircle, 
  Shield, 
  Clock, 
  MessageCircle, 
  Video,
  Phone,
  Calendar,
  Award,
  Heart,
  HelpCircle,
  ClipboardList,
  TrendingUp,
  BadgeCheck,
  MapPin,
  Languages,
  Briefcase,
  GraduationCap,
  FileCheck,
  Users,
  ThumbsUp,
  FileText,
  Beaker,
  Stethoscope,
  Hourglass,
  AlertCircle,
  Zap,
  Handshake,
  Target,
  BookOpen,
  Network,
  XCircle,
  Sparkles,
  HeartHandshake,
  Timer,
  Flame,
  Scale
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const advocatesData: Record<string, any> = {
  '1': {
    id: 1,
    name: 'Dr. Sarah Mitchell',
    title: '20+ years in oncology. She translates the chaos into a clear path forward—and stands beside you every step.',
    price: 150,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=800&fit=crop&crop=face',
    rating: 5.0,
    reviews: 248,
    specialty: 'Cancer Care',
    location: 'Boston, MA',
    languages: ['English', 'Spanish'],
    responseTime: 'Usually responds within 2 hours',
    credentials: [
      { type: 'certification', label: 'Board Certified Patient Advocate (BCPA)', verified: true },
      { type: 'education', label: 'RN, MSN - Johns Hopkins School of Nursing', verified: true },
      { type: 'experience', label: '22 years oncology nursing experience', verified: true },
    ],
    specializations: [
      'Cancer diagnosis navigation',
      'Treatment option analysis',
      'Clinical trial matching',
      'Insurance pre-authorization',
      'Second opinion coordination',
      'Caregiver support',
    ],
    conditionsHandled: [
      'Breast Cancer',
      'Lung Cancer', 
      'Colorectal Cancer',
      'Lymphoma',
      'Leukemia',
      'Prostate Cancer',
    ],
    about: `After 22 years as an oncology nurse at Dana-Farber Cancer Institute, I know firsthand how overwhelming a cancer diagnosis can be. The medical system moves fast, the terminology is confusing, and you're making life-changing decisions while processing the hardest news of your life.

I became an advocate because I believe everyone deserves a champion in their corner—someone who listens, explains, and stands beside you when the path feels uncertain.

Now I work exclusively for you. I attend appointments, ask the questions you didn't know to ask, coordinate between your specialists, and make sure you understand every option before making decisions. You're not just a patient number—you're a person with a story, and I'm here to make sure your voice is heard loud and clear.`,
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
      },
      {
        id: 2,
        name: 'Michael R.',
        date: 'October 2025',
        rating: 5,
        text: 'When my dad was diagnosed with lung cancer, we were lost. Sarah helped us get a second opinion at Memorial Sloan Kettering and caught a staging error that changed his treatment plan. She literally saved his life.',
        condition: 'Lung Cancer',
      },
      {
        id: 3,
        name: 'Amanda K.',
        date: 'September 2025',
        rating: 5,
        text: 'Finally someone who actually listens and explains things in plain English. Sarah helped me navigate insurance denials and got my immunotherapy approved after two rejections. She knows how to work the system.',
        condition: 'Lymphoma',
      },
    ],
    // Patient Outcome Stats
    outcomeStats: {
      appealsApproved: { value: '87%', label: 'Insurance appeals approved' },
      clinicalTrialsMatched: { value: '43', label: 'Clinical trials matched' },
      secondOpinions: { value: '156', label: 'Second opinions coordinated' },
      avgTimeSaved: { value: '12 hrs', label: 'Avg. time saved per patient' },
    },
    // Professional Memberships
    professionalMemberships: [
      { name: 'National Association of Healthcare Advocacy', acronym: 'NAHAC', verified: true },
      { name: 'Alliance of Professional Health Advocates', acronym: 'APHA', verified: true },
      { name: 'Patient Advocate Certification Board', acronym: 'PACB', verified: true },
      { name: 'Oncology Nursing Society', acronym: 'ONS', verified: true },
    ],
    // FAQ
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
    // Intake Questionnaire Preview
    intakePreview: {
      description: 'Before we meet, I\'ll ask you to complete a brief questionnaire so I can hit the ground running. Here\'s what I\'ll need:',
      items: [
        { category: 'Your story', examples: 'Diagnosis timeline, current symptoms, what\'s worrying you most' },
        { category: 'Medical team', examples: 'Current doctors, hospitals, any specialists you\'ve seen' },
        { category: 'Insurance info', examples: 'Plan type, any denials or authorization issues' },
        { category: 'Goals', examples: 'What does success look like for you? What decisions are ahead?' },
        { category: 'Documents', examples: 'Recent lab results, pathology reports, imaging (I\'ll help you gather these)' },
      ],
      timeToComplete: '10-15 minutes',
    },
    // Human Connection Factors
    humanConnection: {
      communicationStyle: {
        label: 'Plain-English Translator',
        description: 'I break down medical jargon into words that actually make sense. No doctor-speak unless you want it.',
      },
      emotionalApproach: {
        label: 'Calm Navigator',
        description: 'I stay steady when things get scary. You can fall apart if you need to—I\'ll hold the pieces until you\'re ready.',
      },
      crisisAvailability: {
        label: 'Late-Night Text OK',
        description: 'Scary results at 10pm? Text me. I check messages until midnight and will get back to you before morning.',
        responseWindow: '8am-midnight, 7 days',
      },
    },
    // Practical Stuff
    practicalStuff: {
      wins: [
        { title: 'Got $47K experimental treatment approved', description: 'Insurance denied it twice. Third appeal with the right documentation—approved in 14 days.' },
        { title: 'Found a Medicaid specialist after 3 rejections', description: 'Patient had rare blood cancer. Found a top specialist who takes Medicaid at Mass General.' },
        { title: 'Caught a staging error that changed everything', description: 'Original diagnosis was Stage IIIB. Got second opinion, actual stage was IIA—completely different treatment.' },
      ],
      stamina: {
        label: 'Marathon Runner',
        description: 'I don\'t tap out. Some of my patients I\'ve worked with for 18+ months through multiple treatment phases. I\'m here for the long haul.',
      },
      conflictStyle: {
        label: 'Diplomat First, Bulldog Second',
        description: 'I start with relationship-building and clear communication. But if diplomacy fails? I know exactly when and how to escalate—and I will.',
      },
    },
    // Trust Indicators
    trustIndicators: {
      personalExperience: {
        hasExperience: true,
        type: 'caregiver',
        story: 'I was my mother\'s caregiver through her ovarian cancer journey. I know what it\'s like to be on the other side of the hospital bed—the fear, the exhaustion, the feeling of helplessness. It\'s why I do this work.',
      },
      boundaries: [
        'Give medical advice or recommend treatments',
        'Replace your medical team',
        'Handle legal malpractice cases',
        'Make decisions for you',
      ],
      network: {
        description: 'I have direct relationships built over 20+ years with oncologists, nurse navigators, social workers, and billing departments at major cancer centers across the Northeast. I\'m not cold-calling—I\'m calling colleagues.',
        highlights: ['Dana-Farber', 'Memorial Sloan Kettering', 'MD Anderson', 'Mass General'],
      },
    },
    // Decision-Making Philosophy - Video Format
    decisionPhilosophy: {
      videos: [
        {
          id: 'autonomy',
          thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
          title: 'Your body, your call',
          duration: '1:24',
          overlay: 'How I support your decisions without pushing my preferences',
        },
        {
          id: 'complexity',
          thumbnail: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop',
          title: 'Why I love complex cases',
          duration: '2:08',
          overlay: 'Rare diagnosis? Multiple specialists? That\'s where I thrive.',
        },
        {
          id: 'difficult-conversations',
          thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop',
          title: 'Having hard conversations',
          duration: '1:47',
          overlay: 'How I help you talk to doctors about what really matters',
        },
      ],
    },
    // Fit (softer framing for "uncomfortable questions")
    fit: {
      bestFor: [
        'Navigate new or complex diagnoses',
        'Coordinate between multiple specialists',
        'Understand treatment options and trade-offs',
        'Fight insurance denials and appeals',
        'Attend appointments and take notes',
      ],
      worksBestWhen: [
        'You\'re ready to be an active participant in your care',
        'You value clear, honest communication—even when it\'s hard',
        'You want a partner, not someone to take over completely',
      ],
      mayNotBeMatch: [
        'You prefer an advocate who will be more directive about treatment choices',
      ],
    },
  },
};

// Default advocate for IDs not in the data
const defaultAdvocate = advocatesData['1'];

export default function AdvocateDetail() {
  const params = useParams();
  const advocateId = params.id || '1';
  const advocate = advocatesData[advocateId] || defaultAdvocate;
  
  const [selectedOption, setSelectedOption] = useState<'intro' | 'consultation'>('consultation');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <button className="flex items-center gap-2 text-stone-500 hover:text-black transition-colors" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to advocates</span>
            </button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section - Large image with info beside */}
        <div className="bg-stone-100 rounded-2xl p-8 mb-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Large Circular Photo */}
            <div className="relative flex-shrink-0">
              <div className="w-48 h-48 rounded-full overflow-hidden bg-stone-200 border-4 border-white shadow-lg">
                <img 
                  src={advocate.image} 
                  alt={advocate.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Verified Badge */}
              <div className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-white">
                <CheckCircle className="w-6 h-6 text-orange-800" />
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 text-center md:text-left">
              {/* Name */}
              <h1 className="text-3xl font-bold text-black mb-3" data-testid="text-advocate-name">
                {advocate.name}
              </h1>

              {/* Badges Row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                <span className="inline-flex items-center gap-1.5 text-sm text-stone-600">
                  <CheckCircle className="w-4 h-4 text-orange-800" />
                  Verified
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600">
                  <Star className="w-4 h-4 text-orange-800" />
                  Top Advocate
                </span>
              </div>

              {/* Specialty/Title */}
              <p className="text-sm text-stone-500 mb-3">{advocate.specialty} • {advocate.credentials[0]?.label}</p>

              {/* Location Row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-stone-500 mb-4">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {advocate.location}
                </span>
                <span className="text-stone-300">|</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {advocate.responseTime}
                </span>
                <span className="text-stone-300">|</span>
                <span className="inline-flex items-center gap-1.5">
                  <Languages className="w-4 h-4" />
                  {advocate.languages.join(', ')}
                </span>
              </div>

              {/* Rating + Stats Row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-black text-black" />
                  ))}
                  <span className="font-semibold text-black ml-1">{advocate.rating}</span>
                  <span className="text-stone-500">| {advocate.reviews} Reviews</span>
                </div>
                <span className="text-stone-300">|</span>
                <span className="text-stone-500">{advocate.stats.patientsHelped.toLocaleString()}+ Patients Helped</span>
                <span className="text-stone-300">|</span>
                <span className="text-stone-500">{advocate.stats.yearsExperience} Years Experience</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Credentials */}
            <section id="credentials">
              <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Verified credentials
              </h2>
              <div className="flex flex-wrap gap-2">
                {advocate.credentials.map((cred: any, idx: number) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-full text-sm">
                    {cred.type === 'certification' && <Award className="w-3.5 h-3.5 text-orange-800" />}
                    {cred.type === 'education' && <GraduationCap className="w-3.5 h-3.5 text-orange-800" />}
                    {cred.type === 'experience' && <Briefcase className="w-3.5 h-3.5 text-orange-800" />}
                    <span className="font-medium text-stone-700">{cred.label}</span>
                    {cred.verified && <CheckCircle className="w-3.5 h-3.5 text-orange-800" />}
                  </span>
                ))}
              </div>
            </section>

            {/* Patient Outcome Stats */}
            <section>
              <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Results I've achieved
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-stone-100 border border-stone-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-orange-800" />
                    <span className="text-xl font-bold text-stone-700">{advocate.outcomeStats?.appealsApproved?.value}</span>
                  </div>
                  <div className="text-sm text-stone-500">{advocate.outcomeStats?.appealsApproved?.label}</div>
                </div>
                <div className="p-4 bg-stone-100 border border-stone-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Beaker className="w-4 h-4 text-orange-800" />
                    <span className="text-xl font-bold text-stone-700">{advocate.outcomeStats?.clinicalTrialsMatched?.value}</span>
                  </div>
                  <div className="text-sm text-stone-500">{advocate.outcomeStats?.clinicalTrialsMatched?.label}</div>
                </div>
                <div className="p-4 bg-stone-100 border border-stone-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Stethoscope className="w-4 h-4 text-orange-800" />
                    <span className="text-xl font-bold text-stone-700">{advocate.outcomeStats?.secondOpinions?.value}</span>
                  </div>
                  <div className="text-sm text-stone-500">{advocate.outcomeStats?.secondOpinions?.label}</div>
                </div>
                <div className="p-4 bg-stone-100 border border-stone-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Hourglass className="w-4 h-4 text-orange-800" />
                    <span className="text-xl font-bold text-stone-700">{advocate.outcomeStats?.avgTimeSaved?.value}</span>
                  </div>
                  <div className="text-sm text-stone-500">{advocate.outcomeStats?.avgTimeSaved?.label}</div>
                </div>
              </div>

              {/* Real wins */}
              <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Real wins (not just bullet points)
              </h3>
              <div className="space-y-3">
                {advocate.practicalStuff?.wins?.map((win: any, idx: number) => (
                  <div key={idx} className="bg-stone-100 border border-stone-200 rounded-xl p-4">
                    <div className="font-semibold text-black mb-1">{win.title}</div>
                    <p className="text-sm text-stone-500">{win.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Professional Memberships */}
            <section>
              <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <BadgeCheck className="w-5 h-5" />
                Professional memberships
              </h2>
              <div className="flex flex-wrap gap-2">
                {advocate.professionalMemberships?.map((membership: any, idx: number) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-full text-sm"
                  >
                    <BadgeCheck className="w-3.5 h-3.5 text-orange-800" />
                    <span className="font-medium text-stone-700">{membership.acronym} - {membership.name}</span>
                  </span>
                ))}
              </div>
            </section>

            {/* How I work - Combined section */}
            <section id="how-i-work">
              <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5" />
                How I work
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-stone-500" />
                    <span className="text-sm font-semibold text-stone-600">Communication</span>
                  </div>
                  <div className="font-semibold text-black mb-1">{advocate.humanConnection?.communicationStyle?.label}</div>
                  <p className="text-sm text-stone-500">{advocate.humanConnection?.communicationStyle?.description}</p>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-stone-500" />
                    <span className="text-sm font-semibold text-stone-600">Emotional style</span>
                  </div>
                  <div className="font-semibold text-black mb-1">{advocate.humanConnection?.emotionalApproach?.label}</div>
                  <p className="text-sm text-stone-500">{advocate.humanConnection?.emotionalApproach?.description}</p>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-stone-500" />
                    <span className="text-sm font-semibold text-stone-600">Crisis hours</span>
                  </div>
                  <div className="font-semibold text-black mb-1">{advocate.humanConnection?.crisisAvailability?.label}</div>
                  <p className="text-sm text-stone-500">{advocate.humanConnection?.crisisAvailability?.description}</p>
                  <div className="mt-2 text-xs font-medium text-stone-500 bg-stone-200 px-2 py-1 rounded-full inline-block">
                    {advocate.humanConnection?.crisisAvailability?.responseWindow}
                  </div>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Timer className="w-4 h-4 text-stone-500" />
                    <span className="text-sm font-semibold text-stone-600">Stamina level</span>
                  </div>
                  <div className="font-semibold text-black mb-1">{advocate.practicalStuff?.stamina?.label}</div>
                  <p className="text-sm text-stone-500">{advocate.practicalStuff?.stamina?.description}</p>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="w-4 h-4 text-stone-500" />
                    <span className="text-sm font-semibold text-stone-600">Conflict approach</span>
                  </div>
                  <div className="font-semibold text-black mb-1">{advocate.practicalStuff?.conflictStyle?.label}</div>
                  <p className="text-sm text-stone-500">{advocate.practicalStuff?.conflictStyle?.description}</p>
                </div>
              </div>
            </section>

            {/* What I do / What I don't do - Side by side */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* What I do */}
                <div>
                  <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                    <Handshake className="w-5 h-5" />
                    What I do
                  </h2>
                  <div className="space-y-2">
                    {advocate.fit?.bestFor?.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-stone-600">
                        <CheckCircle className="w-4 h-4 text-orange-800 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What I don't do */}
                <div>
                  <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    What I don't do
                  </h2>
                  <div className="space-y-2">
                    {advocate.trustIndicators?.boundaries?.map((boundary: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-stone-600">
                        <XCircle className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                        <span>{boundary}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-stone-500 mt-6">Clear expectations help us both. No hard feelings if it doesn't work out.</p>
            </section>

            {/* Network */}
            <section>
              <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <Network className="w-5 h-5" />
                My network (these are people I know)
              </h2>
              <p className="text-stone-500 mb-4">{advocate.trustIndicators?.network?.description}</p>
              <div className="flex flex-wrap gap-2">
                {advocate.trustIndicators?.network?.highlights?.map((place: string, idx: number) => (
                  <span 
                    key={idx}
                    className="px-3 py-1.5 bg-orange-50 text-orange-800 rounded-full text-sm font-medium border border-orange-200"
                  >
                    {place}
                  </span>
                ))}
              </div>
            </section>

            {/* Decision Philosophy - Video Section */}
            <section>
              <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                <Video className="w-5 h-5" />
                How I approach decisions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {advocate.decisionPhilosophy?.videos?.map((video: any) => (
                  <div key={video.id} className="group cursor-pointer">
                    {/* Video Thumbnail */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Dark Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      
                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          <div className="w-0 h-0 border-l-[18px] border-l-black border-y-[11px] border-y-transparent ml-1"></div>
                        </div>
                      </div>
                      
                      {/* Duration Badge */}
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded">
                        {video.duration}
                      </div>
                      
                      {/* Text Overlay */}
                      <div className="absolute bottom-3 left-3 right-12">
                        <p className="text-white text-sm font-medium leading-snug drop-shadow-lg">{video.overlay}</p>
                      </div>
                    </div>
                    
                    {/* Title Below */}
                    <h3 className="font-semibold text-black group-hover:underline">{video.title}</h3>
                  </div>
                ))}
              </div>
            </section>

            {/* Specializations */}
            <section>
              <h2 className="text-xl font-bold text-black mb-4">How I stand with you</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {advocate.specializations.map((spec: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-stone-600">
                    <CheckCircle className="w-4 h-4 text-orange-800" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Conditions */}
            <section>
              <h2 className="text-xl font-bold text-black mb-4">Patients I've championed</h2>
              <div className="flex flex-wrap gap-2">
                {advocate.conditionsHandled.map((condition: string, idx: number) => (
                  <span 
                    key={idx}
                    className="px-3 py-1.5 bg-stone-100 text-stone-600 rounded-full text-sm font-medium"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Frequently asked questions
              </h2>
              <div className="space-y-4">
                {advocate.faq?.map((item: any, idx: number) => (
                  <div key={idx} className="border-b border-stone-200 pb-4 last:border-0 last:pb-0">
                    <h3 className="font-semibold text-black mb-2">{item.question}</h3>
                    <p className="text-stone-500">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews - Airbnb Style */}
            <section id="reviews">
              {/* Rating Summary */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-1">
                  <Star className="w-6 h-6 fill-black text-black" />
                  <span className="text-2xl font-semibold text-black">{advocate.rating}</span>
                </div>
                <span className="text-stone-400">·</span>
                <span className="text-lg text-stone-500">{advocate.reviews} reviews</span>
              </div>

              {/* Rating Breakdown - Patient Advocacy Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-3 mb-10 pb-10 border-b border-stone-200">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-stone-600">Communication clarity</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-1 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-stone-600 w-6">5.0</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-stone-600">Responsiveness</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-1 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: '98%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-stone-600 w-6">4.9</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-stone-600">Medical knowledge</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-1 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-stone-600 w-6">5.0</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-stone-600">Advocacy effectiveness</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-1 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-stone-600 w-6">5.0</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-stone-600">Emotional support</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-1 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: '96%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-stone-600 w-6">4.8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-stone-600">Value for cost</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-1 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-stone-600 w-6">5.0</span>
                  </div>
                </div>
              </div>

              {/* Review Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {advocate.reviewsList.map((review: any) => (
                  <div key={review.id} className="space-y-3">
                    {/* Reviewer Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white font-semibold text-lg">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-black">{review.name}</div>
                        <div className="text-sm text-stone-500">{review.condition}</div>
                      </div>
                    </div>

                    {/* Rating & Date */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-black text-black" : "fill-gray-200 text-gray-200")} />
                        ))}
                      </div>
                      <span className="text-stone-400">·</span>
                      <span className="text-sm text-stone-500">{review.date}</span>
                    </div>

                    {/* Review Text */}
                    <p className="text-stone-600 leading-relaxed line-clamp-4">{review.text}</p>
                    
                    <button className="text-sm font-semibold text-black underline hover:no-underline">
                      Show more
                    </button>
                  </div>
                ))}
              </div>

              {/* Show All Button */}
              <button 
                className="mt-8 px-6 py-3 border border-black rounded-lg font-semibold text-black hover:bg-stone-50 transition-colors"
                data-testid="button-show-all-reviews"
              >
                Show all {advocate.reviews} reviews
              </button>
            </section>

          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-stone-200 rounded-2xl p-6 shadow-lg">
              {/* Booking Options */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setSelectedOption('intro')}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 text-left transition-all",
                    selectedOption === 'intro'
                      ? "border-black bg-stone-50"
                      : "border-stone-200 hover:border-gray-300"
                  )}
                  data-testid="option-intro-call"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-black">Free Intro Call</span>
                    <span className="text-orange-800 font-semibold">Free</span>
                  </div>
                  <p className="text-sm text-stone-500">15 minutes to share your story and see if I'm the right champion for you</p>
                </button>

                <button
                  onClick={() => setSelectedOption('consultation')}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 text-left transition-all",
                    selectedOption === 'consultation'
                      ? "border-black bg-stone-50"
                      : "border-stone-200 hover:border-gray-300"
                  )}
                  data-testid="option-consultation"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-black">Full Consultation</span>
                    <span className="font-semibold text-black">${advocate.price}</span>
                  </div>
                  <p className="text-sm text-stone-500">60 minutes focused entirely on you—your questions, your options, your path forward</p>
                </button>
              </div>

              {/* Next Available */}
              <div className="mb-6">
                <div className="text-sm text-stone-500 mb-2">Next available</div>
                <div className="font-semibold text-black">{advocate.availability.nextAvailable}</div>
              </div>

              {/* Book Button */}
              <Button 
                className="w-full bg-orange-800 text-white py-6 text-lg font-semibold rounded-xl hover:bg-orange-900 transition-colors mb-4"
                data-testid="button-book-now"
              >
                {selectedOption === 'intro' ? 'Schedule Free Intro Call' : `Book for $${advocate.price}`}
              </Button>

              <p className="text-center text-sm text-stone-500 mb-6">
                {selectedOption === 'intro' 
                  ? 'No payment required for intro call'
                  : 'You won\'t be charged until after your session'
                }
              </p>

              {/* Trust Signals */}
              <div className="space-y-3 pt-6 border-t border-stone-200">
                <div className="flex items-center gap-3 text-sm text-stone-500">
                  <Shield className="w-4 h-4 text-orange-800" />
                  <span>Your satisfaction, guaranteed</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-stone-500">
                  <Video className="w-4 h-4 text-orange-800" />
                  <span>Private, secure video—just you and your advocate</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-stone-500">
                  <FileCheck className="w-4 h-4 text-orange-800" />
                  <span>Written summary so nothing gets lost</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-stone-500">
                  <MessageCircle className="w-4 h-4 text-orange-800" />
                  <span>7 days of support—I'm in your corner</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-stone-500">
          © 2026 PatientAdvocate. Your voice. Your advocate. Your health story.
        </div>
      </footer>
    </div>
  );
}
