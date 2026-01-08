import React, { useState } from 'react';
import { Heart, ChevronDown, Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'all', label: 'All Advocates', icon: '👥' },
  { id: 'top', label: 'Top Advocates', icon: '⭐' },
  { id: 'cancer', label: 'Cancer Care', icon: '🎗️' },
  { id: 'chronic', label: 'Chronic Illness', icon: '💊' },
  { id: 'mental', label: 'Mental Health', icon: '🧠' },
  { id: 'elderly', label: 'Elder Care', icon: '🤝' },
  { id: 'pediatric', label: 'Pediatric Care', icon: '👶' },
];

const advocates = [
  {
    id: 1,
    name: 'Dr. Sarah Mitchell',
    username: 'SarahMitchell',
    title: 'Former oncology nurse with 20+ years experience. Specializes in cancer treatment navigation.',
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
    title: 'Bilingual advocate helping families navigate complex healthcare systems and insurance claims.',
    price: 95,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 4.9,
    reviews: 187,
    specialty: 'Insurance Navigation',
  },
  {
    id: 3,
    name: 'James Chen',
    username: 'JamesChen',
    title: 'Healthcare attorney turned advocate. Expert in patient rights and medical billing disputes.',
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
    title: 'Pediatric specialist helping parents navigate childhood illness and developmental care.',
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
    title: 'Former hospital administrator. Helps patients understand treatment options and hospital procedures.',
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
    title: 'Mental health advocate specializing in treatment access and insurance coverage for therapy.',
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
    title: 'Chronic illness survivor. Guides patients through long-term care planning and disability claims.',
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
    title: 'Elder care specialist helping families navigate Medicare, nursing homes, and end-of-life care.',
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
    title: 'Former ER physician now advocating for patients dealing with emergency care and trauma recovery.',
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
    title: 'Registered nurse helping patients understand diagnoses, treatment plans, and medication management.',
    price: 100,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 4.8,
    reviews: 156,
    specialty: 'Treatment Planning',
  },
  {
    id: 11,
    name: 'David Kim',
    username: 'DavidKim',
    title: 'Insurance specialist who helps patients maximize benefits and appeal denied claims.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 5.0,
    reviews: 234,
    specialty: 'Insurance Claims',
  },
  {
    id: 12,
    name: 'Jennifer Moore',
    username: 'JenniferMoore',
    title: 'Rare disease advocate connecting patients with specialists, clinical trials, and support groups.',
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
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-black" data-testid="logo">PatientAdvocate</h1>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors" data-testid="nav-browse">Find an Advocate</a>
              <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors" data-testid="nav-how">How it works</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm text-gray-600 hover:text-black transition-colors" data-testid="button-login">Log in</button>
            <button className="bg-black text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-800 transition-colors" data-testid="button-signup">Sign up</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-3" data-testid="hero-title">Find your patient advocate. Book a consultation.</h2>
        <p className="text-xl text-gray-500" data-testid="hero-subtitle">Get expert healthcare guidance over a video call.</p>
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
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
              data-testid={`category-${cat.id}`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-600" data-testid="text-results">
            Connect with experienced advocates who help you navigate healthcare
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
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
            <h3 className="text-2xl font-bold text-black" data-testid="section-title">Top Patient Advocates</h3>
            <p className="text-gray-500 text-sm mt-1">Trusted professionals ready to help you navigate your healthcare journey</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors" data-testid="button-see-all">
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
            <div
              key={advocate.id}
              className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer"
              data-testid={`card-advocate-${advocate.id}`}
            >
              {/* Favorite Button */}
              <button 
                className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                data-testid={`button-favorite-${advocate.id}`}
              >
                <Heart className="w-4 h-4 text-gray-600" />
              </button>

              {/* Top Advocate Badge */}
              {advocate.isTopExpert && (
                <div className="absolute top-3 left-3 z-10 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-blue-500 text-blue-500" />
                  Top Advocate
                </div>
              )}

              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
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
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>

                <p className="text-xs text-blue-600 font-medium mb-2">{advocate.specialty}</p>
                
                <p className="text-lg font-bold text-black mb-2" data-testid={`text-price-${advocate.id}`}>
                  ${advocate.price} <span className="text-sm font-normal text-gray-500">• Consultation</span>
                </p>

                <p className="text-sm text-gray-600 line-clamp-2" data-testid={`text-title-${advocate.id}`}>
                  {advocate.title}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium text-black">{advocate.rating}</span>
                  <span className="text-sm text-gray-400">({advocate.reviews} reviews)</span>
                </div>
              </div>

              {/* Book Consultation Button */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-4 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  className="w-full bg-black text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors"
                  data-testid={`button-book-${advocate.id}`}
                >
                  Book Consultation
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500">
          © 2026 PatientAdvocate. Empowering patients to navigate healthcare with confidence.
        </div>
      </footer>
    </div>
  );
}
