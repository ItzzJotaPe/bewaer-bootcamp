"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { categoryTable } from "@/db/schema";

import { Button } from "../ui/button";

interface CategorySelectorDesktopProps {
  categories: (typeof categoryTable.$inferSelect)[];
}

const CategorySelectorDesktop = ({
  categories,
}: CategorySelectorDesktopProps) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
      {categories.map((category) => {
        const isActive = pathname === `/category/${category.slug}`;

        return (
          <Button
            key={category.id}
            variant={isActive ? "default" : "ghost"}
            className={`rounded-full text-xs font-semibold sm:text-sm lg:text-base ${
              isActive
                ? "bg-slate-700 text-white hover:bg-slate-800"
                : "bg-white hover:bg-slate-50"
            }`}
          >
            <Link href={`/category/${category.slug}`}>{category.name}</Link>
          </Button>
        );
      })}
    </div>
  );
};

export default CategorySelectorDesktop;
