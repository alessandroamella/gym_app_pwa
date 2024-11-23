import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface DarkModeStore {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (darkMode: boolean) => void;
}

const useDarkModeStore = create<DarkModeStore>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setDarkMode: (darkMode: boolean) => set({ darkMode }),
    }),
    {
      name: 'dark-mode-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useDarkModeStore;
