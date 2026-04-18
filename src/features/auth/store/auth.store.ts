import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCurrentUser } from "@/lib/services/user.service";

type AuthState = {
  user: any;
  token: string | null;
  isHydrated: boolean;
  setAuth: (user: any, token: string) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isHydrated: false,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      fetchUser: async () => {
        try {
          const data = await getCurrentUser();
          set({ user: data });
        } catch {
          // ignore
        }
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state!.isHydrated = true;
      },
    }
  )
);