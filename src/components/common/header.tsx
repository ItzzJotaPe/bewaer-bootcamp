"use client";

import {
  ClipboardListIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  SettingsIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { useUser } from "@/hooks/queries/use-user";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Cart } from "./cart";

export const Header = () => {
  const { data: session } = authClient.useSession();
  const { data: user } = useUser();
  
  const isAdmin = user?.role === "adm";

  return (
    <header className="flex items-center justify-between p-4 sm:p-5 lg:px-12 lg:py-6 xl:px-16 xl:py-8">
      <div className="lg:hidden">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="BEWEAR"
            width={100}
            height={26.14}
            className="h-6 w-auto sm:h-7 lg:h-8 xl:h-10"
          />
        </Link>
      </div>

      <div className="hidden lg:flex lg:flex-1 lg:justify-center">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="BEWEAR"
            width={100}
            height={26.14}
            className="h-6 w-auto sm:h-7 lg:h-8 xl:h-10"
          />
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11"
            >
              <MenuIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full max-w-[320px] sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="text-lg sm:text-xl">Menu</SheetTitle>
            </SheetHeader>
            <div className="px-4 py-4 sm:px-6">
              {session?.user ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                        <AvatarImage
                          src={session?.user?.image as string | undefined}
                        />
                        <AvatarFallback className="text-sm sm:text-base">
                          {session?.user?.name?.split(" ")?.[0]?.[0]}
                          {session?.user?.name?.split(" ")?.[1]?.[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="text-sm font-semibold sm:text-base">
                          {session?.user?.name}
                        </h3>
                        <span className="text-muted-foreground block text-xs sm:text-sm">
                          {session?.user?.email}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => authClient.signOut()}
                      className="h-8 w-8 sm:h-9 sm:w-9"
                    >
                      <LogOutIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold sm:text-base">
                    Olá. Faça seu login!
                  </h2>
                  <Button
                    asChild
                    className="rounded-full px-3 sm:px-4"
                    size="sm"
                  >
                    <Link
                      href="/authentication"
                      className="flex items-center gap-2 text-xs sm:text-sm"
                    >
                      <span>Login</span>
                      <LogInIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Link>
                  </Button>
                </div>
              )}
              <div className="my-4">
                <Separator />
              </div>
              <nav className="flex flex-col space-y-1 text-sm sm:text-base">
                <Link
                  href="/cart/identification"
                  className="hover:bg-muted/50 flex items-center gap-3 rounded-md px-2 py-2.5"
                >
                  <HomeIcon className="h-4 w-4" />
                  <span className="font-semibold">Início</span>
                </Link>
                <Link
                  href="/my-orders"
                  className="hover:bg-muted/50 flex items-center gap-3 rounded-md px-2 py-2.5"
                >
                  <ClipboardListIcon className="h-4 w-4" />
                  <span className="font-semibold">Meus Pedidos</span>
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="hover:bg-muted/50 flex items-center gap-3 rounded-md px-2 py-2.5"
                  >
                    <SettingsIcon className="h-4 w-4" />
                    <span className="font-semibold">Painel Administrativo</span>
                  </Link>
                )}
              </nav>
              <div className="my-4">
                <Separator />
              </div>
              <ul className="mt-1 flex flex-col gap-2.5 text-sm sm:text-base">
                <li>
                  <Link
                    href="/category/camisetas"
                    className="hover:bg-muted/50 block rounded-md px-2 py-2 font-semibold"
                  >
                    Camisetas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/bermuda-shorts"
                    className="hover:bg-muted/50 block rounded-md px-2 py-2 font-semibold"
                  >
                    Bermuda & Shorts
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/calas"
                    className="hover:bg-muted/50 block rounded-md px-2 py-2 font-semibold"
                  >
                    Calças
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/jaquetas-moletons"
                    className="hover:bg-muted/50 block rounded-md px-2 py-2 font-semibold"
                  >
                    Jaquetas & Moletons
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/tnis"
                    className="hover:bg-muted/50 block rounded-md px-2 py-2 font-semibold"
                  >
                    Tênis
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/acessrios"
                    className="hover:bg-muted/50 block rounded-md px-2 py-2 font-semibold"
                  >
                    Acessórios
                  </Link>
                </li>
              </ul>
            </div>
          </SheetContent>
        </Sheet>
        <Cart />
      </div>
    </header>
  );
};
