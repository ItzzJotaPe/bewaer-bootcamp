"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="transition-shadow hover:shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold sm:text-xl">
              {category.name}
            </h2>
            <div className="mt-2 space-y-1 text-xs text-gray-500 sm:text-sm">
              <p>Slug: {category.slug}</p>
              <p>Produtos: {category.productCount}</p>
              <p>
                Criado em:{" "}
                {new Date(category.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="default"
              size="sm"
              className="w-full bg-slate-700 text-white hover:bg-slate-800 sm:w-auto"
              onClick={onEdit}
            >
              <Edit className="mr-1 h-3 w-3" />
              Editar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className={`w-full sm:w-auto ${
                category.productCount > 0
                  ? "cursor-not-allowed bg-gray-400"
                  : ""
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

        <div className="flex">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 sm:w-auto"
          >
            Ver Produtos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
