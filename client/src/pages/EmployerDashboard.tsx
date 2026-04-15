import React, { useState } from 'react';
import { Link, useSearch } from 'wouter';
import {
  Building2, TrendingUp, Shield, Download, ChevronDown,
  CheckCircle, Clock, Plus, ExternalLink, Lock, BarChart2,
  Phone, Mail, AlertTriangle, AlertCircle, FileCheck,
  Info, Users, ArrowRight, Inbox, LayoutDashboard, FileWarning,
  CreditCard, LogOut, Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Mock data ──────────────────────────────────────────────────────────────
const COMPANY = {
  name: 'Acme Health Partners',
  plan: 'Advocacy Plus',
  seatsTotal: 50,
  seatsUsed: 24,
  pricePerSeat: 29,
  renewsAt: 'April 30, 2026',
  contactEmail: 'benefits@acmehp.com',
};

const INSURANCE_PLAN = {
  carrier: 'BlueCross BlueShield',
  groupNumber: 'GRP-AHP-77842',
  planType: 'PPO',
  network: 'BlueCard PPO (Nationwide)',
  formulary: 'Standard 4-Tier',
  deductibleIndividual: '$1,500',
  deductibleFamily: '$3,000',
  oopMaxIndividual: '$5,000',
  oopMaxFamily: '$10,000',
  coinsurance: '80 / 20 in-network',
  effectiveDate: 'January 1, 2026',
  renewalDate: 'December 31, 2026',
};

const BENEFITS_COORDINATOR = {
  name: 'Dana Reyes',
  title: 'Senior Benefits Manager',
  email: 'dana.reyes@acmehp.com',
  phone: '(617) 555-0142',
  availability: 'Mon–Fri, 9 am–5 pm EST',
};

const KPIS = [
  { label: 'Seats used', value: '24 / 50', sub: '48% utilization', highlight: false },
  { label: 'Sessions this quarter', value: '156', sub: '+22% vs Q4 2025', highlight: false },
  { label: 'Avg. satisfaction', value: '4.8 / 5', sub: 'Based on 142 ratings', highlight: false },
  { label: 'Est. savings for team', value: '$138,400', sub: 'Avg. $8,650 / employee', highlight: true },
];

const EMPLOYEES = [
  { id: 1, name: 'Elena Torres',   dept: 'Engineering', specialty: 'Cancer Care',         sessions: 8, saved: '$18,200', status: 'Active',  lastActive: '1 day ago',  hipaa: 'signed',      literacy: 'high',   source: 'self' },
  { id: 2, name: 'Marcus Webb',    dept: 'Sales',       specialty: 'Insurance & Billing', sessions: 4, saved: '$7,400',  status: 'Active',  lastActive: '3 days ago', hipaa: 'signed',      literacy: 'medium', source: 'employer' },
  { id: 3, name: 'Priya Nair',     dept: 'HR',          specialty: 'Rare Diseases',       sessions: 6, saved: '$14,100', status: 'Active',  lastActive: '5 days ago', hipaa: 'signed',      literacy: 'high',   source: 'self' },
  { id: 4, name: 'Tom Bradley',    dept: 'Finance',     specialty: '—',                   sessions: 0, saved: '—',      status: 'Invited', lastActive: 'Never',      hipaa: 'not-started', literacy: '—',      source: 'employer' },
  { id: 5, name: 'Jess Park',      dept: 'Marketing',   specialty: 'Mental Health',       sessions: 3, saved: '$3,800',  status: 'Active',  lastActive: '2 days ago', hipaa: 'signed',      literacy: 'medium', source: 'self' },
  { id: 6, name: 'David Kim',      dept: 'Legal',       specialty: 'Insurance & Billing', sessions: 5, saved: '$12,600', status: 'Active',  lastActive: '1 week ago', hipaa: 'signed',      literacy: 'high',   source: 'employer' },
  { id: 7, name: 'Rachel Simmons', dept: 'Product',     specialty: 'Elder Care',          sessions: 2, saved: '$4,100',  status: 'Active',  lastActive: '4 days ago', hipaa: 'pending',     literacy: 'low',    source: 'self' },
  { id: 8, name: 'Amir Hassan',    dept: 'Engineering', specialty: '—',                   sessions: 0, saved: '—',      status: 'Pending', lastActive: 'Never',      hipaa: 'not-started', literacy: '—',      source: 'employer' },
];

const APPEALS = [
  {
    id: 1,
    employee: 'Elena Torres',
    type: 'Prior Authorization',
    service: 'PET Scan — Full Body',
    carrier: 'BCBS',
    denialDate: 'Mar 15, 2026',
    deadline: 'Apr 25, 2026',
    daysLeft: 22,
    status: 'In progress',
    advocate: 'Dr. Sarah Mitchell',
    priority: 'high',
  },
  {
    id: 2,
    employee: 'Marcus Webb',
    type: 'Claim Appeal',
    service: 'ER Visit — Out-of-network facility fee',
    carrier: 'BCBS',
    denialDate: 'Mar 28, 2026',
    deadline: 'May 10, 2026',
    daysLeft: 37,
    status: 'Draft',
    advocate: 'Maria Rodriguez',
    priority: 'medium',
  },
  {
    id: 3,
    employee: 'David Kim',
    type: 'External Review',
    service: 'Immunotherapy — 6-cycle course',
    carrier: 'BCBS',
    denialDate: 'Feb 12, 2026',
    deadline: 'Apr 8, 2026',
    daysLeft: 5,
    status: 'Submitted',
    advocate: 'James Chen',
    priority: 'urgent',
  },
  {
    id: 4,
    employee: 'Priya Nair',
    type: 'Prior Authorization',
    service: 'Enzyme replacement therapy',
    carrier: 'BCBS',
    denialDate: 'Mar 30, 2026',
    deadline: 'May 14, 2026',
    daysLeft: 41,
    status: 'Draft',
    advocate: 'Jennifer Moore',
    priority: 'medium',
  },
];

const RESOLVED_APPEALS = [
  {
    id: 101,
    employee: 'Elena Torres',
    type: 'Prior Authorization',
    service: 'MRI — Lumbar Spine',
    carrier: 'BCBS',
    denialDate: 'Jan 5, 2026',
    resolvedDate: 'Feb 2, 2026',
    outcome: 'Approved' as const,
    saved: '$4,200',
    advocate: 'Dr. Sarah Mitchell',
  },
  {
    id: 102,
    employee: 'Jess Park',
    type: 'Claim Appeal',
    service: 'Outpatient therapy — 12 sessions',
    carrier: 'BCBS',
    denialDate: 'Dec 14, 2025',
    resolvedDate: 'Jan 18, 2026',
    outcome: 'Approved' as const,
    saved: '$3,800',
    advocate: 'Lisa Park',
  },
  {
    id: 103,
    employee: 'David Kim',
    type: 'Claim Appeal',
    service: 'Lab work — out-of-network billing error',
    carrier: 'BCBS',
    denialDate: 'Nov 20, 2025',
    resolvedDate: 'Dec 10, 2025',
    outcome: 'Corrected' as const,
    saved: '$1,400',
    advocate: 'James Chen',
  },
];

const INCOMING_REQUESTS = [
  {
    id: 1,
    employee: 'Tom Bradley',
    dept: 'Finance',
    requestDate: 'Apr 2, 2026',
    situation: 'Insurance denial — cardiac stress test not covered',
    urgency: 'urgent' as const,
    source: 'employer-referral' as const,
    hipaa: 'not-started' as const,
  },
  {
    id: 2,
    employee: 'Amir Hassan',
    dept: 'Engineering',
    requestDate: 'Apr 1, 2026',
    situation: 'Unexpected hospital bill after emergency surgery — $24,000',
    urgency: 'soon' as const,
    source: 'self' as const,
    hipaa: 'not-started' as const,
  },
];

const SPECIALTIES_BREAKDOWN = [
  { label: 'Insurance & Billing', count: 9, pct: 0.375 },
  { label: 'Cancer Care',         count: 6, pct: 0.25 },
  { label: 'Mental Health',       count: 4, pct: 0.167 },
  { label: 'Elder Care',          count: 3, pct: 0.125 },
  { label: 'Rare Diseases + Other', count: 2, pct: 0.083 },
];

const SESSIONS_BY_MONTH = [
  { month: 'Jan', count: 38 },
  { month: 'Feb', count: 45 },
  { month: 'Mar', count: 51 },
  { month: 'Apr (so far)', count: 22 },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function HipaaBadge({ status }: { status: string }) {
  if (status === 'signed') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-full text-xs font-medium text-accent">
      <FileCheck className="w-3 h-3" /> Signed
    </span>
  );
  if (status === 'pending') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-medium text-amber-800">
      <Clock className="w-3 h-3" /> Pending
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-destructive/10 border border-destructive/20 rounded-full text-xs font-medium text-destructive">
      <AlertCircle className="w-3 h-3" /> Not signed
    </span>
  );
}

function LiteracyBadge({ level }: { level: string }) {
  if (level === '—') return <span className="text-xs text-muted-foreground">—</span>;
  const colors: Record<string, string> = {
    high:   'bg-accent/10 text-accent border-accent/20',
    medium: 'bg-amber-50 text-amber-800 border-amber-200',
    low:    'bg-primary/10 text-primary border-primary/20',
  };
  return (
    <span className={cn("inline-flex px-2 py-0.5 border rounded-full text-xs font-medium capitalize", colors[level])}>
      {level}
    </span>
  );
}

function nextStep(status: string, daysLeft: number): { text: string; urgent: boolean } {
  if (status === 'Draft')        return { text: 'Not yet filed — advocate needs to submit before deadline', urgent: true };
  if (status === 'In progress')  return { text: 'Advocate building case — check for document requests', urgent: false };
  if (status === 'Submitted')    return daysLeft <= 7
    ? { text: 'Awaiting insurer decision — escalate if no response by deadline', urgent: true }
    : { text: 'Submitted — awaiting insurer decision', urgent: false };
  return { text: '', urgent: false };
}

type Tab = 'overview' | 'employees' | 'appeals' | 'billing';

export default function EmployerDashboard() {
  const search = useSearch();
  const initialTab = (new URLSearchParams(search).get('tab') as Tab) || 'overview';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMethodology, setShowMethodology] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [appealFilter, setAppealFilter] = useState<'all' | 'draft' | 'in-progress' | 'submitted' | 'resolved'>('all');

  const filteredEmployees = EMPLOYEES.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const monthlyCost = COMPANY.seatsTotal * COMPANY.pricePerSeat;
  const maxSessions = Math.max(...SESSIONS_BY_MONTH.map(m => m.count));
  const hipaaUnsigned = EMPLOYEES.filter(e => e.hipaa !== 'signed' && e.status === 'Active').length;
  const urgentAppeals = APPEALS.filter(a => a.daysLeft <= 7).length;

  const NAV_ITEMS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview',  label: 'Overview',       icon: LayoutDashboard },
    { id: 'employees', label: 'Employees',      icon: Users },
    { id: 'appeals',   label: 'Appeals',        icon: FileWarning },
    { id: 'billing',   label: 'Plan & Billing', icon: CreditCard },
  ];

  return (
    <div className="flex min-h-screen bg-background">

      {/* ── Side nav rail ─────────────────────────────────────────────────── */}
      <aside className="w-56 flex-shrink-0 bg-background border-r border-border flex flex-col">

        {/* Brand */}
        <div className="h-16 flex items-center px-5 border-b border-border">
          <Link href="/">
            <span className="font-display text-xl text-foreground font-bold cursor-pointer hover:opacity-80 transition-opacity">Brivon</span>
          </Link>
        </div>

        {/* Company badge */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2 px-2 py-1.5 bg-muted rounded-lg">
            <Building2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{COMPANY.name}</p>
              <p className="text-[10px] text-muted-foreground">Admin</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-3 space-y-0.5" role="navigation">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            const hasUrgentBadge = id === 'appeals' && urgentAppeals > 0;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : hasUrgentBadge
                      ? "text-destructive hover:bg-destructive/10"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                {hasUrgentBadge && (
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-[10px] font-bold">
                    {urgentAppeals}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="px-3 py-4 border-t border-border space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Download className="w-4 h-4 flex-shrink-0" />
            Export report
          </button>
          <Link href="/">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <LogOut className="w-4 h-4 flex-shrink-0" />
              Exit admin
            </button>
          </Link>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 overflow-auto">

        {/* Top bar */}
        <div className="h-16 border-b border-border flex items-center justify-between px-8">
          <h1 className="font-display text-lg font-semibold text-foreground">
            {NAV_ITEMS.find(n => n.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            {(() => {
              const totalAlerts = (urgentAppeals > 0 ? 1 : 0) + (INCOMING_REQUESTS.length > 0 ? 1 : 0) + (hipaaUnsigned > 0 ? 1 : 0);
              const notifItems = [
                urgentAppeals > 0 && {
                  icon: AlertTriangle,
                  iconClass: 'text-destructive',
                  label: `${urgentAppeals} appeal deadline${urgentAppeals > 1 ? 's' : ''} expire within 7 days`,
                  detail: APPEALS.filter(a => a.daysLeft <= 7).map(a => `${a.employee} — ${a.daysLeft}d left`).join(', '),
                  cta: 'Review appeals',
                  ctaClass: 'text-destructive hover:bg-destructive/10',
                  onClick: () => { setActiveTab('appeals'); setShowNotifications(false); },
                },
                INCOMING_REQUESTS.length > 0 && {
                  icon: Inbox,
                  iconClass: 'text-amber-600',
                  label: `${INCOMING_REQUESTS.length} request${INCOMING_REQUESTS.length > 1 ? 's' : ''} need an advocate assigned`,
                  detail: INCOMING_REQUESTS.map(r => r.employee).join(', '),
                  cta: 'Assign advocates',
                  ctaClass: 'text-amber-700 hover:bg-amber-50',
                  onClick: () => { setActiveTab('overview'); setShowNotifications(false); },
                },
                hipaaUnsigned > 0 && {
                  icon: AlertCircle,
                  iconClass: 'text-muted-foreground',
                  label: `${hipaaUnsigned} employee${hipaaUnsigned > 1 ? 's' : ''} missing HIPAA authorization`,
                  detail: "Advocates can't access records without it",
                  cta: 'Send reminders',
                  ctaClass: 'text-primary hover:bg-primary/5',
                  onClick: () => { setActiveTab('employees'); setShowNotifications(false); },
                },
              ].filter(Boolean) as NonNullable<typeof notifItems[number]>[];

              return (
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(v => !v)}
                    className="relative w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4.5 h-4.5" />
                    {totalAlerts > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive border-2 border-background" />
                    )}
                  </button>

                  {showNotifications && (
                    <>
                      {/* Backdrop */}
                      <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                      {/* Dropdown */}
                      <div className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-2xl shadow-lg z-20 overflow-hidden">
                        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground">Notifications</span>
                          {totalAlerts === 0
                            ? <span className="text-xs text-muted-foreground">All clear</span>
                            : <span className="text-xs font-medium text-muted-foreground">{totalAlerts} item{totalAlerts > 1 ? 's' : ''} need attention</span>
                          }
                        </div>
                        {totalAlerts === 0 ? (
                          <div className="px-4 py-8 text-center text-sm text-muted-foreground">No alerts right now.</div>
                        ) : (
                          <ul className="divide-y divide-border">
                            {notifItems.map((item, i) => {
                              const Icon = item.icon;
                              return (
                                <li key={i} className="px-4 py-3.5 space-y-1.5">
                                  <div className="flex items-start gap-2.5">
                                    <Icon className={cn('w-4 h-4 mt-0.5 flex-shrink-0', item.iconClass)} />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-foreground leading-snug">{item.label}</p>
                                      <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={item.onClick}
                                    className={cn('ml-6 text-xs font-semibold px-2.5 py-1 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', item.ctaClass)}
                                  >
                                    {item.cta} →
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })()}

            <button className="btn-book flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <Plus className="w-4 h-4" />
              Add seats
            </button>
          </div>
        </div>

      <div className="px-8 py-6">


        {/* Plan info sub-heading on overview */}
        {activeTab === 'overview' && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <p className="text-sm text-muted-foreground">
              {COMPANY.plan} · {COMPANY.seatsUsed} of {COMPANY.seatsTotal} seats active · Renews {COMPANY.renewsAt}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="w-3.5 h-3.5" />
              <span>Employee data is anonymized in all exports</span>
            </div>
          </div>
        )}

        {/* ── OVERVIEW TAB ──────────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">

            {/* KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {KPIS.map(kpi => (
                <div key={kpi.label} className={cn("rounded-2xl p-5 border", kpi.highlight ? "bg-primary/5 border-primary/20" : "bg-background border-border")}>
                  <div className={cn("font-display text-3xl font-bold mb-1", kpi.highlight ? "text-primary" : "text-foreground")}>{kpi.value}</div>
                  <div className="text-sm font-semibold text-foreground mb-0.5">{kpi.label}</div>
                  <div className="text-xs text-muted-foreground">{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* Incoming requests */}
            {INCOMING_REQUESTS.length > 0 && (
              <div className="bg-background border border-border rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Inbox className="w-4 h-4 text-muted-foreground" />
                    <h2 className="font-semibold text-foreground">Incoming requests</h2>
                    <span className="inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">{INCOMING_REQUESTS.length} new</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Assign an advocate to get started</p>
                </div>
                <div className="divide-y divide-border">
                  {INCOMING_REQUESTS.map(req => (
                    <div key={req.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-foreground">{req.employee}</span>
                          <span className="text-xs text-muted-foreground">{req.dept}</span>
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
                            req.urgency === 'urgent' ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-amber-50 text-amber-800 border-amber-200"
                          )}>
                            {req.urgency === 'urgent' && <AlertTriangle className="w-3 h-3" />}
                            {req.urgency === 'urgent' ? 'Urgent' : 'Soon'}
                          </span>
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border",
                            req.source === 'employer-referral' ? "bg-primary/5 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border"
                          )}>
                            {req.source === 'employer-referral' ? 'HR referral' : 'Self-initiated'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{req.situation}</p>
                        <p className="text-xs text-muted-foreground mt-1">Requested {req.requestDate}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <HipaaBadge status={req.hipaa} />
                        <button className="btn-book flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                          Assign advocate <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits coordinator + insurance plan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Coordinator */}
              <div className="bg-background border border-border rounded-2xl p-5 space-y-4">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  Benefits coordinator
                </h2>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0">
                    {BENEFITS_COORDINATOR.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{BENEFITS_COORDINATOR.name}</p>
                    <p className="text-xs text-muted-foreground">{BENEFITS_COORDINATOR.title}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <a href={`mailto:${BENEFITS_COORDINATOR.email}`} className="flex items-center gap-2 text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    {BENEFITS_COORDINATOR.email}
                  </a>
                  <a href={`tel:${BENEFITS_COORDINATOR.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    {BENEFITS_COORDINATOR.phone}
                  </a>
                  <p className="flex items-center gap-2 text-muted-foreground text-xs">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    {BENEFITS_COORDINATOR.availability}
                  </p>
                </div>
              </div>

              {/* Insurance plan quick reference */}
              <div className="bg-background border border-border rounded-2xl p-5 space-y-3">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  Insurance plan
                  <span className="ml-auto text-xs font-medium text-muted-foreground">{INSURANCE_PLAN.carrier}</span>
                </h2>
                <div className="space-y-2 text-sm">
                  {[
                    ['Group #',        INSURANCE_PLAN.groupNumber],
                    ['Plan type',      `${INSURANCE_PLAN.planType} — ${INSURANCE_PLAN.network}`],
                    ['Deductible',     `${INSURANCE_PLAN.deductibleIndividual} / ${INSURANCE_PLAN.deductibleFamily} (ind / fam)`],
                    ['OOP max',        `${INSURANCE_PLAN.oopMaxIndividual} / ${INSURANCE_PLAN.oopMaxFamily} (ind / fam)`],
                    ['Coinsurance',    INSURANCE_PLAN.coinsurance],
                    ['Formulary',      INSURANCE_PLAN.formulary],
                    ['Renews',         INSURANCE_PLAN.renewalDate],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-start justify-between gap-4">
                      <span className="text-muted-foreground flex-shrink-0">{label}</span>
                      <span className="font-medium text-foreground text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-background border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-semibold text-foreground">Sessions over time</h2>
                    <p className="text-xs text-muted-foreground">+22% vs last quarter</p>
                  </div>
                  <BarChart2 className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-end gap-4 h-36">
                  {SESSIONS_BY_MONTH.map(m => (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">{m.count}</span>
                      <div className="w-full rounded-t-md bg-primary/80" style={{ height: `${(m.count / maxSessions) * 100}%`, minHeight: '8px' }} />
                      <span className="text-xs text-muted-foreground text-center leading-tight">{m.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-background border border-border rounded-2xl p-6">
                <h2 className="font-semibold text-foreground mb-5">What employees need help with</h2>
                <div className="space-y-4">
                  {SPECIALTIES_BREAKDOWN.map(sp => (
                    <div key={sp.label}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-foreground">{sp.label}</span>
                        <span className="text-muted-foreground">{sp.count}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${sp.pct * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">{COMPANY.seatsUsed} of {COMPANY.seatsTotal} seats active</p>
              </div>
            </div>

            {/* Recent activity */}
            <div className="bg-background border border-border rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Recent employee activity</h2>
                <button onClick={() => setActiveTab('employees')} className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">View all →</button>
              </div>
              <div className="divide-y divide-border">
                {EMPLOYEES.filter(e => e.status === 'Active').slice(0, 5).map(emp => (
                  <div key={emp.id} className="flex items-center gap-4 px-6 py-3.5">
                    <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-semibold text-foreground flex-shrink-0">{emp.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">{emp.dept}</p>
                    </div>
                    <HipaaBadge status={emp.hipaa} />
                    <div className="hidden sm:block text-xs text-muted-foreground text-right">
                      <div>{emp.specialty}</div>
                      <div>{emp.sessions} sessions</div>
                    </div>
                    <div className="text-sm font-semibold text-accent text-right flex-shrink-0">{emp.saved}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── EMPLOYEES TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'employees' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name or department..."
                className="flex-1 max-w-sm px-4 py-2.5 border border-border rounded-lg bg-background text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button className="btn-book flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Plus className="w-4 h-4" /> Invite employees
              </button>
            </div>

            {/* HIPAA warning */}
            {hipaaUnsigned > 0 && (
              <div className="flex items-start gap-3 px-4 py-3 bg-destructive/5 border border-destructive/20 rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">{hipaaUnsigned} employee{hipaaUnsigned > 1 ? 's' : ''} haven't signed their HIPAA authorization</p>
                  <p className="text-muted-foreground text-xs mt-0.5">Advocates cannot access medical records or contact providers without a signed authorization. Send reminders to unblock their cases.</p>
                </div>
                <button className="ml-auto flex-shrink-0 text-xs font-semibold text-primary hover:underline">Send reminders</button>
              </div>
            )}

            <div className="bg-background border border-border rounded-2xl overflow-hidden">
              <div className="hidden md:grid grid-cols-[1fr_110px_120px_120px_80px_110px] gap-3 px-6 py-3 bg-muted border-b border-border text-xs font-semibold text-muted-foreground">
                <span>Employee</span>
                <span>HIPAA</span>
                <span>How they joined</span>
                <span>Health literacy</span>
                <span>Sessions</span>
                <span>Status</span>
              </div>

              <div className="divide-y divide-border">
                {filteredEmployees.map(emp => (
                  <div key={emp.id} className="grid grid-cols-1 md:grid-cols-[1fr_110px_120px_120px_80px_110px] gap-2 md:gap-3 items-center px-6 py-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-semibold text-foreground flex-shrink-0">{emp.name.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{emp.name}</p>
                        <p className="text-xs text-muted-foreground">{emp.dept} · {emp.specialty !== '—' ? emp.specialty : 'Not started'} · Last active {emp.lastActive}</p>
                      </div>
                    </div>
                    <HipaaBadge status={emp.hipaa} />
                    <span className={cn("text-xs font-medium", emp.source === 'employer' ? "text-primary" : "text-muted-foreground")}>
                      {emp.source === 'employer' ? 'HR referral' : 'Self'}
                    </span>
                    <LiteracyBadge level={emp.literacy} />
                    <span className="text-sm text-foreground font-medium">{emp.sessions}</span>
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border w-fit",
                      emp.status === 'Active'  ? "bg-accent/10 text-accent border-accent/20"
                      : emp.status === 'Invited' ? "bg-amber-50 text-amber-800 border-amber-200"
                      : "bg-muted text-muted-foreground border-border"
                    )}>
                      {emp.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                      {emp.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between px-6 py-3 bg-muted border-t border-border">
                <span className="text-xs text-muted-foreground">{COMPANY.seatsTotal - COMPANY.seatsUsed} of {COMPANY.seatsTotal} seats available</span>
                <button className="text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                  Invite {COMPANY.seatsTotal - COMPANY.seatsUsed} more →
                </button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <strong>Health literacy</strong> is self-reported by each employee during onboarding and helps advocates calibrate how they communicate.
            </p>
          </div>
        )}

        {/* ── APPEALS TAB ───────────────────────────────────────────────────── */}
        {activeTab === 'appeals' && (() => {
          const draftCount     = APPEALS.filter(a => a.status === 'Draft').length;
          const inProgCount    = APPEALS.filter(a => a.status === 'In progress').length;
          const submittedCount = APPEALS.filter(a => a.status === 'Submitted').length;

          const filtered = APPEALS
            .filter(a =>
              appealFilter === 'all'         ? true
              : appealFilter === 'draft'       ? a.status === 'Draft'
              : appealFilter === 'in-progress' ? a.status === 'In progress'
              : appealFilter === 'submitted'   ? a.status === 'Submitted'
              : false
            )
            .sort((a, b) => a.daysLeft - b.daysLeft);

          const FILTER_OPTIONS = [
            { id: 'all'         as const, label: 'All' },
            { id: 'draft'       as const, label: `Needs filing (${draftCount})` },
            { id: 'in-progress' as const, label: `In progress (${inProgCount})` },
            { id: 'submitted'   as const, label: `Waiting on insurer (${submittedCount})` },
            { id: 'resolved'    as const, label: `Resolved (${RESOLVED_APPEALS.length})` },
          ];

          return (
            <div className="space-y-4">

              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-foreground">
                    {APPEALS.length} active appeal{APPEALS.length !== 1 ? 's' : ''}
                    {urgentAppeals > 0 && <span className="text-destructive"> · {urgentAppeals} urgent</span>}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {draftCount > 0 && <span className="text-foreground font-medium">{draftCount} need{draftCount === 1 ? 's' : ''} filing</span>}
                    {draftCount > 0 && inProgCount > 0 && ' · '}
                    {inProgCount > 0 && `${inProgCount} in progress`}
                    {(draftCount > 0 || inProgCount > 0) && submittedCount > 0 && ' · '}
                    {submittedCount > 0 && `${submittedCount} awaiting insurer`}
                  </p>
                </div>
                <button className="flex-shrink-0 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                  <Download className="w-4 h-4" /> Export
                </button>
              </div>

              {/* Filter pills */}
              <div className="flex flex-wrap gap-1.5">
                {FILTER_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setAppealFilter(opt.id)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      appealFilter === opt.id
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Resolved view */}
              {appealFilter === 'resolved' ? (
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="px-4 py-3 bg-muted border-b border-border flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{RESOLVED_APPEALS.length} resolved this year</span>
                    <span className="text-xs text-muted-foreground">
                      ${RESOLVED_APPEALS.reduce((sum, a) => sum + parseInt(a.saved.replace(/\D/g, '')), 0).toLocaleString()} recovered
                    </span>
                  </div>
                  <div className="divide-y divide-border">
                    {RESOLVED_APPEALS.map(r => (
                      <div key={r.id} className="flex items-center gap-4 px-4 py-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground leading-snug">{r.service}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {r.employee} · {r.type} · with {r.advocate} · Resolved {r.resolvedDate}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
                            r.outcome === 'Approved' ? "bg-accent/10 text-accent border-accent/20" : "bg-primary/10 text-primary border-primary/20"
                          )}>
                            <CheckCircle className="w-3 h-3" /> {r.outcome}
                          </span>
                          <p className="text-xs font-semibold text-foreground mt-1">{r.saved} saved</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center border border-dashed border-border rounded-xl">
                  <CheckCircle className="w-8 h-8 text-accent mb-3" />
                  <p className="font-semibold text-foreground">All clear</p>
                  <p className="text-sm text-muted-foreground mt-1">No appeals match this filter.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map(appeal => {
                    const isUrgent = appeal.daysLeft <= 7;
                    const isWarn   = appeal.daysLeft <= 21 && !isUrgent;
                    const pctRemaining = Math.max((appeal.daysLeft / 180) * 100, 0);
                    const step = nextStep(appeal.status, appeal.daysLeft);
                    return (
                      <Link
                        key={appeal.id}
                        href={`/employer/appeals/${appeal.id}`}
                        className={cn(
                          "flex rounded-xl overflow-hidden border w-full text-left cursor-pointer hover:bg-muted/40 transition-colors",
                          isUrgent ? "border-destructive/40" : isWarn ? "border-amber-200" : "border-border"
                        )}
                      >

                        {/* Case info */}
                        <div className="flex-1 px-4 py-3 min-w-0">
                          <p className="font-semibold text-foreground text-sm leading-snug mb-1">{appeal.service}</p>
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-muted-foreground mb-2">
                            <span className="font-medium text-foreground">{appeal.employee}</span>
                            <span>·</span><span>{appeal.type}</span>
                            <span>·</span><span>with {appeal.advocate}</span>
                            <span>·</span><span>{appeal.carrier}</span>
                            <span>·</span><span>Denied {appeal.denialDate}</span>
                          </div>

                          {/* Next step */}
                          {step.text && (
                            <p className={cn(
                              "text-xs mb-2",
                              step.urgent ? "text-destructive font-medium" : "text-muted-foreground"
                            )}>
                              → {step.text}
                            </p>
                          )}

                          <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
                            appeal.status === 'Submitted'   ? "bg-accent/10 text-accent border-accent/20"
                            : appeal.status === 'In progress' ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-muted text-muted-foreground border-border"
                          )}>
                            {appeal.status}
                          </span>
                        </div>

                        {/* Urgency panel */}
                        <div className={cn(
                          "flex flex-col items-center justify-center gap-1.5 px-5 py-3 min-w-[108px] flex-shrink-0",
                          isUrgent ? "bg-destructive text-white"
                          : isWarn  ? "bg-amber-100 text-amber-900"
                          : "bg-muted text-muted-foreground"
                        )}>
                          {isUrgent && <AlertTriangle className="w-3.5 h-3.5 opacity-80" />}
                          <span className="font-display font-bold text-2xl leading-none tracking-tight">{appeal.daysLeft}d left</span>
                          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: isUrgent ? 'rgba(255,255,255,0.25)' : isWarn ? 'rgb(253 230 138)' : 'hsl(var(--border))' }}>
                            <div className="h-full rounded-full" style={{
                              width: `${pctRemaining}%`,
                              background: isUrgent ? 'rgba(255,255,255,0.85)' : isWarn ? 'rgb(217 119 6)' : 'hsl(var(--primary))',
                            }} />
                          </div>
                          <span className="text-xs opacity-70 leading-tight">Due {appeal.deadline}</span>
                        </div>

                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Footnote */}
              <div className="flex items-start gap-3 px-4 py-3 bg-muted border border-border rounded-xl text-xs text-muted-foreground">
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>Deadlines are based on the standard 180-day ERISA internal appeal window. External review and state-specific timelines may differ — your advocate tracks the exact deadline for each case.</span>
              </div>

            </div>
          );
        })()}

        {/* ── BILLING TAB ───────────────────────────────────────────────────── */}
        {activeTab === 'billing' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Current plan */}
            <div className="bg-background border border-border rounded-2xl p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-foreground mb-0.5">{COMPANY.plan}</h2>
                  <p className="text-sm text-muted-foreground">Monthly billing · {COMPANY.seatsTotal} seats</p>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent/10 border border-accent/20 rounded-full text-xs font-semibold text-accent">
                  <CheckCircle className="w-3 h-3" /> Active
                </span>
              </div>

              <div className="space-y-2.5 text-sm">
                {[
                  ['Per seat / month', `$${COMPANY.pricePerSeat}`],
                  ['Seats',            `${COMPANY.seatsTotal}`],
                  ['Monthly total',    `$${monthlyCost.toLocaleString()}`],
                  ['Renews',           COMPANY.renewsAt],
                  ['Billing contact',  COMPANY.contactEmail],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <button className="btn-book w-full bg-primary text-primary-foreground py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Add seats</button>
                <button className="w-full border border-border py-2.5 rounded-full text-sm font-medium text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Manage payment method</button>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-5">

              {/* What's included */}
              <div className="bg-background border border-border rounded-2xl p-6">
                <h2 className="font-semibold text-foreground mb-4">What's included</h2>
                <div className="space-y-2.5">
                  {[
                    'Unlimited advocate matching for all seat holders',
                    'Free 30-min intro calls for every employee',
                    'HIPAA-compliant case files & document sharing',
                    'Quarterly utilization & outcome reports',
                    'Dedicated account manager',
                    'Employee health communications toolkit',
                  ].map(feature => (
                    <div key={feature} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ROI + methodology */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground text-sm">Your ROI this quarter</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Team saved est. <strong className="text-foreground">$138,400</strong> vs. plan cost of <strong className="text-foreground">${(monthlyCost * 3).toLocaleString()}</strong> — a <strong className="text-foreground">~10× return</strong>.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowMethodology(!showMethodology)}
                    className="flex items-center gap-1 text-xs text-primary hover:underline flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                  >
                    How is this calculated?
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showMethodology && "rotate-180")} />
                  </button>
                </div>

                {showMethodology && (
                  <div className="pt-3 border-t border-primary/15 space-y-2 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground">Savings methodology</p>
                    <p><strong className="text-foreground">Claim recoveries:</strong> Actual dollar amounts recovered when a denied claim or billing error was corrected — verified against EOB documents uploaded to the case file.</p>
                    <p><strong className="text-foreground">Negotiated reductions:</strong> Difference between original billed amount and final settled amount on hospital bills, confirmed in writing.</p>
                    <p><strong className="text-foreground">Prior auth approvals:</strong> When a prior authorization is won after denial, we estimate savings as the cost of the approved service — not speculative avoided costs.</p>
                    <p><strong className="text-foreground">What we don't count:</strong> Time saved, stress reduced, or "potential" future savings. Only documented, verifiable amounts are included.</p>
                    <p className="text-primary/80">Savings figures are self-reported by advocates and audited by Brivon quarterly against case file documentation.</p>
                  </div>
                )}
              </div>

              {/* Enterprise */}
              <div className="bg-background border border-border rounded-2xl p-5">
                <div className="flex items-start gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Enterprise tier available</h3>
                    <p className="text-sm text-muted-foreground">Custom pricing for 100+ seats. Includes EAP integration, broker commissions, SSO, and benefit branding kit.</p>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                  Talk to our team <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
