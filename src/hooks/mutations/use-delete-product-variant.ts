import { useMutation, useQueryClient } from "@tanstack/react-query";

export const deleteProductVariantMutationKey = () => ["delete-product-variant"];

export const useDeleteProductVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: deleteProductVariantMutationKey(),
    mutationFn: async (variantId: string) => {
      const response = await fetch(
        `/api/admin/products/delete-variant?variantId=${variantId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete product variant");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to delete product variant");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
};
