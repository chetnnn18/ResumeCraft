import { Reorder, AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, Copy, GripVertical, Sparkles } from "lucide-react";
import { useResume, newId } from "../../context/ResumeContext";
import { Field, TextArea } from "./Fields";
import { Button } from "../ui/primitives";
import { FONT_OPTIONS, ACCENT_OPTIONS, TEMPLATES } from "../../Data";
import { cn } from "../../utils/cn";

function ItemShell({ item, onRemove, onDuplicate, children }) {
  return (
    <Reorder.Item
      value={item}
      className="group rounded-2xl border border-[rgba(17,20,57,0.08)] bg-white p-4 shadow-sm"
      whileDrag={{
        scale: 1.02,
        boxShadow: "0 20px 40px -12px rgba(17,20,57,0.25)",
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="flex cursor-grab items-center gap-1.5 text-ink-3 active:cursor-grabbing">
          <GripVertical size={16} />{" "}
          <span className="text-xs font-semibold">Drag to reorder</span>
        </span>
        <div className="flex gap-1">
          {onDuplicate && (
            <button
              onClick={onDuplicate}
              className="grid h-8 w-8 place-items-center rounded-lg text-ink-3 transition hover:bg-brand-50 hover:text-brand-600 cursor-pointer"
              aria-label="Duplicate"
            >
              <Copy size={15} />
            </button>
          )}
          <button
            onClick={onRemove}
            className="grid h-8 w-8 place-items-center rounded-lg text-ink-3 transition hover:bg-red-50 hover:text-red-500 cursor-pointer"
            aria-label="Remove"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      {children}
    </Reorder.Item>
  );
}

function AddBtn({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-brand-300 bg-brand-50/40 py-3 text-sm font-semibold text-brand-600 transition hover:bg-brand-50 cursor-pointer"
    >
      <Plus size={16} /> {label}
    </button>
  );
}

function AIInlineBtn({ onClick, label = "Write with AI" }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] px-3 py-1.5 text-xs font-semibold text-white shadow transition hover:shadow-lg cursor-pointer"
    >
      <Sparkles size={13} /> {label}
    </button>
  );
}

export default function FormSections({ active, onAI }) {
  const { resume, update, setField } = useResume();

  const setList = (key, list) => setField(key, list);
  const addItem = (key, obj) =>
    setField(key, [...resume[key], { id: newId(), ...obj }]);
  const removeItem = (key, id) =>
    setField(
      key,
      resume[key].filter((i) => i.id !== id),
    );
  const dupItem = (key, item) => {
    const idx = resume[key].findIndex((i) => i.id === item.id);
    const copy = { ...item, id: newId() };
    const next = [...resume[key]];
    next.splice(idx + 1, 0, copy);
    setField(key, next);
  };
  const editItem = (key, id, patch) =>
    setField(
      key,
      resume[key].map((i) => (i.id === id ? { ...i, ...patch } : i)),
    );

  /* ---------- Personal ---------- */
  if (active === "personal")
    return (
      <Wrap title="Personal Information" desc="Tell us about yourself.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Full Name"
            value={resume.personal.fullName}
            onChange={(v) => update("personal.fullName", v)}
            placeholder="Alex Morgan"
          />
          <Field
            label="Job Title"
            value={resume.personal.title}
            onChange={(v) => update("personal.title", v)}
            placeholder="Senior Software Engineer"
          />
          <Field
            label="Email"
            type="email"
            value={resume.personal.email}
            onChange={(v) => update("personal.email", v)}
            placeholder="you@email.com"
          />
          <Field
            label="Phone"
            value={resume.personal.phone}
            onChange={(v) => update("personal.phone", v)}
            placeholder="+1 (555) 000-0000"
          />
          <Field
            label="Location"
            value={resume.personal.location}
            onChange={(v) => update("personal.location", v)}
            placeholder="San Francisco, CA"
          />
          <Field
            label="Website"
            value={resume.personal.website}
            onChange={(v) => update("personal.website", v)}
            placeholder="yoursite.com"
          />
          <Field
            label="LinkedIn"
            value={resume.personal.linkedin}
            onChange={(v) => update("personal.linkedin", v)}
            placeholder="linkedin.com/in/you"
            className="sm:col-span-2"
          />
        </div>
      </Wrap>
    );

  /* ---------- Summary ---------- */
  if (active === "summary")
    return (
      <Wrap
        title="Professional Summary"
        desc="A punchy 2–3 sentence intro."
        action={<AIInlineBtn onClick={() => onAI("summary")} />}
      >
        <TextArea
          value={resume.summary}
          onChange={(v) => setField("summary", v)}
          rows={6}
          placeholder="Write a compelling summary or generate one with AI…"
          hint={`${resume.summary?.length || 0} chars`}
        />
      </Wrap>
    );

  /* ---------- Experience ---------- */
  if (active === "experience")
    return (
      <Wrap
        title="Work Experience"
        desc="List your roles, most recent first."
        action={
          <AIInlineBtn
            onClick={() => onAI("enhance")}
            label="Enhance with AI"
          />
        }
      >
        <Reorder.Group
          axis="y"
          values={resume.experience}
          onReorder={(v) => setList("experience", v)}
          className="space-y-3"
        >
          <AnimatePresence>
            {resume.experience.map((e) => (
              <ItemShell
                key={e.id}
                item={e}
                onRemove={() => removeItem("experience", e.id)}
                onDuplicate={() => dupItem("experience", e)}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Role"
                    value={e.role}
                    onChange={(v) => editItem("experience", e.id, { role: v })}
                    placeholder="Software Engineer"
                  />
                  <Field
                    label="Company"
                    value={e.company}
                    onChange={(v) =>
                      editItem("experience", e.id, { company: v })
                    }
                    placeholder="Acme Inc."
                  />
                  <Field
                    label="Location"
                    value={e.location}
                    onChange={(v) =>
                      editItem("experience", e.id, { location: v })
                    }
                    placeholder="Remote"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Field
                      label="Start"
                      value={e.start}
                      onChange={(v) =>
                        editItem("experience", e.id, { start: v })
                      }
                      placeholder="2021"
                    />
                    <Field
                      label="End"
                      value={e.end}
                      onChange={(v) => editItem("experience", e.id, { end: v })}
                      placeholder="Present"
                    />
                  </div>
                </div>
                <TextArea
                  className="mt-3"
                  label="Achievements (one per line)"
                  value={e.bullets}
                  onChange={(v) => editItem("experience", e.id, { bullets: v })}
                  rows={4}
                  placeholder="Led a team that…"
                />
              </ItemShell>
            ))}
          </AnimatePresence>
        </Reorder.Group>
        <div className="mt-3">
          <AddBtn
            onClick={() =>
              addItem("experience", {
                role: "",
                company: "",
                location: "",
                start: "",
                end: "",
                bullets: "",
              })
            }
            label="Add Experience"
          />
        </div>
      </Wrap>
    );

  /* ---------- Education ---------- */
  if (active === "education")
    return (
      <Wrap title="Education" desc="Your academic background.">
        <Reorder.Group
          axis="y"
          values={resume.education}
          onReorder={(v) => setList("education", v)}
          className="space-y-3"
        >
          <AnimatePresence>
            {resume.education.map((ed) => (
              <ItemShell
                key={ed.id}
                item={ed}
                onRemove={() => removeItem("education", ed.id)}
                onDuplicate={() => dupItem("education", ed)}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Degree"
                    value={ed.degree}
                    onChange={(v) =>
                      editItem("education", ed.id, { degree: v })
                    }
                    placeholder="B.S. Computer Science"
                  />
                  <Field
                    label="School"
                    value={ed.school}
                    onChange={(v) =>
                      editItem("education", ed.id, { school: v })
                    }
                    placeholder="Stanford University"
                  />
                  <Field
                    label="Location"
                    value={ed.location}
                    onChange={(v) =>
                      editItem("education", ed.id, { location: v })
                    }
                    placeholder="Stanford, CA"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Field
                      label="Start"
                      value={ed.start}
                      onChange={(v) =>
                        editItem("education", ed.id, { start: v })
                      }
                      placeholder="2014"
                    />
                    <Field
                      label="End"
                      value={ed.end}
                      onChange={(v) => editItem("education", ed.id, { end: v })}
                      placeholder="2018"
                    />
                  </div>
                </div>
                <Field
                  className="mt-3"
                  label="Details"
                  value={ed.detail}
                  onChange={(v) => editItem("education", ed.id, { detail: v })}
                  placeholder="GPA 3.8 · Honors"
                />
              </ItemShell>
            ))}
          </AnimatePresence>
        </Reorder.Group>
        <div className="mt-3">
          <AddBtn
            onClick={() =>
              addItem("education", {
                degree: "",
                school: "",
                location: "",
                start: "",
                end: "",
                detail: "",
              })
            }
            label="Add Education"
          />
        </div>
      </Wrap>
    );

  /* ---------- Skills ---------- */
  if (active === "skills")
    return (
      <Wrap
        title="Skills"
        desc="Add your top skills."
        action={
          <AIInlineBtn onClick={() => onAI("skills")} label="Suggest Skills" />
        }
      >
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {resume.skills.map((s) => (
              <motion.span
                key={s.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group inline-flex items-center gap-1.5 rounded-full border border-[rgba(17,20,57,0.1)] bg-white py-1.5 pl-3 pr-1.5 text-sm font-medium text-ink shadow-sm"
              >
                <input
                  value={s.name}
                  onChange={(e) =>
                    editItem("skills", s.id, { name: e.target.value })
                  }
                  className="w-auto max-w-[140px] bg-transparent outline-none cursor-text"
                  style={{ width: `${Math.max(s.name.length, 4)}ch` }}
                />
                <button
                  onClick={() => removeItem("skills", s.id)}
                  className="grid h-5 w-5 place-items-center rounded-full text-ink-3 hover:bg-red-50 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
          <button
            onClick={() => addItem("skills", { name: "New Skill" })}
            className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-brand-300 bg-brand-50/40 px-3 py-1.5 text-sm font-semibold text-brand-600 hover:bg-brand-50 cursor-pointer"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </Wrap>
    );

  /* ---------- Projects ---------- */
  if (active === "projects")
    return (
      <Wrap title="Projects" desc="Highlight your best work.">
        <Reorder.Group
          axis="y"
          values={resume.projects}
          onReorder={(v) => setList("projects", v)}
          className="space-y-3"
        >
          <AnimatePresence>
            {resume.projects.map((p) => (
              <ItemShell
                key={p.id}
                item={p}
                onRemove={() => removeItem("projects", p.id)}
                onDuplicate={() => dupItem("projects", p)}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Project Name"
                    value={p.name}
                    onChange={(v) => editItem("projects", p.id, { name: v })}
                    placeholder="DevBoard"
                  />
                  <Field
                    label="Link"
                    value={p.link}
                    onChange={(v) => editItem("projects", p.id, { link: v })}
                    placeholder="github.com/…"
                  />
                </div>
                <TextArea
                  className="mt-3"
                  label="Description"
                  value={p.desc}
                  onChange={(v) => editItem("projects", p.id, { desc: v })}
                  rows={2}
                  placeholder="What it does and your impact…"
                />
              </ItemShell>
            ))}
          </AnimatePresence>
        </Reorder.Group>
        <div className="mt-3">
          <AddBtn
            onClick={() =>
              addItem("projects", { name: "", link: "", desc: "" })
            }
            label="Add Project"
          />
        </div>
      </Wrap>
    );

  /* ---------- Certifications ---------- */
  if (active === "certifications")
    return (
      <Wrap title="Certifications" desc="Show your credentials.">
        <Reorder.Group
          axis="y"
          values={resume.certifications}
          onReorder={(v) => setList("certifications", v)}
          className="space-y-3"
        >
          <AnimatePresence>
            {resume.certifications.map((c) => (
              <ItemShell
                key={c.id}
                item={c}
                onRemove={() => removeItem("certifications", c.id)}
                onDuplicate={() => dupItem("certifications", c)}
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field
                    className="sm:col-span-1"
                    label="Name"
                    value={c.name}
                    onChange={(v) =>
                      editItem("certifications", c.id, { name: v })
                    }
                    placeholder="AWS Architect"
                  />
                  <Field
                    label="Issuer"
                    value={c.issuer}
                    onChange={(v) =>
                      editItem("certifications", c.id, { issuer: v })
                    }
                    placeholder="Amazon"
                  />
                  <Field
                    label="Year"
                    value={c.year}
                    onChange={(v) =>
                      editItem("certifications", c.id, { year: v })
                    }
                    placeholder="2023"
                  />
                </div>
              </ItemShell>
            ))}
          </AnimatePresence>
        </Reorder.Group>
        <div className="mt-3">
          <AddBtn
            onClick={() =>
              addItem("certifications", { name: "", issuer: "", year: "" })
            }
            label="Add Certification"
          />
        </div>
      </Wrap>
    );

  /* ---------- Languages ---------- */
  if (active === "languages")
    return (
      <Wrap title="Languages" desc="Languages you speak.">
        <Reorder.Group
          axis="y"
          values={resume.languages}
          onReorder={(v) => setList("languages", v)}
          className="space-y-3"
        >
          <AnimatePresence>
            {resume.languages.map((l) => (
              <ItemShell
                key={l.id}
                item={l}
                onRemove={() => removeItem("languages", l.id)}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Language"
                    value={l.name}
                    onChange={(v) => editItem("languages", l.id, { name: v })}
                    placeholder="English"
                  />
                  <Field
                    label="Level"
                    value={l.level}
                    onChange={(v) => editItem("languages", l.id, { level: v })}
                    placeholder="Native"
                  />
                </div>
              </ItemShell>
            ))}
          </AnimatePresence>
        </Reorder.Group>
        <div className="mt-3">
          <AddBtn
            onClick={() => addItem("languages", { name: "", level: "" })}
            label="Add Language"
          />
        </div>
      </Wrap>
    );

  /* ---------- References ---------- */
  if (active === "references")
    return (
      <Wrap title="References" desc="Optional — add on request.">
        <Reorder.Group
          axis="y"
          values={resume.references}
          onReorder={(v) => setList("references", v)}
          className="space-y-3"
        >
          <AnimatePresence>
            {resume.references.map((rf) => (
              <ItemShell
                key={rf.id}
                item={rf}
                onRemove={() => removeItem("references", rf.id)}
              >
                <div className="grid gap-3 sm:grid-cols-1">
                  <Field
                    label="Name"
                    value={rf.name}
                    onChange={(v) => editItem("references", rf.id, { name: v })}
                    placeholder="Jordan Lee"
                  />
                  <Field
                    label="Relationship"
                    value={rf.relation}
                    onChange={(v) =>
                      editItem("references", rf.id, { relation: v })
                    }
                    placeholder="Manager at Acme"
                  />
                  <Field
                    label="Contact"
                    value={rf.contact}
                    onChange={(v) =>
                      editItem("references", rf.id, { contact: v })
                    }
                    placeholder="jordan@email.com"
                  />
                </div>
              </ItemShell>
            ))}
          </AnimatePresence>
        </Reorder.Group>
        <div className="mt-3">
          <AddBtn
            onClick={() =>
              addItem("references", { name: "", relation: "", contact: "" })
            }
            label="Add Reference"
          />
        </div>
      </Wrap>
    );

  /* ---------- Settings ---------- */
  if (active === "settings")
    return (
      <Wrap title="Design & Settings" desc="Customize the look of your resume.">
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-xs font-semibold text-ink-2">Template</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setField("template", t.id);
                    setField("accent", t.accent);
                  }}
                  className={cn(
                    "rounded-xl border-2 px-3 py-3 text-left text-sm font-semibold transition cursor-pointer",
                    resume.template === t.id
                      ? "border-brand-500 bg-brand-50"
                      : "border-[rgba(17,20,57,0.08)] bg-white hover:border-brand-300",
                  )}
                >
                  <span
                    className="mb-2 block h-2 w-8 rounded-full"
                    style={{ background: t.accent }}
                  />
                  {t.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-ink-2">
              Accent Color
            </p>
            <div className="flex flex-wrap gap-2">
              {ACCENT_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setField("accent", c)}
                  className={cn(
                    "h-9 w-9 rounded-full ring-2 ring-offset-2 transition cursor-pointer",
                    resume.accent === c ? "ring-brand-500" : "ring-transparent",
                  )}
                  style={{ background: c }}
                  aria-label={`Accent ${c}`}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-ink-2">Font Family</p>
            <div className="flex flex-wrap gap-2">
              {FONT_OPTIONS.map((f) => (
                <button
                  key={f}
                  onClick={() => setField("font", f)}
                  className={cn(
                    "rounded-xl border px-4 py-2 text-sm transition cursor-pointer",
                    resume.font === f
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-[rgba(17,20,57,0.1)] bg-white text-ink-2 hover:border-brand-300",
                  )}
                  style={{ fontFamily: f }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Wrap>
    );

  return null;
}

function Wrap({ title, desc, action, children }) {
  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-ink">{title}</h2>
          <p className="mt-1 text-sm text-ink-2">{desc}</p>
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}
