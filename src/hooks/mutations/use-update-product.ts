import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProductInput } from "@/actions/update-product/schema";

export const updateProductMutationKey = () => ["update-product"] as const;

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: updateProductMutationKey(),
    mutationFn: async (data: UpdateProductInput) => {
      const response = await fetch("/api/admin/products/update", {
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
        throw new Error(result.error || "Failed to update product");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
};
