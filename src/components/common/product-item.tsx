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
  variant?: "default" | "large";
}

const ProductItem = ({
  product,
  textContainerClassName,
  variant = "default",
}: ProductItemProps) => {
  const firstVariant = product.variants[0];
  const isLarge = variant === "large";

  return (
    <Link
      href={`/products-variant/${firstVariant.slug}`}
      className={cn(
        "flex min-w-[140px] flex-col gap-3 sm:min-w-[160px] sm:gap-4 lg:min-w-[160px]",
        isLarge && "lg:min-w-0 lg:flex-1",
      )}
    >
      <Image
        src={firstVariant.imageUrl}
        alt={firstVariant.name}
        sizes={
          isLarge
            ? "(max-width: 640px) 140px, (max-width: 1024px) 160px, 100vw"
            : "(max-width: 640px) 140px, (max-width: 1024px) 160px, 160px"
        }
        height={0}
        width={0}
        className={cn(
          "h-auto w-full rounded-2xl sm:rounded-3xl",
          isLarge && "lg:aspect-square lg:object-cover",
        )}
      />
      <div
        className={cn(
          "flex max-w-[140px] flex-col gap-1 sm:max-w-[160px] lg:max-w-[160px]",
          isLarge && "lg:max-w-none lg:gap-2",
          textContainerClassName,
        )}
      >
        <p
          className={cn(
            "truncate text-xs font-medium sm:text-sm",
            isLarge && "lg:text-base lg:font-semibold",
          )}
        >
          {product.name}
        </p>
        <p
          className={cn(
            "text-muted-foreground truncate text-xs font-medium",
            isLarge && "lg:line-clamp-2 lg:text-sm",
          )}
        >
          {product.description}
        </p>
        <p
          className={cn(
            "truncate text-xs font-semibold sm:text-sm",
            isLarge && "lg:text-base lg:font-bold",
          )}
        >
          {formatCentsToBRL(firstVariant.priceInCents)}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
