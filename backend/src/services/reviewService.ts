import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { v4 as uuidv4 } from "uuid";
import { ReviewRequest, ReviewResult, ReviewIssue, ReviewType } from "../types";

const SYSTEM_PROMPT = `You are an expert code reviewer with deep knowledge of security vulnerabilities, coding best practices, performance optimization, and software design patterns.

Analyze the provided code and return a JSON response with this exact structure:
{{
  "issues": [
    {{
      "type": "security|style|performance|bugs",
      "severity": "critical|high|medium|low|info",
      "line": <line number or null>,
      "title": "<short title>",
      "description": "<detailed description of the issue>",
      "suggestion": "<specific fix or improvement>",
      "codeSnippet": "<relevant code snippet or null>"
    }}
  ],
  "summary": "<overall summary of the code quality and main findings>",
  "score": <0-100 quality score>
}}

Focus on:
- SECURITY: SQL injection, XSS, auth issues, sensitive data exposure, insecure dependencies
- STYLE: naming conventions, code duplication, complexity, readability, documentation
- PERFORMANCE: inefficient algorithms, memory leaks, unnecessary re-renders, N+1 queries
- BUGS: logic errors, null pointer risks, off-by-one errors, race conditions

Return ONLY valid JSON. No markdown, no explanation outside JSON.`;

const HUMAN_PROMPT = `Review this {language} code{filename}:

{reviewTypes}

\`\`\`{language}
{code}
\`\`\`

{context}`;

export class ReviewService {
  private chain: RunnableSequence;
  private reviews: Map<string, ReviewResult> = new Map();

  constructor() {
    const model = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0.1,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", SYSTEM_PROMPT],
      ["human", HUMAN_PROMPT],
    ]);

    this.chain = RunnableSequence.from([
      prompt,
      model,
      new StringOutputParser(),
    ]);

    // Seed with demo data
    this.seedDemoData();
  }

  async reviewCode(request: ReviewRequest): Promise<ReviewResult> {
    const startTime = Date.now();

    const reviewTypeText =
      request.reviewTypes.includes("all")
        ? "Perform a comprehensive review covering security, style, performance, and bugs."
        : `Focus on: ${request.reviewTypes.join(", ")}.`;

    const filenameText = request.filename ? ` (${request.filename})` : "";
    const contextText = request.context
      ? `Additional context: ${request.context}`
      : "";

    const rawOutput = await this.chain.invoke({
      language: request.language,
      filename: filenameText,
      reviewTypes: reviewTypeText,
      code: request.code,
      context: contextText,
    });

    let parsed: { issues: Omit<ReviewIssue, "id">[]; summary: string; score: number };
    try {
      const cleaned = rawOutput.replace(/```json\n?|\n?```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        issues: [],
        summary: "Review completed but output parsing failed.",
        score: 50,
      };
    }

    const result: ReviewResult = {
      id: uuidv4(),
      filename: request.filename,
      language: request.language,
      createdAt: new Date().toISOString(),
      duration: Date.now() - startTime,
      issues: parsed.issues.map((issue) => ({ ...issue, id: uuidv4() })),
      summary: parsed.summary,
      score: Math.min(100, Math.max(0, parsed.score)),
      linesReviewed: request.code.split("\n").length,
    };

    this.reviews.set(result.id, result);
    return result;
  }

  acceptReview(id: string): boolean {
    const review = this.reviews.get(id);
    if (!review) return false;
    review.accepted = true;
    return true;
  }

  getReview(id: string): ReviewResult | undefined {
    return this.reviews.get(id);
  }

  getStats() {
    const allReviews = Array.from(this.reviews.values());
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyReviews = allReviews.filter(
      (r) => new Date(r.createdAt) >= oneWeekAgo
    );

    const accepted = allReviews.filter((r) => r.accepted === true).length;
    const reviewed = allReviews.filter((r) => r.accepted !== undefined).length;

    const issuesByType: Record<string, number> = {};
    const issuesBySeverity: Record<string, number> = {};

    allReviews.forEach((review) => {
      review.issues.forEach((issue) => {
        issuesByType[issue.type] = (issuesByType[issue.type] || 0) + 1;
        issuesBySeverity[issue.severity] =
          (issuesBySeverity[issue.severity] || 0) + 1;
      });
    });

    const avgScore =
      allReviews.length > 0
        ? Math.round(
            allReviews.reduce((sum, r) => sum + r.score, 0) / allReviews.length
          )
        : 0;

    return {
      totalReviews: allReviews.length,
      weeklyReviews: weeklyReviews.length,
      acceptanceRate:
        reviewed > 0 ? Math.round((accepted / reviewed) * 100) : 0,
      avgScore,
      issuesByType,
      issuesBySeverity,
      recentReviews: allReviews
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 10),
    };
  }

  private seedDemoData() {
    const demoReviews: ReviewResult[] = [
      {
        id: uuidv4(),
        filename: "auth.ts",
        language: "typescript",
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        duration: 3200,
        linesReviewed: 145,
        score: 72,
        accepted: true,
        summary:
          "Authentication module has critical SQL injection vulnerability and missing rate limiting. JWT implementation is solid but token expiry could be improved.",
        issues: [
          {
            id: uuidv4(),
            type: "security",
            severity: "critical",
            line: 23,
            title: "SQL Injection Vulnerability",
            description:
              "User input is directly interpolated into SQL query without sanitization.",
            suggestion:
              "Use parameterized queries or an ORM like Prisma to prevent SQL injection.",
            codeSnippet: 'db.query(`SELECT * FROM users WHERE email = ${email}`)',
          },
          {
            id: uuidv4(),
            type: "security",
            severity: "high",
            line: 45,
            title: "Missing Rate Limiting",
            description:
              "Login endpoint has no rate limiting, allowing brute force attacks.",
            suggestion:
              "Implement rate limiting with express-rate-limit or similar middleware.",
          },
          {
            id: uuidv4(),
            type: "style",
            severity: "low",
            line: 67,
            title: "Magic Number",
            description: "Token expiry time 86400 should be a named constant.",
            suggestion:
              "Extract to const TOKEN_EXPIRY_SECONDS = 86400 or use environment variable.",
          },
        ],
      },
      {
        id: uuidv4(),
        filename: "UserList.tsx",
        language: "typescript",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        duration: 2800,
        linesReviewed: 98,
        score: 85,
        accepted: true,
        summary:
          "React component is well-structured but has performance issues with unnecessary re-renders and missing memoization.",
        issues: [
          {
            id: uuidv4(),
            type: "performance",
            severity: "medium",
            line: 12,
            title: "Missing useMemo for Filtered List",
            description:
              "Expensive filter operation runs on every render without memoization.",
            suggestion:
              "Wrap filtered list in useMemo with proper dependency array.",
          },
          {
            id: uuidv4(),
            type: "style",
            severity: "info",
            title: "PropTypes could use Zod schema",
            description:
              "Manual prop validation could leverage existing Zod schemas for consistency.",
            suggestion:
              "Use z.infer<typeof UserSchema> for prop type definitions.",
          },
        ],
      },
      {
        id: uuidv4(),
        filename: "api.py",
        language: "python",
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        duration: 4100,
        linesReviewed: 220,
        score: 61,
        accepted: false,
        summary:
          "API endpoint exposes sensitive data and has multiple performance bottlenecks including N+1 query pattern.",
        issues: [
          {
            id: uuidv4(),
            type: "security",
            severity: "high",
            line: 34,
            title: "Sensitive Data Exposure",
            description: "Password hash returned in API response.",
            suggestion:
              "Exclude password field using serializer exclude list or explicit field selection.",
          },
          {
            id: uuidv4(),
            type: "performance",
            severity: "high",
            line: 58,
            title: "N+1 Query Pattern",
            description:
              "User list endpoint makes a separate DB query for each user's posts.",
            suggestion:
              "Use select_related or prefetch_related to load related data in a single query.",
          },
          {
            id: uuidv4(),
            type: "bugs",
            severity: "medium",
            line: 89,
            title: "Unhandled Exception",
            description: "Database connection errors not caught, causing 500s.",
            suggestion: "Add try/except around DB operations with proper error responses.",
          },
        ],
      },
      {
        id: uuidv4(),
        filename: "utils.js",
        language: "javascript",
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        duration: 1900,
        linesReviewed: 67,
        score: 90,
        accepted: true,
        summary:
          "Utility functions are clean and well-documented. Minor style improvements suggested.",
        issues: [
          {
            id: uuidv4(),
            type: "style",
            severity: "low",
            title: "Inconsistent Error Handling",
            description:
              "Some functions return null on error, others throw. Pick one pattern.",
            suggestion:
              "Standardize on either throwing errors or returning Result types.",
          },
        ],
      },
      {
        id: uuidv4(),
        filename: "database.go",
        language: "go",
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        duration: 3600,
        linesReviewed: 189,
        score: 78,
        accepted: true,
        summary:
          "Go database layer is solid with good connection pooling. Race condition risk in cache layer.",
        issues: [
          {
            id: uuidv4(),
            type: "bugs",
            severity: "high",
            line: 102,
            title: "Race Condition in Cache",
            description:
              "Cache read-modify-write not protected by mutex, causing data races.",
            suggestion: "Use sync.RWMutex to protect concurrent cache access.",
          },
          {
            id: uuidv4(),
            type: "performance",
            severity: "medium",
            title: "Unbounded Connection Pool",
            description: "MaxOpenConns not set, allowing unlimited DB connections.",
            suggestion: "Set db.SetMaxOpenConns(25) and db.SetMaxIdleConns(5).",
          },
        ],
      },
    ];

    demoReviews.forEach((r) => this.reviews.set(r.id, r));
  }
}

export const reviewService = new ReviewService();
