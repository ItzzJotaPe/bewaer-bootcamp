import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { auth } from "@/lib/auth";

import CartSummary from "../components/cart-summary";
import { formatAddress } from "../helpers/address";
import FinishOrderButton from "./components/finish-order-button";

const ConfirmationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    redirect("/");
  }
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });
  if (!cart || cart?.items.length === 0) {
    redirect("/");
  }
  const cartTotalInCents = cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0,
  );
  if (!cart.shippingAddress) {
    redirect("/cart/identification");
  }
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mb-8 flex-1 px-4 sm:mb-12 sm:px-5 lg:px-12 xl:px-16">
        <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-12 lg:space-y-0">
          {/* Coluna da Esquerda - Identificação */}
          <div className="space-y-4 lg:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg lg:text-xl">
                  Identificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <p className="text-xs sm:text-sm lg:text-base">
                      {formatAddress(cart.shippingAddress)}
                    </p>
                  </CardContent>
                </Card>
                <FinishOrderButton />
              </CardContent>
            </Card>
          </div>

          {/* Coluna da Direita - Resumo da Compra */}
          <div className="space-y-4 lg:space-y-6">
            <CartSummary
              subtotalInCents={cartTotalInCents}
              totalInCents={cartTotalInCents}
              products={cart.items.map((item) => ({
                id: item.productVariant.id,
                name: item.productVariant.product.name,
                variantName: item.productVariant.name,
                quantity: item.quantity,
                priceInCents: item.productVariant.priceInCents,
                imageUrl: item.productVariant.imageUrl,
              }))}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ConfirmationPage;
