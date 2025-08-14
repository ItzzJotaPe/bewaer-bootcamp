import { useMutation, useQueryClient } from "@tanstack/react-query";

export const deleteProductMutationKey = () => ["delete-product"];

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: deleteProductMutationKey(),
    mutationFn: async (productId: string) => {
      const response = await fetch(
        `/api/admin/products/delete?productId=${productId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to delete product");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
};
