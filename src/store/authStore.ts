import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface AuthState {
  token: string | null;
  user: { id: number; username: string; profilePicUrl: string | null } | null;
  setToken: (token: string | null) => void;
  setUser: (user: {
    id: number;
    username: string;
    profilePicUrl: string | null;
  }) => void;
  logout: () => void;
}

// Custom storage object for cookies
const cookieStorage = {
  getItem: (name: string): string | null => {
    const value = Cookies.get(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: string): void => {
    // Set cookie with 7 days expiry - adjust as needed
    Cookies.set(name, value, { expires: 7, sameSite: 'strict' });
  },
  removeItem: (name: string): void => {
    Cookies.remove(name);
  },
};

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
      name: 'gym-auth', // name of the cookie
      storage: createJSONStorage(() => cookieStorage),
      // Only persist these fields
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    },
  ),
);
