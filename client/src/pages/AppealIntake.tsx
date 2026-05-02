import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Scale, Clock, CheckCircle2, Loader2, Upload, X } from "lucide-react";
import CodeAutocomplete from "@/components/CodeAutocomplete";
import { CPT_CODES } from "@/data/cpt-codes";
import { ICD10_CODES } from "@/data/icd10-codes";

const STEPS = [
  { id: 1, label: "About you" },
  { id: 2, label: "The denial" },
  { id: 3, label: "Context" },
];

const step1Schema = z.object({
  patientName: z.string().min(2, "Please enter your full name"),
  patientEmail: z.string().email("Please enter a valid email"),
  insurerName: z.string().min(2, "Please enter your insurance company name"),
  planType: z.enum(["medicare", "medicare_advantage", "medicaid", "employer", "marketplace", "other"]),
  memberId: z.string().optional(),
});

const step2Schema = z.object({
  deniedItem: z.string().min(3, "Please describe what was denied"),
  deniedCode: z.string().optional(),
  diagnosisCode: z.string().optional(),
  denialReason: z.string().min(10, "Please describe the denial reason as stated by your insurer"),
  denialDate: z.string().optional(),
});

const step3Schema = z.object({
  additionalContext: z.string().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;
type FormData = Step1Data & Step2Data & Step3Data;

const PLAN_TYPE_LABELS: Record<string, string> = {
  medicare: "Medicare (Original)",
  medicare_advantage: "Medicare Advantage",
  medicaid: "Medicaid",
  employer: "Employer / Workplace Insurance",
  marketplace: "ACA Marketplace Plan",
  other: "Other",
};

export default function AppealIntake() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [denialFile, setDenialFile] = useState<File | null>(null);
  const [, navigate] = useLocation();

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: formData,
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: formData,
  });

  const step3Form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: formData,
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiRequest("POST", "/api/appeals", data);
      const appealCase = await res.json();

      if (denialFile) {
        const fd = new FormData();
        fd.append("file", denialFile);
        await fetch(`/api/appeals/${appealCase.id}/upload-denial`, { method: "POST", body: fd });
      }

      const genRes = await apiRequest("POST", `/api/appeals/${appealCase.id}/generate`, {});
      return genRes.json();
    },
    onSuccess: (data) => {
      navigate(`/case/${data.id}`);
    },
  });

  const handleStep1 = step1Form.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  });

  const handleStep2 = step2Form.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
  });

  const handleStep3 = step3Form.handleSubmit((data) => {
    const final = { ...formData, ...data } as FormData;
    setFormData(final);
    submitMutation.mutate(final);
  });

  if (submitMutation.isPending) {
    return <GeneratingState />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/70 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Scale className="w-4 h-4 text-primary" strokeWidth={1.5} />
            <span className="font-heading text-lg font-semibold tracking-tight text-foreground">Appeal</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span className="font-sans text-xs">~3 minutes</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-6 pt-10 pb-16">
        {/* Step indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-semibold text-foreground">{STEPS[step - 1].label}</span>
            <span className="text-sm text-muted-foreground">Step {step} of {STEPS.length}</span>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${(step / STEPS.length) * 100}%` }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="mb-10">
                <h1 className="font-heading font-semibold leading-[1.08] mb-5" style={{ fontSize: "clamp(2.5rem, 6vw, 3.5rem)" }}>
                  Your claim was denied.{" "}
                  <em className="text-primary not-italic">Let's fight back.</em>
                </h1>
                <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
                  A nurse advocate reviews every AI-drafted appeal letter. Delivered in under 24 hours.
                </p>
              </div>

              <form onSubmit={handleStep1} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="patientName" className="text-sm font-medium text-foreground/70">Your full name</Label>
                    <Input
                      id="patientName"
                      placeholder="Jane Smith"
                      {...step1Form.register("patientName")}
                    />
                    {step1Form.formState.errors.patientName && (
                      <p className="text-destructive text-xs">{step1Form.formState.errors.patientName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="patientEmail" className="text-sm font-medium text-foreground/70">Email address</Label>
                    <Input
                      id="patientEmail"
                      type="email"
                      placeholder="jane@example.com"
                      {...step1Form.register("patientEmail")}
                    />
                    {step1Form.formState.errors.patientEmail && (
                      <p className="text-destructive text-xs">{step1Form.formState.errors.patientEmail.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="insurerName" className="text-sm font-medium text-foreground/70">Insurance company</Label>
                  <Input
                    id="insurerName"
                    placeholder="e.g. UnitedHealthcare, Aetna, Blue Cross Blue Shield"
                    {...step1Form.register("insurerName")}
                  />
                  {step1Form.formState.errors.insurerName && (
                    <p className="text-destructive text-xs">{step1Form.formState.errors.insurerName.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground/70">Plan type</Label>
                  <Select
                    onValueChange={(val) => step1Form.setValue("planType", val as Step1Data["planType"])}
                    defaultValue={formData.planType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your plan type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PLAN_TYPE_LABELS).map(([val, label]) => (
                        <SelectItem key={val} value={val}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {step1Form.formState.errors.planType && (
                    <p className="text-destructive text-xs">{step1Form.formState.errors.planType.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="memberId" className="text-sm font-medium text-foreground/70">
                    Member ID <span className="font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="memberId"
                    placeholder="Found on your insurance card"
                    {...step1Form.register("memberId")}
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" size="lg" className="w-full font-semibold">
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </form>

              <p className="text-center text-xs text-muted-foreground mt-6">
                Your information is encrypted and HIPAA-compliant.
              </p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="mb-8">
                <h2 className="font-heading font-semibold mb-2" style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)" }}>
                  What was denied?
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Describe the specific treatment, drug, or procedure your insurer refused to cover.
                </p>
              </div>

              <form onSubmit={handleStep2} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="deniedItem" className="text-sm font-medium text-foreground/70">Denied service or medication</Label>
                  <Input
                    id="deniedItem"
                    placeholder="e.g. Keytruda (pembrolizumab), MRI of spine, physical therapy"
                    {...step2Form.register("deniedItem")}
                  />
                  {step2Form.formState.errors.deniedItem && (
                    <p className="text-destructive text-xs">{step2Form.formState.errors.deniedItem.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="deniedCode" className="text-sm font-medium text-foreground/70">
                      CPT or NDC code <span className="font-normal text-muted-foreground">(optional)</span>
                    </Label>
                    <CodeAutocomplete
                      id="deniedCode"
                      value={step2Form.watch("deniedCode") ?? ""}
                      onChange={(val) => step2Form.setValue("deniedCode", val)}
                      codes={CPT_CODES}
                      placeholder="Search by code or description…"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="diagnosisCode" className="text-sm font-medium text-foreground/70">
                      ICD-10 diagnosis <span className="font-normal text-muted-foreground">(optional)</span>
                    </Label>
                    <CodeAutocomplete
                      id="diagnosisCode"
                      value={step2Form.watch("diagnosisCode") ?? ""}
                      onChange={(val) => step2Form.setValue("diagnosisCode", val)}
                      codes={ICD10_CODES}
                      placeholder="Search by code or diagnosis…"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="denialReason" className="text-sm font-medium text-foreground/70">
                    Why did your insurer deny it?
                  </Label>
                  <Textarea
                    id="denialReason"
                    placeholder='Copy the exact denial reason from your letter — e.g. "Not medically necessary" or "Experimental/investigational treatment"'
                    rows={3}
                    {...step2Form.register("denialReason")}
                  />
                  {step2Form.formState.errors.denialReason && (
                    <p className="text-destructive text-xs">{step2Form.formState.errors.denialReason.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="denialDate" className="text-sm font-medium text-foreground/70">
                    Date of denial <span className="font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="denialDate"
                    type="date"
                    {...step2Form.register("denialDate")}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button type="submit" size="lg" className="flex-1 font-semibold">
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="mb-8">
                <h2 className="font-heading font-semibold mb-2" style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)" }}>
                  Any other context?
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  The more clinical detail you share, the stronger your appeal will be. Entirely optional.
                </p>
              </div>

              <form onSubmit={handleStep3} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="additionalContext" className="text-sm font-medium text-foreground/70">
                    Clinical context <span className="font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="additionalContext"
                    placeholder="e.g. Patient has tried and failed two prior therapies. Oncologist Dr. Chen has documented medical necessity. Condition is rapidly progressing."
                    rows={5}
                    {...step3Form.register("additionalContext")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Include: prior treatments tried, physician's reasoning, urgency, failed alternatives.
                  </p>
                </div>

                {/* Denial letter upload */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground/70">
                    Denial letter or EOB <span className="font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  {denialFile ? (
                    <div className="flex items-center gap-2 border border-border bg-muted/30 px-3 py-2.5 rounded-lg">
                      <Upload className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
                      <span className="text-sm text-foreground flex-1 truncate">{denialFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setDenialFile(null)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 border border-dashed border-border bg-muted/15 px-4 py-6 cursor-pointer hover:bg-muted/30 transition-colors rounded-lg">
                      <Upload className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                      <span className="text-sm text-muted-foreground text-center">
                        Drop your denial letter PDF here, or <span className="text-primary underline underline-offset-2">browse</span>
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.txt"
                        className="sr-only"
                        onChange={(e) => setDenialFile(e.target.files?.[0] ?? null)}
                      />
                    </label>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Uploading the actual letter helps Claude write a more precise, targeted appeal. PDF up to 10MB.
                  </p>
                </div>

                {/* What happens next */}
                <div className="border border-border rounded-lg p-4 bg-muted/20 space-y-3">
                  <p className="text-sm font-semibold text-foreground">Here's what we'll do for you</p>
                  <div className="space-y-2.5">
                    {[
                      "We'll draft your appeal using the latest clinical guidelines and evidence",
                      "A nurse advocate will personally review and strengthen the letter",
                      "You'll receive the final letter within 24 hours, ready to send to your insurer",
                    ].map((text, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" strokeWidth={1.5} />
                        <p className="text-sm text-muted-foreground leading-snug">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={() => setStep(2)}
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 font-semibold"
                    disabled={submitMutation.isPending}
                  >
                    Generate my appeal
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>

                {submitMutation.isError && (
                  <p className="text-destructive text-sm text-center">
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function GeneratingState() {
  const steps = [
    "Analyzing denial reason and plan type",
    "Searching clinical evidence and guidelines",
    "Drafting professional appeal letter",
    "Formatting for insurer submission",
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Loader2 className="w-5 h-5 text-primary animate-spin" strokeWidth={1.5} />
            <span className="text-xs font-semibold text-primary/70 uppercase tracking-widest">Drafting</span>
          </div>
          <h2 className="font-heading font-semibold leading-tight mb-3" style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)" }}>
            Writing your appeal…
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Reviewing clinical guidelines and evidence to build the strongest possible case. About 30 seconds.
          </p>
        </div>

        <div className="space-y-3">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary/60 shrink-0" strokeWidth={1.5} />
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
