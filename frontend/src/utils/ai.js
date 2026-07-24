// Simulated AI content generators (no external API — deterministic-ish demo output)

const SUMMARIES = [
  "Results-driven {title} with a proven record of shipping high-impact products. Combines deep technical expertise with strong collaboration to deliver scalable, user-focused solutions that move key business metrics.",
  "Innovative {title} passionate about turning complex problems into elegant solutions. Experienced in leading cross-functional teams, optimizing performance, and driving measurable growth across fast-paced environments.",
  "Detail-oriented {title} with a track record of exceeding goals through data-driven decision making. Skilled at balancing speed and quality to deliver products that customers love.",
];

const BULLETS = [
  "Spearheaded {x} that increased efficiency by {n}% across the organization.",
  "Led a team of {m} to deliver {x} ahead of schedule and under budget.",
  "Architected and shipped {x}, improving user engagement by {n}%.",
  "Reduced operational costs by {n}% by streamlining {x}.",
  "Drove adoption of {x}, growing active usage to {k}+ users.",
];

const SKILLS_BY_ROLE = {
  default: [
    "Leadership",
    "Communication",
    "Problem Solving",
    "Project Management",
    "Agile",
    "Strategy",
  ],
  engineer: [
    "React",
    "TypeScript",
    "Node.js",
    "AWS",
    "Docker",
    "CI/CD",
    "System Design",
    "GraphQL",
  ],
  designer: [
    "Figma",
    "User Research",
    "Prototyping",
    "Design Systems",
    "Wireframing",
    "Accessibility",
  ],
  manager: [
    "Roadmapping",
    "Stakeholder Mgmt",
    "OKRs",
    "Analytics",
    "A/B Testing",
    "Go-to-Market",
  ],
};

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const num = (a, b) => Math.floor(Math.random() * (b - a) + a);

export function genSummary(title = "professional") {
  return rand(SUMMARIES).replaceAll("{title}", title || "professional");
}

export function genBullets(context = "key initiatives") {
  const set = new Set();
  while (set.size < 3) {
    set.add(
      rand(BULLETS)
        .replaceAll("{x}", context || "key initiatives")
        .replaceAll("{n}", num(20, 80))
        .replaceAll("{m}", num(3, 12))
        .replaceAll("{k}", num(5, 90) + "K"),
    );
  }
  return [...set].join("\n");
}

export function genSkills(title = "") {
  const t = title.toLowerCase();
  let key = "default";
  if (t.includes("engineer") || t.includes("developer")) key = "engineer";
  else if (t.includes("design")) key = "designer";
  else if (t.includes("manager") || t.includes("product")) key = "manager";
  return SKILLS_BY_ROLE[key];
}

export function genKeywords(title = "") {
  const base = genSkills(title);
  return [
    ...base,
    "Cross-functional",
    "Scalability",
    "Optimization",
    "Mentorship",
  ].slice(0, 10);
}

export function genCoverLetter(name = "Your Name", title = "the role") {
  return `Dear Hiring Manager,\n\nI am excited to apply for ${title}. With a strong background in delivering measurable results and a passion for excellence, I am confident I can make an immediate impact on your team.\n\nThroughout my career I have consistently exceeded expectations — driving growth, leading initiatives, and collaborating across teams to ship outcomes that matter. I thrive in fast-paced environments and bring both strategic thinking and hands-on execution.\n\nI would welcome the opportunity to discuss how my experience aligns with your goals. Thank you for your consideration.\n\nWarm regards,\n${name}`;
}

export function genenhance(text = "") {
  if (!text.trim()) return genBullets("strategic initiatives");
  return text
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const verbs = [
        "Spearheaded",
        "Drove",
        "Orchestrated",
        "Pioneered",
        "Optimized",
      ];
      const cleaned = line.replace(/^[-•\s]+/, "");
      return `${rand(verbs)} ${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}`;
    })
    .join("\n");
}

export function computeScore(resume) {
  let score = 40;
  const tips = [];
  if (resume.summary && resume.summary.length > 80) score += 12;
  else tips.push("Add a richer professional summary (80+ characters).");
  if (resume.experience?.length >= 2) score += 16;
  else tips.push("Add at least 2 work experiences for stronger impact.");
  if (resume.skills?.length >= 6) score += 12;
  else tips.push("List at least 6 relevant skills.");
  if (resume.education?.length >= 1) score += 8;
  else tips.push("Include your education details.");
  if (resume.projects?.length >= 1) score += 6;
  else tips.push("Showcase a project to stand out.");
  if (resume.personal?.linkedin) score += 6;
  else tips.push("Add a LinkedIn or portfolio link.");
  const hasMetrics = resume.experience?.some((e) => /\d/.test(e.bullets || ""));
  if (hasMetrics) score += 10;
  else tips.push("Quantify achievements with numbers and metrics.");
  return { score: Math.min(score, 99), tips: tips.slice(0, 4) };
}
