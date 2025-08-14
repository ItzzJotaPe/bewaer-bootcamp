"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddProductButtonProps {
  onClick: () => void;
}

export function AddProductButton({ onClick }: AddProductButtonProps) {
  return (
    <Button
      variant="default"
      size="default"
      className="bg-blue-600 hover:bg-blue-700"
      onClick={onClick}
    >
      <Plus className="mr-2 h-4 w-4" />
      Adicionar Novo Produto
    </Button>
  );
}
