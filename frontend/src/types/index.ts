export type ReviewType = "security" | "style" | "performance" | "bugs" | "all";
export type Severity = "critical" | "high" | "medium" | "low" | "info";

export interface ReviewRequest {
  code: string;
  language: string;
  filename?: string;
  context?: string;
  reviewTypes: ReviewType[];
}

export interface ReviewIssue {
  id: string;
  type: ReviewType;
  severity: Severity;
  line?: number;
  title: string;
  description: string;
  suggestion: string;
  codeSnippet?: string;
}

export interface ReviewResult {
  id: string;
  filename?: string;
  language: string;
  createdAt: string;
  duration: number;
  issues: ReviewIssue[];
  summary: string;
  score: number;
  accepted?: boolean;
  linesReviewed: number;
}

export interface ReviewStats {
  totalReviews: number;
  weeklyReviews: number;
  acceptanceRate: number;
  avgScore: number;
  issuesByType: Record<string, number>;
  issuesBySeverity: Record<string, number>;
  recentReviews: ReviewResult[];
}
