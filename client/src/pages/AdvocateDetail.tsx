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
  AlertCircle
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
            <section>
              <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Verified Credentials
              </h2>
              <div className="space-y-3">
                {advocate.credentials.map((cred: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    {cred.type === 'certification' && <Award className="w-5 h-5 text-emerald-600 mt-0.5" />}
                    {cred.type === 'education' && <GraduationCap className="w-5 h-5 text-emerald-600 mt-0.5" />}
                    {cred.type === 'experience' && <Briefcase className="w-5 h-5 text-emerald-600 mt-0.5" />}
                    <div className="flex-1">
                      <div className="font-medium text-black">{cred.label}</div>
                    </div>
                    {cred.verified && (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* About */}
            <section>
              <h2 className="text-xl font-bold text-black mb-4">About {advocate.name.split(' ')[0]}</h2>
              <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                {advocate.about}
              </div>
            </section>

            {/* Specializations */}
            <section>
              <h2 className="text-xl font-bold text-black mb-4">How I Stand With You</h2>
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
              <h2 className="text-xl font-bold text-black mb-4">Patients I've Championed</h2>
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
              <h2 className="text-xl font-bold text-black mb-4">What to Expect</h2>
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

            {/* Reviews */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black flex items-center gap-2">
                  <Star className="w-5 h-5 fill-black text-black" />
                  {advocate.reviews} Reviews
                </h2>
              </div>

              <div className="space-y-6">
                {advocate.reviewsList.map((review: any) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold text-black">{review.name}</div>
                        <div className="text-sm text-gray-500">{review.date} • {review.condition}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-black text-black" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{review.text}</p>
                  </div>
                ))}
              </div>

              <button className="mt-6 text-black font-medium underline hover:no-underline" data-testid="button-show-all-reviews">
                Show all {advocate.reviews} reviews
              </button>
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

        {/* Important Information */}
        <section className="mt-16 p-6 bg-amber-50 border border-amber-200 rounded-2xl">
          <h3 className="font-bold text-black mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Good to Know
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Your advocate helps you understand your options and navigate the system—not give medical advice. Your doctors remain your medical decision-makers.</li>
            <li>• Your advocate works only for you. No hospital. No insurance company. Just you.</li>
            <li>• Everything you share stays between us—confidential and HIPAA-protected.</li>
            <li>• Not the right fit? No hard feelings. You can switch advocates anytime.</li>
          </ul>
        </section>
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
