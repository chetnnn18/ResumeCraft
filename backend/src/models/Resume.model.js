import mongoose from 'mongoose';

// ─── Sub-schemas (mirror the frontend Data.js SAMPLE_RESUME structure) ────────

const ExperienceSchema = new mongoose.Schema(
  {
    id:       { type: String, required: true },
    role:     { type: String, default: '' },
    company:  { type: String, default: '' },
    location: { type: String, default: '' },
    start:    { type: String, default: '' },
    end:      { type: String, default: '' },
    bullets:  { type: String, default: '' },
  },
  { _id: false }
);

const EducationSchema = new mongoose.Schema(
  {
    id:       { type: String, required: true },
    degree:   { type: String, default: '' },
    school:   { type: String, default: '' },
    location: { type: String, default: '' },
    start:    { type: String, default: '' },
    end:      { type: String, default: '' },
    detail:   { type: String, default: '' },
  },
  { _id: false }
);

const SkillSchema = new mongoose.Schema(
  { id: { type: String, required: true }, name: { type: String, default: '' } },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    id:   { type: String, required: true },
    name: { type: String, default: '' },
    link: { type: String, default: '' },
    desc: { type: String, default: '' },
  },
  { _id: false }
);

const CertificationSchema = new mongoose.Schema(
  {
    id:     { type: String, required: true },
    name:   { type: String, default: '' },
    issuer: { type: String, default: '' },
    year:   { type: String, default: '' },
  },
  { _id: false }
);

const LanguageSchema = new mongoose.Schema(
  {
    id:    { type: String, required: true },
    name:  { type: String, default: '' },
    level: { type: String, default: '' },
  },
  { _id: false }
);

const ReferenceSchema = new mongoose.Schema(
  {
    id:       { type: String, required: true },
    name:     { type: String, default: '' },
    relation: { type: String, default: '' },
    contact:  { type: String, default: '' },
  },
  { _id: false }
);

const PersonalSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: '' },
    title:    { type: String, default: '' },
    email:    { type: String, default: '' },
    phone:    { type: String, default: '' },
    location: { type: String, default: '' },
    website:  { type: String, default: '' },
    linkedin: { type: String, default: '' },
  },
  { _id: false }
);

// ─── Main Resume Schema ────────────────────────────────────────────────────────

const ResumeSchema = new mongoose.Schema(
  {
    /**
     * ownerId: identifies which user owns this resume.
     *
     * Currently stores a UUID string for anonymous users (generated in the browser).
     * Future-proof: when auth is added, this field can store a MongoDB User ObjectId
     * (as a string) without any schema migration.
     *
     * Indexed for fast per-user queries.
     */
    ownerId: {
      type: String,
      required: [true, 'ownerId is required'],
      index: true,
    },

    // Human-readable label for the resume (used in future dashboard)
    title: { type: String, default: 'My Resume', maxlength: 100 },

    // Design settings — mirror frontend state exactly
    template: { type: String, default: 'modern' },
    accent:   { type: String, default: '#4F46E5' },
    font:     { type: String, default: 'Inter' },

    // Resume content
    personal:       { type: PersonalSchema,        default: () => ({}) },
    summary:        { type: String, default: '' },
    experience:     { type: [ExperienceSchema],    default: [] },
    education:      { type: [EducationSchema],     default: [] },
    skills:         { type: [SkillSchema],          default: [] },
    projects:       { type: [ProjectSchema],        default: [] },
    certifications: { type: [CertificationSchema], default: [] },
    languages:      { type: [LanguageSchema],       default: [] },
    references:     { type: [ReferenceSchema],      default: [] },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
    versionKey: false,
  }
);

// Compound index: quickly fetch all resumes for a user, newest first
ResumeSchema.index({ ownerId: 1, updatedAt: -1 });

const Resume = mongoose.model('Resume', ResumeSchema);
export default Resume;
