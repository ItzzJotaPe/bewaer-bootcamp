import { useQuery } from "@tanstack/react-query";

export const getAdminCategoriesQueryKey = () => ["admin-categories"] as const;

export const useAdminCategories = () => {
  return useQuery({
    queryKey: getAdminCategoriesQueryKey(),
    queryFn: async () => {
      const response = await fetch("/api/admin/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });
};
