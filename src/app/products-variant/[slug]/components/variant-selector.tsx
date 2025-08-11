import Image from "next/image";
import Link from "next/link";

import { productVariantTable } from "@/db/schema";

interface VariantSelectorProps {
  selectedVariantSlug: string;
  variants: (typeof productVariantTable.$inferInsert)[];
}

const VariantSelector = ({
  selectedVariantSlug,
  variants,
}: VariantSelectorProps) => {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {variants.map((variant) => (
        <Link href={`/products-variant/${variant.slug}`} key={variant.id}>
          <Image
            src={variant.imageUrl}
            alt={variant.name}
            width={68}
            height={68}
            className={`h-12 w-12 rounded-lg sm:h-16 sm:w-16 sm:rounded-xl ${
              selectedVariantSlug === variant.slug
                ? "border-primary border-2"
                : ""
            }`}
          />
        </Link>
      ))}
    </div>
  );
};

export default VariantSelector;
