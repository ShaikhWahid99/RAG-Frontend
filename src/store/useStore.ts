import { create } from 'zustand';

interface StoreState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentWorkspaceId: string | null;
  setCurrentWorkspaceId: (id: string | null) => void;
}

export const useStore = create<StoreState>((set) => {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';

  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  }

  return {
    darkMode: isDarkMode,
    toggleDarkMode: () =>
      set((state) => {
        const newDarkMode = !state.darkMode;
        localStorage.setItem('darkMode', newDarkMode.toString());
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { darkMode: newDarkMode };
      }),
    currentWorkspaceId: null,
    setCurrentWorkspaceId: (id) => set({ currentWorkspaceId: id }),
  };
});
