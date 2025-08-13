import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import CategorySelector from "@/components/common/category-selector";
import CategorySelectorDesktop from "@/components/common/category-selector-desktop";
import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { categoryTable, orderTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import Orders from "./components/orders";

const MyOrdersPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    redirect("/authentication");
  }
  const orders = await db.query.orderTable.findMany({
    where: eq(orderTable.userId, session.user.id),
    with: {
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
          <Orders
            orders={orders.map((order) => ({
              id: order.id,
              totalPriceInCents: order.totalPriceInCents,
              status: order.status,
              createdAt: order.createdAt,
              items: order.items.map((item) => ({
                id: item.id,
                imageUrl: item.productVariant.imageUrl,
                productName: item.productVariant.product.name,
                productVariantName: item.productVariant.name,
                priceInCents: item.productVariant.priceInCents,
                quantity: item.quantity,
              })),
            }))}
          />
        </div>

        <div className="px-4 sm:px-5 lg:hidden lg:px-12 xl:px-16">
          <CategorySelector categories={categories} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyOrdersPage;
