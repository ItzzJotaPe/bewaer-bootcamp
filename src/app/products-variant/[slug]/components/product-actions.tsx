"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { addProductToCart } from "@/actions/add-cart-product";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/queries/use-cart";

import AddToCartButton from "./add-to-cart-button";

interface ProductActionsProps {
  productVariantId: string;
}

const ProductActions = ({ productVariantId }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const router = useRouter();
  const { refetch } = useCart();

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleBuyNow = async () => {
    try {
      setIsBuyingNow(true);
      await addProductToCart({
        productVariantId,
        quantity,
      });
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
    <>
      <div className="px-5">
        <div className="space-y-4">
          <h3 className="font-medium">Quantidade</h3>
          <div className="flex w-[100px] items-center justify-between rounded-lg border">
            <Button size="icon" variant="ghost" onClick={handleDecrement}>
              <MinusIcon />
            </Button>
            <p>{quantity}</p>
            <Button size="icon" variant="ghost" onClick={handleIncrement}>
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4 px-5">
        <AddToCartButton
          productVariantId={productVariantId}
          quantity={quantity}
        />
        <Button
          className="rounded-full"
          size="lg"
          onClick={handleBuyNow}
          disabled={isBuyingNow}
        >
          {isBuyingNow ? "Processando..." : "Comprar agora"}
        </Button>
      </div>
    </>
  );
};

export default ProductActions;
