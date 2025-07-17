import { create } from "zustand";
import { FiltersType, SortOption } from "../types";

type Store = {
  querySeach: string;
  filters: FiltersType;
  sortParmas: SortOption[];
  errorSerch: string[];
  setErrorSearch: (error: string[]) => void;
  setQuerySeach: (query: string) => void;
  setFilters: (filters: FiltersType) => void;
  setSortParmas: (sortParmas: SortOption[]) => void;
};

export const useFilterStore = create<Store>()((set) => ({
  querySeach: "",
  filters: {},
  sortParmas: [],
  errorSerch: [],
  setErrorSearch: (error) => set({ errorSerch: error }),
  setQuerySeach: (query) => set({ querySeach: query }),
  setFilters: (filters) => set({ filters: filters }),
  setSortParmas: (sortParmas) => set({ sortParmas: sortParmas }),
}));
