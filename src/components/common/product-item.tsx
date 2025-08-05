import Image from "next/image";
import Link from "next/link";

import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";

interface ProductItemProps {
  product: typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  };
}

const ProductItem = ({ product }: ProductItemProps) => {
  const firstVariant = product.variants[0];
  
  // Verificar se existe uma variante e se ela tem uma URL de imagem válida
  if (!firstVariant || !firstVariant.imageUrl) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-[200px] w-[200px] rounded-3xl bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Imagem não disponível</span>
        </div>
        <div className="flex max-w-[200px] flex-col gap-1">
          <p className="truncate text-sm font-medium">{product.name}</p>
          <p className="text-muted-foreground truncate text-xs font-medium">
            {product.description}
          </p>
          <p className="truncate text-sm font-semibold">
            {firstVariant ? formatCentsToBRL(firstVariant.priceInCents) : "Preço não disponível"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link href="/" className="flex flex-col gap-4">
      <Image
        src={firstVariant.imageUrl}
        alt={firstVariant.name}
        width={200}
        height={200}
        className="rounded-3xl"
      />
      <div className="flex max-w-[200px] flex-col gap-1">
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="text-muted-foreground truncate text-xs font-medium">
          {product.description}
        </p>
        <p className="truncate text-sm font-semibold">
          {formatCentsToBRL(firstVariant.priceInCents)}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
