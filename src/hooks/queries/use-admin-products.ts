import { useQuery } from "@tanstack/react-query";

export const getAdminProductsQueryKey = () => ["admin-products"];

export const useAdminProducts = () => {
  return useQuery({
    queryKey: getAdminProductsQueryKey(),
    queryFn: async () => {
      const response = await fetch("/api/admin/products");
      if (!response.ok) throw new Error("Failed to fetch admin products");
      return response.json();
    },
  });
};
