import { create } from "zustand";

export interface ModalState {
  showExploreModal: boolean;
  showPreviewCard: boolean;
  showAddUsersModal: boolean;
  showSettingsModal: boolean;
  showBlockedListModal: boolean;
  showFriendsListModal: boolean;
  showCreateChatRoomModal: boolean;

  setShowExploreModal: (showExploreModal: boolean) => void;
  setShowFriendsListModal: (showFriendsListModal: boolean) => void;
  setShowPreviewCard: (showPreviewCard: boolean) => void;
  setShowAddUsersModal: (showAddUsersModal: boolean) => void;
  setShowSettingsModal: (showSettingsModal: boolean) => void;
  setShowBlockedListModal: (showBlockedListModal: boolean) => void;
  setShowCreateChatRoomModal: (showCreateChatRoomModal: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  showExploreModal: false,
  showPreviewCard: false,
  showAddUsersModal: false,
  showSettingsModal: false,
  showBlockedListModal: false,
  showFriendsListModal: false,
  showCreateChatRoomModal: false,

  setShowFriendsListModal: (showFriendsListModal: boolean) =>
    set((state) => {
      state.showFriendsListModal = showFriendsListModal;
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

  setShowBlockedListModal: (showBlockedListModal: boolean) =>
    set((state) => {
      state.showBlockedListModal = showBlockedListModal;
      return { ...state };
    }),

  setShowCreateChatRoomModal: (showCreateChatRoomModal: boolean) =>
    set((state) => {
      state.showCreateChatRoomModal = showCreateChatRoomModal;
      return { ...state };
    }),
}));
