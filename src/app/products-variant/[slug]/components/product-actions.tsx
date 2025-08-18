"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { addProductToCart } from "@/actions/add-cart-product";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/queries/use-cart";
import { authClient } from "@/lib/auth-client";

import AddToCartButton from "./add-to-cart-button";

interface ProductActionsProps {
  productVariantId: string;
}

const ProductActions = ({ productVariantId }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const router = useRouter();
  const { refetch } = useCart();
  const { data: session } = authClient.useSession();

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleBuyNow = async () => {
    try {
      setIsBuyingNow(true);
      if (!session?.user?.id) {
        router.push("/authentication");
        return;
      }
      const result = await addProductToCart({
        productVariantId,
        quantity,
      });
      if ("error" in result) {
        toast.error(
          result.error === "Unauthorized"
            ? "Faça login para adicionar ao carrinho"
            : "Erro ao adicionar produto ao carrinho",
        );
        return;
      }
      await refetch();
      toast.success("Produto adicionado ao carrinho!");
      router.push("/cart/identification");
    } catch (error) {
      toast.error("Erro ao adicionar produto ao carrinho");
      console.error(error);
    } finally {
      setIsBuyingNow(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="px-4 sm:px-5 lg:px-6">
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-sm font-medium sm:text-base lg:text-lg">
            Quantidade
          </h3>
          <div className="flex w-[90px] items-center justify-between rounded-lg border sm:w-[100px]">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDecrement}
              className="h-8 w-8 sm:h-9 sm:w-9"
            >
              <MinusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <p className="text-sm sm:text-base">{quantity}</p>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleIncrement}
              className="h-8 w-8 sm:h-9 sm:w-9"
            >
              <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-3 px-4 sm:space-y-4 sm:px-5 lg:flex-row lg:space-y-0 lg:space-x-4 lg:px-6">
        <AddToCartButton
          productVariantId={productVariantId}
          quantity={quantity}
        />
        <Button
          className="rounded-full text-sm sm:text-base"
          size="lg"
          onClick={handleBuyNow}
          disabled={isBuyingNow}
        >
          {isBuyingNow ? "Processando..." : "Comprar agora"}
        </Button>
      </div>
    </div>
  );
};

export default ProductActions;
