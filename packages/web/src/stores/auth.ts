import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserDto = {
  id: number;
  username: string;
  role: string;
  name: string;
  bio: string;
  profileImageUrl: string | null;
  skills: { id: number; name: string }[];
  mentorApplications: { id: number; status: string; motivation: string; createdAt: string }[];
  location?: {
    country?: string;
    city?: string;
  };
  social?: string;
};

type AuthState = {
  user: UserDto | null;
};

type AuthActions = {
  setUser: (user: UserDto | null) => void;
  updateUser: (updates: Partial<UserDto>) => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : state.user,
        })),
    }),
    { name: "user" }
  )
);
