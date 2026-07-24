import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Reveal({ children, className, delay = 0, variants = fadeUp }) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  as,
  ...props
}) {
  const Comp = as || (props.href ? "a" : "button");
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer select-none";
  const sizes = {
    sm: "text-sm px-4 py-2",
    md: "text-sm px-6 py-3",
    lg: "text-base px-8 py-4",
  };
  const variants = {
    primary:
      "text-white bg-gradient-to-r from-[#111439] via-[#4F46E5] to-[#7C3AED] bg-[length:200%_200%] hover:bg-right shadow-[0_10px_30px_-8px_rgba(79,70,229,0.5)] hover:shadow-[0_16px_40px_-8px_rgba(124,58,237,0.6)] hover:-translate-y-0.5",
    secondary:
      "text-ink bg-white border border-[rgba(17,20,57,0.1)] shadow-sm hover:shadow-md hover:-translate-y-0.5",
    ghost: "text-ink-2 hover:text-ink hover:bg-black/5",
    soft: "text-brand-600 bg-brand-50 hover:bg-brand-100",
  };
  return (
    <Comp
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Badge({ children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[rgba(17,20,57,0.08)] bg-white/70 px-4 py-1.5 text-xs font-semibold text-ink-2 backdrop-blur",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
  className,
}) {
  return (
    <div
      className={cn(
        center && "mx-auto max-w-2xl text-center",
        "mb-14",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <Badge className="mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand-500 to-violet-brand" />
            {eyebrow}
          </Badge>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.1}>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-ink-2">
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
