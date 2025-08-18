import { useQuery } from "@tanstack/react-query";

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export const getCategoriesQueryKey = () => ["categories"] as const;

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: getCategoriesQueryKey(),
    queryFn: async (): Promise<Category[]> => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data: Category[] = await response.json();
      return data;
    },
  });
};
