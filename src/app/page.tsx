import { desc } from "drizzle-orm";
import Image from "next/image";

import BrandList from "@/components/common/brand-list";
import BrandListWithArrows from "@/components/common/brand-list-with-arrows";
import CategorySelector from "@/components/common/category-selector";
import CategorySelectorDesktop from "@/components/common/category-selector-desktop";
import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import ProductListWithArrows from "@/components/common/product-list-with-arrows";
import { db } from "@/db";
import { productTable } from "@/db/schema";

const Home = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });
  const newlyCreatedProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: {
      variants: true,
    },
  });
  const categories = await db.query.categoryTable.findMany({});

  const partnerBrands = [
    { name: "Nike", logo: "/nike.svg" },
    { name: "Adidas", logo: "/adidas.svg" },
    { name: "Puma", logo: "/puma.svg" },
    { name: "New Balance", logo: "/newbalance.svg" },
    { name: "Ralph Lauren", logo: "/ralphlauren.svg" },
    { name: "Zara", logo: "/zara.svg" },
    { name: "Jordan", logo: "/jordan.svg" },
    { name: "Vans", logo: "/vans.svg" },
    { name: "North Face", logo: "/thenorthface.svg" },
    { name: "Hugo Boss", logo: "/hugoboss.svg" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mb-8 flex-1 space-y-4 sm:mb-12 sm:space-y-6 lg:space-y-8">
        <div className="hidden px-4 sm:px-5 lg:block lg:px-12 xl:px-16">
          <CategorySelectorDesktop categories={categories} />
        </div>

        <div className="px-4 sm:px-5 lg:px-12 xl:px-16">
          <picture>
            <source
              media="(min-width: 1024px)"
              srcSet="/banner-01-desktop.png"
            />
            <Image
              src="/banner-01.png"
              alt="Leve uma vida com estilo"
              height={0}
              width={0}
              sizes="100vw"
              className="lg:max-w-8xl h-auto w-full rounded-lg sm:rounded-xl lg:mx-auto"
            />
          </picture>
        </div>

        <div className="lg:hidden">
          <BrandList brands={partnerBrands} title="Marcas parceiras" />
        </div>
        <div className="hidden lg:block">
          <BrandListWithArrows
            brands={partnerBrands}
            title="Marcas parceiras"
          />
        </div>

        <div className="lg:hidden">
          <ProductList products={products} title="Mais vendidos" />
        </div>
        <div className="hidden lg:block">
          <ProductListWithArrows products={products} title="Mais vendidos" />
        </div>

        <div className="px-4 sm:px-5 lg:hidden lg:px-12 xl:px-16">
          <CategorySelector categories={categories} />
        </div>

        <div className="px-4 sm:px-5 lg:hidden lg:px-12 xl:px-16">
          <Image
            src="/banner-02.png"
            alt="Leve uma vida com estilo"
            height={0}
            width={0}
            sizes="100vw"
            className="h-auto w-full rounded-lg sm:rounded-xl"
          />
        </div>

        <div className="lg:hidden">
          <ProductList products={newlyCreatedProducts} title="Novos produtos" />
        </div>
        <div className="hidden lg:block">
          <ProductListWithArrows
            products={newlyCreatedProducts}
            title="Novos produtos"
          />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Home;
