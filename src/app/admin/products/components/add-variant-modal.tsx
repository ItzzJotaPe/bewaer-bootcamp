"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createProductVariantSchema } from "@/actions/create-product-variant/schema";
import { CreateProductVariantInput } from "@/actions/create-product-variant/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { useCreateProductVariant } from "@/hooks/mutations/use-create-product-variant";

interface AddVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  onSuccess: () => void;
}

export function AddVariantModal({
  isOpen,
  onClose,
  productId,
  productName,
  onSuccess,
}: AddVariantModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [priceDisplay, setPriceDisplay] = useState("");
  const createVariantMutation = useCreateProductVariant();

  const form = useForm<CreateProductVariantInput>({
    resolver: zodResolver(createProductVariantSchema),
    defaultValues: {
      name: "",
      slug: "",
      color: "",
      priceInCents: 0,
      imageUrl: "",
      productId: productId,
    },
  });

  useEffect(() => {
    form.register("imageUrl");
  }, [form]);

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: "",
        slug: "",
        color: "",
        priceInCents: 0,
        imageUrl: "",
        productId: productId,
      });
      setImageUrl("");
      setPriceDisplay("");
    }
  }, [isOpen, form, productId]);

  const onSubmit = async (data: CreateProductVariantInput) => {
    // Validação manual simples
    if (!imageUrl) {
      toast.error("Por favor, selecione uma imagem para a variante");
      return;
    }

    if (!data.name || !data.slug || !data.color) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (data.priceInCents <= 0) {
      toast.error("O preço deve ser maior que zero");
      return;
    }

    setIsSubmitting(true);

    try {
      const variantData = {
        ...data,
        imageUrl: imageUrl,
      };

      await createVariantMutation.mutateAsync(variantData);

      toast.success("Variante criada com sucesso!");
      form.reset({
        name: "",
        slug: "",
        color: "",
        priceInCents: 0,
        imageUrl: "",
        productId: productId,
      });
      setImageUrl("");
      setPriceDisplay("");
      onSuccess();
      onClose();
    } catch {
      toast.error("Erro ao criar variante");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    form.setValue("name", name);
    const generatedSlug = generateSlug(name);
    form.setValue("slug", generatedSlug);
  };

  const handlePriceChange = (priceInput: string) => {
    // Remove tudo exceto números, vírgula e ponto
    let cleanValue = priceInput.replace(/[^\d,.]/g, "");

    // Se não há vírgula nem ponto, adiciona vírgula automaticamente
    if (!cleanValue.includes(",") && !cleanValue.includes(".")) {
      if (cleanValue.length === 1) {
        cleanValue = `0,0${cleanValue}`;
      } else if (cleanValue.length === 2) {
        cleanValue = `0,${cleanValue}`;
      } else {
        const reais = cleanValue.slice(0, -2);
        const centavos = cleanValue.slice(-2);
        cleanValue = `${reais},${centavos}`;
      }
    }

    // Normaliza para usar vírgula como separador decimal
    cleanValue = cleanValue.replace(".", ",");

    // Se há múltiplas vírgulas, mantém apenas a primeira
    const commaIndex = cleanValue.indexOf(",");
    if (commaIndex !== -1) {
      const beforeComma = cleanValue.slice(0, commaIndex);
      const afterComma = cleanValue.slice(commaIndex + 1).replace(/[,]/g, "");
      cleanValue = `${beforeComma},${afterComma}`;
    }

    // Limita centavos a 2 dígitos
    if (cleanValue.includes(",")) {
      const parts = cleanValue.split(",");
      if (parts[1] && parts[1].length > 2) {
        parts[1] = parts[1].slice(0, 2);
        cleanValue = parts.join(",");
      }
    }

    setPriceDisplay(cleanValue);

    // Converte para centavos
    const priceInReais = parseFloat(cleanValue.replace(",", "."));

    if (!isNaN(priceInReais) && priceInReais > 0) {
      const priceInCents = Math.round(priceInReais * 100);
      form.setValue("priceInCents", priceInCents);
    } else {
      form.setValue("priceInCents", 0);
    }
  };

  const handleImageUploaded = (url: string) => {
    setImageUrl(url);
    form.setValue("imageUrl", url, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Adicionar Variante - {productName}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Variante *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o nome da variante"
                          {...field}
                          onChange={(e) => handleNameChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug (gerado automaticamente)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="slug-da-variante"
                          {...field}
                          disabled
                          className="cursor-not-allowed bg-gray-50 text-gray-600"
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        O slug é gerado automaticamente baseado no nome da
                        variante
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Azul, Vermelho, Verde"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priceInCents"
                  render={() => (
                    <FormItem>
                      <FormLabel>Preço em R$ *</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="0,00"
                          value={priceDisplay}
                          onChange={(e) => handlePriceChange(e.target.value)}
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        Digite o preço em reais (ex: 99,99)
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <ImageUpload
                  onImageUploaded={handleImageUploaded}
                  currentImageUrl={imageUrl}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-slate-700 text-white hover:bg-slate-800"
              >
                {isSubmitting ? "Criando..." : "Criar Variante"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
