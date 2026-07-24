import { GoogleGenerativeAI } from '@google/generative-ai';
import AppError from '../utils/AppError.js';

/**
 * GeminiService
 *
 * Single service class that wraps the Google Gemini API.
 * All AI features for ResumAI are implemented as methods here.
 *
 * Rules enforced:
 * - Every method returns structured JSON validated before returning.
 * - Exponential backoff retry on rate-limit (429) and transient (503) errors.
 * - responseMimeType: 'application/json' forces the model to return valid JSON.
 * - Never returns raw markdown or plain paragraphs.
 */
class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set.');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  }

  // ─── Internal helpers ──────────────────────────────────────────────────────

  /**
   * Returns a Gemini model instance configured to always respond in JSON.
   * This is the safest way to get structured data from Gemini.
   */
  #getModel() {
    return this.genAI.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
        topP: 0.9,
      },
    });
  }

  /**
   * Core generation method with retry logic.
   * Retries up to `maxRetries` times with exponential backoff on:
   *   - 429 (rate limit)
   *   - 503 (service unavailable)
   *
   * @param {string} prompt - The full prompt string
   * @param {number} maxRetries - Max retry attempts (default 3)
   * @returns {object} Parsed JSON object from Gemini
   */
  async #generate(prompt, maxRetries = 3) {
    const model = this.#getModel();

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        if (!text || text.trim() === '') {
          throw new AppError('Gemini returned an empty response.', 502);
        }

        // Parse and return the JSON
        const parsed = JSON.parse(text);
        return parsed;
      } catch (err) {
        const isRetryable =
          err.status === 429 || err.status === 503 || err.message?.includes('503');
        const isLastAttempt = attempt === maxRetries - 1;

        if (isRetryable && !isLastAttempt) {
          // Exponential backoff: 1s, 2s, 4s
          const waitMs = Math.pow(2, attempt) * 1000;
          console.warn(`Gemini retry ${attempt + 1}/${maxRetries} after ${waitMs}ms. Reason: ${err.message}`);
          await new Promise((r) => setTimeout(r, waitMs));
          continue;
        }

        // JSON parse error
        if (err instanceof SyntaxError) {
          throw new AppError('Gemini returned invalid JSON. Please try again.', 502);
        }

        // Already an AppError — rethrow
        if (err.isOperational) throw err;

        // Unknown error
        throw new AppError(`AI service error: ${err.message}`, 503);
      }
    }
  }

  // ─── Public Methods ────────────────────────────────────────────────────────

  /**
   * Generate a professional summary paragraph.
   * Tab: "summary" in AIAssistant → result type: "text"
   */
  async generateSummary({ title = '', experience = [], skills = [] }) {
    const expText = experience
      .map((e) => `${e.role} at ${e.company}`)
      .join(', ') || 'no prior experience listed';

    const skillsText = skills.map((s) => s.name).join(', ') || 'general skills';

    const prompt = `
You are an expert resume writer. Write a compelling professional summary for a resume.

Context:
- Job Title: ${title || 'Professional'}
- Experience: ${expText}
- Key Skills: ${skillsText}

Requirements:
- 2 to 3 sentences only
- Start with the job title or years of experience
- Mention 1-2 key skills or achievements
- End with a value proposition for the employer
- Professional, confident tone
- No clichés like "results-driven" or "passionate"
- Maximum 60 words

Respond with ONLY this JSON (no other text):
{
  "summary": "The complete 2-3 sentence professional summary here"
}`;

    const data = await this.#generate(prompt);

    if (typeof data?.summary !== 'string' || data.summary.trim() === '') {
      throw new AppError('Failed to generate a valid summary. Please try again.', 500);
    }

    return data.summary.trim();
  }

  /**
   * Enhance experience bullet points using strong action verbs and metrics.
   * Tab: "enhance" in AIAssistant → result type: "text" (newline-separated)
   */
  async enhanceBullets({ bullets = '', role = '', company = '' }) {
    const prompt = `
You are an expert resume writer specializing in impactful bullet points.

Context:
- Role: ${role || 'Professional'}
- Company: ${company || 'Company'}
- Current bullets:
${bullets || '(no bullets provided — generate 3 strong example bullets for this role)'}

Requirements:
- Rewrite or generate 3 to 5 bullet points
- Start EVERY bullet with a strong action verb (Led, Built, Increased, Reduced, Launched, Architected, etc.)
- Add quantified metrics wherever possible (%, $, numbers, time saved)
- Focus on impact and business outcome, not just tasks
- Each bullet: maximum 20 words
- Do NOT use the word "responsible"

Respond with ONLY this JSON (no other text):
{
  "bullets": [
    "Action verb + specific achievement + metric",
    "Action verb + specific achievement + metric",
    "Action verb + specific achievement + metric"
  ]
}`;

    const data = await this.#generate(prompt);

    if (!Array.isArray(data?.bullets) || data.bullets.length === 0) {
      throw new AppError('Failed to enhance bullets. Please try again.', 500);
    }

    // Return as newline-separated string — matches the existing frontend format
    return data.bullets.join('\n');
  }

  /**
   * Suggest additional relevant skills for a given job title.
   * Tab: "skills" in AIAssistant → result type: "chips"
   */
  async suggestSkills({ title = '', currentSkills = [] }) {
    const existing = currentSkills.map((s) => s.name).join(', ') || 'none';

    const prompt = `
You are a career expert. Suggest relevant skills for a job seeker.

Context:
- Job Title: ${title || 'Professional'}
- Skills they already have: ${existing}

Requirements:
- Suggest exactly 8 new skills NOT already in the existing list
- Mix: technical skills, tools, and relevant soft skills
- Be specific (e.g. "PostgreSQL" not "databases", "React.js" not "frontend")
- Order from most to least in-demand for this role

Respond with ONLY this JSON (no other text):
{
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8"]
}`;

    const data = await this.#generate(prompt);

    if (!Array.isArray(data?.skills) || data.skills.length === 0) {
      throw new AppError('Failed to suggest skills. Please try again.', 500);
    }

    return data.skills;
  }

  /**
   * Extract ATS-optimized keywords from resume content.
   * Tab: "keywords" in AIAssistant → result type: "chips"
   */
  async generateKeywords({ title = '', summary = '', experience = [] }) {
    const expText = experience
      .map((e) => `${e.role}: ${(e.bullets || '').slice(0, 200)}`)
      .join('\n')
      .slice(0, 800);

    const prompt = `
You are an ATS (Applicant Tracking System) expert. Extract the most important keywords from this resume.

Resume data:
- Target role: ${title || 'Professional'}
- Summary: ${summary || 'not provided'}
- Experience highlights:
${expText || 'not provided'}

Requirements:
- Extract 8 to 12 keywords
- Include: technical skills, tools, methodologies, industry terms
- Include both acronyms and full forms where relevant (e.g. "REST API")
- These keywords should help the resume pass ATS filters
- Do NOT repeat keywords already very obvious in the content

Respond with ONLY this JSON (no other text):
{
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8"]
}`;

    const data = await this.#generate(prompt);

    if (!Array.isArray(data?.keywords) || data.keywords.length === 0) {
      throw new AppError('Failed to generate keywords. Please try again.', 500);
    }

    return data.keywords;
  }

  /**
   * Generate a professional cover letter.
   * Tab: "cover" in AIAssistant → result type: "text"
   */
  async generateCoverLetter({ name = 'Applicant', title = 'the position', company = 'the company' }) {
    const prompt = `
You are an expert cover letter writer.

Details:
- Applicant Name: ${name}
- Applying for: ${title}
- Company: ${company}

Requirements:
- Write a professional cover letter with 3 paragraphs:
  1. Opening: why you are excited about this role and company
  2. Middle: your most relevant experience/achievement (be specific)
  3. Closing: call to action and thank you
- Confident but not arrogant tone
- Do NOT use: "I am writing to express...", "Please find attached", clichés
- Maximum 200 words total
- Include a proper salutation and sign-off

Respond with ONLY this JSON (no other text):
{
  "coverLetter": "Dear Hiring Manager,\\n\\nFull cover letter text here...\\n\\nBest regards,\\n${name}"
}`;

    const data = await this.#generate(prompt);

    if (typeof data?.coverLetter !== 'string' || data.coverLetter.trim() === '') {
      throw new AppError('Failed to generate cover letter. Please try again.', 500);
    }

    return data.coverLetter.trim();
  }

  /**
   * Compute an ATS compatibility score for the resume.
   * Tab: "score" in AIAssistant → result type: "score" → { score, tips }
   *
   * Returns the EXACT format the existing AIAssistant UI expects:
   * { score: number(0-100), tips: string[] (max 4) }
   */
  async atsScore({ resume }) {
    // Build a concise snapshot — avoids sending unnecessary data to Gemini
    const snapshot = {
      hasName:          !!resume.personal?.fullName,
      hasTitle:         !!resume.personal?.title,
      hasEmail:         !!resume.personal?.email,
      hasPhone:         !!resume.personal?.phone,
      hasLocation:      !!resume.personal?.location,
      hasLinkedIn:      !!resume.personal?.linkedin,
      hasWebsite:       !!resume.personal?.website,
      summaryLength:    resume.summary?.trim().length || 0,
      experienceCount:  resume.experience?.length || 0,
      hasMetrics:       resume.experience?.some((e) => /\d/.test(e.bullets || '')) ?? false,
      skillsCount:      resume.skills?.length || 0,
      educationCount:   resume.education?.length || 0,
      projectsCount:    resume.projects?.length || 0,
      certificationsCount: resume.certifications?.length || 0,
      languagesCount:   resume.languages?.length || 0,
      averageBulletCount: resume.experience?.length
        ? Math.round(
            resume.experience.reduce(
              (acc, e) => acc + (e.bullets?.split('\n').filter(Boolean).length || 0),
              0
            ) / resume.experience.length
          )
        : 0,
    };

    const prompt = `
You are an ATS (Applicant Tracking System) expert evaluating a resume.

Resume snapshot:
${JSON.stringify(snapshot, null, 2)}

Score this resume out of 100 using these weighted criteria:
- Professional summary (80+ chars): 12 points
- Work experience (2+ entries): 16 points  
- Quantified achievements (numbers/metrics in bullets): 12 points
- Skills (6+ listed): 12 points
- Education (1+ entry): 8 points
- Projects (1+ entry): 8 points
- Complete contact info (email + phone + location): 10 points
- LinkedIn profile: 6 points
- Website/portfolio: 4 points
- Certifications: 6 points
- Languages section: 3 points
- Multiple bullets per job (3+): 3 points

Also provide exactly 4 specific, actionable improvement tips (only for areas where points were lost).

Respond with ONLY this JSON (no other text):
{
  "score": <integer 0-100>,
  "tips": [
    "Specific actionable tip 1",
    "Specific actionable tip 2",
    "Specific actionable tip 3",
    "Specific actionable tip 4"
  ]
}`;

    const data = await this.#generate(prompt);

    if (typeof data?.score !== 'number' || !Array.isArray(data?.tips)) {
      throw new AppError('Failed to compute ATS score. Please try again.', 500);
    }

    return {
      score: Math.min(Math.max(Math.round(data.score), 0), 100),
      tips: data.tips.slice(0, 4).filter((t) => typeof t === 'string'),
    };
  }

  /**
   * Match a resume against a job description.
   * Available for future frontend wiring — not yet exposed via a route.
   */
  async jdMatch({ resume, jobDescription }) {
    const resumeText = [
      resume.personal?.title,
      resume.summary,
      resume.skills?.map((s) => s.name).join(', '),
      resume.experience?.map((e) => `${e.role} ${e.bullets}`).join(' '),
    ]
      .filter(Boolean)
      .join('\n');

    const prompt = `
You are a hiring manager comparing a resume to a job description.

Job Description:
${jobDescription.slice(0, 2000)}

Resume Content:
${resumeText.slice(0, 2000)}

Respond with ONLY this JSON (no other text):
{
  "matchPercentage": <integer 0-100>,
  "missingSkills": ["skill1", "skill2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "strengths": ["What the resume does well for this JD"],
  "suggestions": ["Specific things to add/change to match this JD better"]
}`;

    const data = await this.#generate(prompt);

    if (typeof data?.matchPercentage !== 'number') {
      throw new AppError('Failed to match resume to job description. Please try again.', 500);
    }

    return data;
  }

  /**
   * Rewrite and improve the entire resume content.
   * Available for future frontend wiring — not yet exposed via a route.
   */
  async rewriteResume({ resume }) {
    const prompt = `
You are an expert resume writer. Improve this resume's written content.

Current summary: ${resume.summary || 'none'}
Experience bullets (first job): ${resume.experience?.[0]?.bullets || 'none'}
Skills: ${resume.skills?.map((s) => s.name).join(', ') || 'none'}

Respond with ONLY this JSON (no other text):
{
  "summary": "Improved professional summary",
  "experienceBullets": ["Improved bullet 1", "Improved bullet 2", "Improved bullet 3"]
}`;

    const data = await this.#generate(prompt);

    if (typeof data?.summary !== 'string') {
      throw new AppError('Failed to rewrite resume. Please try again.', 500);
    }

    return data;
  }
}

// Export a single shared instance
export default new GeminiService();
