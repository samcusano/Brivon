// Shared mock data for patient case pages.
// In production this would come from an API.

export type CaseStatus = 'active' | 'resolved';

export type Outcome = { id: number; title: string; date: string; desc: string; savedAmount?: number };
export type InProgressItem = { id: number; title: string; desc: string; urgency: 'high' | 'medium' | 'low' };
export type NextStep = { id: number; title: string; desc: string; type: 'session' | 'action' | 'upload' };
export type CaseDocument = { id: number; name: string; size: string; by: string; date: string };
export type CaseNote = { id: number; author: string; initials: string; date: string; text: string };
export type SessionRecord = { id: number; date: string; type: string; summary: string };

export type PatientCase = {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  statusLabel: string;
  urgentAction: string | null;
  advocate: {
    name: string;
    specialty: string;
    image: string;
    responseTime: string;
    lastMessage: string;
    initials: string;
  };
  startedAt: string;
  nextSession: { date: string; time: string; type: string } | null;
  sessionsCompleted: number;
  docsShared: number;
  outcomes: Outcome[];
  inProgress: InProgressItem[];
  nextSteps: NextStep[];
  documents: CaseDocument[];
  notes: CaseNote[];
  sessionHistory: SessionRecord[];
};

export const CASES: PatientCase[] = [
  {
    id: 'BRV-2026-0847',
    title: 'Cancer Treatment Navigation',
    description: 'Navigating diagnosis, treatment options, second opinions, and insurance coverage for Stage III diagnosis.',
    status: 'active',
    statusLabel: 'Appeal in Progress',
    urgentAction: 'Insurance appeal decision expected April 17 — check your email for the insurer\'s response.',
    advocate: {
      name: 'Dr. Sarah Mitchell',
      specialty: 'Cancer Care · BCPA Certified',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
      responseTime: '< 2 hrs',
      lastMessage: "Appeal submitted. Key argument: NCI guidelines classify this as standard of care for Stage III. I'll follow up in 10 days.",
      initials: 'SM',
    },
    startedAt: 'January 8, 2026',
    nextSession: { date: 'Thu, April 10', time: '2:00 PM EST', type: 'Video call' },
    sessionsCompleted: 6,
    docsShared: 12,
    outcomes: [
      { id: 1, title: 'Second opinion secured', date: 'Mar 12', desc: 'Dana-Farber consultation completed, all records transferred' },
      { id: 2, title: 'Billing error reversed', date: 'Feb 5', desc: '$1,240 overcharge flagged and dispute filed', savedAmount: 1240 },
    ],
    inProgress: [
      { id: 1, title: 'Insurance appeal — PET scan', desc: 'Decision expected April 17', urgency: 'high' },
      { id: 2, title: 'Clinical trial eligibility check', desc: 'Sarah contacting Dana-Farber coordinator', urgency: 'medium' },
    ],
    nextSteps: [
      { id: 1, title: 'Session 7 — Appeal review', desc: 'Thursday, April 10 at 2:00 PM EST', type: 'session' },
      { id: 2, title: 'Upload March EOB statement', desc: 'Sarah requested for billing review', type: 'upload' },
    ],
    documents: [
      { id: 1, name: 'InsuranceAppeal_PETScan.pdf', size: '248 KB', by: 'Sarah', date: 'Apr 3' },
      { id: 2, name: 'PathologyReport_March2026.pdf', size: '1.2 MB', by: 'You', date: 'Mar 20' },
      { id: 3, name: 'DanaFarber_SecondOpinion.pdf', size: '892 KB', by: 'Sarah', date: 'Mar 28' },
      { id: 4, name: 'DenialLetter_Feb2026.pdf', size: '156 KB', by: 'You', date: 'Feb 14' },
    ],
    notes: [
      { id: 1, author: 'Sarah', initials: 'SM', date: 'Apr 3', text: "Appeal submitted. Key argument: NCI guidelines classify this scan as standard of care for Stage III diagnoses. If denied again, we escalate to external review. I'll follow up in 10 days." },
      { id: 2, author: 'You', initials: 'JM', date: 'Mar 29', text: "The Dana-Farber appointment went really well. Dr. Kapoor mentioned a FOLFOXIRI trial. Can you help me get the eligibility criteria?" },
      { id: 3, author: 'Sarah', initials: 'SM', date: 'Mar 29', text: "I'll reach out to Dana-Farber's research coordinator today. Key eligibility cutoff is ECOG performance status ≤ 2." },
    ],
    sessionHistory: [
      { id: 1, date: 'Jan 15, 2026', type: 'Video call', summary: 'Initial case intake. Reviewed diagnosis, treatment plan, and insurance coverage gaps.' },
      { id: 2, date: 'Jan 29, 2026', type: 'Video call', summary: 'Identified $1,240 billing error on January statement. Drafted dispute letter.' },
      { id: 3, date: 'Feb 12, 2026', type: 'Phone call', summary: 'Coordinated second opinion referral to Dana-Farber. Transferred all pathology records.' },
      { id: 4, date: 'Feb 26, 2026', type: 'Video call', summary: 'Reviewed second opinion from Dr. Kapoor. Discussed clinical trial eligibility criteria.' },
      { id: 5, date: 'Mar 19, 2026', type: 'Video call', summary: 'Filed insurance appeal for PET scan denial. Cited NCI standard-of-care guidelines.' },
      { id: 6, date: 'Apr 2, 2026', type: 'Phone call', summary: 'Appeal confirmed submitted. Reviewed next steps and trial coordinator contact at Dana-Farber.' },
    ],
  },
  {
    id: 'BRV-2026-1023',
    title: 'Insurance Billing Review',
    description: 'Reviewing and disputing incorrect medical billing charges across three providers.',
    status: 'active',
    statusLabel: 'In Review',
    urgentAction: 'Upload your March EOB to unblock the billing audit — Marcus is waiting on it.',
    advocate: {
      name: 'Marcus Webb',
      specialty: 'Insurance & Billing · CMPE',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      responseTime: '< 4 hrs',
      lastMessage: "I've identified three additional charges to dispute. I'll need your March EOB to complete the audit.",
      initials: 'MW',
    },
    startedAt: 'February 14, 2026',
    nextSession: { date: 'Fri, April 11', time: '11:00 AM EST', type: 'Phone call' },
    sessionsCompleted: 3,
    docsShared: 7,
    outcomes: [
      { id: 1, title: '$1,240 overcharge reversed', date: 'Mar 5', desc: 'Provider issued corrected EOB and refund', savedAmount: 1240 },
    ],
    inProgress: [
      { id: 1, title: 'Billing audit — March charges', desc: 'Awaiting March EOB from you', urgency: 'high' },
    ],
    nextSteps: [
      { id: 1, title: 'Session 4 — Audit review', desc: 'Friday, April 11 at 11:00 AM EST', type: 'session' },
      { id: 2, title: 'Upload March EOB', desc: 'Required to complete the audit', type: 'upload' },
    ],
    documents: [
      { id: 1, name: 'BillingAudit_Feb2026.pdf', size: '384 KB', by: 'Marcus', date: 'Mar 15' },
      { id: 2, name: 'EOB_Jan2026.pdf', size: '210 KB', by: 'You', date: 'Feb 20' },
      { id: 3, name: 'DisputeLetter_Provider1.pdf', size: '96 KB', by: 'Marcus', date: 'Mar 5' },
    ],
    notes: [
      { id: 1, author: 'Marcus', initials: 'MW', date: 'Mar 28', text: "I've identified three additional charges to dispute on your February statement. I'll need your March EOB to complete the full audit." },
      { id: 2, author: 'You', initials: 'JM', date: 'Mar 29', text: "I'll try to get that uploaded by end of week. Should I also send the provider's itemized bill?" },
      { id: 3, author: 'Marcus', initials: 'MW', date: 'Mar 29', text: "Yes, the itemized bill would be very helpful. It'll let me cross-reference against what was actually submitted to insurance." },
    ],
    sessionHistory: [
      { id: 1, date: 'Feb 20, 2026', type: 'Video call', summary: 'Reviewed January EOB. Identified initial overcharge and began audit across all three providers.' },
      { id: 2, date: 'Mar 5, 2026', type: 'Phone call', summary: '$1,240 reversal confirmed by provider. Continued audit on February statement charges.' },
      { id: 3, date: 'Mar 28, 2026', type: 'Video call', summary: 'Identified three additional disputes. Requested March EOB to complete full audit.' },
    ],
  },
  {
    id: 'BRV-2025-0312',
    title: 'Prescription Cost Navigation',
    description: 'Finding affordable alternatives and patient assistance programs for high-cost specialty medication.',
    status: 'resolved',
    statusLabel: 'Resolved',
    urgentAction: null,
    advocate: {
      name: 'Dr. Priya Nair',
      specialty: 'Pharmacy Navigation · PharmD',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
      responseTime: '< 3 hrs',
      lastMessage: "Great news — the manufacturer assistance program was approved. Your co-pay drops from $890 to $15/month starting May 1.",
      initials: 'PN',
    },
    startedAt: 'October 12, 2025',
    nextSession: null,
    sessionsCompleted: 4,
    docsShared: 5,
    outcomes: [
      { id: 1, title: 'Manufacturer assistance approved', date: 'Dec 4', desc: 'Co-pay reduced from $890 to $15/month ($875/month savings)', savedAmount: 10500 },
      { id: 2, title: 'Generic alternative identified', date: 'Nov 18', desc: 'Biosimilar option available at 60% lower cost', savedAmount: 3200 },
    ],
    inProgress: [],
    nextSteps: [],
    documents: [
      { id: 1, name: 'AssistanceProgram_Approval.pdf', size: '142 KB', by: 'Priya', date: 'Dec 4' },
      { id: 2, name: 'PrescriptionCostAnalysis.pdf', size: '258 KB', by: 'Priya', date: 'Nov 10' },
    ],
    notes: [
      { id: 1, author: 'Priya', initials: 'PN', date: 'Dec 4', text: "Great news — the manufacturer assistance program was approved. Your co-pay will drop from $890 to $15/month starting May 1. This case is now resolved." },
      { id: 2, author: 'You', initials: 'JM', date: 'Dec 5', text: "This is such a relief. Thank you so much for everything, Priya!" },
    ],
    sessionHistory: [
      { id: 1, date: 'Oct 20, 2025', type: 'Video call', summary: 'Reviewed current prescription costs. Identified manufacturer assistance program as primary opportunity.' },
      { id: 2, date: 'Nov 5, 2025', type: 'Phone call', summary: 'Applied for manufacturer assistance program. Identified biosimilar alternative at 60% lower cost.' },
      { id: 3, date: 'Nov 20, 2025', type: 'Video call', summary: 'Submitted all required documentation for the assistance program application.' },
      { id: 4, date: 'Dec 4, 2025', type: 'Phone call', summary: 'Assistance program approved. Co-pay reduced from $890 to $15/month. Case successfully closed.' },
    ],
  },
];

export function getCaseById(id: string): PatientCase | undefined {
  return CASES.find(c => c.id === id);
}
