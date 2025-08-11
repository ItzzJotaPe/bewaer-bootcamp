import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";

import ProductActions from "./components/product-actions";
import VariantSelector from "./components/variant-selector";

interface ProductVariantPageProps {
  params: Promise<{ slug: string }>;
}

const ProductVariantPage = async ({ params }: ProductVariantPageProps) => {
  const { slug } = await params;
  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      product: {
        with: {
          variants: true,
        },
      },
    },
  });
  if (!productVariant) {
    return notFound();
  }
  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, productVariant.product.categoryId),
    with: {
      variants: true,
    },
  });
  return (
    <>
      <Header />
      <div className="flex flex-col space-y-4 sm:space-y-6 lg:space-y-8">
        <div className="px-4 sm:px-5 lg:px-6">
          <Image
            src={productVariant.imageUrl}
            alt={productVariant.name}
            sizes="100vw"
            height={0}
            width={0}
            className="h-auto w-full rounded-lg object-cover sm:rounded-xl lg:rounded-2xl"
          />
        </div>

        <div className="px-4 sm:px-5 lg:px-6">
          <VariantSelector
            selectedVariantSlug={productVariant.slug}
            variants={productVariant.product.variants}
          />
        </div>

        <div className="px-4 sm:px-5 lg:px-6">
          {/* DESCRIÇÃO */}
          <h2 className="text-base font-semibold sm:text-lg lg:text-xl">
            {productVariant.product.name}
          </h2>
          <h3 className="text-muted-foreground text-xs sm:text-sm lg:text-base">
            {productVariant.name}
          </h3>
          <h3 className="text-base font-semibold sm:text-lg lg:text-xl">
            {formatCentsToBRL(productVariant.priceInCents)}
          </h3>
        </div>

        <ProductActions productVariantId={productVariant.id} />

        <div className="px-4 sm:px-5 lg:px-6">
          <p className="text-sm text-shadow-amber-600 sm:text-base lg:text-lg">
            {productVariant.product.description}
          </p>
        </div>

        <ProductList title="Talvez você goste" products={likelyProducts} />

        <Footer />
      </div>
    </>
  );
};

export default ProductVariantPage;
