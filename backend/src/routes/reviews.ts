import { Router, Request, Response } from "express";
import { z } from "zod";
import { reviewService } from "../services/reviewService";

const router = Router();

const ReviewRequestSchema = z.object({
  code: z.string().min(1, "Code is required").max(50000, "Code too large"),
  language: z.string().min(1, "Language is required"),
  filename: z.string().optional(),
  context: z.string().optional(),
  reviewTypes: z
    .array(z.enum(["security", "style", "performance", "bugs", "all"]))
    .default(["all"]),
});

// POST /api/reviews — submit code for review
router.post("/", async (req: Request, res: Response) => {
  const parsed = ReviewRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const result = await reviewService.reviewCode(parsed.data);
    return res.status(201).json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Review failed:", message);
    return res.status(500).json({ error: "Review failed", detail: message });
  }
});

// GET /api/reviews/stats — dashboard statistics
router.get("/stats", (_req: Request, res: Response) => {
  const stats = reviewService.getStats();
  return res.json(stats);
});

// GET /api/reviews/:id — get a specific review
router.get("/:id", (req: Request, res: Response) => {
  const review = reviewService.getReview(req.params.id);
  if (!review) return res.status(404).json({ error: "Review not found" });
  return res.json(review);
});

// PATCH /api/reviews/:id/accept — mark review as accepted
router.patch("/:id/accept", (req: Request, res: Response) => {
  const success = reviewService.acceptReview(req.params.id);
  if (!success) return res.status(404).json({ error: "Review not found" });
  return res.json({ success: true });
});

export default router;
