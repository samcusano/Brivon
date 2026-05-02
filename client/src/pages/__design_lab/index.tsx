import { AsideA } from "./AsideA";
import { AsideB } from "./AsideB";
import { AsideC } from "./AsideC";
import { AsideD } from "./AsideD";
import { FeedbackOverlay } from "./FeedbackOverlay";

const DIRECTIONS = [
  {
    id: "A",
    name: "Editorial Pull Quote",
    rationale:
      "Denial reason is the headline — large serif blockquote with terracotta left border. Patient identity becomes name + pills, no label/value rows. Sections breathe with warm borders.",
    Component: AsideA,
  },
  {
    id: "B",
    name: "Argument Sides",
    rationale:
      "Two color zones: 'Their argument' (terracotta-tinted, denial dominant) vs 'Your case' (cream, patient + clinical as prose). Frames the advocate's mental model — you're building a counter-argument.",
    Component: AsideB,
  },
  {
    id: "C",
    name: "Narrative Prose",
    rationale:
      "Zero labels. Everything rendered as flowing human sentences — reads like a case brief, not a form. Denial reason surfaces as a serif blockquote embedded within the prose.",
    Component: AsideC,
  },
  {
    id: "D",
    name: "Focused Accordion",
    rationale:
      "Denial reason is the always-visible hero block — nothing competing. Patient, insurer, and clinical live in collapsible sections below. Clinical context open by default. Progressive disclosure.",
    Component: AsideD,
  },
];

export default function DesignLab() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(to bottom, #f6e1ca, #fbf3eb)" }}
    >
      {/* Lab header */}
      <header className="border-b border-[hsl(30_18%_80%)] bg-[#fbf3eb]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Design Lab
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-xs text-muted-foreground">
                  Case Detail — Patient Aside
                </span>
              </div>
              <h1 className="font-heading text-xl font-semibold tracking-tight">
                4 Directions
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Premium Warmth · Denial reason as hero · Inline interactions
              </p>
            </div>
            <div className="text-right text-sm text-muted-foreground shrink-0">
              <p className="font-medium text-foreground">How to give feedback</p>
              <p>Click the chat bubble → Add comments → Submit</p>
            </div>
          </div>
        </div>
      </header>

      {/* Directions — 2×2 grid */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {DIRECTIONS.map(({ id, name, rationale, Component }) => (
            <section key={id}>
              {/* Direction label */}
              <div className="flex items-start gap-3.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-base flex items-center justify-center shrink-0 shadow-sm">
                  {id}
                </div>
                <div>
                  <h2 className="font-heading text-base font-semibold tracking-tight">
                    {name}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                    {rationale}
                  </p>
                </div>
              </div>

              {/* Preview */}
              <div data-variant={id} className="shadow-md rounded-2xl">
                <Component />
              </div>
            </section>
          ))}
        </div>
      </main>

      <FeedbackOverlay targetName="CaseDetailAside" />
    </div>
  );
}
