"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  updateProductVariantSchema,
  UpdateProductVariantInput,
} from "@/actions/update-product-variant/schema";
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
import { useUpdateProductVariant } from "@/hooks/mutations/use-update-product-variant";

interface EditVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  variant: {
    id: string;
    name: string;
    slug: string;
    color: string;
    priceInCents: number;
    imageUrl: string;
  };
}

export function EditVariantModal({
  isOpen,
  onClose,
  onSuccess,
  variant,
}: EditVariantModalProps) {
  const [imageUrl, setImageUrl] = useState(variant.imageUrl);
  const [priceDisplay, setPriceDisplay] = useState(
    (variant.priceInCents / 100).toFixed(2).replace(".", ","),
  );
  const updateMutation = useUpdateProductVariant();

  const form = useForm<UpdateProductVariantInput>({
    resolver: zodResolver(updateProductVariantSchema),
    defaultValues: {
      id: variant.id,
      name: variant.name,
      slug: variant.slug,
      color: variant.color,
      priceInCents: variant.priceInCents,
      imageUrl: variant.imageUrl,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: variant.id,
        name: variant.name,
        slug: variant.slug,
        color: variant.color,
        priceInCents: variant.priceInCents,
        imageUrl: variant.imageUrl,
      });
      setImageUrl(variant.imageUrl);
      setPriceDisplay(
        (variant.priceInCents / 100).toFixed(2).replace(".", ","),
      );
    }
  }, [isOpen, variant, form]);

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
    form.setValue("slug", generateSlug(name));
  };

  const handlePriceChange = (priceInput: string) => {
    let cleanValue = priceInput.replace(/[^\d,.]/g, "");
    if (!cleanValue.includes(",") && !cleanValue.includes(".")) {
      if (cleanValue.length === 1) cleanValue = `0,0${cleanValue}`;
      else if (cleanValue.length === 2) cleanValue = `0,${cleanValue}`;
      else cleanValue = `${cleanValue.slice(0, -2)},${cleanValue.slice(-2)}`;
    }
    cleanValue = cleanValue.replace(".", ",");
    const commaIndex = cleanValue.indexOf(",");
    if (commaIndex !== -1) {
      const before = cleanValue.slice(0, commaIndex);
      const after = cleanValue.slice(commaIndex + 1).replace(/[,]/g, "");
      cleanValue = `${before},${after}`;
    }
    if (cleanValue.includes(",")) {
      const parts = cleanValue.split(",");
      if (parts[1] && parts[1].length > 2) {
        parts[1] = parts[1].slice(0, 2);
        cleanValue = parts.join(",");
      }
    }
    setPriceDisplay(cleanValue);
    const priceInReais = parseFloat(cleanValue.replace(",", "."));
    form.setValue(
      "priceInCents",
      !isNaN(priceInReais) ? Math.round(priceInReais * 100) : 0,
    );
  };

  const onSubmit = async (data: UpdateProductVariantInput) => {
    try {
      const payload = { ...data, imageUrl };
      await updateMutation.mutateAsync(payload);
      toast.success("Variante atualizada com sucesso!");
      onSuccess();
      onClose();
    } catch {
      toast.error("Erro ao atualizar variante");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Variante</DialogTitle>
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
                      <FormLabel>Nome *</FormLabel>
                      <FormControl>
                        <Input
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
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled
                          className="cursor-not-allowed bg-gray-50 text-gray-600"
                        />
                      </FormControl>
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
                        <Input {...field} />
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
                          value={priceDisplay}
                          onChange={(e) => handlePriceChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <ImageUpload
                  onImageUploaded={setImageUrl}
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
                className="bg-slate-700 text-white hover:bg-slate-800"
              >
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
