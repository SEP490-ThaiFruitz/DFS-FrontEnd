import { create } from "zustand";

interface UseForgetPasswordDialogProps {
  isOpen: boolean;

  onOpen: () => void;
  onClose: () => void;
  onChange: (state: boolean) => void;
}

export const useForgetPasswordDialog = create<UseForgetPasswordDialogProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),

  onChange: (state: boolean) => set({ isOpen: state }),
}));

