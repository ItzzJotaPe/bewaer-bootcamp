"use client";

import { VariantActionButtons } from "./variant-action-buttons";

interface VariantCardProps {
  id: string;
  name: string;
  color: string;
  priceInCents: number;
  imageUrl: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function VariantCard({
  id,
  name,
  color,
  priceInCents,
  imageUrl,
  onEdit,
  onDelete,
}: VariantCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-md border p-3">
      <div className="h-16 w-16 overflow-hidden rounded-md">
        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{name}</p>
        <p className="text-sm text-gray-600">{color}</p>
        <p className="text-sm font-semibold text-blue-600">
          R$ {(priceInCents / 100).toFixed(2)}
        </p>
      </div>
      <VariantActionButtons onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
