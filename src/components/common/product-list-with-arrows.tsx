"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRef } from "react";

import { productTable, productVariantTable } from "@/db/schema";

import { Button } from "../ui/button";
import ProductItem from "./product-item";

interface ProductListWithArrowsProps {
  title: string;
  products: (typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  })[];
}

const ProductListWithArrows = ({
  title,
  products,
}: ProductListWithArrowsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="px-4 text-base font-semibold sm:px-5 sm:text-lg lg:px-12 lg:text-xl xl:px-16">
        {title}
      </h3>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex w-full gap-3 overflow-x-auto px-4 sm:gap-4 sm:px-5 lg:gap-6 lg:px-12 xl:px-16 [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>

        <div className="hidden lg:block">
          <Button
            onClick={scrollLeft}
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-2 h-10 w-10 -translate-y-1/2 rounded-full bg-white shadow-lg hover:bg-gray-50"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>

          <Button
            onClick={scrollRight}
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-2 h-10 w-10 -translate-y-1/2 rounded-full bg-white shadow-lg hover:bg-gray-50"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductListWithArrows;
