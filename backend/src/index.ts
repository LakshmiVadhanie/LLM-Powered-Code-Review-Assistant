import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import reviewRoutes from "./routes/reviews";
import { errorHandler, notFound } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));

// Routes
app.get("/health", (_req, res) => res.json({ status: "ok", version: "1.0.0" }));
app.use("/api/reviews", reviewRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🚀 Code Review API running on http://localhost:${PORT}`);
  console.log(`   OpenAI Key: ${process.env.OPENAI_API_KEY ? "✓ set" : "✗ missing"}\n`);
});

export default app;
