import Link from "next/link";

import { categoryTable } from "@/db/schema";

import { Button } from "../ui/button";

interface CategorySelectorProps {
  categories: (typeof categoryTable.$inferSelect)[];
}

const CategorySelector = ({ categories }: CategorySelectorProps) => {
  return (
    <div className="rounded-2xl bg-[#F4EFFF] p-4 sm:rounded-3xl sm:p-6 lg:p-8">
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            className="rounded-full bg-white text-xs font-semibold sm:text-sm lg:text-base"
          >
            <Link href={`/category/${category.slug}`}>{category.name}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
