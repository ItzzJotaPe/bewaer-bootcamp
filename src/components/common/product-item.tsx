import Image from "next/image";
import Link from "next/link";

import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";
import { cn } from "@/lib/utils";

interface ProductItemProps {
  product: typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  };
  textContainerClassName?: string;
}

const ProductItem = ({ product, textContainerClassName }: ProductItemProps) => {
  const firstVariant = product.variants[0];
  return (
    <Link
      href={`/products-variant/${firstVariant.slug}`}
      className="flex min-w-[140px] flex-col gap-3 sm:min-w-[160px] sm:gap-4 lg:min-w-[180px]"
    >
      <Image
        src={firstVariant.imageUrl}
        alt={firstVariant.name}
        sizes="(max-width: 640px) 140px, (max-width: 1024px) 160px, 180px"
        height={0}
        width={0}
        className="h-auto w-full rounded-2xl sm:rounded-3xl"
      />
      <div
        className={cn(
          "flex max-w-[140px] flex-col gap-1 sm:max-w-[160px] lg:max-w-[180px]",
          textContainerClassName,
        )}
      >
        <p className="truncate text-xs font-medium sm:text-sm">
          {product.name}
        </p>
        <p className="text-muted-foreground truncate text-xs font-medium">
          {product.description}
        </p>
        <p className="truncate text-xs font-semibold sm:text-sm">
          {formatCentsToBRL(firstVariant.priceInCents)}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
