import { useQuery } from "@tanstack/react-query";
import { Scale, Copy, Download, Clock, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import DeadlineBanner from "@/components/DeadlineBanner";
import type { AppealCase } from "@shared/schema";

interface PatientCaseProps {
  caseId: string;
}

const TIMELINE_STEPS: { key: string[]; label: string; description: string }[] = [
  { key: ["draft", "generating"], label: "Submitted", description: "Your denial information has been received" },
  { key: ["generating"], label: "AI Drafting", description: "Our AI is writing your personalized appeal letter" },
  { key: ["ready"], label: "Advocate Review", description: "A nurse advocate is reviewing and finalizing your letter" },
  { key: ["approved", "submitted", "won", "lost"], label: "Approved", description: "Your letter has been reviewed and is ready to submit" },
];

function getStepIndex(status: string): number {
  if (status === "draft") return 0;
  if (status === "generating") return 1;
  if (status === "ready") return 2;
  return 3;
}

export default function PatientCase({ caseId }: PatientCaseProps) {
  const [copied, setCopied] = useState(false);

  const { data: appealCase, isLoading } = useQuery<AppealCase>({
    queryKey: ["/api/appeals", caseId],
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data || data.status === "draft" || data.status === "generating") return 3000;
      return false;
    },
  });

  const copyLetter = async () => {
    if (!appealCase?.appealLetter) return;
    await navigator.clipboard.writeText(appealCase.appealLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadLetter = () => {
    if (!appealCase?.appealLetter) return;
    const blob = new Blob([appealCase.appealLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appeal-letter-${caseId.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" strokeWidth={1.5} />
      </div>
    );
  }

  if (!appealCase) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <p className="font-heading text-xl font-semibold text-foreground mb-2">Case not found</p>
          <p className="text-sm text-muted-foreground">This link may be incorrect or the case may have been removed.</p>
        </div>
      </div>
    );
  }

  const stepIndex = getStepIndex(appealCase.status);
  const isGenerating = appealCase.status === "draft" || appealCase.status === "generating";
  const isApproved = ["approved", "submitted", "won", "lost"].includes(appealCase.status);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/70 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Scale className="w-4 h-4 text-primary" strokeWidth={1.5} />
            <span className="font-heading text-lg font-semibold">Appeal</span>
          </div>
          <StatusPill status={appealCase.status} />
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10 space-y-8">
        {/* Patient info */}
        <div>
          <h1 className="font-heading font-semibold leading-tight mb-1 text-balance" style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)" }}>
            {appealCase.patientName}
          </h1>
          <p className="text-sm text-muted-foreground">
            {appealCase.deniedItem} · {appealCase.insurerName}
          </p>
        </div>

        {/* Deadline */}
        {appealCase.denialDate && (
          <DeadlineBanner denialDate={appealCase.denialDate} />
        )}

        {/* Timeline — editorial horizontal style */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-4">Progress</p>

          {/* Desktop: horizontal timeline */}
          <div className="hidden sm:flex items-start gap-0">
            {TIMELINE_STEPS.map((s, i) => {
              const isDone = i < stepIndex;
              const isCurrent = i === stepIndex;
              const isFuture = i > stepIndex;
              return (
                <div key={s.label} className="flex-1 flex flex-col">
                  <div className="flex items-center">
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                      isDone && "bg-primary border-primary",
                      isCurrent && isGenerating && "border-primary bg-background",
                      isCurrent && !isGenerating && "bg-primary border-primary",
                      isFuture && "border-border bg-background"
                    )}>
                      {(isDone || (isCurrent && !isGenerating)) && (
                        <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                      )}
                      {isCurrent && isGenerating && (
                        <Loader2 className="w-2.5 h-2.5 text-primary animate-spin" strokeWidth={2.5} />
                      )}
                    </div>
                    {i < TIMELINE_STEPS.length - 1 && (
                      <div className={cn("flex-1 h-px transition-colors", isDone ? "bg-primary" : "bg-border")} />
                    )}
                  </div>
                  <div className={cn("mt-2 pr-3", isFuture && "opacity-40")}>
                    <p className={cn(
                      "text-xs font-semibold leading-tight",
                      isCurrent ? "text-primary" : isDone ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {s.label}
                    </p>
                    {isCurrent && isGenerating && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">In progress…</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile: vertical timeline */}
          <div className="sm:hidden space-y-3">
            {TIMELINE_STEPS.map((s, i) => {
              const isDone = i < stepIndex;
              const isCurrent = i === stepIndex;
              const isFuture = i > stepIndex;
              return (
                <div key={s.label} className="flex items-start gap-3">
                  <div className="flex flex-col items-center mt-0.5">
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                      isDone && "bg-primary border-primary",
                      isCurrent && isGenerating && "border-primary bg-background",
                      isCurrent && !isGenerating && "bg-primary border-primary",
                      isFuture && "border-border bg-background"
                    )}>
                      {(isDone || (isCurrent && !isGenerating)) && (
                        <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                      )}
                      {isCurrent && isGenerating && (
                        <Loader2 className="w-2.5 h-2.5 text-primary animate-spin" />
                      )}
                    </div>
                    {i < TIMELINE_STEPS.length - 1 && (
                      <div className={cn("w-px h-5 mt-1", isDone ? "bg-primary" : "bg-border")} />
                    )}
                  </div>
                  <div className={cn(isFuture && "opacity-40")}>
                    <p className={cn(
                      "text-sm font-semibold leading-tight",
                      isCurrent ? "text-primary" : isDone ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {s.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Outcome messages */}
          {appealCase.status === "won" && (
            <div className="mt-5 pt-4 border-t border-green-200 bg-green-50/60 rounded-md px-4 py-3">
              <p className="text-sm font-semibold text-green-700">Appeal won — insurer approved coverage</p>
            </div>
          )}
          {appealCase.status === "lost" && (
            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                The insurer denied the appeal. You may be able to request an external independent review — contact your advocate for next steps.
              </p>
            </div>
          )}
        </div>

        {/* Under review notice */}
        {appealCase.status === "ready" && (
          <div className="bg-muted/25 border border-border rounded-lg p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/12 text-primary flex items-center justify-center shrink-0 mt-0.5 text-sm font-bold font-sans">
              NA
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Your advocate is reviewing this now</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A nurse advocate is reading your letter and making sure it's as strong as possible. You'll get an email when it's ready — usually within 24 hours.
              </p>
            </div>
          </div>
        )}

        {/* Waiting state */}
        {isGenerating && (
          <div className="flex items-center gap-3 py-4 text-muted-foreground">
            <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-medium text-foreground">Drafting your personalized appeal…</p>
              <p className="text-xs mt-0.5">This usually takes under 30 seconds. This page will update automatically.</p>
            </div>
          </div>
        )}

        {/* Letter (once approved) */}
        {isApproved && appealCase.appealLetter && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-xl">Your Appeal Letter</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyLetter} className="text-xs">
                  {copied ? (
                    <><Check className="w-3.5 h-3.5 mr-1.5 text-primary" />Copied</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Copy</>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={downloadLetter} className="text-xs">
                  <Download className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} />Download
                </Button>
              </div>
            </div>
            <div className="border border-border bg-card rounded-lg p-6">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                {appealCase.appealLetter}
              </pre>
            </div>
          </div>
        )}

        {/* Submission guide */}
        {isApproved && (
          <div className="border border-border bg-muted/20 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <p className="font-semibold text-sm">How to submit your appeal</p>
            </div>
            <ol className="space-y-2 text-sm text-muted-foreground">
              {[
                "Fill in the bracketed placeholders (physician name, contact info, today's date)",
                "Have your physician sign the letter — this significantly increases success rate",
                "Submit via your insurer's member portal, certified mail, or their appeals fax line",
                "Keep a copy of everything you send and note the date submitted",
                "Insurers must respond within 30–60 days (7 days for urgent/expedited reviews)",
              ].map((step, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="text-muted-foreground/50 shrink-0 mt-px">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Questions? Email <a href="mailto:support@appeal.ai" className="text-primary underline underline-offset-2">support@appeal.ai</a>
        </p>
      </main>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; class: string }> = {
    draft: { label: "Queued", class: "bg-muted text-muted-foreground" },
    generating: { label: "Generating…", class: "bg-primary/10 text-primary" },
    ready: { label: "Under review", class: "bg-amber-100 text-amber-700" },
    approved: { label: "Ready to submit", class: "bg-green-100 text-green-700" },
    submitted: { label: "Submitted", class: "bg-green-100 text-green-700" },
    won: { label: "Won", class: "bg-green-100 text-green-700" },
    lost: { label: "Denied", class: "bg-muted text-muted-foreground" },
  };
  const s = map[status] ?? map.draft;
  return (
    <span className={cn("text-[11px] font-semibold px-2.5 py-1 rounded font-sans tracking-wide", s.class)}>
      {s.label}
    </span>
  );
}
