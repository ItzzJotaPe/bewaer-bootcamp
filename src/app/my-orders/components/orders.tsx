"use client";

import { Loader2, RefreshCw } from "lucide-react";

import CartSummary from "@/app/cart/components/cart-summary";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useVerifyOrderPayment } from "@/hooks/mutations/use-verify-order-payment";
import { useOrders } from "@/hooks/queries/use-orders";

const Orders = () => {
  const { data: orders, isLoading, error } = useOrders();
  const verifyOrderPaymentMutation = useVerifyOrderPayment();

  const handleVerifyPayment = async (orderId: string) => {
    try {
      await verifyOrderPaymentMutation.mutateAsync(orderId);
    } catch (error) {
      console.error("Failed to verify payment:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">Erro ao carregar pedidos</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Nenhum pedido encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <h1 className="text-xl font-semibold sm:text-2xl lg:text-3xl">
        Meus Pedidos
      </h1>
      <div className="space-y-4 sm:space-y-4">
        {orders.map((order) => (
          <Card
            key={order.id}
            className="mx-auto max-w-2xl overflow-hidden lg:mx-0 lg:max-w-none"
          >
            <CardContent className="p-0">
              <Accordion type="single" collapsible>
                <AccordionItem value={order.id} className="border-0">
                  <AccordionTrigger className="px-3 py-4 hover:no-underline sm:px-6 sm:py-6">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:grid lg:grid-cols-4 lg:gap-4">
                        <div className="flex items-center gap-2 sm:col-span-1">
                          <span className="text-muted-foreground text-xs sm:text-sm sm:font-medium">
                            Pedido:
                          </span>
                          <span className="text-sm font-semibold sm:text-sm">
                            #{order.id.slice(-3)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 sm:col-span-1">
                          <span className="text-muted-foreground text-xs sm:text-sm sm:font-medium">
                            Status:
                          </span>
                          {order.status === "paid" && (
                            <Badge className="w-fit text-xs sm:text-sm">
                              Pago
                            </Badge>
                          )}
                          {order.status === "pending" && (
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className="w-fit text-xs sm:text-sm"
                              >
                                Pagamento pendente
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVerifyPayment(order.id);
                                }}
                                disabled={verifyOrderPaymentMutation.isPending}
                                className="h-6 w-6 p-0"
                              >
                                <RefreshCw
                                  className={`h-3 w-3 ${verifyOrderPaymentMutation.isPending ? "animate-spin" : ""}`}
                                />
                              </Button>
                            </div>
                          )}
                          {order.status === "canceled" && (
                            <Badge
                              variant="destructive"
                              className="w-fit text-xs sm:text-sm"
                            >
                              Pedido cancelado
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 sm:col-span-1">
                          <span className="text-muted-foreground text-xs sm:text-sm sm:font-medium">
                            Data:
                          </span>
                          <span className="text-sm sm:text-sm">
                            {new Date(order.createdAt).toLocaleDateString(
                              "pt-BR",
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 sm:col-span-1">
                          <span className="text-muted-foreground text-xs sm:text-sm sm:font-medium">
                            Pagamento:
                          </span>
                          <span className="text-sm sm:text-sm">Cartão</span>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-4 sm:px-6 sm:pb-6">
                    <div className="border-t pt-4">
                      <CartSummary
                        subtotalInCents={order.totalPriceInCents}
                        totalInCents={order.totalPriceInCents}
                        products={order.items.map((item) => ({
                          id: item.id,
                          name: item.productName,
                          variantName: item.productVariantName,
                          priceInCents: item.priceInCents,
                          quantity: item.quantity,
                          imageUrl: item.imageUrl,
                        }))}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
