import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  CheckCircle2,
  Save,
  Trophy,
  XCircle,
  Clock,
  Copy,
  Check,
  RotateCcw,
  GitCompareArrows,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppealCase } from "@shared/schema";
import DeadlineBanner from "@/components/DeadlineBanner";

interface AdvocateCaseDetailProps {
  appealCase: AppealCase;
  onBack: () => void;
}

const PLAN_LABELS: Record<string, string> = {
  medicare: "Medicare",
  medicare_advantage: "Medicare Advantage",
  medicaid: "Medicaid",
  employer: "Employer plan",
  marketplace: "ACA Marketplace",
  other: "Other",
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function AdvocateCaseDetail({ appealCase, onBack }: AdvocateCaseDetailProps) {
  const qc = useQueryClient();
  const [letter, setLetter] = useState(appealCase.appealLetter ?? "");
  const [notes, setNotes] = useState(appealCase.advocateNotes ?? "");
  const [isDirty, setIsDirty] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedDenial, setCopiedDenial] = useState(false);
  const [showDiff, setShowDiff] = useState(false);

  const original = appealCase.appealLetterOriginal ?? "";
  const isEdited = original.length > 0 && letter !== original;

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", `/api/appeals/${appealCase.id}`, {
        appealLetter: letter,
        advocateNotes: notes,
      });
      return res.json();
    },
    onSuccess: () => {
      setIsDirty(false);
      qc.invalidateQueries({ queryKey: ["/api/advocate/cases"] });
    },
  });

  const approveMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/appeals/${appealCase.id}/approve`, {
        appealLetter: letter,
        advocateNotes: notes,
      });
      return res.json();
    },
    onSuccess: () => {
      setIsDirty(false);
      qc.invalidateQueries({ queryKey: ["/api/advocate/cases"] });
      onBack();
    },
  });

  const outcomeMutation = useMutation({
    mutationFn: async (outcome: "won" | "lost") => {
      const res = await apiRequest("POST", `/api/appeals/${appealCase.id}/outcome`, { outcome });
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/advocate/cases"] });
      onBack();
    },
  });

  const handleLetterChange = (val: string) => {
    setLetter(val);
    setIsDirty(true);
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    setIsDirty(true);
  };

  const copyLetter = async () => {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyDenial = async () => {
    await navigator.clipboard.writeText(appealCase.denialReason);
    setCopiedDenial(true);
    setTimeout(() => setCopiedDenial(false), 2000);
  };

  const isApproved = ["approved", "submitted", "won", "lost"].includes(appealCase.status);
  const isOutcome = ["won", "lost"].includes(appealCase.status);

  return (
    <div className="flex flex-col h-full">
      {/* Sub-header */}
      <div
        className="border-b border-border px-6 py-3 flex items-center justify-between shrink-0 backdrop-blur-sm bg-background/85"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-1.5 text-foreground/50 hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2.5">
            <span className="font-heading font-semibold text-sm text-foreground">
              {appealCase.patientName}
            </span>
            <StatusChip status={appealCase.status} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Save draft
            </Button>
          )}
          {!isOutcome && (
            <Button
              size="sm"
              onClick={() => approveMutation.mutate()}
              disabled={approveMutation.isPending || appealCase.status === "approved"}
              className="gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {appealCase.status === "approved" ? "Approved" : "Approve & finalize"}
            </Button>
          )}
          {isApproved && !isOutcome && (
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => outcomeMutation.mutate("won")}
                disabled={outcomeMutation.isPending}
                className="gap-1.5 border-green-300 text-green-700 hover:bg-green-50"
              >
                <Trophy className="w-3.5 h-3.5" />
                Won
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => outcomeMutation.mutate("lost")}
                disabled={outcomeMutation.isPending}
                className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                Lost
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Case aside — Direction B: Argument Sides */}
        <aside className="w-72 shrink-0 border-r border-border flex flex-col overflow-hidden">
          {/* Zone 1 — Their argument */}
          <div className="px-5 pt-5 pb-5 shrink-0 bg-destructive/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold text-primary/60 uppercase tracking-widest">
                Their argument
              </span>
              <button
                onClick={copyDenial}
                className="flex items-center gap-1 text-[11px] text-primary/45 hover:text-primary transition-colors"
              >
                {copiedDenial ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copiedDenial ? "Copied" : "Copy"}
              </button>
            </div>

            <blockquote className="font-heading text-[15px] font-semibold italic text-foreground leading-relaxed">
              "{appealCase.denialReason}"
            </blockquote>

            <div className="mt-3.5 pt-3.5 border-t border-primary/10 flex items-center gap-1.5 text-xs text-foreground/45 flex-wrap">
              <span className="font-medium text-foreground/60">{appealCase.insurerName}</span>
              {appealCase.denialDate && (
                <>
                  <span className="text-foreground/25">·</span>
                  <span>Denied {appealCase.denialDate}</span>
                </>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 px-5 py-2.5 border-y border-border shrink-0 bg-muted/20">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">vs</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Zone 2 — Your case */}
          <div className="flex-1 overflow-y-auto px-5 pt-4 pb-5 space-y-4 bg-background">
            <span className="text-[10px] font-semibold text-foreground/40 uppercase tracking-widest block">
              Your case
            </span>

            {/* Patient identity */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold flex items-center justify-center shrink-0">
                {initials(appealCase.patientName)}
              </div>
              <div className="min-w-0">
                <p className="font-heading font-semibold text-foreground text-sm leading-tight truncate">
                  {appealCase.patientName}
                </p>
                <p className="text-xs text-foreground/45 mt-0.5 truncate">
                  {appealCase.patientEmail}
                </p>
                <p className="text-xs text-foreground/40 mt-0.5">
                  {PLAN_LABELS[appealCase.planType] ?? appealCase.planType}
                  {appealCase.memberId && ` · ${appealCase.memberId}`}
                </p>
              </div>
            </div>

            {/* Denied item */}
            <div className="px-3.5 py-3 rounded-lg border border-border bg-muted/40">
              <p className="text-[10px] font-semibold text-foreground/40 uppercase tracking-wider mb-1.5">
                Denied service
              </p>
              <p className="text-sm font-medium text-foreground leading-snug">
                {appealCase.deniedItem}
              </p>
              {(appealCase.deniedCode || appealCase.diagnosisCode) && (
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {appealCase.deniedCode && (
                    <code className="text-[10px] font-mono text-foreground/50 bg-foreground/5 px-1.5 py-0.5 rounded">
                      {appealCase.deniedCode}
                    </code>
                  )}
                  {appealCase.diagnosisCode && (
                    <code className="text-[10px] font-mono text-foreground/50 bg-foreground/5 px-1.5 py-0.5 rounded">
                      {appealCase.diagnosisCode}
                    </code>
                  )}
                </div>
              )}
            </div>

            {/* Clinical context */}
            {appealCase.additionalContext && (
              <div>
                <p className="text-[10px] font-semibold text-foreground/40 uppercase tracking-wider mb-1.5">
                  Clinical context
                </p>
                <p className="text-sm text-foreground/65 leading-relaxed">
                  {appealCase.additionalContext}
                </p>
              </div>
            )}

            {/* Deadline + timestamp — de-emphasized */}
            <div className="pt-1 space-y-2">
              <DeadlineBanner denialDate={appealCase.denialDate} compact />
              {appealCase.appealLetterGeneratedAt && (
                <div className="flex items-center gap-1.5 text-xs text-foreground/30">
                  <Clock className="w-3 h-3" />
                  Letter generated{" "}
                  {new Date(appealCase.appealLetterGeneratedAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Letter editor + notes */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0 p-5">
            <div className="flex items-center justify-between mb-2.5 shrink-0">
              <h2 className="text-sm font-medium text-foreground">Appeal Letter</h2>
              <div className="flex items-center gap-2">
                {isDirty && (
                  <span className="text-xs text-amber-600 font-medium">Unsaved changes</span>
                )}
                {isEdited && !isOutcome && (
                  <>
                    <button
                      onClick={() => setShowDiff((s) => !s)}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      title="Toggle diff view"
                    >
                      <GitCompareArrows className="w-3.5 h-3.5" />
                      {showDiff ? "Hide diff" : "View diff"}
                    </button>
                    <button
                      onClick={() => { setLetter(original); setIsDirty(true); setShowDiff(false); }}
                      className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-800 transition-colors"
                      title="Revert to AI-generated draft"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Revert to AI draft
                    </button>
                  </>
                )}
                <button
                  onClick={copyLetter}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? (
                    <><Check className="w-3.5 h-3.5 text-primary" />Copied</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" />Copy</>
                  )}
                </button>
              </div>
            </div>

            {showDiff && isEdited ? (
              <div className="flex-1 min-h-0 overflow-y-auto rounded-md border border-border bg-muted/20 p-3 font-mono text-xs leading-relaxed">
                <SimpleDiff original={original} edited={letter} />
              </div>
            ) : (
              <Textarea
                value={letter}
                onChange={(e) => handleLetterChange(e.target.value)}
                className={cn(
                  "flex-1 resize-none font-mono text-sm leading-relaxed min-h-0",
                  isOutcome && "opacity-70 cursor-not-allowed"
                )}
                readOnly={isOutcome}
                placeholder="Appeal letter will appear here once generated…"
              />
            )}
          </div>

          {/* Advocate notes */}
          <div className="border-t border-border p-4 shrink-0 bg-muted/10">
            <label className="text-xs font-medium text-foreground/40 uppercase tracking-wide block mb-2">
              Advocate notes (internal only)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Add clinical notes, edits made, or reasons for any changes…"
              rows={2}
              className="resize-none text-sm"
              readOnly={isOutcome}
            />
            {saveMutation.isError && (
              <p className="text-destructive text-xs mt-1.5">Failed to save. Please try again.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, { label: string; class: string }> = {
    ready: { label: "Needs review", class: "bg-amber-100 text-amber-700 border-amber-200" },
    approved: { label: "Approved", class: "bg-primary/10 text-primary border-primary/20" },
    submitted: { label: "Submitted", class: "bg-green-100 text-green-700 border-green-200" },
    won: { label: "Won", class: "bg-green-100 text-green-700 border-green-200" },
    lost: { label: "Lost", class: "bg-red-100 text-red-700 border-red-200" },
    generating: { label: "Generating", class: "bg-blue-100 text-blue-700 border-blue-200" },
    draft: { label: "Draft", class: "bg-muted text-muted-foreground border-border" },
  };
  const s = map[status] ?? map.draft;
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${s.class}`}>
      {s.label}
    </span>
  );
}

function SimpleDiff({ original, edited }: { original: string; edited: string }) {
  const origLines = original.split("\n");
  const editLines = edited.split("\n");
  const result: { type: "same" | "removed" | "added"; text: string }[] = [];
  const maxLen = Math.max(origLines.length, editLines.length);

  for (let i = 0; i < maxLen; i++) {
    const o = origLines[i];
    const e = editLines[i];
    if (o === e) {
      result.push({ type: "same", text: o ?? "" });
    } else {
      if (o !== undefined) result.push({ type: "removed", text: o });
      if (e !== undefined) result.push({ type: "added", text: e });
    }
  }

  return (
    <div>
      {result.map((line, i) => (
        <div
          key={i}
          className={cn(
            "px-2 py-px whitespace-pre-wrap",
            line.type === "removed" && "bg-red-50 text-red-700 line-through opacity-70",
            line.type === "added" && "bg-green-50 text-green-800",
            line.type === "same" && "text-muted-foreground"
          )}
        >
          <span className="select-none mr-2 opacity-40">
            {line.type === "removed" ? "−" : line.type === "added" ? "+" : " "}
          </span>
          {line.text || " "}
        </div>
      ))}
    </div>
  );
}
