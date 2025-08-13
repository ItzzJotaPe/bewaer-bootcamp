"use client";

import Image from "next/image";
import Link from "next/link";

import { Header } from "@/components/common/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

const CheckoutSuccessPage = () => {
  return (
    <>
      <Header />
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent
          className="p-4 text-center sm:p-6"
          showCloseButton={false}
        >
          <Image
            src="/illustration.svg"
            alt="Success"
            width={300}
            height={300}
            className="mx-auto h-48 w-48 sm:h-64 sm:w-64 lg:h-80 lg:w-80"
          />
          <DialogTitle className="mt-4 text-xl sm:text-2xl lg:text-3xl">
            Pedido efetuado!
          </DialogTitle>
          <DialogDescription className="text-sm font-medium sm:text-base lg:text-lg">
            Seu pedido foi efetuado com sucesso. Você pode acompanhar o status
            na seção de "Meus Pedidos".
          </DialogDescription>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Button
              className="rounded-full text-sm sm:text-base"
              size="lg"
              asChild
            >
              <Link href="/my-orders">Ver meus pedidos</Link>
            </Button>
            <Button
              className="rounded-full text-sm sm:text-base"
              variant="outline"
              size="lg"
              asChild
            >
              <Link href="/">Voltar para a loja</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckoutSuccessPage;
