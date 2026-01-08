import React, { useState } from 'react';
import { Heart, ChevronDown, Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'all', label: 'All Experts', icon: '👥' },
  { id: 'top', label: 'Top Experts', icon: '⭐' },
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'wellness', label: 'Wellness', icon: '🧘' },
  { id: 'career', label: 'Career & Business', icon: '💼' },
  { id: 'style', label: 'Style & Beauty', icon: '✨' },
  { id: 'astrology', label: 'Astrology & more', icon: '🔮' },
];

const experts = [
  {
    id: 1,
    name: 'Alexis Ohanian',
    username: 'AlexisOhanian',
    title: 'Founder of Reddit, Initialized, & 776 (100% to charity)',
    price: 2000,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 5.0,
    reviews: 48,
  },
  {
    id: 2,
    name: 'Alli Webb',
    username: 'AlliWebb',
    title: 'Founder of Drybar (sold for $255M) Shark Tank Judge, NYT Best Selling Author',
    price: 550,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 4.9,
    reviews: 127,
  },
  {
    id: 3,
    name: 'Nicolas Jammet',
    username: 'NicolasJammet',
    title: 'Co-founder of Sweetgreen. NYSE: $SG. Valued $5B+.',
    price: 500,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 5.0,
    reviews: 89,
  },
  {
    id: 4,
    name: 'Paul English',
    username: 'PaulEnglish',
    title: 'Co-founder of KAYAK (IPO then $2B exit). Total six exits. Founded five nonprofits.',
    price: 1300,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 4.8,
    reviews: 64,
  },
  {
    id: 5,
    name: 'Nikita Bier',
    username: 'NikitaBier',
    title: 'Co-founder of Gas, acquired by Discord. Co-founder of TBH, acquired by Facebook.',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 5.0,
    reviews: 156,
  },
  {
    id: 6,
    name: 'Heidi Zak',
    username: 'HeidiZak',
    title: 'CEO of Thirdlove, an intimates brand with over 5 million customers',
    price: 400,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 4.9,
    reviews: 93,
  },
  {
    id: 7,
    name: 'Jason Tan',
    username: 'JasonTan',
    title: 'Founded & led sift.com (AI security, $1.5B+) thru $100M ARR, 400 people',
    price: 450,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 4.7,
    reviews: 78,
  },
  {
    id: 8,
    name: 'Nancy Twine',
    username: 'NancyTwine',
    title: 'Founder of Briogeo (Acq. by Wella). EY Entrepreneur of the Year FL (2024)',
    price: 1000,
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 5.0,
    reviews: 112,
  },
  {
    id: 9,
    name: 'Brian Lee',
    username: 'BrianLee',
    title: 'Co-Founder of LegalZoom ($2B IPO), The Honest Company ($1B IPO), ShoeDazzle',
    price: 1750,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 4.9,
    reviews: 87,
  },
  {
    id: 10,
    name: 'Sarah Leary',
    username: 'SarahLeary',
    title: 'Co-founder of Nextdoor. Investor. Board Member. Entrepreneur in Residence, Harvard.',
    price: 470,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 4.8,
    reviews: 56,
  },
  {
    id: 11,
    name: 'Andrew Chen',
    username: 'AndrewChen',
    title: 'General Partner at Andreessen Horowitz. Author of The Cold Start Problem.',
    price: 2000,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 5.0,
    reviews: 203,
  },
  {
    id: 12,
    name: 'Neil Parikh',
    username: 'NeilParikh',
    title: 'Co-Founder of Casper. Investor in 150+ startups (Affirm, Reddit, Relativity)',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face',
    isTopExpert: true,
    rating: 4.9,
    reviews: 134,
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
            <h1 className="text-2xl font-bold text-black" data-testid="logo">intro</h1>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors" data-testid="nav-browse">Browse</a>
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
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-3" data-testid="hero-title">Choose an expert. Book a session.</h2>
        <p className="text-xl text-gray-500" data-testid="hero-subtitle">Get advice over a video call.</p>
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
            Book in-demand experts & get advice over a video call
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
            <h3 className="text-2xl font-bold text-black" data-testid="section-title">Top Experts</h3>
            <p className="text-gray-500 text-sm mt-1">Access to the best experts has never been easier</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors" data-testid="button-see-all">
            See all
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expert Cards Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {experts.map((expert) => (
            <div
              key={expert.id}
              className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer"
              data-testid={`card-expert-${expert.id}`}
            >
              {/* Favorite Button */}
              <button 
                className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                data-testid={`button-favorite-${expert.id}`}
              >
                <Heart className="w-4 h-4 text-gray-600" />
              </button>

              {/* Top Expert Badge */}
              {expert.isTopExpert && (
                <div className="absolute top-3 left-3 z-10 bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  Top Expert
                </div>
              )}

              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={expert.image}
                  alt={expert.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-black" data-testid={`text-name-${expert.id}`}>{expert.name}</h4>
                  {expert.isTopExpert && (
                    <div className="w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                
                <p className="text-lg font-bold text-black mb-2" data-testid={`text-price-${expert.id}`}>
                  ${expert.price.toLocaleString()} <span className="text-sm font-normal text-gray-500">• Session</span>
                </p>

                <p className="text-sm text-gray-600 line-clamp-2" data-testid={`text-title-${expert.id}`}>
                  {expert.title}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium text-black">{expert.rating}</span>
                  <span className="text-sm text-gray-400">({expert.reviews} reviews)</span>
                </div>
              </div>

              {/* See Times Button */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-4 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  className="w-full bg-black text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors"
                  data-testid={`button-see-times-${expert.id}`}
                >
                  See Times
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500">
          © 2026 Intro. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
