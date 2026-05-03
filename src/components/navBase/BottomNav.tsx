"use client";

import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/features/auth/store/auth.store";

const navItems = [
  {
    label: "Home",
    path: "/",
    icon: Home,
  },
  {
    label: "Terima",
    path: "/r",
    icon: Users,
    requiresAuth: true,
  },
  {
    label: "Berikan",
    path: "/g",
    icon: Users,
    requiresAuth: true,
  },
  {
    label: "Akun",
    path: "/profile",
    icon: User,
    requiresAuth: true,
  },
];

export function BottomNav() {
  const location = useLocation();
  const { token, isHydrated } = useAuthStore();

  if (!isHydrated) return null;

  const isLoggedIn = !!token;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-[0_-2px_10px_rgba(0,0,0,0.1)] lg:hidden safe-area-bottom">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);

          const showItem = !item.requiresAuth || isLoggedIn;
          if (!showItem) return null;

          const Icon = item.icon;

          const href = item.path === "/profile" && !isLoggedIn ? "/login" : item.path;

          return (
            <NavLink
              key={item.path}
              to={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 rounded-xl px-4 py-2 text-xs transition-all duration-200",
                isActive
                  ? "text-[#16A34A] font-semibold bg-[#16A34A]/10 scale-105"
                  : "text-muted-foreground hover:text-foreground active:scale-95"
              )}
            >
              <Icon
                className={cn("size-5 transition-transform", isActive && "scale-110")}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}