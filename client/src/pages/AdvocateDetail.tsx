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
  Share2,
  MapPin,
  Languages,
  Briefcase,
  GraduationCap,
  FileCheck,
  Users,
  ThumbsUp,
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
        'I don\'t give medical advice or tell you what treatment to choose',
        'I don\'t replace your medical team—I help you work with them',
        'I don\'t handle legal malpractice cases (but can refer you)',
        'I don\'t work with patients who aren\'t ready to be active participants',
        'You\'re looking for someone to make decisions for you',
        'Your primary need is emotional counseling (I\'ll refer you to great therapists)',
        'You need legal representation for malpractice',
        'You prefer an advocate who will be more directive about treatment choices',
      ],
      network: {
        description: 'I have direct relationships built over 20+ years with oncologists, nurse navigators, social workers, and billing departments at major cancer centers across the Northeast. I\'m not cold-calling—I\'m calling colleagues.',
        highlights: ['Dana-Farber', 'Memorial Sloan Kettering', 'MD Anderson', 'Mass General'],
      },
    },
    // Decision-Making Philosophy
    decisionPhilosophy: {
      autonomy: {
        label: 'Your Body, Your Call',
        description: 'I present options, explain trade-offs, and help you think through decisions—but I will never push you toward a choice that isn\'t yours. If you decide "no more chemo," I\'ll help you explore what that path looks like with dignity.',
      },
      complexity: {
        label: 'Energized by Complexity',
        description: 'Rare diagnosis? Multiple specialists who can\'t agree? I love the puzzle. Complex cases are where I do my best work—I\'ll dig into research, coordinate between teams, and find the signal in the noise.',
      },
    },
    // Fit (softer framing for "uncomfortable questions")
    fit: {
      bestFor: [
        'Patients facing new or complex cancer diagnoses',
        'Families who feel overwhelmed by conflicting opinions',
        'Anyone who needs help understanding treatment options',
        'People navigating insurance denials or authorization battles',
        'Patients who want someone at appointments taking notes',
      ],
      worksBestWhen: [
        'You\'re ready to be an active participant in your care',
        'You value clear, honest communication—even when it\'s hard',
        'You want a partner, not someone to take over completely',
      ],
      mayNotBeMatch: [
        'You\'re looking for someone to make decisions for you',
        'Your primary need is emotional counseling (I\'ll refer you to great therapists)',
        'You need legal representation for malpractice',
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
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to advocates</span>
            </button>
          </Link>
          <div className="flex items-center gap-3">
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              data-testid="button-share"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share</span>
            </button>
            <button 
              onClick={() => setIsFavorited(!isFavorited)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              data-testid="button-save"
            >
              <Heart className={cn("w-4 h-4", isFavorited && "fill-red-500 text-red-500")} />
              <span className="text-sm font-medium">Save</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
            <img 
              src={advocate.image} 
              alt={advocate.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Quick Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 text-emerald-600" strokeWidth={1.5} />
                Top Advocate
              </span>
              <span className="text-sm text-gray-500">{advocate.specialty}</span>
            </div>

            <h1 className="text-3xl font-bold text-black mb-2" data-testid="text-advocate-name">{advocate.name}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-black text-black" />
                <span className="font-semibold">{advocate.rating}</span>
                <span className="text-gray-500">({advocate.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{advocate.location}</span>
              </div>
            </div>

            <p className="text-gray-600 mb-6">{advocate.title}</p>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-black">{advocate.stats.patientsHelped.toLocaleString()}+</div>
                <div className="text-sm text-gray-500">Patients helped</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-black">{advocate.stats.yearsExperience}</div>
                <div className="text-sm text-gray-500">Years experience</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-black">{advocate.stats.responseRate}%</div>
                <div className="text-sm text-gray-500">Response rate</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-black text-black" />
                  <span className="text-2xl font-bold text-black">{advocate.stats.avgRating}</span>
                </div>
                <div className="text-sm text-gray-500">Average rating</div>
              </div>
            </div>

            {/* Response Time */}
            <div className="flex items-center gap-2 text-gray-600 mb-6">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{advocate.responseTime}</span>
            </div>

            {/* Languages */}
            <div className="flex items-center gap-2 text-gray-600">
              <Languages className="w-4 h-4" />
              <span className="text-sm">Speaks {advocate.languages.join(', ')}</span>
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
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm">
                    {cred.type === 'certification' && <Award className="w-3.5 h-3.5 text-emerald-600" />}
                    {cred.type === 'education' && <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />}
                    {cred.type === 'experience' && <Briefcase className="w-3.5 h-3.5 text-emerald-600" />}
                    <span className="font-medium text-gray-800">{cred.label}</span>
                    {cred.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
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
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">Communication</span>
                  </div>
                  <div className="font-semibold text-black mb-1">{advocate.humanConnection?.communicationStyle?.label}</div>
                  <p className="text-sm text-gray-600">{advocate.humanConnection?.communicationStyle?.description}</p>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">Emotional style</span>
                  </div>
                  <div className="font-semibold text-black mb-1">{advocate.humanConnection?.emotionalApproach?.label}</div>
                  <p className="text-sm text-gray-600">{advocate.humanConnection?.emotionalApproach?.description}</p>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">Crisis hours</span>
                  </div>
                  <div className="font-semibold text-black mb-1">{advocate.humanConnection?.crisisAvailability?.label}</div>
                  <p className="text-sm text-gray-600">{advocate.humanConnection?.crisisAvailability?.description}</p>
                  <div className="mt-2 text-xs font-medium text-gray-600 bg-gray-200 px-2 py-1 rounded-full inline-block">
                    {advocate.humanConnection?.crisisAvailability?.responseWindow}
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Timer className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">Stamina level</span>
                  </div>
                  <div className="font-semibold text-black mb-1">{advocate.practicalStuff?.stamina?.label}</div>
                  <p className="text-sm text-gray-600">{advocate.practicalStuff?.stamina?.description}</p>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">Conflict approach</span>
                  </div>
                  <div className="font-semibold text-black mb-1">{advocate.practicalStuff?.conflictStyle?.label}</div>
                  <p className="text-sm text-gray-600">{advocate.practicalStuff?.conflictStyle?.description}</p>
                </div>
              </div>
            </section>

            {/* Real wins */}
            <section id="real-wins">
              <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Real wins (not just bullet points)
              </h2>
              <div className="space-y-4">
                {advocate.practicalStuff?.wins?.map((win: any, idx: number) => (
                  <div key={idx} className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                    <div className="font-semibold text-black mb-1">{win.title}</div>
                    <p className="text-sm text-gray-600">{win.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* What I do */}
            <section>
              <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <Handshake className="w-5 h-5" />
                What I do
              </h2>
              <div className="space-y-2">
                {advocate.fit?.bestFor?.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* What I don't do */}
            <section>
              <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                What I don't do
              </h2>
              <p className="text-gray-600 mb-4">Clear expectations help us both. No hard feelings if it doesn't work out. Here's where my role ends:</p>
              <div className="space-y-2">
                {advocate.trustIndicators?.boundaries?.map((boundary: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-gray-700">
                    <XCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{boundary}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Network */}
            <section>
              <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <Network className="w-5 h-5" />
                My network (these are people I know)
              </h2>
              <p className="text-gray-600 mb-4">{advocate.trustIndicators?.network?.description}</p>
              <div className="flex flex-wrap gap-2">
                {advocate.trustIndicators?.network?.highlights?.map((place: string, idx: number) => (
                  <span 
                    key={idx}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100"
                  >
                    {place}
                  </span>
                ))}
              </div>
            </section>

            {/* Decision Philosophy */}
            <section>
              <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                How I approach decisions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <div className="font-semibold text-black mb-1">{advocate.decisionPhilosophy?.autonomy?.label}</div>
                  <p className="text-sm text-gray-600">{advocate.decisionPhilosophy?.autonomy?.description}</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <div className="font-semibold text-black mb-1">{advocate.decisionPhilosophy?.complexity?.label}</div>
                  <p className="text-sm text-gray-600">{advocate.decisionPhilosophy?.complexity?.description}</p>
                </div>
              </div>
            </section>

            {/* Specializations */}
            <section>
              <h2 className="text-xl font-bold text-black mb-4">How I stand with you</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {advocate.specializations.map((spec: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
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
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </section>

            {/* What to Expect */}
            <section>
              <h2 className="text-xl font-bold text-black mb-4">What to expect</h2>
              <div className="space-y-3">
                {advocate.whatToExpect.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {idx + 1}
                    </div>
                    <span className="text-gray-700">{item}</span>
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
                <span className="text-gray-400">·</span>
                <span className="text-lg text-gray-600">{advocate.reviews} reviews</span>
              </div>

              {/* Rating Breakdown - Patient Advocacy Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-3 mb-10 pb-10 border-b border-gray-200">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-700">Communication clarity</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-6">5.0</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-700">Responsiveness</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: '98%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-6">4.9</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-700">Medical knowledge</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-6">5.0</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-700">Advocacy effectiveness</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-6">5.0</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-700">Emotional support</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: '96%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-6">4.8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-700">Value for cost</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-6">5.0</span>
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
                        <div className="text-sm text-gray-500">{review.condition}</div>
                      </div>
                    </div>

                    {/* Rating & Date */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-black text-black" : "fill-gray-200 text-gray-200")} />
                        ))}
                      </div>
                      <span className="text-gray-400">·</span>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 leading-relaxed line-clamp-4">{review.text}</p>
                    
                    <button className="text-sm font-semibold text-black underline hover:no-underline">
                      Show more
                    </button>
                  </div>
                ))}
              </div>

              {/* Show All Button */}
              <button 
                className="mt-8 px-6 py-3 border border-black rounded-lg font-semibold text-black hover:bg-gray-50 transition-colors"
                data-testid="button-show-all-reviews"
              >
                Show all {advocate.reviews} reviews
              </button>
            </section>

            {/* About */}
            <section>
              <h2 className="text-xl font-bold text-black mb-4">About {advocate.name.split(' ')[1]}</h2>
              <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                {advocate.about}
              </div>
            </section>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
              {/* Booking Options */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setSelectedOption('intro')}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 text-left transition-all",
                    selectedOption === 'intro'
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  data-testid="option-intro-call"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-black">Free Intro Call</span>
                    <span className="text-emerald-600 font-semibold">Free</span>
                  </div>
                  <p className="text-sm text-gray-500">15 minutes to share your story and see if I'm the right champion for you</p>
                </button>

                <button
                  onClick={() => setSelectedOption('consultation')}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 text-left transition-all",
                    selectedOption === 'consultation'
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  data-testid="option-consultation"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-black">Full Consultation</span>
                    <span className="font-semibold text-black">${advocate.price}</span>
                  </div>
                  <p className="text-sm text-gray-500">60 minutes focused entirely on you—your questions, your options, your path forward</p>
                </button>
              </div>

              {/* Next Available */}
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-2">Next available</div>
                <div className="font-semibold text-black">{advocate.availability.nextAvailable}</div>
              </div>

              {/* Book Button */}
              <Button 
                className="w-full bg-black text-white py-6 text-lg font-medium rounded-xl hover:bg-gray-800 transition-colors mb-4"
                data-testid="button-book-now"
              >
                {selectedOption === 'intro' ? 'Schedule Free Intro Call' : `Book for $${advocate.price}`}
              </Button>

              <p className="text-center text-sm text-gray-500 mb-6">
                {selectedOption === 'intro' 
                  ? 'No payment required for intro call'
                  : 'You won\'t be charged until after your session'
                }
              </p>

              {/* Trust Signals */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Your satisfaction, guaranteed</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Video className="w-4 h-4 text-emerald-600" />
                  <span>Private, secure video—just you and your advocate</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>Written summary so nothing gets lost</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>7 days of support—I'm in your corner</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
          © 2026 PatientAdvocate. Your voice. Your advocate. Your health story.
        </div>
      </footer>
    </div>
  );
}
