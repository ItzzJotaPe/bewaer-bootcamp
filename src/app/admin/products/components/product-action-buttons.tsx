"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface ProductActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function ProductActionButtons({
  onEdit,
  onDelete,
}: ProductActionButtonsProps) {
  return (
    <div className="mb-4 flex gap-2">
      <Button
        variant="default"
        size="sm"
        className="flex-1 bg-green-600 hover:bg-green-700"
        onClick={onEdit}
      >
        <Edit className="mr-2 h-4 w-4" />
        Editar Produto
      </Button>
      <Button
        variant="destructive"
        size="sm"
        className="flex-1"
        onClick={onDelete}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Excluir
      </Button>
    </div>
  );
}
