import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateProductInput } from "@/actions/create-product/schema";

export const createProductMutationKey = () => ["create-product"];

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: createProductMutationKey(),
    mutationFn: async (data: CreateProductInput) => {
      console.log("Hook - Iniciando criação de produto:", data);

      const response = await fetch("/api/admin/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Hook - Status da resposta:", response.status);
      console.log("Hook - OK da resposta:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Hook - Erro na resposta:", errorText);
        throw new Error("Failed to create product");
      }

      const result = await response.json();
      console.log("Hook - Resultado da API:", result);

      if (!result.success) {
        throw new Error(result.error || "Failed to create product");
      }

      return result;
    },
    onSuccess: () => {
      console.log("Hook - Produto criado com sucesso, invalidando queries");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error) => {
      console.error("Hook - Erro na mutation:", error);
    },
  });
};
