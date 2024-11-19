import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Profile } from '../types';

interface AuthState {
  token: string | null;
  user: Profile | null;
  setToken: (token: string | null) => void;
  setUser: (user: Profile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: 'gym-auth', // key for localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    },
  ),
);
