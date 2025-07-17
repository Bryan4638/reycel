import { create } from "zustand";
import { OrderAdd } from "../type";

type Store = {
  order: OrderAdd | null;
  errors: Array<string>;
  isLoading: boolean;
  setOrder: (order: OrderAdd | null) => void;
  setErrors: (errors: Array<string>) => void;
  setIsLoading: (isLoading: boolean) => void;
};

export const useNewOrderStore = create<Store>()((set) => ({
  order: null,
  errors: [],
  isLoading: true,
  setOrder: (order) => set({ order: order }),
  setErrors: (errors) => set({ errors: errors }),
  setIsLoading: (isLoading) => set({ isLoading: isLoading }),
}));
