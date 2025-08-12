import Link from "next/link";

import { categoryTable } from "@/db/schema";

import { Button } from "../ui/button";

interface CategorySelectorDesktopProps {
  categories: (typeof categoryTable.$inferSelect)[];
}

const CategorySelectorDesktop = ({
  categories,
}: CategorySelectorDesktopProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
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
  );
};

export default CategorySelectorDesktop;
