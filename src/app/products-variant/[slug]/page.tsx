import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

import CategorySelectorDesktop from "@/components/common/category-selector-desktop";
import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { Separator } from "@/components/ui/separator";
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
  const categories = await db.query.categoryTable.findMany({});
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mb-8 flex flex-1 flex-col space-y-4 sm:mb-12 sm:space-y-6 lg:space-y-8">
        <div className="hidden lg:block">
          <div className="mb-6 px-4 sm:px-5 lg:px-12 xl:px-16">
            <CategorySelectorDesktop categories={categories} />
          </div>
          <div className="mb-4 px-4 sm:px-5 lg:px-12 xl:px-16">
            <Separator />
          </div>
        </div>
        <div className="px-4 sm:px-5 lg:px-12 xl:px-16">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12">
            {/* Coluna da Esquerda - Imagem */}
            <div className="mb-6 lg:mb-0">
              <Image
                src={productVariant.imageUrl}
                alt={productVariant.name}
                sizes="100vw"
                height={0}
                width={0}
                className="h-auto w-full max-w-2xl rounded-lg object-cover sm:rounded-xl lg:mx-auto lg:rounded-2xl"
              />
            </div>

            {/* Coluna da Direita - Informações do Produto */}
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-semibold sm:text-lg lg:text-3xl lg:font-bold">
                  {productVariant.product.name}
                </h2>
                <h3 className="text-muted-foreground text-xs sm:text-sm lg:text-lg lg:font-medium">
                  {productVariant.name}
                </h3>
                <h3 className="text-base font-semibold sm:text-lg lg:text-2xl lg:font-bold">
                  {formatCentsToBRL(productVariant.priceInCents)}
                </h3>
              </div>

              <div>
                <VariantSelector
                  selectedVariantSlug={productVariant.slug}
                  variants={productVariant.product.variants}
                />
              </div>

              <div>
                <ProductActions productVariantId={productVariant.id} />
              </div>

              <div>
                <p className="text-sm text-shadow-amber-600 sm:text-base lg:text-lg">
                  {productVariant.product.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <ProductList
          title="Talvez você goste"
          products={likelyProducts}
          variant="large"
        />

        <Footer />
      </main>
    </div>
  );
};

export default ProductVariantPage;
