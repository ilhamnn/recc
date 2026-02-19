"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetFooter,
} from "@/components/ui/navBase/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { MenuToggle } from "@/components/ui/navBase/menu-toggle";

export function SimpleHeader() {
  const [open, setOpen] = React.useState(false);

  const roleItems = ["giver", "recipient"];
  const idItems = ["eng", "中国", "ID"];

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-1/4 z-50 w-full border-b backdrop-blur-lg">
      <nav className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img src="/Untitled-1j.png" alt="logo" width={32} height={32} />
          <p className="text-lg font-black tracking-tight">serba</p>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost">Role pick</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              align="start"
              className="z-50 min-w-40 rounded-md border bg-background p-1 shadow-md"
            >
              {roleItems.map((item) => (
                <DropdownMenu.Item
                  key={item}
                  className="cursor-pointer rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent"
                >
                  {item}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          <a className={buttonVariants({ variant: "ghost" })} href="#">
            Notif
          </a>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost">ID</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              align="start"
              className="z-50 min-w-40 rounded-md border bg-background p-1 shadow-md"
            >
              {idItems.map((item) => (
                <DropdownMenu.Item
                  key={item}
                  className="cursor-pointer rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent"
                >
                  {item}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          <a className={buttonVariants({ variant: "ghost" })} href="#">
            Bantuan
          </a>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <Button size="icon" variant="outline" className="lg:hidden">
            <MenuToggle
              strokeWidth={2.5}
              open={open}
              onOpenChange={setOpen}
              className="size-6"
            />
          </Button>

          <SheetContent
            side="left"
            showClose={false}
            className="bg-background/95 supports-backdrop-filter:bg-background/80 gap-0 backdrop-blur-lg"
          >
            <div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
              <p className="px-3 text-sm font-semibold">Role pick</p>
              {roleItems.map((item) => (
                <Button key={item} variant="ghost" className="justify-start">
                  {item}
                </Button>
              ))}

              <a
                className={buttonVariants({
                  variant: "ghost",
                  className: "justify-start",
                })}
                href="#"
              >
                Notif
              </a>

              <p className="px-3 text-sm font-semibold">ID</p>
              {idItems.map((item) => (
                <Button key={item} variant="ghost" className="justify-start">
                  {item}
                </Button>
              ))}

              <a
                className={buttonVariants({
                  variant: "ghost",
                  className: "justify-start",
                })}
                href="#"
              >
                Bantuan
              </a>
            </div>

            <SheetFooter>
              <Button variant="outline">Sign In</Button>
              <Button>Get Started</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
