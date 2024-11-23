import { create } from 'zustand';

interface SplashState {
  splash: boolean;
  setSplash: (splash: boolean) => void;
}

export const useSplashStore = create<SplashState>()((set) => ({
  splash: true,
  setSplash: (splash) => set({ splash }),
}));
