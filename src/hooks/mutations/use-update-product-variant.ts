import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProductVariantInput } from "@/actions/update-product-variant/schema";

export const updateProductVariantMutationKey = () =>
  ["update-product-variant"] as const;

export const useUpdateProductVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: updateProductVariantMutationKey(),
    mutationFn: async (data: UpdateProductVariantInput) => {
      const response = await fetch("/api/admin/products/update-variant", {
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
        throw new Error(result.error || "Failed to update product variant");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
};
