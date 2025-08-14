"use client";

import { AddProductButton } from "./add-product-button";
import { ProductCard } from "./product-card";

interface ProductVariant {
  id: string;
  name: string;
  color: string;
  priceInCents: number;
  imageUrl: string;
}

interface Product {
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
}

interface ProductsContainerProps {
  products: Product[];
}

export function ProductsContainer({ products }: ProductsContainerProps) {
  const handleEditProduct = (productId: string) => {
    console.log("Editar produto:", productId);
  };

  const handleDeleteProduct = (productId: string) => {
    console.log("Excluir produto:", productId);
  };

  const handleEditVariant = (variantId: string) => {
    console.log("Editar variante:", variantId);
  };

  const handleDeleteVariant = (variantId: string) => {
    console.log("Excluir variante:", variantId);
  };

  const handleAddVariant = (productId: string) => {
    console.log("Adicionar variante ao produto:", productId);
  };

  const handleAddProduct = () => {
    console.log("Adicionar novo produto");
  };

  if (products.length === 0) {
    return (
      <div className="col-span-full rounded-lg border bg-white p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">
          Nenhum produto cadastrado
        </h3>
        <p className="text-gray-600">Comece adicionando seu primeiro produto</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <AddProductButton onClick={handleAddProduct} />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            slug={product.slug}
            createdAt={product.createdAt}
            category={product.category || undefined}
            variants={product.variants}
            onEditProduct={() => handleEditProduct(product.id)}
            onDeleteProduct={() => handleDeleteProduct(product.id)}
            onEditVariant={handleEditVariant}
            onDeleteVariant={handleDeleteVariant}
            onAddVariant={() => handleAddVariant(product.id)}
          />
        ))}
      </div>
    </>
  );
}
