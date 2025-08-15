import { useMutation, useQueryClient } from "@tanstack/react-query";

export const deleteCategoryMutationKey = () => ["delete-category"] as const;

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: deleteCategoryMutationKey(),
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/categories/delete?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to delete category");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });
};
