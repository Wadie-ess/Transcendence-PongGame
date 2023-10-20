import { create } from "zustand";

export interface ModalState {
  showExploreModal: boolean;
  setShowExploreModal: (showExploreModal: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  showExploreModal: false,
  setShowExploreModal: (showExploreModal: boolean) =>
    set((state) => {
      state.showExploreModal = showExploreModal;
      return { ...state };
    }),
}));
