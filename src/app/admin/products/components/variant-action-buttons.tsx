"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface VariantActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function VariantActionButtons({
  onEdit,
  onDelete,
}: VariantActionButtonsProps) {
  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="sm"
        className="h-7 border-slate-300 px-2 text-xs text-slate-700 hover:border-slate-400 hover:bg-slate-50"
        onClick={onEdit}
      >
        <Edit className="mr-1 h-3 w-3" />
        Editar
      </Button>
      <Button
        variant="destructive"
        size="sm"
        className="h-7 px-2 text-xs"
        onClick={onDelete}
      >
        <Trash2 className="mr-1 h-3 w-3" />
        Excluir
      </Button>
    </div>
  );
}
