import React, { useState } from 'react';
import { Link } from 'wouter';
import { Heart, ChevronDown, CheckCircle, Star, Users, Award, Ribbon, Pill, Brain, Handshake, Baby } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'all', label: 'All Advocates', Icon: Users },
  { id: 'top', label: 'Top Advocates', Icon: Award },
  { id: 'cancer', label: 'Cancer Care', Icon: Ribbon },
  { id: 'chronic', label: 'Chronic Illness', Icon: Pill },
  { id: 'mental', label: 'Mental Health', Icon: Brain },
  { id: 'elderly', label: 'Elder Care', Icon: Handshake },
  { id: 'pediatric', label: 'Pediatric Care', Icon: Baby },
];

const advocates = [
  {
    id: 1,
    name: 'Dr. Sarah Mitchell',
    username: 'SarahMitchell',
    title: '20+ years in oncology. She translates the chaos into a clear path forward—and stands beside you every step.',
    price: 150,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 5.0,
    reviews: 248,
    specialty: 'Cancer Care',
  },
  {
    id: 2,
    name: 'Maria Rodriguez',
    username: 'MariaRodriguez',
    title: 'Bilingual champion who cuts through insurance red tape. Claim denied? She becomes your voice.',
    price: 95,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 4.9,
    reviews: 187,
    specialty: 'Insurance Advocacy',
  },
  {
    id: 3,
    name: 'James Chen',
    username: 'JamesChen',
    title: 'Healthcare attorney who switched sides. Now he uses the system\'s own rules to advocate for you.',
    price: 200,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 5.0,
    reviews: 156,
    specialty: 'Patient Rights',
  },
  {
    id: 4,
    name: 'Dr. Emily Watson',
    username: 'EmilyWatson',
    title: 'When it\'s your kid, fear hits different. She walks with you through every test, every question, every sleepless night.',
    price: 175,
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 4.8,
    reviews: 134,
    specialty: 'Pediatric Care',
  },
  {
    id: 5,
    name: 'Robert Thompson',
    username: 'RobertThompson',
    title: 'Former hospital insider. He knows how the system works—and makes sure it works for you.',
    price: 125,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 5.0,
    reviews: 198,
    specialty: 'Hospital Navigation',
  },
  {
    id: 6,
    name: 'Lisa Park',
    username: 'LisaPark',
    title: 'Mental health matters. She champions your access to care—no stigma, no barriers, just support.',
    price: 110,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 4.9,
    reviews: 167,
    specialty: 'Mental Health',
  },
  {
    id: 7,
    name: 'Michael Davis',
    username: 'MichaelDavis',
    title: 'Chronic illness survivor. He\'s been where you are—and now helps you chart your own path forward.',
    price: 85,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 4.7,
    reviews: 143,
    specialty: 'Chronic Illness',
  },
  {
    id: 8,
    name: 'Angela Foster',
    username: 'AngelaFoster',
    title: 'Caring for aging parents is overwhelming. She turns the maze of Medicare into a clear roadmap.',
    price: 140,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 5.0,
    reviews: 212,
    specialty: 'Elder Care',
  },
  {
    id: 9,
    name: 'Dr. Kevin Patel',
    username: 'KevinPatel',
    title: 'Former ER doc. When crisis hits, he\'s the calm voice giving you real answers—fast.',
    price: 190,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 4.9,
    reviews: 178,
    specialty: 'Emergency Care',
  },
  {
    id: 10,
    name: 'Susan Williams',
    username: 'SusanWilliams',
    title: 'Cuts through the jargon. Gives you insights that are clear, actionable, and real. No fluff, just truth.',
    price: 100,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 4.8,
    reviews: 156,
    specialty: 'Treatment Strategy',
  },
  {
    id: 11,
    name: 'David Kim',
    username: 'DavidKim',
    title: 'Insurance companies count on you giving up. He doesn\'t. Appeals, denials, fine print—he breaks through it all.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 5.0,
    reviews: 234,
    specialty: 'Claims Champion',
  },
  {
    id: 12,
    name: 'Jennifer Moore',
    username: 'JenniferMoore',
    title: 'Rare disease? Uncharted territory? She connects you with specialists and trials others can\'t find.',
    price: 160,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 4.9,
    reviews: 189,
    specialty: 'Rare Diseases',
  },
];

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-black" data-testid="logo">PatientAdvocate</h1>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm text-stone-500 hover:text-black transition-colors" data-testid="nav-browse">Find Your Fighter</a>
              <a href="#" className="text-sm text-stone-500 hover:text-black transition-colors" data-testid="nav-how">How It Works</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm text-stone-500 hover:text-black transition-colors" data-testid="button-login">Log in</button>
            <button className="bg-black text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-800 transition-colors" data-testid="button-signup">Sign up</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-3" data-testid="hero-title">Your health story deserves someone in your corner.</h2>
        <p className="text-xl text-stone-500" data-testid="hero-subtitle">Find advocates who see you, hear you, and stand with you.</p>
      </section>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                activeCategory === cat.id
                  ? "bg-black text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              )}
              data-testid={`category-${cat.id}`}
            >
              <cat.Icon className="w-4 h-4" strokeWidth={1.5} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <p className="text-stone-500" data-testid="text-results">
            Champions who have your back. Because you shouldn't do this alone.
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors"
            data-testid="button-filters"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
              <circle cx="8" cy="6" r="2" fill="currentColor" />
              <circle cx="16" cy="12" r="2" fill="currentColor" />
              <circle cx="10" cy="18" r="2" fill="currentColor" />
            </svg>
            Filters
          </button>
        </div>
      </div>

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-black" data-testid="section-title">Proven Advocates</h3>
            <p className="text-stone-500 text-sm mt-1">They've been where you are. Now they're ready to stand alongside you.</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-black transition-colors" data-testid="button-see-all">
            See all
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Advocate Cards Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {advocates.map((advocate) => (
            <Link key={advocate.id} href={`/advocate/${advocate.id}`}>
              <div
                className="group relative bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer"
                data-testid={`card-advocate-${advocate.id}`}
              >
              {/* Favorite Button */}
              <button 
                className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                data-testid={`button-favorite-${advocate.id}`}
              >
                <Heart className="w-4 h-4 text-stone-500" />
              </button>

              {/* Top Advocate Badge */}
              {advocate.isTopExpert && (
                <div className="absolute top-3 left-3 z-10 bg-stone-200 text-stone-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-700" strokeWidth={1.5} />
                  Top Advocate
                </div>
              )}

              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={advocate.image}
                  alt={advocate.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-black" data-testid={`text-name-${advocate.id}`}>{advocate.name}</h4>
                  {advocate.isTopExpert && (
                    <CheckCircle className="w-4 h-4 text-black" strokeWidth={1.5} />
                  )}
                </div>

                <p className="text-xs text-amber-700 font-medium mb-2">{advocate.specialty}</p>
                
                <p className="text-lg font-bold text-black mb-2" data-testid={`text-price-${advocate.id}`}>
                  ${advocate.price} <span className="text-sm font-normal text-stone-500">• Consultation</span>
                </p>

                <p className="text-sm text-stone-500 line-clamp-2" data-testid={`text-title-${advocate.id}`}>
                  {advocate.title}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-stone-200">
                  <Star className="w-3.5 h-3.5 fill-black text-black" />
                  <span className="text-sm font-medium text-black">{advocate.rating}</span>
                  <span className="text-sm text-stone-400">({advocate.reviews} reviews)</span>
                </div>
              </div>

              {/* Book Consultation Button */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-4 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  className="w-full bg-amber-700 text-white font-semibold py-3 rounded-xl hover:bg-amber-800 transition-colors"
                  data-testid={`button-book-${advocate.id}`}
                >
                  Book Your Advocate
                </button>
              </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-stone-500">
          © 2026 PatientAdvocate. Your voice. Your advocate. Your health story.
        </div>
      </footer>
    </div>
  );
}
