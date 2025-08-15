"use client";

import { useState } from "react";
import { toast } from "sonner";

import { AdminOrder } from "@/actions/get-admin-orders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUpdateOrderStatus } from "@/hooks/mutations/use-update-order-status";

import { OrderDetailsModal } from "./order-details-modal";
import { UpdateStatusModal } from "./update-status-modal";

interface OrderCardProps {
  order: AdminOrder;
}

export function OrderCard({ order }: OrderCardProps) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const updateStatusMutation = useUpdateOrderStatus();

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

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        orderId: order.id,
        status: newStatus,
      });
      toast.success("Status do pedido atualizado com sucesso!");
      setIsStatusModalOpen(false);
    } catch (error) {
      toast.error("Erro ao atualizar status do pedido");
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 sm:p-6">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <h3 className="text-lg font-semibold sm:text-xl">
                    Pedido #{order.id.slice(0, 8)}
                  </h3>
                  <Badge
                    className={`w-fit border ${getStatusColor(order.status)}`}
                  >
                    {getStatusText(order.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p>
                      <strong>Cliente:</strong> {order.recipientName}
                    </p>
                    <p>
                      <strong>Email:</strong> {order.email}
                    </p>
                    <p>
                      <strong>Telefone:</strong> {order.phone}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p>
                      <strong>Endereço:</strong> {order.street}, {order.number}
                    </p>
                    <p>
                      <strong>Cidade:</strong> {order.city} - {order.state}
                    </p>
                    <p>
                      <strong>CEP:</strong> {order.zipCode}
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-sm text-gray-500">
                  <p>
                    Criado em:{" "}
                    {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                  <p className="font-medium text-gray-700">
                    Total: R$ {(order.totalPriceInCents / 100).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDetailsModalOpen(true)}
                  className="w-full sm:w-auto"
                >
                  Ver Detalhes
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsStatusModalOpen(true)}
                  className="w-full sm:w-auto"
                >
                  Atualizar Status
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="mb-3 font-semibold">
                Itens do Pedido ({order.items.length})
              </h4>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between gap-2 rounded-md border p-3 sm:flex-row sm:items-center"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        {item.productVariant.product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.productVariant.name} - {item.productVariant.color}
                      </p>
                    </div>
                    <div className="text-right sm:text-left">
                      <p className="font-medium">Qtd: {item.quantity}</p>
                      <p className="text-sm text-gray-600">
                        R$ {(item.priceInCents / 100).toFixed(2)} cada
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <OrderDetailsModal
        order={order}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

      <UpdateStatusModal
        order={order}
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onUpdate={handleStatusUpdate}
        isLoading={updateStatusMutation.isPending}
      />
    </>
  );
}
