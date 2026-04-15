import React, { useState } from 'react';
import { Link } from 'wouter';
import {
  LayoutDashboard, FolderOpen, CalendarDays, DollarSign, Settings,
  Clock, CheckCircle, AlertCircle, Video, FileText, Send, FilePlus,
  ChevronRight, ArrowRight, LogOut, Menu, X,
  Award, Shield, BookOpen, Upload, Plus, AlertTriangle, GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Mock data ──────────────────────────────────────────────────────────────

const STATS = [
  { label: 'Active cases', value: '6' },
  { label: 'Pending requests', value: '3' },
  { label: 'Sessions this week', value: '8' },
  { label: 'Earnings this month', value: '$4,200' },
];

const PENDING_REQUESTS = [
  {
    id: 1,
    patient: 'Sarah M.',
    age: 52,
    situation: 'Stage III breast cancer — seeking second opinion on treatment plan and guidance through insurance appeals',
    urgency: 'urgent' as const,
    requestedAt: '2 hours ago',
    specialty: 'Oncology',
  },
  {
    id: 2,
    patient: 'Robert K.',
    age: 67,
    situation: 'Medicare billing dispute — $18,000 unexpected balance bill after hip replacement surgery',
    urgency: 'soon' as const,
    requestedAt: '1 day ago',
    specialty: 'Insurance & Billing',
  },
  {
    id: 3,
    patient: 'Linda T.',
    age: 45,
    situation: 'Rare autoimmune condition — prior authorization denied for specialty medication, needs urgent appeal',
    urgency: 'soon' as const,
    requestedAt: '2 days ago',
    specialty: 'Rare Diseases',
  },
];

const ACTIVE_CASES = [
  {
    id: 1,
    patient: 'Patient A',
    specialty: 'Oncology',
    lastActivity: '1 day ago',
    status: 'Active' as const,
  },
  {
    id: 2,
    patient: 'Patient B',
    specialty: 'Insurance & Billing',
    lastActivity: '3 days ago',
    status: 'Awaiting docs' as const,
  },
  {
    id: 3,
    patient: 'Patient C',
    specialty: 'Rare Diseases',
    lastActivity: '1 day ago',
    status: 'Active' as const,
  },
  {
    id: 4,
    patient: 'Patient D',
    specialty: 'Cardiology',
    lastActivity: '5 days ago',
    status: 'Scheduled' as const,
  },
  {
    id: 5,
    patient: 'Patient E',
    specialty: 'Mental Health',
    lastActivity: '2 days ago',
    status: 'Awaiting docs' as const,
  },
  {
    id: 6,
    patient: 'Patient F',
    specialty: 'Insurance & Billing',
    lastActivity: '4 hours ago',
    status: 'Active' as const,
  },
];

const UPCOMING_SESSIONS = [
  {
    id: 1,
    patient: 'Patient A',
    time: 'Today, 2:00 PM',
    type: 'Video call',
  },
  {
    id: 2,
    patient: 'Patient C',
    time: 'Tomorrow, 10:30 AM',
    type: 'Video call',
  },
  {
    id: 3,
    patient: 'Patient F',
    time: 'Apr 7, 9:00 AM',
    type: 'Phone call',
  },
];

// ── Credentials & CE data ─────────────────────────────────────────────────
const MY_CERTIFICATIONS = [
  {
    id: 1,
    body: 'Patient Advocate Certification Board (PACB)',
    name: 'Board Certified Patient Advocate',
    abbr: 'BCPA',
    number: 'BCPA-2021-4892',
    issuedDate: 'Jan 15, 2021',
    expiryDate: 'Dec 31, 2026',
    status: 'verified' as const,
    daysUntilExpiry: 272,
  },
  {
    id: 2,
    body: 'Massachusetts Board of Registration in Nursing',
    name: 'Registered Nurse',
    abbr: 'RN',
    number: 'MA-RN-882941',
    issuedDate: 'Jun 1, 2003',
    expiryDate: 'Jun 30, 2026',
    status: 'verified' as const,
    daysUntilExpiry: 87,
  },
];

const CE_LOG = [
  { id: 1, course: 'Insurance Appeals: Advanced Strategies',   provider: 'NAHAC',  credits: 4, date: 'Mar 10, 2026', source: 'uploaded' as const },
  { id: 2, course: 'Health Literacy in Patient Navigation',    provider: 'PACB',   credits: 3, date: 'Jan 22, 2026', source: 'uploaded' as const },
  { id: 3, course: 'HIPAA Compliance for Advocates',           provider: 'Brivon', credits: 2, date: 'Dec 5, 2025',  source: 'auto'     as const },
];

const CE_COURSES = [
  { id: 1, title: 'Navigating Prior Authorization Denials',     provider: 'Brivon', credits: 3, duration: '2.5 hrs', level: 'Intermediate', category: 'Insurance & Appeals' },
  { id: 2, title: 'Oncology Patient Navigation Fundamentals',   provider: 'ACCC',   credits: 5, duration: '4 hrs',   level: 'Foundational',  category: 'Cancer Care'        },
  { id: 3, title: 'Mental Health Advocacy & Care Coordination', provider: 'NAHAC',  credits: 4, duration: '3 hrs',   level: 'Intermediate', category: 'Mental Health'      },
  { id: 4, title: 'Billing Error Detection & Recovery',         provider: 'Brivon', credits: 2, duration: '1.5 hrs', level: 'All levels',   category: 'Insurance & Appeals' },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: 'Active' | 'Awaiting docs' | 'Scheduled' }) {
  const styles = {
    Active: 'bg-accent/10 text-accent border-accent/20',
    'Awaiting docs': 'bg-amber-50 text-amber-800 border-amber-200',
    Scheduled: 'bg-primary/10 text-primary border-primary/20',
  };
  return (
    <span className={cn('inline-flex px-2 py-0.5 border rounded-full text-xs font-medium', styles[status])}>
      {status}
    </span>
  );
}

function UrgencyBadge({ urgency }: { urgency: 'urgent' | 'soon' }) {
  if (urgency === 'urgent') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-destructive/10 border border-destructive/20 rounded-full text-xs font-medium text-destructive">
        <AlertCircle className="w-3 h-3" /> Urgent
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-medium text-amber-800">
      <Clock className="w-3 h-3" /> Soon
    </span>
  );
}

type NavTab = 'overview' | 'cases' | 'schedule' | 'earnings' | 'credentials' | 'availability' | 'settings';

const NAV_ITEMS: { id: NavTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview',     label: 'Overview',     icon: LayoutDashboard },
  { id: 'cases',        label: 'Cases',        icon: FolderOpen      },
  { id: 'availability', label: 'Availability', icon: CalendarDays    },
  { id: 'schedule',     label: 'Schedule',     icon: Clock           },
  { id: 'earnings',     label: 'Earnings',     icon: DollarSign      },
  { id: 'credentials',  label: 'Credentials',  icon: Award           },
  { id: 'settings',     label: 'Settings',     icon: Settings        },
];

// ── Availability tab ───────────────────────────────────────────────────────

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIMES = ['7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'];

type DaySchedule = { enabled: boolean; start: string; end: string };
type WeekSchedule = Record<string, DaySchedule>;

const DEFAULT_SCHEDULE: WeekSchedule = {
  Monday:    { enabled: true,  start: '09:00', end: '17:00' },
  Tuesday:   { enabled: true,  start: '09:00', end: '17:00' },
  Wednesday: { enabled: true,  start: '10:00', end: '15:00' },
  Thursday:  { enabled: true,  start: '09:00', end: '17:00' },
  Friday:    { enabled: false, start: '09:00', end: '17:00' },
  Saturday:  { enabled: false, start: '09:00', end: '12:00' },
  Sunday:    { enabled: false, start: '09:00', end: '12:00' },
};

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

function AvailabilityTab() {
  const [schedule, setSchedule] = useState<WeekSchedule>(DEFAULT_SCHEDULE);
  const [buffer, setBuffer] = useState('15');
  const [minNotice, setMinNotice] = useState('24');
  const [bookingWindow, setBookingWindow] = useState('60');
  const [saved, setSaved] = useState(false);

  function updateDay(day: string, updates: Partial<DaySchedule>) {
    setSchedule(s => ({ ...s, [day]: { ...s[day], ...updates } }));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const enabledDays = DAYS.filter(d => schedule[d]?.enabled);

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground mb-1">Availability</h2>
        <p className="text-sm text-muted-foreground">Set your weekly hours. Patients can book sessions within your available windows.</p>
      </div>

      {/* Weekly schedule */}
      <div className="space-y-2">
        {DAYS.map(day => {
          const { enabled, start, end } = schedule[day];
          return (
            <div key={day} className={cn("flex items-center gap-4 px-4 py-3 rounded-lg border transition-colors", enabled ? "border-border bg-background" : "border-border/50 bg-muted/30")}>
              <label className="flex items-center gap-2.5 cursor-pointer w-32 flex-shrink-0">
                <div
                  onClick={() => updateDay(day, { enabled: !enabled })}
                  className={cn("w-9 h-5 rounded-full flex items-center transition-colors cursor-pointer flex-shrink-0", enabled ? "bg-primary" : "bg-muted-foreground/30")}
                >
                  <div className={cn("w-4 h-4 rounded-full bg-white shadow-sm transition-transform mx-0.5", enabled ? "translate-x-4" : "translate-x-0")} />
                </div>
                <span className={cn("text-sm font-medium", enabled ? "text-foreground" : "text-muted-foreground")}>{day.slice(0, 3)}</span>
              </label>

              {enabled ? (
                <div className="flex items-center gap-2 flex-1">
                  <select
                    value={start}
                    onChange={e => updateDay(day, { start: e.target.value })}
                    className="text-sm border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {TIMES.map(t => <option key={t} value={t}>{formatTime(t)}</option>)}
                  </select>
                  <span className="text-xs text-muted-foreground">to</span>
                  <select
                    value={end}
                    onChange={e => updateDay(day, { end: e.target.value })}
                    className="text-sm border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {TIMES.filter(t => t > start).map(t => <option key={t} value={t}>{formatTime(t)}</option>)}
                  </select>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Unavailable</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Booking settings */}
      <div className="border border-border rounded-lg p-4 space-y-4">
        <p className="text-sm font-semibold text-foreground">Booking settings</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Buffer between sessions</label>
            <select value={buffer} onChange={e => setBuffer(e.target.value)} className="w-full text-sm border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="0">No buffer</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Minimum notice</label>
            <select value={minNotice} onChange={e => setMinNotice(e.target.value)} className="w-full text-sm border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="4">4 hours</option>
              <option value="24">24 hours</option>
              <option value="48">48 hours</option>
              <option value="72">72 hours</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Booking window</label>
            <select value={bookingWindow} onChange={e => setBookingWindow(e.target.value)} className="w-full text-sm border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="14">2 weeks ahead</option>
              <option value="30">1 month ahead</option>
              <option value="60">2 months ahead</option>
              <option value="90">3 months ahead</option>
            </select>
          </div>
        </div>
      </div>

      {enabledDays.length > 0 && (
        <div className="p-3 bg-muted/50 border border-border rounded-lg text-xs text-muted-foreground">
          Available <span className="font-medium text-foreground">{enabledDays.map(d => d.slice(0, 3)).join(', ')}</span>.
          Sessions bookable up to <span className="font-medium text-foreground">{bookingWindow} days</span> in advance with <span className="font-medium text-foreground">{minNotice}h</span> minimum notice.
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          Save availability
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-primary">
            <CheckCircle className="w-4 h-4" /> Saved
          </span>
        )}
      </div>
    </div>
  );
}

export default function AdvocateDashboard() {
  const [activeTab, setActiveTab]     = useState<NavTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddCert, setShowAddCert] = useState(false);
  const [showLogCE,   setShowLogCE]   = useState(false);
  const [certForm, setCertForm]       = useState({ name: '', body: '', number: '', issued: '', expiry: '' });
  const [ceForm,   setCeForm]         = useState({ course: '', provider: '', credits: '', date: '' });
  const ceCreditsTotal = CE_LOG.reduce((sum, e) => sum + e.credits, 0);

  return (
    <div className="flex min-h-screen bg-background">

      {/* ── Mobile sidebar overlay ──────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Side nav rail ───────────────────────────────────────────────── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-56 bg-background border-r border-border flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-border">
          <Link href="/">
            <span className="font-display text-xl text-foreground font-bold cursor-pointer hover:opacity-80 transition-opacity">
              Brivon
            </span>
          </Link>
          <button
            className="lg:hidden p-1 rounded-md text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Advocate badge */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2 px-2 py-1.5 bg-muted rounded-lg">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-primary">AD</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">Dr. Alex Davis</p>
              <p className="text-[10px] text-muted-foreground">Advocate Portal</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-3 space-y-0.5" role="navigation">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-border">
          <Link href="/">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <LogOut className="w-4 h-4 flex-shrink-0" />
              Exit portal
            </button>
          </Link>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Top bar */}
        <div className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-display text-lg font-semibold text-foreground">
              {NAV_ITEMS.find(n => n.id === activeTab)?.label}
            </h1>
          </div>
        </div>

        {/* Page body */}
        <div className="flex-1 p-4 lg:p-8 overflow-auto">

          {activeTab === 'overview' && (
            <div className="space-y-8">

              {/* Setup checklist banner — shown until all steps complete */}
              <div className="border border-primary/20 bg-primary/5 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Finish setting up your profile</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Complete these steps before your first patient can book you.</p>
                  </div>
                  <span className="text-xs text-primary font-medium">2 of 4 done</span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Credentials verified', done: true },
                    { label: 'E&O insurance confirmed', done: true },
                    { label: 'Set your availability', done: false, tab: 'availability' as NavTab },
                    { label: 'Add a package or session rate', done: false, href: '/onboard' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2.5">
                      <div className={cn("w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0", item.done ? "bg-primary" : "border-2 border-border")}>
                        {item.done && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <span className={cn("text-sm flex-1", item.done ? "text-muted-foreground line-through" : "text-foreground")}>{item.label}</span>
                      {!item.done && item.tab && (
                        <button onClick={() => setActiveTab(item.tab!)} className="text-xs text-primary hover:underline">Set up →</button>
                      )}
                      {!item.done && item.href && (
                        <a href={item.href} className="text-xs text-primary hover:underline">Add →</a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((stat) => (
                  <div key={stat.label} className="bg-background border border-border rounded-2xl p-5">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="mt-1 text-2xl font-display font-bold text-foreground">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Main grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Left: Pending requests + Active cases */}
                <div className="xl:col-span-2 space-y-6">

                  {/* Pending requests */}
                  <section>
                    <h2 className="font-display text-base font-semibold text-foreground mb-3">
                      Pending requests
                    </h2>
                    <div className="space-y-3">
                      {PENDING_REQUESTS.map((req) => (
                        <div
                          key={req.id}
                          className="bg-background border border-border rounded-2xl p-5 space-y-3"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm text-foreground">{req.patient}</span>
                              <span className="text-xs text-muted-foreground">Age {req.age} · {req.specialty}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <UrgencyBadge urgency={req.urgency} />
                              <span className="text-xs text-muted-foreground">{req.requestedAt}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{req.situation}</p>
                          <div className="flex gap-2">
                            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                              Accept
                            </button>
                            <button className="bg-muted text-foreground px-4 py-2 rounded-full text-sm font-semibold hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Active cases */}
                  <section>
                    <h2 className="font-display text-base font-semibold text-foreground mb-3">
                      Active cases
                    </h2>
                    <div className="bg-background border border-border rounded-2xl overflow-hidden">
                      <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-5 py-3 border-b border-border bg-muted/50">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Patient</span>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Specialty</span>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Last activity</span>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</span>
                      </div>
                      <ul className="divide-y divide-border">
                        {ACTIVE_CASES.map((c) => (
                          <li key={c.id} className="px-5 py-4">
                            {/* Mobile layout */}
                            <div className="flex items-start justify-between gap-2 sm:hidden">
                              <div className="space-y-1">
                                <p className="text-sm font-semibold text-foreground">{c.patient}</p>
                                <p className="text-xs text-muted-foreground">{c.specialty} · {c.lastActivity}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1.5">
                                <StatusBadge status={c.status} />
                                <Link href="/cases">
                                  <span className="text-xs text-primary font-medium hover:underline cursor-pointer">View case</span>
                                </Link>
                              </div>
                            </div>
                            {/* Desktop layout */}
                            <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto] gap-4 items-center">
                              <p className="text-sm font-semibold text-foreground">{c.patient}</p>
                              <p className="text-sm text-muted-foreground">{c.specialty}</p>
                              <p className="text-sm text-muted-foreground">{c.lastActivity}</p>
                              <div className="flex items-center gap-3">
                                <StatusBadge status={c.status} />
                                <Link href="/cases">
                                  <span className="text-sm text-primary font-medium hover:underline cursor-pointer flex items-center gap-0.5">
                                    View case <ChevronRight className="w-3.5 h-3.5" />
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>
                </div>

                {/* Right sidebar */}
                <div className="space-y-6">

                  {/* Upcoming sessions */}
                  <section className="bg-background border border-border rounded-2xl p-5">
                    <h2 className="font-display text-base font-semibold text-foreground mb-4">
                      Upcoming sessions
                    </h2>
                    <div className="space-y-3">
                      {UPCOMING_SESSIONS.map((s) => (
                        <div key={s.id} className="flex items-center justify-between gap-3 p-3 bg-muted rounded-xl">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Video className="w-4 h-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{s.patient}</p>
                              <p className="text-xs text-muted-foreground">{s.time}</p>
                            </div>
                          </div>
                          <button className="flex-shrink-0 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            Join
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Quick actions */}
                  <section className="bg-background border border-border rounded-2xl p-5">
                    <h2 className="font-display text-base font-semibold text-foreground mb-4">
                      Quick actions
                    </h2>
                    <div className="space-y-2">
                      {[
                        { label: 'Add session notes', icon: FileText },
                        { label: 'Request documents', icon: FilePlus },
                        { label: 'Send message', icon: Send },
                      ].map(({ label, icon: Icon }) => (
                        <button
                          key={label}
                          className="w-full flex items-center gap-3 px-4 py-3 bg-muted rounded-xl text-sm font-medium text-foreground hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="flex-1 text-left">{label}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}

          {/* ── CREDENTIALS TAB ──────────────────────────────────────── */}
          {activeTab === 'credentials' && (
            <div className="space-y-6 max-w-3xl">

              {/* Renewal alerts */}
              {MY_CERTIFICATIONS.filter(c => c.daysUntilExpiry <= 90).map(cert => (
                <div key={cert.id} className="flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {cert.abbr} renews in {cert.daysUntilExpiry} days — {cert.expiryDate}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Submit renewal documents before {cert.expiryDate} to avoid a lapse in your verified status on Brivon.
                    </p>
                  </div>
                  <button className="text-xs font-semibold text-amber-700 hover:underline flex-shrink-0">Renew →</button>
                </div>
              ))}

              {/* Certifications list */}
              <div className="border border-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-foreground">My certifications</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Verified credentials appear on your public profile with a Brivon badge</p>
                  </div>
                  <button
                    onClick={() => setShowAddCert(v => !v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                <div className="divide-y divide-border">
                  {MY_CERTIFICATIONS.map(cert => (
                    <div key={cert.id} className="flex items-start gap-4 px-5 py-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <span className="font-semibold text-foreground text-sm">{cert.name}</span>
                          <span className="text-xs font-mono text-muted-foreground">{cert.abbr}</span>
                          {cert.status === 'verified' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-full text-xs font-medium text-accent">
                              <CheckCircle className="w-3 h-3" /> Verified by Brivon
                            </span>
                          )}
                          {cert.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-medium text-amber-800">
                              <Clock className="w-3 h-3" /> Under review
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{cert.body}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          #{cert.number} · Issued {cert.issuedDate} ·{' '}
                          <span className={cert.daysUntilExpiry <= 90 ? 'text-amber-700 font-medium' : ''}>
                            Valid through {cert.expiryDate}
                          </span>
                        </p>
                      </div>
                      <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 mt-0.5">Edit</button>
                    </div>
                  ))}
                </div>

                {/* Add cert form */}
                {showAddCert && (
                  <div className="border-t border-border px-5 py-5 bg-muted/30 space-y-4">
                    <h3 className="text-sm font-semibold text-foreground">Add certification</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Certification name</label>
                        <input type="text" value={certForm.name} onChange={e => setCertForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="e.g. Board Certified Patient Advocate"
                          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Issuing body</label>
                        <input type="text" value={certForm.body} onChange={e => setCertForm(f => ({ ...f, body: e.target.value }))}
                          placeholder="e.g. PACB"
                          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Certification number</label>
                        <input type="text" value={certForm.number} onChange={e => setCertForm(f => ({ ...f, number: e.target.value }))}
                          placeholder="e.g. BCPA-2024-0001"
                          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Issue date</label>
                        <input type="date" value={certForm.issued} onChange={e => setCertForm(f => ({ ...f, issued: e.target.value }))}
                          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Expiry date</label>
                        <input type="date" value={certForm.expiry} onChange={e => setCertForm(f => ({ ...f, expiry: e.target.value }))}
                          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Verification document</label>
                        <div className="flex items-center gap-3 px-3 py-2.5 bg-background border border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                          <Upload className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">Upload certificate PDF — reviewed within 2 business days</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setShowAddCert(false)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        Submit for verification
                      </button>
                      <button onClick={() => setShowAddCert(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Continuing education */}
              <div className="border border-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h2 className="font-semibold text-foreground">Continuing education</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">BCPA renewal cycle · Jan 2024 – Dec 2026 · 30 credits required</p>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0 mt-0.5">{30 - ceCreditsTotal} credits remaining</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-foreground">{ceCreditsTotal} of 30 credits logged</span>
                    <span className="text-xs text-muted-foreground">Due Dec 31, 2026</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(ceCreditsTotal / 30) * 100}%` }} />
                  </div>
                </div>

                {/* CE log */}
                <div className="px-5 py-4 border-b border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground">Credit log</h3>
                    <button onClick={() => setShowLogCE(v => !v)}
                      className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                      <Plus className="w-3.5 h-3.5" /> Log credits
                    </button>
                  </div>
                  <div className="space-y-3">
                    {CE_LOG.map(entry => (
                      <div key={entry.id} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-3.5 h-3.5 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{entry.course}</p>
                          <p className="text-xs text-muted-foreground">{entry.provider} · {entry.date}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-semibold text-foreground">{entry.credits} cr</p>
                          <p className="text-xs text-muted-foreground">{entry.source === 'auto' ? 'Auto-logged' : 'Certificate on file'}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Log CE form */}
                  {showLogCE && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">Log CE credits</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-muted-foreground mb-1">Course name</label>
                          <input type="text" value={ceForm.course} onChange={e => setCeForm(f => ({ ...f, course: e.target.value }))}
                            placeholder="Course or training title"
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">Provider</label>
                          <input type="text" value={ceForm.provider} onChange={e => setCeForm(f => ({ ...f, provider: e.target.value }))}
                            placeholder="e.g. NAHAC, PACB"
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">Credits</label>
                          <input type="number" value={ceForm.credits} onChange={e => setCeForm(f => ({ ...f, credits: e.target.value }))}
                            placeholder="0" min="0" max="20"
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">Completion date</label>
                          <input type="date" value={ceForm.date} onChange={e => setCeForm(f => ({ ...f, date: e.target.value }))}
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">Certificate</label>
                          <div className="flex items-center gap-2 px-3 py-2 bg-background border border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                            <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Upload PDF</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setShowLogCE(false)}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                          Save
                        </button>
                        <button onClick={() => setShowLogCE(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-5 py-3 bg-muted/30">
                  <p className="text-xs text-muted-foreground">Credits from Brivon courses are auto-logged. External credits require a certificate upload and are reviewed within 2 business days.</p>
                </div>
              </div>

              {/* In-platform courses */}
              <div>
                <div className="mb-4">
                  <h2 className="font-semibold text-foreground">Courses available for credit</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Complete within Brivon — credits auto-logged to your CE record</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CE_COURSES.map(course => (
                    <div key={course.id} className="border border-border rounded-xl p-4 bg-background hover:border-primary/30 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm leading-snug">{course.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{course.provider} · {course.category}</p>
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary flex-shrink-0">
                          {course.credits} cr
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{course.duration} · {course.level}</span>
                        <button className="text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                          Start →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ── AVAILABILITY TAB ──────────────────────────────────────── */}
          {activeTab === 'availability' && <AvailabilityTab />}

          {activeTab !== 'overview' && activeTab !== 'credentials' && activeTab !== 'availability' && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-muted-foreground text-sm">
                {NAV_ITEMS.find(n => n.id === activeTab)?.label} — coming soon
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile bottom tab bar ─────────────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-background border-t border-border flex items-center">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors focus-visible:outline-none',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <Icon className={cn('w-5 h-5', isActive ? 'text-primary' : 'text-muted-foreground')} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom padding so content isn't hidden behind bottom tab bar on mobile */}
      <div className="lg:hidden h-16" />
    </div>
  );
}
