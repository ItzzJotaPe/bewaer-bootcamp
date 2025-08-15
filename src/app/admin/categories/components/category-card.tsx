"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    productCount: number;
    createdAt: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{category.name}</h2>
          <div className="mt-2 space-y-1 text-sm text-gray-500">
            <p>Slug: {category.slug}</p>
            <p>Produtos: {category.productCount}</p>
            <p>
              Criado em:{" "}
              {new Date(category.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="bg-slate-700 text-white hover:bg-slate-800"
            onClick={onEdit}
          >
            <Edit className="mr-1 h-3 w-3" />
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className={`${
              category.productCount > 0 ? "cursor-not-allowed bg-gray-400" : ""
            }`}
            disabled={category.productCount > 0}
            onClick={onDelete}
            title={
              category.productCount > 0
                ? "Não é possível excluir categoria com produtos"
                : "Excluir categoria"
            }
          >
            <Trash2 className="mr-1 h-3 w-3" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
        >
          Ver Produtos
        </Button>
      </div>
    </div>
  );
}
