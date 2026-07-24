import { Mail, Phone, MapPin, Globe, Link2 as Linkedin } from "lucide-react";

function Bullets({ text }) {
  if (!text) return null;
  return (
    <ul className="mt-1 space-y-1">
      {text
        .split("\n")
        .filter(Boolean)
        .map((b, i) => (
          <li key={i} className="flex gap-2 leading-snug">
            <span className="mt-[6px] inline-block h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />
            <span>{b.replace(/^[-•\s]+/, "")}</span>
          </li>
        ))}
    </ul>
  );
}

/* ---------- Template: Modern (two-column header band) ---------- */
function ModernTemplate({ r, accent }) {
  return (
    <div className="px-9 py-8 text-[11px] text-slate-700">
      <header className="border-b-2 pb-4" style={{ borderColor: accent }}>
        <h1 className="text-[26px] font-extrabold tracking-tight text-slate-900">
          {r.personal.fullName}
        </h1>
        <p className="text-[13px] font-semibold" style={{ color: accent }}>
          {r.personal.title}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500">
          {r.personal.email && <span className="inline-flex items-center gap-1"><Mail size={11} />{r.personal.email}</span>}
          {r.personal.phone && <span className="inline-flex items-center gap-1"><Phone size={11} />{r.personal.phone}</span>}
          {r.personal.location && <span className="inline-flex items-center gap-1"><MapPin size={11} />{r.personal.location}</span>}
          {r.personal.linkedin && <span className="inline-flex items-center gap-1"><Linkedin size={11} />{r.personal.linkedin}</span>}
        </div>
      </header>

      <Section title="Profile" accent={accent}>
        <p className="leading-relaxed">{r.summary}</p>
      </Section>

      <Section title="Experience" accent={accent}>
        <div className="space-y-3">
          {r.experience.map((e) => (
            <div key={e.id}>
              <div className="flex items-baseline justify-between">
                <p className="font-bold text-slate-900">{e.role}</p>
                <span className="text-[10px] text-slate-500">{e.start} – {e.end}</span>
              </div>
              <p className="text-[10.5px] font-semibold" style={{ color: accent }}>{e.company}{e.location ? ` · ${e.location}` : ""}</p>
              <Bullets text={e.bullets} />
            </div>
          ))}
        </div>
      </Section>

      <div className="grid grid-cols-2 gap-6">
        <Section title="Education" accent={accent}>
          {r.education.map((ed) => (
            <div key={ed.id} className="mb-2">
              <p className="font-bold text-slate-900">{ed.degree}</p>
              <p className="text-[10.5px]" style={{ color: accent }}>{ed.school}</p>
              <p className="text-[10px] text-slate-500">{ed.start} – {ed.end}</p>
              {ed.detail && <p className="text-[10px] text-slate-500">{ed.detail}</p>}
            </div>
          ))}
        </Section>
        <Section title="Skills" accent={accent}>
          <div className="flex flex-wrap gap-1.5">
            {r.skills.map((s) => (
              <span key={s.id} className="rounded px-2 py-0.5 text-[10px] font-medium" style={{ background: `${accent}15`, color: accent }}>
                {s.name}
              </span>
            ))}
          </div>
        </Section>
      </div>

      {r.projects?.length > 0 && (
        <Section title="Projects" accent={accent}>
          {r.projects.map((p) => (
            <div key={p.id} className="mb-1.5">
              <p className="font-bold text-slate-900">{p.name} <span className="font-normal text-slate-400">{p.link}</span></p>
              <p className="leading-snug">{p.desc}</p>
            </div>
          ))}
        </Section>
      )}

      <div className="grid grid-cols-2 gap-6">
        {r.certifications?.length > 0 && (
          <Section title="Certifications" accent={accent}>
            {r.certifications.map((c) => (
              <p key={c.id} className="mb-1">{c.name} <span className="text-slate-400">· {c.issuer} {c.year}</span></p>
            ))}
          </Section>
        )}
        {r.languages?.length > 0 && (
          <Section title="Languages" accent={accent}>
            {r.languages.map((l) => (
              <p key={l.id} className="mb-1">{l.name} <span className="text-slate-400">— {l.level}</span></p>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

/* ---------- Template: Minimal ---------- */
function MinimalTemplate({ r, accent }) {
  return (
    <div className="px-10 py-10 text-[11px] text-slate-700">
      <header className="text-center">
        <h1 className="text-[24px] font-bold tracking-[0.04em] text-slate-900 uppercase">{r.personal.fullName}</h1>
        <p className="mt-1 text-[12px] tracking-wide text-slate-500">{r.personal.title}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-x-3 text-[10px] text-slate-500">
          {[r.personal.email, r.personal.phone, r.personal.location, r.personal.website].filter(Boolean).join("  ·  ")}
        </div>
      </header>
      <hr className="my-5 border-slate-200" />
      <MinSec title="Summary"><p className="leading-relaxed">{r.summary}</p></MinSec>
      <MinSec title="Experience">
        {r.experience.map((e) => (
          <div key={e.id} className="mb-3">
            <div className="flex justify-between"><p className="font-semibold text-slate-900">{e.role}, {e.company}</p><span className="text-slate-400">{e.start}–{e.end}</span></div>
            <Bullets text={e.bullets} />
          </div>
        ))}
      </MinSec>
      <MinSec title="Education">
        {r.education.map((ed) => (
          <div key={ed.id} className="flex justify-between"><p><span className="font-semibold text-slate-900">{ed.degree}</span>, {ed.school}</p><span className="text-slate-400">{ed.start}–{ed.end}</span></div>
        ))}
      </MinSec>
      <MinSec title="Skills"><p>{r.skills.map((s) => s.name).join(" · ")}</p></MinSec>
    </div>
  );
}

/* ---------- Template: Sidebar (Executive / Corporate / Creative / Developer) ---------- */
function SidebarTemplate({ r, accent, dark = false }) {
  return (
    <div className="flex min-h-full text-[11px]">
      <aside className="w-[34%] px-5 py-8 text-white" style={{ background: dark ? "#111439" : accent }}>
        <h1 className="text-[20px] font-extrabold leading-tight">{r.personal.fullName}</h1>
        <p className="mt-1 text-[11px] opacity-80">{r.personal.title}</p>
        <SideBlock title="Contact">
          <div className="space-y-1.5 text-[10px] opacity-90">
            {r.personal.email && <p className="flex items-center gap-1.5"><Mail size={10} />{r.personal.email}</p>}
            {r.personal.phone && <p className="flex items-center gap-1.5"><Phone size={10} />{r.personal.phone}</p>}
            {r.personal.location && <p className="flex items-center gap-1.5"><MapPin size={10} />{r.personal.location}</p>}
            {r.personal.linkedin && <p className="flex items-center gap-1.5"><Linkedin size={10} />{r.personal.linkedin}</p>}
            {r.personal.website && <p className="flex items-center gap-1.5"><Globe size={10} />{r.personal.website}</p>}
          </div>
        </SideBlock>
        <SideBlock title="Skills">
          <div className="flex flex-wrap gap-1.5">
            {r.skills.map((s) => (
              <span key={s.id} className="rounded bg-white/15 px-2 py-0.5 text-[9.5px]">{s.name}</span>
            ))}
          </div>
        </SideBlock>
        {r.languages?.length > 0 && (
          <SideBlock title="Languages">
            {r.languages.map((l) => <p key={l.id} className="text-[10px] opacity-90">{l.name} — {l.level}</p>)}
          </SideBlock>
        )}
        {r.certifications?.length > 0 && (
          <SideBlock title="Certifications">
            {r.certifications.map((c) => <p key={c.id} className="text-[10px] opacity-90">{c.name}</p>)}
          </SideBlock>
        )}
      </aside>
      <main className="flex-1 px-6 py-8 text-slate-700">
        <Section title="Profile" accent={accent}><p className="leading-relaxed">{r.summary}</p></Section>
        <Section title="Experience" accent={accent}>
          <div className="space-y-3">
            {r.experience.map((e) => (
              <div key={e.id}>
                <div className="flex items-baseline justify-between">
                  <p className="font-bold text-slate-900">{e.role}</p>
                  <span className="text-[10px] text-slate-500">{e.start}–{e.end}</span>
                </div>
                <p className="text-[10.5px] font-semibold" style={{ color: accent }}>{e.company}</p>
                <Bullets text={e.bullets} />
              </div>
            ))}
          </div>
        </Section>
        <Section title="Education" accent={accent}>
          {r.education.map((ed) => (
            <div key={ed.id} className="mb-1.5">
              <p className="font-bold text-slate-900">{ed.degree}</p>
              <p className="text-[10.5px]" style={{ color: accent }}>{ed.school} · {ed.start}–{ed.end}</p>
            </div>
          ))}
        </Section>
        {r.projects?.length > 0 && (
          <Section title="Projects" accent={accent}>
            {r.projects.map((p) => (
              <div key={p.id} className="mb-1.5"><p className="font-bold text-slate-900">{p.name}</p><p>{p.desc}</p></div>
            ))}
          </Section>
        )}
      </main>
    </div>
  );
}

function Section({ title, accent, children }) {
  return (
    <section className="mt-5">
      <h3 className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wider" style={{ color: accent }}>{title}</h3>
      {children}
    </section>
  );
}
function MinSec({ title, children }) {
  return (
    <section className="mb-4">
      <h3 className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{title}</h3>
      {children}
    </section>
  );
}
function SideBlock({ title, children }) {
  return (
    <div className="mt-5">
      <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] opacity-70">{title}</h3>
      {children}
    </div>
  );
}

export default function ResumePreview({ resume }) {
  const accent = resume.accent || "#4F46E5";
  const t = resume.template || "modern";
  let Body;
  if (t === "minimal") Body = <MinimalTemplate r={resume} accent={accent} />;
  else if (t === "executive") Body = <SidebarTemplate r={resume} accent={accent} dark />;
  else if (t === "creative" || t === "corporate" || t === "developer")
    Body = <SidebarTemplate r={resume} accent={accent} />;
  else Body = <ModernTemplate r={resume} accent={accent} />;

  return (
    <div
      className="resume-doc mx-auto bg-white"
      style={{ fontFamily: resume.font || "Inter", width: "100%", aspectRatio: "1 / 1.414" }}
      id="resume-doc"
    >
      {Body}
    </div>
  );
}
