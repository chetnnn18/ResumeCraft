import { cn } from "../../utils/cn";

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className,
}) {
  return (
    <label className={cn("block", className)}>
      {label && (
        <span className="mb-1.5 block text-xs font-semibold text-ink-2">
          {label}
        </span>
      )}
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[rgba(17,20,57,0.1)] bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 cursor-text"
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  hint,
  className,
}) {
  return (
    <label className={cn("block", className)}>
      {label && (
        <span className="mb-1.5 flex items-center justify-between text-xs font-semibold text-ink-2">
          {label}
          {hint && <span className="font-normal text-ink-3">{hint}</span>}
        </span>
      )}
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-xl border border-[rgba(17,20,57,0.1)] bg-white px-3.5 py-2.5 text-sm leading-relaxed text-ink shadow-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 cursor-text"
      />
    </label>
  );
}
