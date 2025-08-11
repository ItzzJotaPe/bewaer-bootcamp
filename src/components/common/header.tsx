"use client";

import {
  ClipboardListIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";

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
  return (
    <header className="flex items-center justify-between p-5">
      <Link href="/">
        <Image src="/logo.svg" alt="BEWEAR" width={100} height={26.14} />
      </Link>

      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="px-6 py-4">
              {session?.user ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={session?.user?.image as string | undefined}
                        />
                        <AvatarFallback>
                          {session?.user?.name?.split(" ")?.[0]?.[0]}
                          {session?.user?.name?.split(" ")?.[1]?.[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-semibold">{session?.user?.name}</h3>
                        <span className="text-muted-foreground block text-xs">
                          {session?.user?.email}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => authClient.signOut()}
                    >
                      <LogOutIcon />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Olá. Faça seu login!</h2>
                  <Button asChild className="rounded-full px-4" size="sm">
                    <Link
                      href="/authentication"
                      className="flex items-center gap-2"
                    >
                      <span>Login</span>
                      <LogInIcon className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
              <div className="my-4">
                <Separator />
              </div>
              <nav className="flex flex-col space-y-1 text-sm">
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
              </nav>
              <div className="my-4">
                <Separator />
              </div>
              <ul className="mt-1 flex flex-col gap-2.5 text-sm">
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
