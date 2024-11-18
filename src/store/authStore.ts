import { create } from 'zustand';

interface AuthState {
  user: { id: number; username: string; profilePicUrl: string | null } | null;
  setUser: (user: {
    id: number;
    username: string;
    profilePicUrl: string | null;
  }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null });
  },
}));
