import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import CategorySelector from "@/components/common/category-selector";
import CategorySelectorDesktop from "@/components/common/category-selector-desktop";
import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { categoryTable, shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import CartSummary from "../components/cart-summary";
import Addresses from "./components/addresses";

const IdentificationPage = async () => {
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
  const shippingAddresses = await db.query.shippingAddressTable.findMany({
    where: eq(shippingAddressTable.userId, session.user.id),
  });
  const cartTotalInCents = cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0,
  );
  const categories = await db.query.categoryTable.findMany({});

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mb-8 flex-1 space-y-4 sm:mb-12 sm:space-y-6 lg:space-y-8">
        <div className="hidden px-4 sm:px-5 lg:block lg:px-12 xl:px-16">
          <CategorySelectorDesktop categories={categories} />
        </div>

        <div className="px-4 sm:px-5 lg:px-12 xl:px-16">
          <Separator />
        </div>

        <div className="px-4 sm:px-5 lg:px-12 xl:px-16">
          <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-12 lg:space-y-0">
            {/* Coluna da Esquerda - Identificação */}
            <div className="space-y-4 lg:space-y-6">
              <Addresses
                shippingAddresses={shippingAddresses}
                defaultShippingAddressId={cart.shippingAddress?.id || null}
              />
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
        </div>

        <div className="px-4 sm:px-5 lg:hidden lg:px-12 xl:px-16">
          <CategorySelector categories={categories} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default IdentificationPage;
