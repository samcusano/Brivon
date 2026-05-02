import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertAppealCaseSchema } from "@shared/schema";
import Anthropic from "@anthropic-ai/sdk";
import multer from "multer";
import { createRequire } from "module";
const _require = createRequire(import.meta.url);
const pdfParse = _require("pdf-parse") as (buffer: Buffer) => Promise<{ text: string }>;
import { sendCaseReceived, sendLetterReady, sendAdvocateNewCase } from "./email";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {

  // Create a new appeal case from intake form
  app.post("/api/appeals", async (req, res) => {
    const parsed = insertAppealCaseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const appealCase = await storage.createAppealCase(parsed.data);
    res.json(appealCase);

    // Fire-and-forget — don't block the response
    sendCaseReceived({
      patientEmail: appealCase.patientEmail,
      patientName: appealCase.patientName,
      caseId: appealCase.id,
      deniedItem: appealCase.deniedItem,
      insurerName: appealCase.insurerName,
    }).catch((e) => console.error("[email] sendCaseReceived failed:", e));
  });

  // Get appeal case by ID
  app.get("/api/appeals/:id", async (req, res) => {
    const appealCase = await storage.getAppealCase(req.params.id);
    if (!appealCase) return res.status(404).json({ error: "Not found" });
    res.json(appealCase);
  });

  // Get all cases for a patient by email
  app.get("/api/appeals", async (req, res) => {
    const email = req.query.email as string;
    if (!email) return res.status(400).json({ error: "email query param required" });
    const cases = await storage.getAppealCasesByEmail(email);
    res.json(cases);
  });

  // Generate appeal letter using Claude
  app.post("/api/appeals/:id/generate", async (req, res) => {
    const appealCase = await storage.getAppealCase(req.params.id);
    if (!appealCase) return res.status(404).json({ error: "Not found" });

    await storage.updateAppealCase(appealCase.id, { status: "generating" });

    const prompt = buildAppealPrompt(appealCase);

    try {
      const message = await anthropic.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      });

      const letterText =
        message.content[0].type === "text" ? message.content[0].text : "";

      const updated = await storage.updateAppealCase(appealCase.id, {
        status: "ready",
        appealLetter: letterText,
        appealLetterOriginal: letterText,
        appealLetterGeneratedAt: new Date(),
      });

      res.json(updated);

      // Notify advocate of new case ready for review
      sendAdvocateNewCase({
        caseId: appealCase.id,
        patientName: appealCase.patientName,
        deniedItem: appealCase.deniedItem,
        insurerName: appealCase.insurerName,
        denialReason: appealCase.denialReason,
      }).catch((e) => console.error("[email] sendAdvocateNewCase failed:", e));
    } catch (err: any) {
      await storage.updateAppealCase(appealCase.id, { status: "draft" });
      res.status(500).json({ error: err.message });
    }
  });

  // Upload denial letter / EOB PDF — extracts text and attaches to case for better AI context
  app.post("/api/appeals/:id/upload-denial", upload.single("file"), async (req, res) => {
    const appealCase = await storage.getAppealCase(req.params.id);
    if (!appealCase) return res.status(404).json({ error: "Not found" });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    let text = "";
    try {
      if (req.file.mimetype === "application/pdf") {
        const parsed = await pdfParse(req.file.buffer);
        text = parsed.text;
      } else {
        // Plain text or other — use buffer directly
        text = req.file.buffer.toString("utf-8");
      }
    } catch (err: any) {
      return res.status(422).json({ error: "Could not extract text from file" });
    }

    const updated = await storage.updateAppealCase(appealCase.id, { denialLetterText: text.slice(0, 8000) });
    res.json({ ok: true, characters: text.length });
  });

  // Advocate: analytics summary
  app.get("/api/advocate/analytics", async (_req, res) => {
    const analytics = await storage.getAnalytics();
    res.json(analytics);
  });

  // Advocate: get all cases (optionally filtered by status)
  app.get("/api/advocate/cases", async (req, res) => {
    const status = req.query.status as string | undefined;
    const cases = await storage.getAllAppealCases(status);
    res.json(cases);
  });

  // Advocate: save edits to the letter and/or notes (without approving)
  app.patch("/api/appeals/:id", async (req, res) => {
    const { appealLetter, advocateNotes } = req.body;
    const updates: Partial<import("@shared/schema").AppealCase> = {};
    if (appealLetter !== undefined) updates.appealLetter = appealLetter;
    if (advocateNotes !== undefined) updates.advocateNotes = advocateNotes;
    const updated = await storage.updateAppealCase(req.params.id, updates);
    res.json(updated);
  });

  // Advocate: approve and finalize the letter
  app.post("/api/appeals/:id/approve", async (req, res) => {
    const { appealLetter, advocateNotes } = req.body;
    const updates: Partial<import("@shared/schema").AppealCase> = {
      status: "approved",
      advocateApprovedAt: new Date(),
    };
    if (appealLetter !== undefined) updates.appealLetter = appealLetter;
    if (advocateNotes !== undefined) updates.advocateNotes = advocateNotes;
    const updated = await storage.updateAppealCase(req.params.id, updates);
    res.json(updated);

    // Notify patient their letter is advocate-approved and ready
    sendLetterReady({
      patientEmail: updated.patientEmail,
      patientName: updated.patientName,
      caseId: updated.id,
      deniedItem: updated.deniedItem,
    }).catch((e) => console.error("[email] sendLetterReady failed:", e));
  });

  // Advocate: mark outcome (won / lost)
  app.post("/api/appeals/:id/outcome", async (req, res) => {
    const { outcome } = req.body as { outcome: "won" | "lost" };
    if (!["won", "lost"].includes(outcome)) {
      return res.status(400).json({ error: "outcome must be 'won' or 'lost'" });
    }
    const updated = await storage.updateAppealCase(req.params.id, { status: outcome });
    res.json(updated);
  });

  return httpServer;
}

function buildAppealPrompt(appealCase: {
  patientName: string;
  insurerName: string;
  planType: string;
  memberId?: string | null;
  deniedItem: string;
  deniedCode?: string | null;
  diagnosisCode?: string | null;
  denialReason: string;
  denialDate?: string | null;
  additionalContext?: string | null;
  denialLetterText?: string | null;
}): string {
  return `You are an expert healthcare patient advocate with deep knowledge of insurance law, clinical evidence, and prior authorization appeal procedures. Write a compelling, professional prior authorization appeal letter on behalf of the patient below.

The letter should:
- Open with a clear statement of purpose and reference the denied item and denial date
- Cite the clinical necessity of the treatment using evidence-based medicine language
- Reference relevant medical guidelines (e.g., NCCN, AHA, ADA, USPSTF) where appropriate
- Address the insurer's specific denial reason directly and refute it with clinical rationale
- Include a formal request for expedited review if the denial involves a life-threatening or urgent condition
- Close with a clear call to action and contact information placeholder
- Be formal, factual, and empathetic — never aggressive
- Be 400-600 words

Patient Information:
- Name: ${appealCase.patientName}
- Insurer: ${appealCase.insurerName}
- Plan Type: ${appealCase.planType}
- Member ID: ${appealCase.memberId ?? "Not provided"}

Denied Item/Service: ${appealCase.deniedItem}
${appealCase.deniedCode ? `- CPT/NDC Code: ${appealCase.deniedCode}` : ""}
${appealCase.diagnosisCode ? `- Diagnosis (ICD-10): ${appealCase.diagnosisCode}` : ""}
Denial Date: ${appealCase.denialDate ?? "Not specified"}
Insurer's Stated Denial Reason: ${appealCase.denialReason}
${appealCase.additionalContext ? `Additional Clinical Context: ${appealCase.additionalContext}` : ""}
${appealCase.denialLetterText ? `\nFull Denial Letter / EOB Text (uploaded by patient):\n${appealCase.denialLetterText}` : ""}

Write the full appeal letter now. Use "[PATIENT NAME]", "[PHYSICIAN NAME]", "[PHYSICIAN CONTACT]", and "[DATE]" as placeholders where appropriate.`;
}
