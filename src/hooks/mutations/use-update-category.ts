import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateCategoryInput } from "@/actions/update-category/schema";

export const updateCategoryMutationKey = () => ["update-category"] as const;

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: updateCategoryMutationKey(),
    mutationFn: async (data: UpdateCategoryInput) => {
      const response = await fetch("/api/admin/categories/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to update category");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });
};
