import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useFeedbacks() {
  const { toast } = useToast();

  return useQuery({
    queryKey: [api.feedbacks.list.path],
    queryFn: async () => {
      try {
        const res = await fetch(api.feedbacks.list.path, { credentials: "include" });
        if (!res.ok) {
          throw new Error("피드백 목록을 불러오는데 실패했습니다.");
        }
        const data = await res.json();
        const parsed = api.feedbacks.list.responses[200].parse(data);
        
        return parsed.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      } catch (err) {
        console.error("[Zod] validations failed:", err);
        throw err;
      }
    },
  });
}

export function useCreateFeedback() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data) => {
      const validated = api.feedbacks.create.input.parse(data);
      const res = await fetch(api.feedbacks.create.path, {
        method: api.feedbacks.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const errorData = await res.json();
          throw new Error(errorData.message || "입력값을 확인해주세요.");
        }
        throw new Error("피드백 등록에 실패했습니다.");
      }

      return api.feedbacks.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.feedbacks.list.path] });
      toast({
        title: "의견이 등록되었습니다!",
        description: "소중한 의견 감사드립니다. 앱 개선에 큰 도움이 됩니다.",
        variant: "default",
        className: "bg-primary text-primary-foreground border-none",
      });
    },
    onError: (error) => {
      toast({
        title: "등록 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
