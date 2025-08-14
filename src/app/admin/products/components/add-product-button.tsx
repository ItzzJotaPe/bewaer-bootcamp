"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AddProductButtonProps {
  onClick: () => void;
}

export function AddProductButton({ onClick }: AddProductButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="bg-slate-700 text-white hover:bg-slate-800"
    >
      <PlusIcon className="mr-2 h-4 w-4" />
      Adicionar Produto
    </Button>
  );
}
