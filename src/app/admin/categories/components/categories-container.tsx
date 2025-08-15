"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useDeleteCategory } from "@/hooks/mutations/use-delete-category";

import { AddCategoryModal } from "./add-category-modal";
import { CategoryCard } from "./category-card";
import { EditCategoryModal } from "./edit-category-modal";

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  createdAt: string;
}

interface CategoriesContainerProps {
  initialCategories: Category[];
}

export function CategoriesContainer({
  initialCategories,
}: CategoriesContainerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<{
    id: string;
    name: string;
    slug: string;
  } | null>(null);

  const deleteCategoryMutation = useDeleteCategory();

  const handleAddCategory = () => {
    setIsAddModalOpen(true);
  };

  const handleEditCategory = (category: {
    id: string;
    name: string;
    slug: string;
  }) => {
    setCategoryToEdit(category);
    setIsEditModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategoryMutation.mutateAsync(categoryId);
      // Atualizar estado local após exclusão
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
      toast.success("Categoria excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir categoria");
    }
  };

  const handleSuccess = () => {
    // Recarregar a página para obter dados atualizados
    window.location.reload();
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={handleAddCategory}
          className="rounded-md bg-slate-700 px-4 py-2 text-white transition-colors hover:bg-slate-800"
        >
          + Adicionar Nova Categoria
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={() => handleEditCategory(category)}
            onDelete={() => handleDeleteCategory(category.id)}
          />
        ))}

        {categories.length === 0 && (
          <div className="col-span-full rounded-lg border bg-white p-8 text-center">
            <h3 className="mb-2 text-lg font-semibold">
              Nenhuma categoria cadastrada
            </h3>
            <p className="text-gray-600">
              Comece adicionando sua primeira categoria
            </p>
          </div>
        )}
      </div>

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {categoryToEdit && (
        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCategoryToEdit(null);
          }}
          onSuccess={handleSuccess}
          category={categoryToEdit}
        />
      )}
    </div>
  );
}
