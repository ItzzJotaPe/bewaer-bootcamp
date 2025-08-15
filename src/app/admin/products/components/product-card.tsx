"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AddVariantButton } from "./add-variant-button";
import { ProductActionButtons } from "./product-action-buttons";
import { VariantCard } from "./variant-card";

interface ProductVariant {
  id: string;
  name: string;
  color: string;
  priceInCents: number;
  imageUrl: string;
}

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  slug: string;
  createdAt: Date;
  imageUrl?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  variants: ProductVariant[];
  onEditProduct: () => void;
  onDeleteProduct: () => void;
  onEditVariant: (variantId: string) => void;
  onDeleteVariant: (variantId: string) => void;
  onAddVariant: () => void;
}

export function ProductCard({
  id,
  name,
  description,
  slug,
  createdAt,
  imageUrl,
  category,
  variants,
  onEditProduct,
  onDeleteProduct,
  onEditVariant,
  onDeleteVariant,
  onAddVariant,
}: ProductCardProps) {
  const getMainImage = () => {
    if (imageUrl) return imageUrl;
    if (variants.length > 0) return variants[0].imageUrl;
    return null;
  };

  const mainImage = getMainImage();

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 sm:h-56 md:h-64">
        {mainImage ? (
          <img
            src={mainImage}
            alt={name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <span className="text-sm">Sem imagem</span>
          </div>
        )}

        {category && (
          <Badge className="absolute top-2 left-2 bg-slate-700 text-white sm:top-3 sm:left-3">
            {category.name}
          </Badge>
        )}

        <Badge
          variant="secondary"
          className="absolute top-2 right-2 border-slate-200 bg-slate-100 text-slate-700 sm:top-3 sm:right-3"
        >
          {variants.length} variante{variants.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <CardContent className="p-3 sm:p-4">
        <div className="mb-3">
          <h2 className="mb-2 text-base font-semibold text-gray-900 sm:text-lg">
            {name}
          </h2>
          <p className="line-clamp-2 text-xs text-gray-600 sm:text-sm">
            {description}
          </p>
        </div>

        <div className="mb-4 space-y-1 text-xs text-gray-500">
          <p>Slug: {slug}</p>
          <p>Criado em: {new Date(createdAt).toLocaleDateString("pt-BR")}</p>
        </div>

        <ProductActionButtons
          onEdit={onEditProduct}
          onDelete={onDeleteProduct}
        />

        <Separator className="my-3 sm:my-4" />

        <div className="mb-4">
          <h3 className="mb-3 text-xs font-semibold text-gray-700 sm:text-sm">
            Variantes ({variants.length})
          </h3>

          {variants.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {variants.map((variant) => (
                <VariantCard
                  key={variant.id}
                  id={variant.id}
                  name={variant.name}
                  color={variant.color}
                  priceInCents={variant.priceInCents}
                  imageUrl={variant.imageUrl}
                  onEdit={() => onEditVariant(variant.id)}
                  onDelete={() => onDeleteVariant(variant.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic sm:text-sm">
              Nenhuma variante cadastrada
            </p>
          )}
        </div>

        <AddVariantButton onClick={onAddVariant} />
      </CardContent>
    </Card>
  );
}
