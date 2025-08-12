"use client";

import CartSummary from "@/app/cart/components/cart-summary";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { orderTable } from "@/db/schema";

interface OrdersProps {
  orders: Array<{
    id: string;
    totalPriceInCents: number;
    status: (typeof orderTable.$inferSelect)["status"];
    createdAt: Date;
    items: Array<{
      id: string;
      imageUrl: string;
      productName: string;
      productVariantName: string;
      priceInCents: number;
      quantity: number;
    }>;
  }>;
}

const Orders = ({ orders }: OrdersProps) => {
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
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger className="px-3 py-4 text-left hover:no-underline sm:px-6 sm:py-6">
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:grid lg:grid-cols-4 lg:gap-4">
                      {/* Número do Pedido */}
                      <div className="flex items-center gap-2 sm:col-span-1">
                        <span className="text-muted-foreground text-xs sm:text-sm sm:font-medium">
                          Pedido:
                        </span>
                        <span className="text-sm font-semibold sm:text-sm">
                          #{order.id.slice(-3)}
                        </span>
                      </div>

                      {/* Status */}
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
                          <Badge
                            variant="secondary"
                            className="w-fit text-xs sm:text-sm"
                          >
                            Pagamento pendente
                          </Badge>
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

                      {/* Data */}
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

                      {/* Pagamento */}
                      <div className="flex items-center gap-2 sm:col-span-1">
                        <span className="text-muted-foreground text-xs sm:text-sm sm:font-medium">
                          Pagamento:
                        </span>
                        <span className="text-sm sm:text-sm">Cartão</span>
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
                          quantity: item.quantity,
                          priceInCents: item.priceInCents,
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
