import { AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeadlineBannerProps {
  denialDate: string | null | undefined;
  compact?: boolean; // true = sidebar strip, false = full banner
}

function computeDeadline(denialDate: string): {
  daysRemaining: number;
  deadline: Date;
} {
  const denial = new Date(denialDate + "T00:00:00"); // avoid timezone shift
  const deadline = new Date(denial);
  deadline.setDate(deadline.getDate() + 180);
  const msRemaining = deadline.getTime() - Date.now();
  const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
  return { daysRemaining, deadline };
}

export default function DeadlineBanner({ denialDate, compact = false }: DeadlineBannerProps) {
  if (!denialDate) return null;

  const { daysRemaining, deadline } = computeDeadline(denialDate);

  const isExpired = daysRemaining <= 0;
  const isUrgent = daysRemaining > 0 && daysRemaining <= 30;
  const isWarning = daysRemaining > 30 && daysRemaining <= 60;
  const isSafe = daysRemaining > 60;

  const deadlineFormatted = deadline.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (compact) {
    // Sidebar strip version
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-xs border",
          isExpired && "bg-red-50 border-red-200 text-red-700",
          isUrgent && "bg-red-50 border-red-200 text-red-700",
          isWarning && "bg-amber-50 border-amber-200 text-amber-700",
          isSafe && "bg-green-50 border-green-200 text-green-700"
        )}
      >
        {isExpired || isUrgent ? (
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
        ) : isSafe ? (
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <Clock className="w-3.5 h-3.5 shrink-0" />
        )}
        <div>
          {isExpired ? (
            <span className="font-semibold">Appeal deadline passed</span>
          ) : (
            <>
              <span className="font-semibold">{daysRemaining} days</span>
              {" "}to file · {deadlineFormatted}
            </>
          )}
        </div>
      </div>
    );
  }

  // Full banner version
  return (
    <div
      className={cn(
        "rounded-xl border px-5 py-4 flex items-start gap-3",
        isExpired && "bg-red-50 border-red-200",
        isUrgent && "bg-red-50 border-red-200",
        isWarning && "bg-amber-50 border-amber-200",
        isSafe && "bg-green-50/60 border-green-200"
      )}
    >
      <div className={cn(
        "mt-0.5",
        (isExpired || isUrgent) && "text-red-600",
        isWarning && "text-amber-600",
        isSafe && "text-green-700"
      )}>
        {isExpired || isUrgent ? (
          <AlertTriangle className="w-5 h-5" />
        ) : isSafe ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <Clock className="w-5 h-5" />
        )}
      </div>
      <div>
        <p className={cn(
          "font-medium text-sm",
          (isExpired || isUrgent) && "text-red-800",
          isWarning && "text-amber-800",
          isSafe && "text-green-800"
        )}>
          {isExpired
            ? "Appeal deadline has passed"
            : `${daysRemaining} days remaining to file your internal appeal`}
        </p>
        <p className={cn(
          "text-xs mt-0.5",
          (isExpired || isUrgent) && "text-red-600",
          isWarning && "text-amber-600",
          isSafe && "text-green-700"
        )}>
          {isExpired
            ? `The 180-day internal appeal window expired on ${deadlineFormatted}. Contact your state insurance commissioner for options.`
            : `Deadline: ${deadlineFormatted} · Insurers must respond within 30–60 days of filing`}
        </p>
      </div>
    </div>
  );
}
