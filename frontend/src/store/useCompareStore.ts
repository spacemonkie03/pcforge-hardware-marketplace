import { create } from 'zustand';

interface CompareState {
  ids: string[];
  toggle: (id: string) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareState>((set) => ({
  ids: [],
  toggle: (id) =>
    set((state) => ({
      ids: state.ids.includes(id)
        ? state.ids.filter((x) => x !== id)
        : [...state.ids, id]
    })),
  clear: () => set({ ids: [] })
}));

