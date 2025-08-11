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
      <Card>
        <CardContent className="p-4 sm:p-6">
          {orders.map((order) => (
            <Accordion type="single" collapsible key={order.id}>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  <div className="flex w-full flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex items-center gap-2">
                      {order.status === "paid" && (
                        <Badge className="text-xs sm:text-sm">Pago</Badge>
                      )}
                      {order.status === "pending" && (
                        <Badge
                          variant="secondary"
                          className="text-xs sm:text-sm"
                        >
                          Pagamento pendente
                        </Badge>
                      )}
                      {order.status === "canceled" && (
                        <Badge
                          variant="destructive"
                          className="text-xs sm:text-sm"
                        >
                          Pedido cancelado
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm lg:text-base">
                      Pedido feito em{" "}
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
