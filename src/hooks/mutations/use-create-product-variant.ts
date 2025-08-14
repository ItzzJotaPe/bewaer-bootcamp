import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateProductVariantInput } from "@/actions/create-product-variant/schema";

export const createProductVariantMutationKey = () => ["create-product-variant"];

export const useCreateProductVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: createProductVariantMutationKey(),
    mutationFn: async (data: CreateProductVariantInput) => {
      const response = await fetch("/api/admin/products/create-variant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create product variant");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
};
