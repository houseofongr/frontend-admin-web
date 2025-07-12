import { create } from "zustand";
import { useEffect } from "react";
import { Category } from "../types/universe";
import { getCategory } from "../service/categoryService";

// Zustand store 정의
interface CategoryStore {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  loadCategoriesIfEmpty: () => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],

  setCategories: (categories) => set({ categories }),

  loadCategoriesIfEmpty: async () => {
    if (get().categories.length === 0) {
      const data = await getCategory();
      set({ categories: data.categories });
    }
  },
}));

// 외부에서 사용하는 커스텀 훅
export function useCategories(): Category[] {
  const categories = useCategoryStore((s) => s.categories);
  const loadCategoriesIfEmpty = useCategoryStore(
    (s) => s.loadCategoriesIfEmpty
  );

  useEffect(() => {
    loadCategoriesIfEmpty();
  }, [loadCategoriesIfEmpty]);

  return categories;
}
