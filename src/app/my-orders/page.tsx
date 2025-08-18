import { headers } from "next/headers";
import { redirect } from "next/navigation";

import CategorySelectorDesktop from "@/components/common/category-selector-desktop";
import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { auth } from "@/lib/auth";

import Orders from "./components/orders";

const MyOrdersPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    redirect("/authentication");
  }

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
          <Orders />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyOrdersPage;
