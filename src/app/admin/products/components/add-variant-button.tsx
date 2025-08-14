"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AddVariantButtonProps {
  onClick: () => void;
}

export function AddVariantButton({ onClick }: AddVariantButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="sm"
      className="w-full border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
    >
      <PlusIcon className="mr-2 h-4 w-4" />
      Adicionar Variante
    </Button>
  );
}
