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
  category,
  variants,
  onEditProduct,
  onDeleteProduct,
  onEditVariant,
  onDeleteVariant,
  onAddVariant,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      {/* Imagem principal do produto */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-100">
        {variants.length > 0 ? (
          <img
            src={variants[0].imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <span className="text-sm">Sem imagem</span>
          </div>
        )}

        {/* Badge de categoria */}
        {category && (
          <Badge className="absolute top-3 left-3 bg-blue-600">
            {category.name}
          </Badge>
        )}

        {/* Badge de quantidade de variantes */}
        <Badge variant="secondary" className="absolute top-3 right-3">
          {variants.length} variante{variants.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <CardContent className="p-4">
        {/* Informações do produto */}
        <div className="mb-3">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">{name}</h2>
          <p className="line-clamp-2 text-sm text-gray-600">{description}</p>
        </div>

        <div className="mb-4 space-y-1 text-xs text-gray-500">
          <p>Slug: {slug}</p>
          <p>Criado em: {new Date(createdAt).toLocaleDateString("pt-BR")}</p>
        </div>

        {/* Botões de ação do produto */}
        <ProductActionButtons
          onEdit={onEditProduct}
          onDelete={onDeleteProduct}
        />

        <Separator className="my-4" />

        {/* Variantes do produto */}
        <div className="mb-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">
            Variantes ({variants.length})
          </h3>

          {variants.length > 0 ? (
            <div className="space-y-3">
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
            <p className="text-sm text-gray-500 italic">
              Nenhuma variante cadastrada
            </p>
          )}
        </div>

        {/* Botão para adicionar variante */}
        <AddVariantButton onClick={onAddVariant} />
      </CardContent>
    </Card>
  );
}
