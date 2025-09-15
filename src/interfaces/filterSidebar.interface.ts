export interface FilterSidebarInterface {
  // Opciones de filtros
  categories: {
    id: string;
    name: string;
    hasSubcategories: boolean;
    subcategories?: {
      id: string;
      name: string;
    }[];
  }[];

  // Estado actual de filtros aplicados
  appliedFilters: {
    category?: string; // skincare, makeup
    subcategory?: string; // lipstick, eyeshadows
    brand?: string; // Heimish, Etude House
  };

  // mobile
  isOpen: boolean; // Para modal en mobile
  expandedCategory: string | null; // Qué categoría está expandida
  isLoading: boolean; // Estado de carga

  // Métodos/eventos que debe manejar
  onCategoryClick: (categoryId: string) => void;
  onSubcategoryClick: (categoryId: string, subcategoryId: string) => void;
  onClearFilters: () => void;
  onCloseModal: () => void;

  hasActiveFilters: boolean;
  activeFilterText: string;
}


export type CategoryForHome = {
  id: string;
  name: string;
  hasSubcategories: boolean;
  subcategories?: {
    id: string;
    name: string;
  }[];
};