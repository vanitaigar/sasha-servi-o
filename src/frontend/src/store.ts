import type { UserProfile } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  // User
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;

  // Theme
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void;

  // Notifications
  unreadNotificationsCount: number;
  setUnreadNotificationsCount: (count: number) => void;
  incrementUnreadNotifications: () => void;
  clearUnreadNotifications: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      userProfile: null,
      setUserProfile: (profile) => set({ userProfile: profile }),

      // Theme
      theme: "dark",
      setTheme: (theme) => {
        set({ theme });
        const root = document.documentElement;
        if (theme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      },
      toggleTheme: () => {
        const current = get().theme;
        const next = current === "dark" ? "light" : "dark";
        get().setTheme(next);
      },

      // Notifications
      unreadNotificationsCount: 0,
      setUnreadNotificationsCount: (count) =>
        set({ unreadNotificationsCount: count }),
      incrementUnreadNotifications: () =>
        set((s) => ({
          unreadNotificationsCount: s.unreadNotificationsCount + 1,
        })),
      clearUnreadNotifications: () => set({ unreadNotificationsCount: 0 }),
    }),
    {
      name: "sasha-servico-store",
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
);
