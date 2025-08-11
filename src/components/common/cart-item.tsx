import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { formatCentsToBRL } from "@/helpers/money";
import { useDecreaseCartProduct } from "@/hooks/mutations/use-decrease-cart-product";
import { useIncreaseCartProduct } from "@/hooks/mutations/use-increase-cart-product";
import { useRemoveProductFromCart } from "@/hooks/mutations/use-remove-product-from-cart";

import { Button } from "../ui/button";

interface CartItemProps {
  id: string;
  productName: string;
  productVariantId: string;
  productVariantName: string;
  productVariantImageUrl: string;
  productVariantPriceInCents: number;
  quantity: number;
}

const CartItem = ({
  id,
  productName,
  productVariantId,
  productVariantName,
  productVariantImageUrl,
  productVariantPriceInCents,
  quantity,
}: CartItemProps) => {
  const removeProductFromCartMutation = useRemoveProductFromCart(id);
  const decreaseCartProductQuantityMutation = useDecreaseCartProduct(id);
  const increaseCartProductQuantityMutation =
    useIncreaseCartProduct(productVariantId);
  const handleDeleteClick = () => {
    removeProductFromCartMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Produto removido do carrinho.");
      },
      onError: () => {
        toast.error("Erro ao remover produto do carrinho.");
      },
    });
  };
  const handleDecreaseQuantityClick = () => {
    decreaseCartProductQuantityMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Quantidade do produto diminuida.");
      },
    });
  };
  const handleIncreaseQuantityClick = () => {
    increaseCartProductQuantityMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Quantidade do produto aumentada.");
      },
    });
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 sm:gap-4">
        <Image
          src={productVariantImageUrl}
          alt={productVariantName}
          width={78}
          height={78}
          className="h-16 w-16 rounded-lg sm:h-20 sm:w-20"
        />
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold sm:text-sm">{productName}</p>
          <p className="text-muted-foreground text-xs font-medium">
            {productVariantName}
          </p>
          <div className="flex w-[90px] items-center justify-between rounded-lg border p-1 sm:w-[100px]">
            <Button
              className="h-4 w-4 sm:h-5 sm:w-5"
              variant="ghost"
              onClick={handleDecreaseQuantityClick}
            >
              <MinusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <p className="text-xs font-medium">{quantity}</p>
            <Button
              className="h-4 w-4 sm:h-5 sm:w-5"
              variant="ghost"
              onClick={handleIncreaseQuantityClick}
            >
              <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDeleteClick}
          className="h-8 w-8 sm:h-9 sm:w-9"
        >
          <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <p className="text-xs font-bold sm:text-sm">
          {formatCentsToBRL(productVariantPriceInCents)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
