import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "@/lib/api";
import { ReviewRequest } from "@/types";
import toast from "react-hot-toast";

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: reviewApi.getStats,
    refetchInterval: 30_000,
  });
}

export function useReview(id: string | null) {
  return useQuery({
    queryKey: ["review", id],
    queryFn: () => reviewApi.getReview(id!),
    enabled: !!id,
  });
}

export function useSubmitReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: ReviewRequest) => reviewApi.submit(req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Review failed");
    },
  });
}

export function useAcceptReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewApi.acceptReview(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Review accepted!");
    },
  });
}
