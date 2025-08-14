"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddVariantButtonProps {
  onClick: () => void;
}

export function AddVariantButton({ onClick }: AddVariantButtonProps) {
  return (
    <Button
      variant="default"
      size="sm"
      className="w-full bg-blue-600 hover:bg-blue-700"
      onClick={onClick}
    >
      <Plus className="mr-2 h-4 w-4" />
      Adicionar Variante
    </Button>
  );
}
