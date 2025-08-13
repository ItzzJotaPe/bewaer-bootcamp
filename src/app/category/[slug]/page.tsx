import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductItem from "@/components/common/product-item";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { categoryTable, productTable } from "@/db/schema";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;
  const category = await db.query.categoryTable.findFirst({
    where: eq(categoryTable.slug, slug),
  });
  if (!category) {
    return notFound();
  }
  const products = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, category.id),
    with: {
      variants: true,
    },
  });
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mb-8 flex-1 space-y-6 px-4 py-6 sm:mb-12 sm:space-y-8 sm:px-5 sm:py-8 lg:space-y-10 lg:px-12 lg:py-10 xl:px-16">
        {/* Header da Categoria */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center sm:space-y-6 lg:mr-15">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl xl:text-6xl">
            {category.name}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-sm sm:text-base lg:text-lg">
            Descubra nossa seleção exclusiva de produtos da categoria{" "}
            {category.name.toLowerCase()}
          </p>
        </div>

        {/* Separador */}
        <div className="px-4 sm:px-5 lg:px-12 xl:px-16">
          <Separator className="mx-auto max-w-4xl" />
        </div>

        {/* Grid de Produtos */}
        <div className="space-y-6">
          {products.length > 0 ? (
            <>
              <div className="text-center">
                <p className="text-muted-foreground text-sm sm:text-base lg:mr-15">
                  {products.length} produto{products.length !== 1 ? "s" : ""}{" "}
                  encontrado{products.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="max-w-8xl mx-auto">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-8 xl:grid-cols-5">
                  {products.map((product) => (
                    <ProductItem
                      key={product.id}
                      product={product}
                      textContainerClassName="max-w-full"
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center sm:py-16 lg:py-20">
              <p className="text-muted-foreground text-lg font-medium sm:text-xl lg:text-2xl">
                Nenhum produto encontrado nesta categoria
              </p>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                Tente navegar por outras categorias ou volte mais tarde
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
