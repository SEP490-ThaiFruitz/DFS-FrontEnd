import { create } from "zustand";

interface UseRegisterDialogProps {
  isOpen: boolean;

  onOpen: () => void;
  onClose: () => void;
  onChange: (state: boolean) => void;
}

export const useRegisterDialog = create<UseRegisterDialogProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),

  onChange: (state: boolean) => set({ isOpen: state }),
}));
