import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, Copy, CheckCircle2, Shield, Clock } from "lucide-react";
import DeadlineBanner from "@/components/DeadlineBanner";
import { useState } from "react";
import type { AppealCase } from "@shared/schema";

interface AppealReadyProps {
  caseId: string;
}

export default function AppealReady({ caseId }: AppealReadyProps) {
  const [copied, setCopied] = useState(false);

  const { data: appealCase, isLoading } = useQuery<AppealCase>({
    queryKey: ["/api/appeals", caseId],
    refetchInterval: (query) => {
      const data = query.state.data;
      // Poll until generation is complete
      if (!data || data.status === "generating" || data.status === "draft") return 2000;
      return false;
    },
  });

  const copyToClipboard = async () => {
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

  if (isLoading || !appealCase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const isGenerating = appealCase.status === "generating" || appealCase.status === "draft";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-heading font-semibold">Appeal</span>
          </div>
          <Badge
            variant={
              appealCase.status === "ready" || appealCase.status === "submitted"
                ? "default"
                : "secondary"
            }
          >
            {statusLabel(appealCase.status)}
          </Badge>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
        {isGenerating ? (
          <div className="text-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-heading font-semibold mb-2">Drafting your letter…</h2>
            <p className="text-muted-foreground">This usually takes under 30 seconds.</p>
          </div>
        ) : (
          <>
            {/* Success banner */}
            <div className="rounded-xl bg-primary/8 border border-primary/20 p-5 mb-8 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground mb-0.5">Your appeal letter is ready</p>
                <p className="text-sm text-muted-foreground">
                  A nurse advocate will review this letter within 24 hours before it's finalized.
                  You can download it now or wait for the reviewed version.
                </p>
              </div>
            </div>

            {/* Deadline banner */}
            {appealCase.denialDate && (
              <div className="mb-6">
                <DeadlineBanner denialDate={appealCase.denialDate} />
              </div>
            )}

            {/* Case summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              <InfoCard label="Patient" value={appealCase.patientName} />
              <InfoCard label="Insurer" value={appealCase.insurerName} />
              <InfoCard label="Denied item" value={appealCase.deniedItem} />
            </div>

            {/* The letter */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-heading font-semibold">Appeal Letter</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    {copied ? (
                      <><CheckCircle2 className="w-4 h-4 mr-1.5 text-primary" /> Copied</>
                    ) : (
                      <><Copy className="w-4 h-4 mr-1.5" /> Copy</>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadLetter}>
                    <Download className="w-4 h-4 mr-1.5" /> Download
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                  {appealCase.appealLetter}
                </pre>
              </div>
            </div>

            {/* Submission instructions */}
            <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <p className="font-medium text-sm">How to submit your appeal</p>
              </div>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Fill in the bracketed placeholders (your physician's name and contact info, today's date)</li>
                <li>Have your physician sign the letter if possible — this significantly increases success rate</li>
                <li>Submit via your insurer's member portal, certified mail, or their appeals fax line</li>
                <li>Keep a copy of everything you send and note the date you submitted</li>
                <li>Insurers must respond to appeals within 30–60 days (7 days for urgent/expedited reviews)</li>
              </ol>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
              Questions? Email <a href="mailto:support@appeal.ai" className="text-primary underline underline-offset-2">support@appeal.ai</a>
            </p>
          </>
        )}
      </main>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-medium text-foreground truncate">{value}</p>
    </div>
  );
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    draft: "Queued",
    generating: "Generating…",
    ready: "Ready for review",
    submitted: "Submitted",
    won: "Won",
    lost: "Denied",
  };
  return map[status] ?? status;
}
