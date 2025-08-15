"use client";

import { Loader2 } from "lucide-react";

import { OrderCard } from "./order-card";
import { useAdminOrders } from "@/hooks/queries/use-admin-orders";

export function OrdersContainer() {
  const { data: orders, isLoading, error } = useAdminOrders();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold text-red-600">
          Erro ao carregar pedidos
        </h3>
        <p className="text-gray-600">
          Ocorreu um erro ao carregar os pedidos. Tente novamente.
        </p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Nenhum pedido encontrado</h3>
        <p className="text-gray-600">Ainda não há pedidos no sistema</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
