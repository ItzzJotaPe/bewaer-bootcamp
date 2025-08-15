"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useDeleteProduct } from "@/hooks/mutations/use-delete-product";
import { useDeleteProductVariant } from "@/hooks/mutations/use-delete-product-variant";

import { AddProductButton } from "./add-product-button";
import { AddProductModal } from "./add-product-modal";
import { AddVariantModal } from "./add-variant-modal";
import { EditProductModal } from "./edit-product-modal";
import { EditVariantModal } from "./edit-variant-modal";
import { ProductCard } from "./product-card";

interface ProductVariant {
  id: string;
  name: string;
  slug: string;
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
  imageUrl?: string;
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
  const [localProducts, setLocalProducts] = useState(products);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isAddVariantModalOpen, setIsAddVariantModalOpen] = useState(false);
  const [selectedProductForVariant, setSelectedProductForVariant] =
    useState<Product | null>(null);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isEditVariantModalOpen, setIsEditVariantModalOpen] = useState(false);
  const [variantToEdit, setVariantToEdit] = useState<
    (ProductVariant & { productId: string }) | null
  >(null);

  const deleteProductMutation = useDeleteProduct();
  const deleteVariantMutation = useDeleteProductVariant();

  const handleEditProduct = (productId: string) => {
    const product = localProducts.find((p) => p.id === productId) || null;
    setProductToEdit(product);
    setIsEditProductModalOpen(!!product);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (
      !confirm(
        "Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.",
      )
    ) {
      return;
    }

    try {
      await deleteProductMutation.mutateAsync(productId);
      setLocalProducts((prev) => prev.filter((p) => p.id !== productId));
      toast.success("Produto excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir produto");
      console.error("Erro ao excluir produto:", error);
    }
  };

  const handleEditVariant = (variantId: string) => {
    const parent = localProducts.find((p) =>
      p.variants.some((v) => v.id === variantId),
    );
    const variant = parent?.variants.find((v) => v.id === variantId) || null;
    if (parent && variant) {
      setVariantToEdit({ ...variant, productId: parent.id });
      setIsEditVariantModalOpen(true);
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (
      !confirm(
        "Tem certeza que deseja excluir esta variante? Esta ação não pode ser desfeita.",
      )
    ) {
      return;
    }

    try {
      await deleteVariantMutation.mutateAsync(variantId);
      setLocalProducts((prev) =>
        prev.map((product) => ({
          ...product,
          variants: product.variants.filter((v) => v.id !== variantId),
        })),
      );
      toast.success("Variante excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir variante");
      console.error("Erro ao excluir variante:", error);
    }
  };

  const handleAddVariant = (productId: string) => {
    const product = localProducts.find((p) => p.id === productId);
    if (product) {
      setSelectedProductForVariant(product);
      setIsAddVariantModalOpen(true);
    }
  };

  const handleAddProduct = () => {
    setIsAddProductModalOpen(true);
  };

  const handleProductCreated = () => {
    window.location.reload();
  };

  const handleVariantCreated = () => {
    window.location.reload();
  };

  if (localProducts.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 text-center sm:p-8">
        <h3 className="mb-2 text-lg font-semibold">
          Nenhum produto cadastrado
        </h3>
        <p className="text-gray-600">Comece adicionando seu primeiro produto</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 sm:mb-6">
        <AddProductButton onClick={handleAddProduct} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {localProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            slug={product.slug}
            createdAt={product.createdAt}
            imageUrl={product.imageUrl}
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

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onSuccess={handleProductCreated}
      />

      {productToEdit && (
        <EditProductModal
          isOpen={isEditProductModalOpen}
          onClose={() => {
            setIsEditProductModalOpen(false);
            setProductToEdit(null);
          }}
          onSuccess={() => window.location.reload()}
          product={productToEdit}
        />
      )}

      {variantToEdit && (
        <EditVariantModal
          isOpen={isEditVariantModalOpen}
          onClose={() => {
            setIsEditVariantModalOpen(false);
            setVariantToEdit(null);
          }}
          onSuccess={() => window.location.reload()}
          variant={variantToEdit}
        />
      )}

      {selectedProductForVariant && (
        <AddVariantModal
          isOpen={isAddVariantModalOpen}
          onClose={() => {
            setIsAddVariantModalOpen(false);
            setSelectedProductForVariant(null);
          }}
          productId={selectedProductForVariant.id}
          productName={selectedProductForVariant.name}
          onSuccess={handleVariantCreated}
        />
      )}
    </>
  );
}
