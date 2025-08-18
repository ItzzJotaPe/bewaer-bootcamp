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
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["addProductToCart", productVariantId, quantity],
    mutationFn: async () =>
      addProductToCart({
        productVariantId,
        quantity,
      }),
    onSuccess: (result) => {
      if ("error" in result) {
        toast.error(
          result.error === "Unauthorized"
            ? "Faça login para adicionar ao carrinho"
            : "Erro ao adicionar produto ao carrinho",
        );
        return;
      }
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
      onClick={async () => {
        if (!session?.user?.id) {
          router.push("/authentication");
          return;
        }
        try {
          const result = await mutateAsync();
          if ("error" in result) {
            toast.error(
              result.error === "Unauthorized"
                ? "Faça login para adicionar ao carrinho"
                : "Erro ao adicionar produto ao carrinho",
            );
            return;
          }
        } catch (e) {
          toast.error("Erro ao adicionar produto ao carrinho");
          console.error(e);
        }
      }}
    >
      {isPending && <Loader2 className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />}
      Adicionar ao carrinho
    </Button>
  );
};

export default AddToCartButton;
