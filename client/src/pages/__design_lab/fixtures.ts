export interface MockCase {
  id: string;
  patientName: string;
  patientEmail: string;
  deniedItem: string;
  insurerName: string;
  denialReason: string;
  status: "ready" | "approved" | "submitted" | "won" | "lost" | "generating";
  planType: string;
  appealLetterGeneratedAt: string | null;
  additionalContext?: string;
  denialDate?: string;
}

export const mockCases: MockCase[] = [
  {
    id: "case-001",
    patientName: "Maria Santos",
    patientEmail: "m.santos@email.com",
    deniedItem: "Keytruda (pembrolizumab) 200mg IV",
    insurerName: "UnitedHealthcare",
    denialReason: "Not medically necessary per plan guidelines",
    status: "ready",
    planType: "employer",
    appealLetterGeneratedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    additionalContext: "Stage III NSCLC, failed two prior platinum-based therapies.",
    denialDate: "2026-04-10",
  },
  {
    id: "case-002",
    patientName: "James Williams",
    patientEmail: "j.williams@gmail.com",
    deniedItem: "MRI lumbar spine with contrast",
    insurerName: "Aetna",
    denialReason: "Experimental / investigational treatment",
    status: "ready",
    planType: "medicare",
    appealLetterGeneratedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    denialDate: "2026-04-08",
  },
  {
    id: "case-003",
    patientName: "Thomas Rivera",
    patientEmail: "t.rivera@gmail.com",
    deniedItem: "Ozempic (semaglutide) 0.5mg",
    insurerName: "Anthem",
    denialReason: "Not medically necessary — weight management only",
    status: "ready",
    planType: "employer",
    appealLetterGeneratedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    denialDate: "2026-04-12",
  },
  {
    id: "case-004",
    patientName: "Eleanor Park",
    patientEmail: "eleanor.park@work.com",
    deniedItem: "Physical therapy (30 sessions)",
    insurerName: "Blue Cross Blue Shield",
    denialReason: "Exceeded benefit limit for plan year",
    status: "approved",
    planType: "employer",
    appealLetterGeneratedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "case-005",
    patientName: "Robert Chen",
    patientEmail: "r.chen@hospital.org",
    deniedItem: "Humira (adalimumab) 40mg",
    insurerName: "Cigna",
    denialReason: "Step therapy requirement not met",
    status: "won",
    planType: "employer",
    appealLetterGeneratedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "case-006",
    patientName: "Diane Foster",
    patientEmail: "diane.foster@email.com",
    deniedItem: "Genetic testing (BRCA1/2 panel)",
    insurerName: "Humana",
    denialReason: "Not covered under current plan benefits",
    status: "lost",
    planType: "marketplace",
    appealLetterGeneratedAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
  },
];

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
