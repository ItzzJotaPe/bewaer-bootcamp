import { useQuery } from "@tanstack/react-query";

export const getCategoriesQueryKey = () => ["categories"];

export const useCategories = () => {
  return useQuery({
    queryKey: getCategoriesQueryKey(),
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });
};
