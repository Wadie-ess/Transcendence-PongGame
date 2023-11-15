import { create } from "zustand";

export interface ModalState {
  showExploreModal: boolean;
  showPreviewCard: boolean;
  showAddUsersModal: boolean;
  showSettingsModal: boolean;
  showBlockedLIstModal: boolean;
  showFriendsListModal: boolean;

  setShowExploreModal: (showExploreModal: boolean) => void;
  setShowFriendsModal: (showFriendsModal: boolean) => void;
  setShowPreviewCard: (showPreviewCard: boolean) => void;
  setShowAddUsersModal: (showAddUsersModal: boolean) => void;
  setShowSettingsModal: (showSettingsModal: boolean) => void;
  setShowBlockedList: (showBlockedLIstModal: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  showExploreModal: false,
  showPreviewCard: false,
  showAddUsersModal: false,
  showSettingsModal: false,
  showBlockedLIstModal: false,
  showFriendsListModal: false,

  setShowFriendsModal: (showFriendsModal: boolean) =>
    set((state) => {
      state.showFriendsListModal = showFriendsModal;
      return { ...state };
    }),
  setShowBlockedList: (showBlockedLIstModal: boolean) =>
    set((state) => {
      state.showBlockedLIstModal = showBlockedLIstModal;
      return { ...state };
    }),

  setShowSettingsModal: (showSettingsModal: boolean) =>
    set((state) => {
      state.showSettingsModal = showSettingsModal;
      return { ...state };
    }),
  setShowExploreModal: (showExploreModal: boolean) =>
    set((state) => {
      state.showExploreModal = showExploreModal;
      return { ...state };
    }),

  setShowPreviewCard: (showPreviewCard: boolean) =>
    set((state) => {
      state.showPreviewCard = showPreviewCard;
      return { ...state };
    }),

  setShowAddUsersModal: (showAddUsersModal: boolean) =>
    set((state) => {
      state.showAddUsersModal = showAddUsersModal;
      return { ...state };
    }),
}));
