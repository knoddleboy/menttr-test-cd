import { create } from "zustand";

type PageHeaderState = {
  title: string;
};

type PageHeaderActions = {
  setTitle: (newTitle: string) => void;
};

export const usePageHeaderStore = create<PageHeaderState & PageHeaderActions>((set) => ({
  title: "",
  setTitle: (newTitle) => set({ title: newTitle }),
}));
