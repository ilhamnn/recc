"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetFooter,
} from "@/components/ui/navBase/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { MenuToggle } from "@/components/ui/navBase/menu-toggle";
import { ChevronDown, LogOut } from "lucide-react";

export function SimpleHeader() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [expandedSection, setExpandedSection] = React.useState<string | null>(
    null,
  );
  const [selectedperan, setSelectedperan] = React.useState<string | null>(null);
  const [selectedLang, setSelectedLang] = React.useState<string | null>(null);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const peranItems = ["pemberi", "penerima"];
  const idItems = ["eng", "中国", "id"];

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login", { replace: true });
  };

  const handlePeranSelect = (item: string) => {
    setSelectedperan(item);
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      // arahkan sesuai peran
      navigate(item === "pemberi" ? "/r" : "/g");
    }
  };

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-lg">
      <nav className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/Untitled-1j.png" alt="logo" width={32} height={32} />
          <p className="text-lg font-black tracking-tight">serba</p>
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-2 lg:flex">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost">
                {selectedperan ?? "peran"}
                <ChevronDown className="ml-1 size-4" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              align="start"
              className="z-50 min-w-40 rounded-md border bg-background p-1 shadow-md"
            >
              {peranItems.map((item) => (
                <DropdownMenu.Item
                  key={item}
                  onSelect={() => handlePeranSelect(item)}
                  className="cursor-pointer rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent"
                >
                  {item}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          {/* Notif hanya muncul jika sudah login */}
          {isLoggedIn && (
            <a className={buttonVariants({ variant: "ghost" })} href="#">
              notif
            </a>
          )}

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost">{selectedLang ?? "id"}</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              align="start"
              className="z-50 min-w-40 rounded-md border bg-background p-1 shadow-md"
            >
              {idItems.map((item) => (
                <DropdownMenu.Item
                  key={item}
                  onSelect={() => setSelectedLang(item)}
                  className="cursor-pointer rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent"
                >
                  {item}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          <a className={buttonVariants({ variant: "ghost" })} href="#">
            bantuan
          </a>

          {isLoggedIn ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 size-4" />
              Keluar
            </Button>
          ) : (
            <Button size="sm" onClick={() => navigate("/login")}>
              Masuk
            </Button>
          )}
        </div>

        {/* Mobile sheet */}
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
            <div className="grid gap-y-1 overflow-y-auto px-4 pt-12 pb-5">
              <Button
                variant="ghost"
                className="justify-between"
                onClick={() => toggleSection("peran")}
              >
                {selectedperan ?? "peran"}
                <ChevronDown
                  className={`size-4 transition-transform duration-200 ${
                    expandedSection === "peran" ? "rotate-180" : ""
                  }`}
                />
              </Button>
              {expandedSection === "peran" && (
                <div className="ml-3 grid gap-y-1 border-l pl-3">
                  {peranItems.map((item) => (
                    <Button
                      key={item}
                      variant="ghost"
                      onClick={() => {
                        setOpen(false);
                        handlePeranSelect(item);
                      }}
                      className="justify-start text-muted-foreground"
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              )}

              {isLoggedIn && (
                <a
                  className={buttonVariants({
                    variant: "ghost",
                    className: "justify-start",
                  })}
                  href="#"
                >
                  notif
                </a>
              )}

              <Button
                variant="ghost"
                className="justify-between"
                onClick={() => toggleSection("id")}
              >
                {selectedLang ?? "id"}
                <ChevronDown
                  className={`size-4 transition-transform duration-200 ${
                    expandedSection === "id" ? "rotate-180" : ""
                  }`}
                />
              </Button>
              {expandedSection === "id" && (
                <div className="ml-3 grid gap-y-1 border-l pl-3">
                  {idItems.map((item) => (
                    <Button
                      key={item}
                      variant="ghost"
                      onClick={() => setSelectedLang(item)}
                      className="justify-start text-muted-foreground"
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              )}
              <a
                className={buttonVariants({
                  variant: "ghost",
                  className: "justify-start",
                })}
                href="#"
              >
                bantuan
              </a>
            </div>

            <SheetFooter>
              {isLoggedIn ? (
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="mr-2 size-4" />
                  Keluar
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setOpen(false);
                    navigate("/login");
                  }}
                >
                  Masuk / Daftar
                </Button>
              )}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
