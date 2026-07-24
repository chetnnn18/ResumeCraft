import {
  Sparkles,
  ShieldCheck,
  Eye,
  Download,
  MousePointerClick,
  LayoutGrid,
  Wand2,
  Gauge,
} from "lucide-react";

export const COMPANIES = [
  "Google",
  "Amazon",
  "Microsoft",
  "Meta",
  "Netflix",
  "Spotify",
  "Airbnb",
  "Stripe",
];

export const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Resume Writing",
    desc: "Generate compelling, recruiter-ready bullet points and summaries in seconds.",
  },
  {
    icon: ShieldCheck,
    title: "ATS Optimization",
    desc: "Beat applicant tracking systems with keyword-perfect, parseable formatting.",
  },
  {
    icon: Eye,
    title: "Live Preview",
    desc: "Watch every edit render instantly in a pixel-perfect resume preview.",
  },
  {
    icon: Download,
    title: "PDF Export",
    desc: "Download crisp, print-ready PDFs that look flawless on any device.",
  },
  {
    icon: MousePointerClick,
    title: "Drag & Drop Builder",
    desc: "Reorder sections effortlessly with a fluid drag-and-drop interface.",
  },
  {
    icon: LayoutGrid,
    title: "Multiple Templates",
    desc: "Choose from premium, designer-crafted templates for any industry.",
  },
  {
    icon: Wand2,
    title: "One-Click Improvements",
    desc: "Instantly elevate weak phrasing into powerful, results-driven language.",
  },
  {
    icon: Gauge,
    title: "Resume Scoring",
    desc: "Get an instant score with actionable insights to strengthen your resume.",
  },
];

export const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    accent: "#4F46E5",
    popular: true,
    tag: "Clean & balanced",
  },
  {
    id: "minimal",
    name: "Minimal",
    accent: "#111439",
    popular: false,
    tag: "Whitespace first",
  },
  {
    id: "executive",
    name: "Executive",
    accent: "#0F766E",
    popular: false,
    tag: "Leadership ready",
  },
  {
    id: "creative",
    name: "Creative",
    accent: "#DB2777",
    popular: true,
    tag: "Bold & vibrant",
  },
  {
    id: "corporate",
    name: "Corporate",
    accent: "#1D4ED8",
    popular: false,
    tag: "Polished & formal",
  },
  {
    id: "developer",
    name: "Developer",
    accent: "#7C3AED",
    popular: false,
    tag: "Tech-focused",
  },
  {
    id: "elegant",
    name: "Elegant",
    accent: "#92400E",
    popular: false,
    tag: "Sophisticated touch",
  },
  {
    id: "classic",
    name: "Classic",
    accent: "#1F2937",
    popular: false,
    tag: "Timeless & refined",
  },
];

















export const WORKFLOW = [
  {
    step: "01",
    title: "Enter Information",
    desc: "Add your details with our smart, guided forms — or import an existing resume.",
  },
  {
    step: "02",
    title: "AI Enhances Content",
    desc: "Let AI rewrite, optimize, and tailor your content for the role you want.",
  },
  {
    step: "03",
    title: "Choose Template",
    desc: "Pick a designer template and customize fonts, colors, and layout instantly.",
  },
  {
    step: "04",
    title: "Download Resume",
    desc: "Export a polished, ATS-friendly PDF ready to land your next interview.",
  },
];

export const BENEFITS = [
  { stat: "3x", label: "More interview callbacks" },
  { stat: "8 min", label: "Average time to build" },
  { stat: "98%", label: "ATS pass rate" },
  { stat: "120K+", label: "Resumes created" },
];

export const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Software Engineer @ Google",
    avatar: "https://i.pravatar.cc/120?img=47",
    text: "I built my resume in 10 minutes and landed 3 interviews the same week. The AI suggestions are unreal.",
    rating: 5,
  },
  {
    name: "Marcus Webb",
    role: "Product Manager @ Stripe",
    avatar: "https://i.pravatar.cc/120?img=12",
    text: "The ATS optimization actually works. My applications stopped getting ghosted overnight.",
    rating: 5,
  },
  {
    name: "Aisha Patel",
    role: "UX Designer @ Airbnb",
    avatar: "https://i.pravatar.cc/120?img=32",
    text: "Beautiful templates, smooth editing, and the live preview is addictive. Best resume tool I've used.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Data Scientist @ Netflix",
    avatar: "https://i.pravatar.cc/120?img=15",
    text: "The resume scoring feature pointed out gaps I never noticed. Total game-changer for my job hunt.",
    rating: 5,
  },
  {
    name: "Elena Rossi",
    role: "Marketing Lead @ Spotify",
    avatar: "https://i.pravatar.cc/120?img=45",
    text: "From blank page to recruiter-ready in one sitting. The AI rewrite assistant is pure magic.",
    rating: 5,
  },
  {
    name: "James Carter",
    role: "Recent Graduate",
    avatar: "https://i.pravatar.cc/120?img=68",
    text: "As a fresher with no clue how to write a resume, this made me look like a seasoned pro.",
    rating: 5,
  },
];

export const PRICING = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Everything you need to get started.",
    features: [
      "1 resume",
      "Basic templates",
      "PDF export",
      "Live preview",
      "Community support",
    ],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    desc: "For serious job seekers who want an edge.",
    features: [
      "Unlimited resumes",
      "All premium templates",
      "Full AI writing suite",
      "ATS score analyzer",
      "Cover letter generator",
      "Priority support",
    ],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Premium",
    price: "$29",
    period: "per month",
    desc: "Maximum power for career professionals.",
    features: [
      "Everything in Pro",
      "1-on-1 expert review",
      "LinkedIn optimization",
      "Personal brand kit",
      "Interview prep AI",
      "Dedicated success manager",
    ],
    cta: "Go Premium",
    highlight: false,
  },
];

export const FAQS = [
  {
    q: "Is AI ResumeCraft really free to start?",
    a: "Yes! You can build, preview, and download a complete resume on the Free plan with no credit card required.",
  },
  {
    q: "Will my resume pass ATS systems?",
    a: "Absolutely. Every template is built with clean, parseable structure and our AI optimizes keywords for the roles you target.",
  },
  {
    q: "Can I customize the templates?",
    a: "Yes — adjust fonts, accent colors, section order, and layout. Your data instantly re-renders across any template.",
  },
  {
    q: "How does the AI writing work?",
    a: "Our AI analyzes your role and experience to generate tailored summaries, achievement-driven bullet points, and skill suggestions.",
  },
  {
    q: "Is my data secure?",
    a: "Your resume data is stored locally in your browser by default, giving you full control and privacy over your information.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Of course. Upgrade, downgrade, or cancel your plan at any time — no questions asked, no hidden fees.",
  },
];

export const SECTION_LIST = [
  { id: "personal", label: "Personal Info", icon: "User" },
  { id: "summary", label: "Summary", icon: "FileText" },
  { id: "experience", label: "Experience", icon: "Briefcase" },
  { id: "education", label: "Education", icon: "GraduationCap" },
  { id: "skills", label: "Skills", icon: "Zap" },
  { id: "projects", label: "Projects", icon: "FolderGit2" },
  { id: "certifications", label: "Certifications", icon: "Award" },
  { id: "languages", label: "Languages", icon: "Languages" },
  { id: "references", label: "References", icon: "Users" },
  { id: "settings", label: "Settings", icon: "Settings" },
];

export const SAMPLE_RESUME = {
  template: "modern",
  accent: "#4F46E5",
  font: "Inter",
  personal: {
    fullName: "Alex Morgan",
    title: "Senior Software Engineer",
    email: "alex.morgan@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "alexmorgan.dev",
    linkedin: "linkedin.com/in/alexmorgan",
  },
  summary:
    "Senior Software Engineer with 7+ years building scalable web platforms used by millions. Specialized in React, Node.js, and cloud architecture. Passionate about clean code, mentorship, and shipping products that delight users.",
  experience: [
    {
      id: "e1",
      role: "Senior Software Engineer",
      company: "TechFlow Inc.",
      location: "San Francisco, CA",
      start: "2021",
      end: "Present",
      bullets:
        "Led migration to a micro-frontend architecture, cutting deploy times by 60%.\nMentored 5 engineers and established team-wide code review standards.\nShipped a real-time analytics dashboard adopted by 40K+ daily users.",
    },
    {
      id: "e2",
      role: "Software Engineer",
      company: "Cloudbase",
      location: "Remote",
      start: "2018",
      end: "2021",
      bullets:
        "Built RESTful APIs handling 2M+ requests per day with 99.9% uptime.\nReduced page load times by 45% through code-splitting and caching.",
    },
  ],
  education: [
    {
      id: "ed1",
      degree: "B.S. in Computer Science",
      school: "Stanford University",
      location: "Stanford, CA",
      start: "2014",
      end: "2018",
      detail: "GPA 3.8 · Dean's List · ACM Club President",
    },
  ],
  skills: [
    { id: "s1", name: "React" },
    { id: "s2", name: "TypeScript" },
    { id: "s3", name: "Node.js" },
    { id: "s4", name: "AWS" },
    { id: "s5", name: "GraphQL" },
    { id: "s6", name: "Docker" },
    { id: "s7", name: "PostgreSQL" },
    { id: "s8", name: "System Design" },
  ],
  projects: [
    {
      id: "p1",
      name: "DevBoard",
      link: "github.com/alex/devboard",
      desc: "Open-source Kanban tool for developers with 4K+ GitHub stars and real-time sync.",
    },
  ],
  certifications: [
    {
      id: "c1",
      name: "AWS Solutions Architect",
      issuer: "Amazon",
      year: "2023",
    },
  ],
  languages: [
    { id: "l1", name: "English", level: "Native" },
    { id: "l2", name: "Spanish", level: "Professional" },
  ],
  references: [
    {
      id: "r1",
      name: "Jordan Lee",
      relation: "Engineering Manager, TechFlow",
      contact: "jordan@email.com",
    },
  ],
};

export const FONT_OPTIONS = ["Inter", "Georgia", "Arial", "Times New Roman"];
export const ACCENT_OPTIONS = [
  "#4F46E5",
  "#7C3AED",
  "#0F766E",
  "#DB2777",
  "#1D4ED8",
  "#111439",
];
