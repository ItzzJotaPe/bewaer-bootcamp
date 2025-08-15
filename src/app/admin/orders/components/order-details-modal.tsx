"use client";

import { AdminOrder } from "@/actions/get-admin-orders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OrderDetailsModalProps {
  order: AdminOrder;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "canceled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Detalhes do Pedido #{order.id.slice(0, 8)}</span>
            <Badge className={`border ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="rounded-lg border p-4">
            <h3 className="mb-3 text-lg font-semibold">
              Informações do Cliente
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p>
                  <strong>Nome:</strong> {order.recipientName}
                </p>
                <p>
                  <strong>Email:</strong> {order.email}
                </p>
                <p>
                  <strong>Telefone:</strong> {order.phone}
                </p>
                <p>
                  <strong>CPF/CNPJ:</strong> {order.cpfOrCnpj}
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  <strong>Endereço:</strong>
                </p>
                <p>
                  {order.street}, {order.number}
                </p>
                <p>
                  {order.city} - {order.state}
                </p>
                <p>CEP: {order.zipCode}</p>
                <p>{order.country}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-3 text-lg font-semibold">
              Informações do Pedido
            </h3>
            <div className="space-y-2">
              <p>
                <strong>ID do Pedido:</strong> {order.id}
              </p>
              <p>
                <strong>Data de Criação:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString("pt-BR")} às{" "}
                {new Date(order.createdAt).toLocaleTimeString("pt-BR")}
              </p>
              <p>
                <strong>Status:</strong> {getStatusText(order.status)}
              </p>
              <p className="text-lg font-semibold text-green-700">
                <strong>Total:</strong> R${" "}
                {(order.totalPriceInCents / 100).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-3 text-lg font-semibold">
              Itens do Pedido ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex-1">
                    <p className="text-lg font-medium">
                      {item.productVariant.product.name}
                    </p>
                    <p className="text-gray-600">
                      Variante: {item.productVariant.name}
                    </p>
                    <p className="text-gray-600">
                      Cor: {item.productVariant.color}
                    </p>
                  </div>
                  <div className="text-right sm:text-left">
                    <p className="text-lg font-semibold">
                      Qtd: {item.quantity}
                    </p>
                    <p className="text-gray-600">
                      R$ {(item.priceInCents / 100).toFixed(2)} cada
                    </p>
                    <p className="text-lg font-semibold text-green-700">
                      R${" "}
                      {((item.priceInCents * item.quantity) / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose} variant="outline">
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
