"use client";

import { productTable, productVariantTable } from "@/db/schema";

import ProductItem from "./product-item";

interface ProductListProps {
  title: string;
  products: (typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  })[];
}

const ProductList = ({ title, products }: ProductListProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="px-4 text-base font-semibold sm:px-5 sm:text-lg lg:px-12 lg:text-xl xl:px-16">
        {title}
      </h3>
      <div className="flex w-full gap-3 overflow-x-auto px-4 sm:gap-4 sm:px-5 lg:gap-6 lg:px-12 xl:px-16 [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
