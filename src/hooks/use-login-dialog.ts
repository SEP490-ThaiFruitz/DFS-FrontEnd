import { create } from "zustand";

interface UseLoginDialogProps {
  isOpen: boolean;

  onOpen: () => void;
  onClose: () => void;
}

export const useLoginDialog = create<UseLoginDialogProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }), // Update state directly
  onClose: () => set({ isOpen: false }), // Update state directly
}));
