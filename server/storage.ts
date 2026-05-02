import { type User, type InsertUser, type AppealCase, type InsertAppealCase } from "@shared/schema";

export interface InsurerStats {
  name: string;
  total: number;
  won: number;
  winRate: number;
  avgDaysToResolution: number | null;
}

export interface MonthlyVolume {
  month: string; // "2026-03"
  total: number;
  won: number;
  lost: number;
}

export interface AdvocateAnalytics {
  totalCases: number;
  statusBreakdown: Record<string, number>;
  winRate: number; // won / (won + lost)
  avgDaysToApproval: number | null;
  insurerStats: InsurerStats[];
  monthlyVolume: MonthlyVolume[];
}
import { randomUUID } from "crypto";

const SAMPLE_LETTER = `[DATE]

Appeals & Grievances Department
UnitedHealthcare
P.O. Box 30432
Salt Lake City, UT 84130

RE: Prior Authorization Appeal — [PATIENT NAME] — Member ID: UHC-123456
Denied Service: Keytruda (pembrolizumab) 200mg IV infusion — CPT 96413
Diagnosis: Non-small cell lung carcinoma (ICD-10: C34.10)
Date of Denial: March 15, 2026

To Whom It May Concern:

I am writing on behalf of [PATIENT NAME] to formally appeal UnitedHealthcare's denial of prior authorization for pembrolizumab (Keytruda) immunotherapy, which was denied on March 15, 2026 on the grounds of "not medically necessary based on clinical review."

This determination is inconsistent with established clinical evidence and national oncology guidelines, and we respectfully request a full reconsideration.

CLINICAL NECESSITY

[PATIENT NAME] has been diagnosed with advanced non-small cell lung carcinoma (NSCLC). Tumor biomarker testing confirms PD-L1 expression of ≥50%, which meets the precise threshold established by the FDA-approved indication for first-line pembrolizumab monotherapy. The National Comprehensive Cancer Network (NCCN) Guidelines for NSCLC (Version 3.2026) designate pembrolizumab as a Category 1 preferred regimen for patients with PD-L1 TPS ≥50% — the highest level of evidence-based recommendation the NCCN assigns.

The landmark KEYNOTE-024 trial demonstrated a statistically significant improvement in progression-free survival (10.3 vs. 6.0 months; HR 0.50; p<0.001) and overall survival in this exact patient population. Withholding this treatment in favor of cytotoxic chemotherapy represents a clinically inferior approach that contradicts the standard of care.

PRIOR TREATMENT HISTORY

[PATIENT NAME] has progressed through two prior lines of systemic therapy. Pembrolizumab is not a first resort — it is the clinically indicated next step based on treatment history and biomarker eligibility.

REQUEST FOR EXPEDITED REVIEW

Given the life-threatening nature of metastatic lung carcinoma and the time-sensitive nature of immunotherapy initiation, we respectfully request that this appeal be processed under the expedited review timeline (72 hours per CMS regulations for Medicare Advantage urgent appeals).

We request that UnitedHealthcare reverse its denial and approve prior authorization for pembrolizumab immediately. Please provide written confirmation of the appeal decision to the address below.

Sincerely,

[PHYSICIAN NAME], [CREDENTIALS]
[PHYSICIAN CONTACT]
NPI: [NPI NUMBER]

cc: [PATIENT NAME]`;

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Appeal Cases
  getAppealCase(id: string): Promise<AppealCase | undefined>;
  getAppealCasesByEmail(email: string): Promise<AppealCase[]>;
  getAllAppealCases(status?: string): Promise<AppealCase[]>;
  createAppealCase(data: InsertAppealCase): Promise<AppealCase>;
  updateAppealCase(id: string, updates: Partial<AppealCase>): Promise<AppealCase>;
  getAnalytics(): Promise<AdvocateAnalytics>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private appealCases: Map<string, AppealCase>;

  constructor() {
    this.users = new Map();
    this.appealCases = new Map();
    this._seed();
  }

  private _seed() {
    const now = new Date();
    const seed = (overrides: Partial<AppealCase>): AppealCase => {
      const id = randomUUID();
      const base: AppealCase = {
        id,
        patientName: "Jane Doe",
        patientEmail: "jane@example.com",
        insurerName: "UnitedHealthcare",
        planType: "employer",
        memberId: "UHC-123456",
        deniedItem: "Keytruda (pembrolizumab) infusion",
        deniedCode: "96413",
        diagnosisCode: "C34.10",
        denialReason: "Not medically necessary based on clinical review",
        denialDate: "2026-03-15",
        additionalContext: "Patient has failed two prior lines of therapy. Oncologist has documented PD-L1 expression ≥50%.",
        status: "ready",
        appealLetter: SAMPLE_LETTER,
        appealLetterOriginal: SAMPLE_LETTER,
        denialLetterText: null,
        appealLetterGeneratedAt: new Date(Date.now() - 1000 * 60 * 30),
        advocateNotes: null,
        advocateApprovedAt: null,
        createdAt: now,
        updatedAt: now,
        ...overrides,
      };
      this.appealCases.set(id, base);
      return base;
    };

    seed({ patientName: "Robert Kim", insurerName: "Aetna", planType: "medicare_advantage", deniedItem: "Spinal MRI (lumbar)", deniedCode: "72148", diagnosisCode: "M54.5", denialReason: "Requires prior authorization — step therapy not met", additionalContext: "Patient has 8-week history of radicular pain unresponsive to NSAIDs and physical therapy.", appealLetterGeneratedAt: new Date(Date.now() - 1000 * 60 * 15) });
    seed({ patientName: "Linda Torres", insurerName: "Blue Cross Blue Shield", planType: "marketplace", deniedItem: "Dupixent (dupilumab) 300mg", deniedCode: "J0222", diagnosisCode: "L20.9", denialReason: "Experimental/investigational or not FDA approved for this indication", additionalContext: "Patient has moderate-to-severe atopic dermatitis. Multiple topical therapies including TCS and calcineurin inhibitors failed.", appealLetterGeneratedAt: new Date(Date.now() - 1000 * 60 * 60 * 2) });
    seed({ patientName: "Marcus Webb", insurerName: "Cigna", planType: "employer", deniedItem: "30 sessions of inpatient rehabilitation", deniedCode: "97530", diagnosisCode: "I63.9", denialReason: "Level of care not medically necessary; outpatient therapy recommended", additionalContext: "Patient suffered ischemic stroke 6 weeks ago with significant motor deficits. Neurologist documents functional improvement trajectory requiring intensive inpatient rehab.", status: "approved", advocateNotes: "Letter strengthened with Barthel Index reference. Ready to send.", advocateApprovedAt: new Date(Date.now() - 1000 * 60 * 60 * 5), appealLetterGeneratedAt: new Date(Date.now() - 1000 * 60 * 60 * 6) });
    seed({ patientName: "Priya Nair", insurerName: "Humana", planType: "medicare", deniedItem: "Ozempic (semaglutide) 1mg weekly", deniedCode: "J3490", diagnosisCode: "E11.9", denialReason: "Not covered: weight loss drug exclusion", additionalContext: "Prescribed for Type 2 diabetes management, not weight loss. A1C 9.2%. Metformin and sulfonylurea both discontinued due to adverse effects.", status: "won", advocateNotes: "Insurer reversed on expedited review. Cited diabetes indication clearly.", advocateApprovedAt: new Date(Date.now() - 1000 * 60 * 60 * 48), appealLetterGeneratedAt: new Date(Date.now() - 1000 * 60 * 60 * 50) });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async getAppealCase(id: string): Promise<AppealCase | undefined> {
    return this.appealCases.get(id);
  }

  async getAppealCasesByEmail(email: string): Promise<AppealCase[]> {
    return Array.from(this.appealCases.values()).filter(
      (c) => c.patientEmail === email,
    );
  }

  async getAllAppealCases(status?: string): Promise<AppealCase[]> {
    const all = Array.from(this.appealCases.values());
    const filtered = status ? all.filter((c) => c.status === status) : all;
    return filtered.sort(
      (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
    );
  }

  async createAppealCase(data: InsertAppealCase): Promise<AppealCase> {
    const id = randomUUID();
    const now = new Date();
    const appealCase: AppealCase = {
      id,
      ...data,
      memberId: data.memberId ?? null,
      deniedCode: data.deniedCode ?? null,
      diagnosisCode: data.diagnosisCode ?? null,
      denialDate: data.denialDate ?? null,
      additionalContext: data.additionalContext ?? null,
      denialLetterText: null,
      status: "draft",
      appealLetter: null,
      appealLetterOriginal: null,
      appealLetterGeneratedAt: null,
      advocateNotes: null,
      advocateApprovedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    this.appealCases.set(id, appealCase);
    return appealCase;
  }

  async updateAppealCase(id: string, updates: Partial<AppealCase>): Promise<AppealCase> {
    const existing = this.appealCases.get(id);
    if (!existing) throw new Error(`Appeal case ${id} not found`);
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.appealCases.set(id, updated);
    return updated;
  }

  async getAnalytics(): Promise<AdvocateAnalytics> {
    const all = Array.from(this.appealCases.values());

    const statusBreakdown: Record<string, number> = {};
    for (const c of all) {
      statusBreakdown[c.status] = (statusBreakdown[c.status] ?? 0) + 1;
    }

    const won = statusBreakdown["won"] ?? 0;
    const lost = statusBreakdown["lost"] ?? 0;
    const winRate = won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0;

    // Avg days from createdAt to advocateApprovedAt
    const approvedWithDates = all.filter((c) => c.advocateApprovedAt && c.createdAt);
    const avgDaysToApproval = approvedWithDates.length > 0
      ? Math.round(
          approvedWithDates.reduce((sum, c) => {
            const ms = new Date(c.advocateApprovedAt!).getTime() - new Date(c.createdAt!).getTime();
            return sum + ms / (1000 * 60 * 60 * 24);
          }, 0) / approvedWithDates.length
        )
      : null;

    // Insurer stats
    const insurerMap: Record<string, { total: number; won: number; lost: number; daysSum: number; daysCount: number }> = {};
    for (const c of all) {
      const name = c.insurerName;
      if (!insurerMap[name]) insurerMap[name] = { total: 0, won: 0, lost: 0, daysSum: 0, daysCount: 0 };
      insurerMap[name].total++;
      if (c.status === "won") insurerMap[name].won++;
      if (c.status === "lost") insurerMap[name].lost++;
      if (c.advocateApprovedAt && c.createdAt) {
        const days = (new Date(c.advocateApprovedAt).getTime() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        insurerMap[name].daysSum += days;
        insurerMap[name].daysCount++;
      }
    }
    const insurerStats: InsurerStats[] = Object.entries(insurerMap)
      .map(([name, s]) => ({
        name,
        total: s.total,
        won: s.won,
        winRate: s.won + s.lost > 0 ? Math.round((s.won / (s.won + s.lost)) * 100) : 0,
        avgDaysToResolution: s.daysCount > 0 ? Math.round(s.daysSum / s.daysCount) : null,
      }))
      .sort((a, b) => b.total - a.total);

    // Monthly volume (last 6 months)
    const monthMap: Record<string, { total: number; won: number; lost: number }> = {};
    for (const c of all) {
      if (!c.createdAt) continue;
      const d = new Date(c.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!monthMap[key]) monthMap[key] = { total: 0, won: 0, lost: 0 };
      monthMap[key].total++;
      if (c.status === "won") monthMap[key].won++;
      if (c.status === "lost") monthMap[key].lost++;
    }
    const monthlyVolume: MonthlyVolume[] = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, v]) => ({ month, ...v }));

    return {
      totalCases: all.length,
      statusBreakdown,
      winRate,
      avgDaysToApproval,
      insurerStats,
      monthlyVolume,
    };
  }
}

export const storage = new MemStorage();
