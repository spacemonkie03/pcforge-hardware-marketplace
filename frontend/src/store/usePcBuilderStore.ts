import { create } from 'zustand';

export interface SelectedParts {
  cpuId?: string;
  motherboardId?: string;
  gpuId?: string;
  ramId?: string;
  psuId?: string;
  caseId?: string;
}

interface PcBuilderState {
  selection: SelectedParts;
  setPart: (key: keyof SelectedParts, value?: string) => void;
  reset: () => void;
}

export const usePcBuilderStore = create<PcBuilderState>((set) => ({
  selection: {},
  setPart: (key, value) =>
    set((state) => ({ selection: { ...state.selection, [key]: value } })),
  reset: () => set({ selection: {} })
}));

