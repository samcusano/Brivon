import { useState, useEffect, useRef, useCallback } from "react";

interface Comment {
  id: string;
  variant: string | null;
  elementDescription: string;
  selector: string;
  x: number;
  y: number;
  text: string;
}

interface FeedbackOverlayProps {
  targetName: string;
}

export function FeedbackOverlay({ targetName }: FeedbackOverlayProps) {
  const [mode, setMode] = useState<"idle" | "selecting" | "commenting">("idle");
  const [comments, setComments] = useState<Comment[]>([]);
  const [pendingPos, setPendingPos] = useState<{ x: number; y: number } | null>(null);
  const [pendingText, setPendingText] = useState("");
  const [pendingEl, setPendingEl] = useState<{ description: string; selector: string; variant: string | null } | null>(null);
  const [overallDirection, setOverallDirection] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getVariant = (el: Element): string | null => {
    let cur: Element | null = el;
    while (cur) {
      const v = cur.getAttribute("data-variant");
      if (v) return v;
      cur = cur.parentElement;
    }
    return null;
  };

  const describeElement = (el: Element): string => {
    const tag = el.tagName.toLowerCase();
    const text = (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 50);
    const id = el.id ? `#${el.id}` : "";
    return `${tag}${id}${text ? ` "${text}"` : ""}`;
  };

  const selectorFor = (el: Element): string => {
    if (el.id) return `#${el.id}`;
    const tag = el.tagName.toLowerCase();
    const cls =
      el.className && typeof el.className === "string"
        ? "." +
          el.className
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .join(".")
        : "";
    return `${tag}${cls}`;
  };

  const handlePageClick = useCallback(
    (e: MouseEvent) => {
      if (mode !== "selecting") return;
      const target = e.target as Element;
      if (target.closest("[data-feedback-overlay]")) return;

      e.preventDefault();
      e.stopPropagation();

      setPendingPos({ x: e.clientX, y: e.clientY });
      setPendingEl({
        description: describeElement(target),
        selector: selectorFor(target),
        variant: getVariant(target),
      });
      setMode("commenting");
      setPendingText("");
      setTimeout(() => textareaRef.current?.focus(), 60);
    },
    [mode]
  );

  useEffect(() => {
    if (mode === "selecting") {
      document.addEventListener("click", handlePageClick, true);
      document.body.style.cursor = "crosshair";
    } else {
      document.removeEventListener("click", handlePageClick, true);
      document.body.style.cursor = "";
    }
    return () => {
      document.removeEventListener("click", handlePageClick, true);
      document.body.style.cursor = "";
    };
  }, [mode, handlePageClick]);

  const saveComment = () => {
    if (!pendingText.trim() || !pendingPos || !pendingEl) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        variant: pendingEl.variant,
        elementDescription: pendingEl.description,
        selector: pendingEl.selector,
        x: pendingPos.x,
        y: pendingPos.y,
        text: pendingText.trim(),
      },
    ]);
    setMode("selecting");
    setPendingPos(null);
    setPendingText("");
    setPendingEl(null);
  };

  const formatFeedback = (): string => {
    let out = `## Design Lab Feedback\n\n`;
    out += `**Target:** ${targetName}\n`;
    out += `**Comments:** ${comments.length}\n\n`;

    const byVariant: Record<string, Comment[]> = {};
    comments.forEach((c) => {
      const key = c.variant ? `Variant ${c.variant}` : "General";
      if (!byVariant[key]) byVariant[key] = [];
      byVariant[key].push(c);
    });

    for (const [variant, varComments] of Object.entries(byVariant)) {
      out += `### ${variant}\n`;
      varComments.forEach((c, i) => {
        out += `${i + 1}. **${c.elementDescription}** (\`${c.selector}\`)\n   "${c.text}"\n\n`;
      });
    }

    if (overallDirection.trim()) {
      out += `### Overall Direction\n${overallDirection.trim()}\n`;
    }

    return out;
  };

  const handleSubmit = () => {
    const text = formatFeedback();
    navigator.clipboard.writeText(text).then(() => {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    });
  };

  const popupLeft = pendingPos
    ? Math.min(pendingPos.x + 16, (typeof window !== "undefined" ? window.innerWidth : 1200) - 310)
    : 0;
  const popupTop = pendingPos
    ? Math.min(pendingPos.y, (typeof window !== "undefined" ? window.innerHeight : 800) - 220)
    : 0;

  return (
    <div data-feedback-overlay="true">
      {/* Pins */}
      {comments.map((c, i) => (
        <div
          key={c.id}
          style={{ position: "fixed", left: c.x - 12, top: c.y - 12, zIndex: 9998 }}
          title={c.text}
          className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-lg pointer-events-none select-none"
        >
          {i + 1}
        </div>
      ))}

      {/* Comment popup */}
      {mode === "commenting" && pendingPos && (
        <div
          style={{ position: "fixed", left: popupLeft, top: popupTop, zIndex: 9999 }}
          className="w-72 rounded-2xl border border-border bg-background shadow-2xl p-3.5 space-y-2.5"
        >
          <p className="text-xs text-muted-foreground truncate">
            📌 {pendingEl?.variant ? `Variant ${pendingEl.variant} — ` : ""}{pendingEl?.description}
          </p>
          <textarea
            ref={textareaRef}
            value={pendingText}
            onChange={(e) => setPendingText(e.target.value)}
            placeholder="Add your comment…"
            className="w-full text-sm border border-border rounded-xl p-2.5 resize-none h-20 focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) saveComment();
              if (e.key === "Escape") {
                setMode("selecting");
                setPendingPos(null);
              }
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={saveComment}
              className="flex-1 bg-primary text-primary-foreground text-xs py-2 rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Save  <span className="opacity-60">⌘↵</span>
            </button>
            <button
              onClick={() => {
                setMode("selecting");
                setPendingPos(null);
              }}
              className="px-3 text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Selecting mode banner */}
      {mode === "selecting" && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] bg-foreground text-background text-sm px-5 py-2.5 rounded-full shadow-xl flex items-center gap-3">
          <span>Click any element to comment</span>
          <button
            onClick={() => setMode("idle")}
            className="opacity-60 hover:opacity-100 font-medium"
          >
            ✕ Done
          </button>
        </div>
      )}

      {/* Panel + FAB */}
      <div className="fixed bottom-6 right-6 z-[9997] flex flex-col items-end gap-3">
        {showPanel && (
          <div className="w-80 rounded-2xl border border-border bg-background shadow-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Design Feedback</h3>
              <button
                onClick={() => setShowPanel(false)}
                className="text-muted-foreground hover:text-foreground w-6 h-6 flex items-center justify-center rounded-full hover:bg-muted"
              >
                ✕
              </button>
            </div>

            <button
              onClick={() => {
                setMode("selecting");
                setShowPanel(false);
              }}
              className="w-full bg-primary/10 text-primary border border-primary/20 text-sm py-2 rounded-xl font-medium hover:bg-primary/20 transition-colors"
            >
              + Click to add comment
            </button>

            {comments.length > 0 && (
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {comments.map((c, i) => (
                  <div key={c.id} className="flex gap-2 text-xs items-start">
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{c.text}</p>
                      <p className="text-muted-foreground truncate">{c.elementDescription}</p>
                    </div>
                    <button
                      onClick={() =>
                        setComments((prev) => prev.filter((x) => x.id !== c.id))
                      }
                      className="text-muted-foreground hover:text-destructive shrink-0 mt-0.5"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Overall direction <span className="text-destructive">*</span>
              </label>
              <textarea
                value={overallDirection}
                onChange={(e) => setOverallDirection(e.target.value)}
                placeholder="Which variant wins? What should change?"
                className="w-full text-sm border border-border rounded-xl p-2.5 resize-none h-20 focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!overallDirection.trim()}
              className="w-full bg-primary text-primary-foreground text-sm py-2.5 rounded-xl font-semibold hover:opacity-90 disabled:opacity-40 transition-all"
            >
              {submitted ? "✓ Copied to clipboard!" : "Submit All Feedback"}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              Paste the copied text back in the terminal
            </p>
          </div>
        )}

        <button
          onClick={() => setShowPanel((s) => !s)}
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:opacity-90 transition-all active:scale-95"
          title="Add feedback"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
