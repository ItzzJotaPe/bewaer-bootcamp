"use client";

import { useState } from "react";

import { AdminOrder } from "@/actions/get-admin-orders";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface UpdateStatusModalProps {
  order: AdminOrder;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (status: string) => void;
  isLoading: boolean;
}

export function UpdateStatusModal({
  order,
  isOpen,
  onClose,
  onUpdate,
  isLoading,
}: UpdateStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(order.status);

  const handleUpdate = () => {
    onUpdate(selectedStatus);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "paid":
        return "Pago";
      case "canceled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "pending":
        return "Pedido aguardando pagamento";
      case "paid":
        return "Pedido pago e confirmado";
      case "canceled":
        return "Pedido cancelado";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Atualizar Status do Pedido</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Pedido #{order.id.slice(0, 8)}
            </Label>
            <p className="text-sm text-gray-600">
              Cliente: {order.recipientName}
            </p>
            <p className="text-sm text-gray-600">
              Total: R$ {(order.totalPriceInCents / 100).toFixed(2)}
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Novo Status</Label>
            <RadioGroup
              value={selectedStatus}
              onValueChange={setSelectedStatus}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pending" id="pending" />
                <Label htmlFor="pending" className="flex-1 cursor-pointer">
                  <div>
                    <div className="font-medium">Pendente</div>
                    <div className="text-sm text-gray-600">
                      Pedido aguardando pagamento
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paid" id="paid" />
                <Label htmlFor="paid" className="flex-1 cursor-pointer">
                  <div>
                    <div className="font-medium">Pago</div>
                    <div className="text-sm text-gray-600">
                      Pedido pago e confirmado
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="canceled" id="canceled" />
                <Label htmlFor="canceled" className="flex-1 cursor-pointer">
                  <div>
                    <div className="font-medium">Cancelado</div>
                    <div className="text-sm text-gray-600">
                      Pedido cancelado
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isLoading || selectedStatus === order.status}
            >
              {isLoading ? "Atualizando..." : "Atualizar Status"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
