"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { addProductToCart } from "@/actions/add-cart-product";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface AddToCartButtonProps {
  productVariantId: string;
  quantity: number;
}

const AddToCartButton = ({
  productVariantId,
  quantity,
}: AddToCartButtonProps) => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["addProductToCart", productVariantId, quantity],
    mutationFn: () =>
      addProductToCart({
        productVariantId,
        quantity,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Produto adicionado ao carrinho!");
    },
    onError: () => {
      toast.error("Erro ao adicionar produto ao carrinho");
    },
  });
  return (
    <Button
      className="rounded-full text-sm sm:text-base"
      size="lg"
      variant="outline"
      disabled={isPending}
      onClick={() => {
        if (!session?.user?.id) {
          router.push("/authentication");
          return;
        }
        mutate();
      }}
    >
      {isPending && <Loader2 className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />}
      Adicionar ao carrinho
    </Button>
  );
};

export default AddToCartButton;
