import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, CornerDownLeft, Copy, Check } from "lucide-react";
import { SectionHeading, Reveal } from "../ui/primitives";

const OUTPUT =
  "Senior Software Engineer with 7+ years architecting scalable web platforms serving millions of users. Expert in React, Node.js, and cloud infrastructure, with a proven record of leading teams, shipping high-impact features, and driving measurable business growth.";

export default function AIShowcase() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [phase, setPhase] = useState("idle"); // idle -> thinking -> typing -> done
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let timers = [];
    setPhase("thinking");
    timers.push(
      setTimeout(() => {
        setPhase("typing");
        let i = 0;
        const tick = () => {
          i += 2;
          setText(OUTPUT.slice(0, i));
          if (i < OUTPUT.length) timers.push(setTimeout(tick, 18));
          else setPhase("done");
        };
        tick();
      }, 1600),
    );
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const copy = () => {
    navigator.clipboard?.writeText(OUTPUT);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="relative py-24" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="AI Showcase"
          title="Watch AI write your resume in real time"
          subtitle="Describe what you want and our AI crafts polished, recruiter-ready content instantly."
        />

        <Reveal>
          <div className="mx-auto grid max-w-5xl gap-5 rounded-3xl border border-[rgba(17,20,57,0.08)] bg-white/70 p-5 shadow-soft backdrop-blur md:grid-cols-2 md:p-7">
            {/* Input */}
            <div className="rounded-2xl border border-[rgba(17,20,57,0.08)] bg-lilac p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-3">
                Your prompt
              </p>
              <div className="rounded-xl border border-[rgba(17,20,57,0.1)] bg-white p-4 shadow-sm">
                <p className="text-sm leading-relaxed text-ink">
                  "Generate a professional software engineer summary."
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-ink-3">Tone: Professional</span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] px-3 py-1.5 text-xs font-semibold text-white">
                    Generate <CornerDownLeft size={12} />
                  </span>
                </div>
              </div>
            </div>

            {/* Output */}
            <div className="relative rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-violet-50 p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600">
                  <Sparkles size={13} /> AI output
                </p>
                {phase === "done" && (
                  <button
                    onClick={copy}
                    className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-brand-600 shadow-sm transition hover:shadow"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                )}
              </div>
              <div className="min-h-[160px] rounded-xl bg-white/80 p-4">
                {phase === "thinking" && (
                  <div className="flex items-center gap-2 text-sm text-ink-3">
                    <span className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-2 w-2 rounded-full bg-brand-500"
                          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{
                            duration: 0.9,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </span>
                    AI is thinking…
                  </div>
                )}
                {(phase === "typing" || phase === "done") && (
                  <p className="text-sm leading-relaxed text-ink">
                    {text}
                    {phase === "typing" && (
                      <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-brand-500 align-middle" />
                    )}
                  </p>
                )}
                {phase === "idle" && (
                  <p className="text-sm text-ink-3">Output will appear here…</p>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
