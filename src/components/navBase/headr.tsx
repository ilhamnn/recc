"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronDown, User, LogOut, Users, Bell } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { logout as apiLogout } from "@/lib/services/auth.service";
import { cn } from "@/lib/utils";

// ─── Bottom Mobile Navigation ───────────────────────────────────────────────

const roleItems = [
  { label: "Pemberi", value: "pemberi", path: "/g" },
  { label: "Penerima", value: "penerima", path: "/r" },
];

function BottomNav({
  selectedRole,
  onRoleSelect,
  onProfileClick,
  onNotifClick,
}: {
  selectedRole: string | null;
  onRoleSelect: (item: (typeof roleItems)[number]) => void;
  onProfileClick: () => void;
  onNotifClick: () => void;
}) {
  const [roleOpen, setRoleOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const { token, isHydrated } = useAuthStore();

  if (!isHydrated) return null;

  const isLoggedIn = !!token;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-[0_-2px_10px_rgba(0,0,0,0.1)] lg:hidden safe-area-bottom">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {/* Pilihan Peran */}
        <DropdownMenu.Root open={roleOpen} onOpenChange={setRoleOpen}>
          <DropdownMenu.Trigger asChild>
            <button
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 rounded-xl px-4 py-2 text-xs transition-all duration-200",
                roleOpen
                  ? "text-[#16A34A] font-semibold bg-[#16A34A]/10 scale-105"
                  : "text-muted-foreground hover:text-foreground active:scale-95",
              )}
            >
              <Users
                className={cn(
                  "size-5 transition-transform",
                  roleOpen && "scale-110",
                )}
                strokeWidth={roleOpen ? 2.5 : 2}
              />
              <span className="text-[10px] font-medium max-w-[60px] text-center leading-tight">
                {selectedRole ?? "Peran"}
              </span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="start"
              sideOffset={-8}
              className="z-[60] mb-2 min-w-40 rounded-md border bg-background p-1 shadow-lg"
            >
              {roleItems.map((item) => (
                <DropdownMenu.Item
                  key={item.value}
                  onSelect={() => {
                    setRoleOpen(false);
                    onRoleSelect(item);
                  }}
                  className="flex cursor-pointer items-center rounded-sm px-3 py-2.5 text-sm outline-none hover:bg-accent"
                >
                  {item.label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Notifikasi */}
        {isLoggedIn ? (
          <button
            onClick={onNotifClick}
            className="flex flex-col items-center justify-center gap-0.5 rounded-xl px-4 py-2 text-xs text-muted-foreground transition-all duration-200 hover:text-foreground active:scale-95"
          >
            <Bell className="size-5" strokeWidth={2} />
            <span className="text-[10px] font-medium">Notifikasi</span>
          </button>
        ) : (
          <button
            disabled
            className="flex flex-col items-center justify-center gap-0.5 rounded-xl px-4 py-2 text-xs text-muted-foreground/50 cursor-not-allowed"
          >
            <Bell className="size-5" strokeWidth={2} />
            <span className="text-[10px] font-medium">Notifikasi</span>
          </button>
        )}

        {/* Profile / Sign In */}
        {isLoggedIn ? (
          <DropdownMenu.Root open={profileOpen} onOpenChange={setProfileOpen}>
            <DropdownMenu.Trigger asChild>
              <button
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 rounded-xl px-4 py-2 text-xs transition-all duration-200",
                  profileOpen
                    ? "text-[#16A34A] font-semibold bg-[#16A34A]/10 scale-105"
                    : "text-muted-foreground hover:text-foreground active:scale-95",
                )}
              >
                <User
                  className={cn(
                    "size-5 transition-transform",
                    profileOpen && "scale-110",
                  )}
                  strokeWidth={profileOpen ? 2.5 : 2}
                />
                <span className="text-[10px] font-medium">Profile</span>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={-8}
                className="z-[60] mb-2 min-w-44 rounded-md border bg-background p-1 shadow-lg"
              >
                <DropdownMenu.Item
                  onSelect={() => {
                    setProfileOpen(false);
                    onProfileClick();
                  }}
                  className="flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2.5 text-sm outline-none hover:bg-accent"
                >
                  <User className="size-4" />
                  Detail Profile
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-border" />
                <DropdownMenu.Item
                  onSelect={() => {
                    setProfileOpen(false);
                    onProfileClick();
                  }}
                  className="flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2.5 text-sm outline-none hover:bg-accent text-destructive"
                >
                  <LogOut className="size-4" />
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ) : (
          <button
            onClick={onProfileClick}
            className="flex flex-col items-center justify-center gap-0.5 rounded-xl px-4 py-2 text-xs text-muted-foreground transition-all duration-200 hover:text-foreground active:scale-95"
          >
            <User className="size-5" strokeWidth={2} />
            <span className="text-[10px] font-medium">Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
}

// ─── SimpleHeader ────────────────────────────────────────────────────────────

export function SimpleHeader() {
  const navigate = useNavigate();
  const [roleOpen, setRoleOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);

  const { token, isHydrated, logout } = useAuthStore();

  // Wait for persist to rehydrate
  if (!isHydrated)
    return (
      <header className="bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-lg">
        <nav className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => navigate("/")}
          >
            <img src="/Untitled-1j.png" alt="logo" width={32} height={32} />
            <p className="text-lg font-black tracking-tight">serba</p>
          </div>
        </nav>
        <BottomNav
          selectedRole={null}
          onRoleSelect={() => {}}
          onProfileClick={() => navigate("/login")}
          onNotifClick={() => {}}
        />
      </header>
    );

  const isLoggedIn = !!token;

  const handleRoleSelect = (item: (typeof roleItems)[number]) => {
    setSelectedRole(item.label);
    setRoleOpen(false);
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate(item.path);
    }
  };

  const handleLogout = async () => {
    try {
      if (token) await apiLogout(token);
    } catch {
      // ignore
    }
    logout();
    navigate("/login", { replace: true });
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <header className="bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-lg">
        <nav className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => navigate("/")}
          >
            <img src="/Untitled-1j.png" alt="logo" width={32} height={32} />
            <p className="text-lg font-black tracking-tight">serba</p>
          </div>

          {/* Desktop nav */}
          <div className="hidden items-center gap-2 lg:flex">
            <DropdownMenu.Root open={roleOpen} onOpenChange={setRoleOpen}>
              <DropdownMenu.Trigger asChild>
                <Button variant="ghost">
                  {selectedRole ?? "Pilihan Peran"}
                  <ChevronDown className="ml-1 size-4" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                align="start"
                className="z-50 min-w-40 rounded-md border bg-background p-1 shadow-md"
              >
                {roleItems.map((item) => (
                  <DropdownMenu.Item
                    key={item.value}
                    onSelect={() => handleRoleSelect(item)}
                    className="cursor-pointer rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent"
                  >
                    {item.label}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            {isLoggedIn && (
              <a className={buttonVariants({ variant: "ghost" })} href="#">
                Notifikasi
              </a>
            )}

            <a className={buttonVariants({ variant: "ghost" })} href="#">
              Bantuan
            </a>

            {/* Profile / Masuk */}
            {isLoggedIn ? (
              <DropdownMenu.Root open={profileOpen} onOpenChange={setProfileOpen}>
                <DropdownMenu.Trigger asChild>
                  <Button variant="ghost">
                    <User className="mr-2 size-4" />
                    Profile
                    <ChevronDown className="ml-1 size-4" />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content
                  align="end"
                  className="z-50 min-w-48 rounded-md border bg-background p-1 shadow-md"
                >
                  <DropdownMenu.Item
                    onSelect={() => {
                      setProfileOpen(false);
                      navigate("/profile");
                    }}
                    className="flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent"
                  >
                    <User className="size-4" />
                    Detail Profile
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="my-1 h-px bg-border" />
                  <DropdownMenu.Item
                    onSelect={handleLogout}
                    className="flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent text-destructive"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            ) : (
              <Button size="sm" onClick={() => navigate("/login")}>
                Masuk
              </Button>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        selectedRole={selectedRole}
        onRoleSelect={handleRoleSelect}
        onProfileClick={handleProfileClick}
        onNotifClick={() => {}}
      />
    </>
  );
}
