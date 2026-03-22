import axios from "axios";
import { ReviewRequest, ReviewResult, ReviewStats } from "@/types";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export const reviewApi = {
  submit: async (request: ReviewRequest): Promise<ReviewResult> => {
    const { data } = await api.post<ReviewResult>("/reviews", request);
    return data;
  },

  getStats: async (): Promise<ReviewStats> => {
    const { data } = await api.get<ReviewStats>("/reviews/stats");
    return data;
  },

  getReview: async (id: string): Promise<ReviewResult> => {
    const { data } = await api.get<ReviewResult>(`/reviews/${id}`);
    return data;
  },

  acceptReview: async (id: string): Promise<void> => {
    await api.patch(`/reviews/${id}/accept`);
  },
};
