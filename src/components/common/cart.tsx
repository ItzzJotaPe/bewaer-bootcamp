"use client";

import { ShoppingBasketIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { formatCentsToBRL } from "@/helpers/money";
import { useCart } from "@/hooks/queries/use-cart";
import { authClient } from "@/lib/auth-client";

import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import CartItem from "./cart-item";

export const Cart = () => {
  const { data: session } = authClient.useSession();
  const { data: cart } = useCart({ enabled: !!session?.user?.id });
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11"
        >
          <ShoppingBasketIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full max-w-[320px] sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-lg sm:text-xl">Carrinho</SheetTitle>
        </SheetHeader>

        <div className="flex h-full flex-col px-4 pb-4 sm:px-5 sm:pb-5">
          {cart?.items && cart.items.length > 0 ? (
            <>
              <div className="flex h-full max-h-full flex-col overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="flex h-full flex-col gap-6 sm:gap-8">
                    {cart.items.map((item) => (
                      <CartItem
                        key={item.id}
                        id={item.id}
                        productVariantId={item.productVariant.id}
                        productName={item.productVariant.product.name}
                        productVariantName={item.productVariant.name}
                        productVariantImageUrl={item.productVariant.imageUrl}
                        productVariantPriceInCents={
                          item.productVariant.priceInCents
                        }
                        quantity={item.quantity}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <ShoppingBasketIcon className="text-muted-foreground mx-auto mb-4 h-10 w-10 sm:h-12 sm:w-12" />
                <p className="text-muted-foreground text-base font-medium sm:text-lg">
                  O carrinho está vazio
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Adicione produtos para continuar comprando
                </p>
              </div>
            </div>
          )}

          {cart?.items && cart?.items.length > 0 && (
            <div className="flex flex-col gap-3 sm:gap-4">
              <Separator />

              <div className="flex items-center justify-between text-xs font-medium sm:text-sm">
                <p>Subtotal</p>
                <p>{formatCentsToBRL(cart?.totalPriceInCents ?? 0)}</p>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-xs font-medium sm:text-sm">
                <p>Entrega</p>
                <p>GRÁTIS</p>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-xs font-medium sm:text-sm">
                <p>Total</p>
                <p>{formatCentsToBRL(cart?.totalPriceInCents ?? 0)}</p>
              </div>

              <Button
                className="mt-4 rounded-full text-xs sm:mt-5 sm:text-sm"
                asChild
              >
                <Link href="/cart/identification">Finalizar compra</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

// SERVER ACTION
