import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCategoryInput } from "@/actions/create-category/schema";

export const createCategoryMutationKey = () => ["create-category"] as const;

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: createCategoryMutationKey(),
    mutationFn: async (data: CreateCategoryInput) => {
      const response = await fetch("/api/admin/categories/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to create category");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });
};
