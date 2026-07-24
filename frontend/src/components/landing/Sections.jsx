import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, Plus, Minus, ArrowRight, Crown } from "lucide-react";
import {
  SectionHeading,
  Reveal,
  Button,
  Badge,
  fadeUp,
  stagger,
} from "../ui/primitives";
import {
  COMPANIES,
  FEATURES,
  TEMPLATES,
  WORKFLOW,
  BENEFITS,
  TESTIMONIALS,
  PRICING,
  FAQS,
  SAMPLE_RESUME,
} from "../../Data";
import ResumePreview from "../resume/ResumePreview";
import { cn } from "../../utils/cn";

/* -------------------- Companies -------------------- */
export function Companies() {
  return (
    <section className="border-y border-[rgba(17,20,57,0.06)] bg-white/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-ink-3">
          Trusted by professionals hired at
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
          <div className="animate-marquee flex w-max gap-16">
            {[...COMPANIES, ...COMPANIES].map((c, i) => (
              <span
                key={i}
                className="text-2xl font-extrabold tracking-tight text-ink/30"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Features -------------------- */
export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to get hired"
          subtitle="A complete toolkit that blends intelligent AI with beautiful design to make resume building effortless."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl border border-[rgba(17,20,57,0.08)] bg-white/70 p-6 shadow-soft backdrop-blur transition-shadow hover:shadow-glow"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50/0 to-violet-50/0 opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white shadow-lg shadow-brand-500/30 transition-transform group-hover:scale-110">
                <f.icon size={22} />
              </span>
              <h3 className="mt-5 text-base font-bold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- Templates -------------------- */
export function Templates({ onLaunch }) {
  return (
    <section id="templates" className="relative py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-brand-50/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Templates"
          title="Designer templates for every career"
          subtitle="Switch templates instantly — your content adapts perfectly to any style you choose."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {TEMPLATES.map((t) => (
            <motion.div
              key={t.id}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-[rgba(17,20,57,0.08)] bg-white shadow-soft"
            >
              {t.popular && (
                <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] px-3 py-1 text-[11px] font-bold text-white shadow-lg">
                  <Star size={11} fill="currentColor" /> Popular
                </span>
              )}
              <div className="relative h-72 overflow-hidden bg-lilac">
                <div className="absolute left-1/2 top-4 w-[88%] -translate-x-1/2 origin-top scale-100 overflow-hidden rounded-lg border border-slate-200 shadow-xl transition-transform duration-500 group-hover:scale-105">
                  <ResumePreview
                    resume={{
                      ...SAMPLE_RESUME,
                      template: t.id,
                      accent: t.accent,
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-4 flex translate-y-4 justify-center opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <Button size="sm" onClick={onLaunch}>
                    Use template <ArrowRight size={15} />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
                <div>
                  <p className="font-bold text-ink">{t.name}</p>
                  <p className="text-xs text-ink-3">{t.tag}</p>
                </div>
                <span
                  className="h-6 w-6 rounded-full ring-2 ring-white"
                  style={{ background: t.accent }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- Workflow -------------------- */
export function Workflow() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          title="From blank page to hired in 4 steps"
          subtitle="A guided, intelligent workflow that does the heavy lifting for you."
        />
        <div className="relative grid gap-8 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent md:block" />
          {WORKFLOW.map((w, i) => (
            <Reveal
              key={w.step}
              delay={i * 0.1}
              className="relative text-center"
            >
              <div className="relative mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#111439] via-[#4F46E5] to-[#7C3AED] text-lg font-extrabold text-white shadow-glow">
                {w.step}
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">
                {w.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Benefits -------------------- */
export function Benefits() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="grid gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#111439] via-[#312e81] to-[#4338ca] p-8 sm:grid-cols-2 sm:p-12 lg:grid-cols-4">
            {BENEFITS.map((b) => (
              <div key={b.label} className="text-center">
                <p className="bg-gradient-to-r from-white to-brand-100 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">
                  {b.stat}
                </p>
                <p className="mt-2 text-sm text-white/70">{b.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------- Testimonials -------------------- */
export function Testimonials() {
  const row = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <section className="overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by job seekers everywhere"
          subtitle="Join thousands who turned their resume into interview invitations."
        />
      </div>
      <div className="relative [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="animate-marquee flex w-max gap-5 [animation-duration:45s] hover:[animation-play-state:paused]">
          {row.map((t, i) => (
            <div
              key={i}
              className="w-[340px] shrink-0 rounded-2xl border border-[rgba(17,20,57,0.08)] bg-white/70 p-6 shadow-soft backdrop-blur"
            >
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, k) => (
                  <Star key={k} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-2">
                "{t.text}"
              </p>
              <div className="mt-5 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm font-bold text-ink">{t.name}</p>
                  <p className="text-xs text-ink-3">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Pricing -------------------- */
export function Pricing({ onLaunch }) {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, transparent pricing"
          subtitle="Start for free. Upgrade when you're ready to supercharge your job hunt."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid items-stretch gap-6 lg:grid-cols-3"
        >
          {PRICING.map((p) => (
            <motion.div
              key={p.name}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className={cn(
                "relative flex flex-col rounded-3xl border p-7 shadow-soft",
                p.highlight
                  ? "border-transparent bg-gradient-to-br from-[#111439] via-[#312e81] to-[#4338ca] text-white shadow-glow lg:scale-105"
                  : "border-[rgba(17,20,57,0.08)] bg-white/70 backdrop-blur",
              )}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-white px-4 py-1 text-xs font-bold text-brand-600 shadow-lg">
                  <Crown size={13} /> Most Popular
                </span>
              )}
              <h3
                className={cn(
                  "text-lg font-bold",
                  p.highlight ? "text-white" : "text-ink",
                )}
              >
                {p.name}
              </h3>
              <p
                className={cn(
                  "mt-1 text-sm",
                  p.highlight ? "text-white/70" : "text-ink-2",
                )}
              >
                {p.desc}
              </p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">{p.price}</span>
                <span
                  className={cn(
                    "text-sm",
                    p.highlight ? "text-white/60" : "text-ink-3",
                  )}
                >
                  /{p.period}
                </span>
              </div>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <span
                      className={cn(
                        "grid h-5 w-5 shrink-0 place-items-center rounded-full",
                        p.highlight
                          ? "bg-white/20 text-white"
                          : "bg-emerald-50 text-emerald-600",
                      )}
                    >
                      <Check size={13} />
                    </span>
                    <span
                      className={p.highlight ? "text-white/90" : "text-ink-2"}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-2">
                <Button
                  onClick={onLaunch}
                  variant={p.highlight ? "secondary" : "primary"}
                  className="w-full"
                >
                  {p.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- FAQ -------------------- */
export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          subtitle="Everything you need to know about AI ResumeCraft."
        />
        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.04}>
                <div className="overflow-hidden rounded-2xl border border-[rgba(17,20,57,0.08)] bg-white/70 backdrop-blur">
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-ink">{f.q}</span>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
                      {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="px-6 pb-5 text-sm leading-relaxed text-ink-2">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------- CTA -------------------- */
export function CTA({ onLaunch }) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#111439] via-[#4F46E5] to-[#7C3AED] px-6 py-16 text-center shadow-glow sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute -left-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" />
            <Badge className="mx-auto mb-6 border-white/20 bg-white/10 text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Free
              to start
            </Badge>
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              Your dream job is one resume away
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-white/80">
              Build a stunning, ATS-friendly resume in minutes — no design
              skills required.
            </p>
            <div className="mt-8 flex justify-center">
              <Button size="lg" variant="secondary" onClick={onLaunch}>
                Start Building Free <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------- Footer -------------------- */
export function Footer() {
  const cols = {
    Product: ["Features", "Templates", "Pricing", "AI Writer"],
    Company: ["About", "Careers", "Blog", "Press"],
    Resources: ["Help Center", "Resume Guide", "Examples", "Contact"],
    Legal: ["Privacy", "Terms", "Cookies", "Security"],
  };
  return (
    <footer className="border-t border-[rgba(17,20,57,0.08)] bg-white/50 pt-16">
      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="AI ResumeCraft logo"
                className="h-9 w-9 rounded-xl object-cover shadow-[0_4px_12px_-4px_rgba(79,70,229,0.5)]"
              />
              <span className="text-lg font-extrabold text-ink">
                AI Resum<span className="text-gradient">eCraft</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-ink-2">
              The intelligent resume builder helping professionals land their
              dream jobs faster.
            </p>
          </div>
          {Object.entries(cols).map(([title, items]) => (
            <div key={title}>
              <p className="text-sm font-bold text-ink">{title}</p>
              <ul className="mt-4 space-y-2.5">
                {items.map((it) => (
                  <li key={it}>
                    <a
                      href="#top"
                      className="text-sm text-ink-2 transition hover:text-brand-600"
                    >
                      {it}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[rgba(17,20,57,0.08)] pt-6 sm:flex-row">
          <p className="text-sm text-ink-3">
            © 2026 AI ResumeCraft. All rights reserved.
          </p>
          <p className="text-sm text-ink-3">
            Crafted with AI · Built for humans
          </p>
        </div>
      </div>
    </footer>
  );
}
