import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import type { FilterSidebarInterface, CategoryForHome } from 'src/interfaces/filterSidebar.interface';
import { Product, ProductData } from 'src/interfaces/product.inteface';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`; //señales para el estado de filtros

  private filterState = signal<FilterSidebarInterface>(this.getInitialState());
  private filteredProducts = signal<Product[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null); //señales readOnly

  readonly filterState$ = this.filterState.asReadonly();
  readonly filteredProducts$ = this.filteredProducts.asReadonly();
  readonly loading$ = this.loading.asReadonly();
  readonly error$ = this.error.asReadonly();

  readonly hasActiveFilters = computed(() => {
    const filters = this.filterState$().appliedFilters;
    return !!(filters.category || filters.subcategory || filters.brand);
  });

  readonly activeFilterText = computed(() => {
    const filters = this.filterState$().appliedFilters;
    const parts: string[] = [];
    if (filters.category)
      parts.push(`Category: ${this.formatCategoryName(filters.category)}`);
    if (filters.subcategory) parts.push(`Subcategory: ${filters.subcategory}`);
    if (filters.brand) parts.push(`Brand: ${filters.brand}`);
    return parts.join(' | ');
  });

  readonly productsCount = computed(() => this.filteredProducts().length);

  constructor() {
    this.initializeCategories();
    this.loadAllProducts();
  }

  private getInitialState(): FilterSidebarInterface {
    return {
      categories: [],
      appliedFilters: {},
      isOpen: false,
      expandedCategory: null,
      isLoading: false,
      hasActiveFilters: false,
      activeFilterText: '',
      onCategoryClick: (categoryId: string) => this.onCategoryClick(categoryId),
      onSubcategoryClick: (categoryId: string, subcategoryId: string) =>
        this.onSubcategoryClick(categoryId, subcategoryId),
      onClearFilters: () => this.clearAllFilters(),
      onCloseModal: () => this.closeModal(),
    };
  }

  private getFilteredProducts(filters: any): Observable<ProductData> {
    const params = this.buildHttpParams(filters);
    return this.http.get<ProductData>(this.apiUrl, { params });
  }

  private buildHttpParams(filters: any): HttpParams {
    let params = new HttpParams();

    if (filters.category) {
      params = params.set('category', filters.category);
    }

    if (filters.subcategory) {
      params = params.set('subcategory', filters.subcategory);
    }

    if (filters.brand) {
      params = params.set('brand', filters.brand);
    }

    return params;
  }

  private loadFilteredProducts(filters: any): void {
    this.loading.set(true);
    this.error.set(null);

    this.getFilteredProducts(filters)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          if (!response.error && response.data) {
            this.filteredProducts.set(response.data);
          } else {
            this.filteredProducts.set([]);
            this.error.set('No products found with those filters');
          }
        },
        error: (err) => {
          console.error('Error filtering products:', err);
          this.error.set('Error loading products');
          this.filteredProducts.set([]);
        },
      });
  } // Métodos públicos

  onCategoryClick(categoryId: string): void {
    const currentState = this.filterState();

    if (currentState.expandedCategory === categoryId) {
      this.filterState.update((state) => {
        if (
          state.appliedFilters.category === categoryId &&
          !state.appliedFilters.subcategory &&
          !state.appliedFilters.brand
        ) {
          this.clearAllFilters();
        }
        return { ...state, expandedCategory: null };
      });
      return;
    }

    this.filterState.update((state) => ({
      ...state,
      expandedCategory: categoryId,
    }));

    const category = currentState.categories.find(
      (cat) => cat.id === categoryId
    );
    if (categoryId !== 'brands' && !category?.hasSubcategories) {
      this.applyFilter({ category: categoryId });
    }
  }

  onSubcategoryClick(categoryId: string, subcategoryId: string): void {
    let filters: any;

    if (categoryId === 'brands') {
      filters = {
        brand: subcategoryId,
        category: undefined,
        subcategory: undefined,
      };
    } else {
      filters = {
        category: categoryId,
        subcategory: subcategoryId,
        brand: undefined,
      };
    }
    this.applyFilter(filters);
    this.closeModal();
  }

  private applyFilter(filters: {
    category?: string;
    subcategory?: string;
    brand?: string;
  }): void {
    this.filterState.update((state) => ({
      ...state,
      appliedFilters: filters,
    }));
    this.loadFilteredProducts(this.filterState$().appliedFilters);
  }

  clearAllFilters(): void {
    this.filterState.update((state) => ({
      ...state,
      appliedFilters: {},
      expandedCategory: null,
    }));

    this.loadAllProducts();
  }

  loadAllProducts(): void {
    this.loadFilteredProducts({});
  } // Métodos para modal (mobile)

  openModal(): void {
    this.filterState.update((state) => ({ ...state, isOpen: true }));
  }

  closeModal(): void {
    this.filterState.update((state) => ({ ...state, isOpen: false }));
  } // Método para buscar por marca independientemente

  searchByBrand(brandName: string): void {
    this.applyFilter({ brand: brandName });
  } // Helper methods

  private formatCategoryName(category: string): string {
    return category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  private initializeCategories(): void {
    const categories = this.buildCategoriesFromBackendLogic();
    this.filterState.update((state) => ({ ...state, categories }));
  }

  private buildCategoriesFromBackendLogic() {
    const validCategories = ['skincare', 'makeup', 'sets', 'beauty-tools'];

    const validProductSubcategories: { [key: string]: string[] } = {
      makeup: [
        'lipstick',
        'mascara',
        'blush',
        'eyeliner',
        'cushions',
        'eyeshadows',
      ],
    };

    const validBrands = [
      'Heimish',
      'Skin food',
      'Etude house',
      '3ce',
      "A'PIEU",
      'Romand',
      'Amuse',
      'Clio',
      'Tony moly',
      'Holika Holika',
      'LILY BY RED',
      'Peach c',
      'Peripera',
      'Anua',
      'Innisfree',
      'Beauty of Joseon',
      'Benton',
      'ROUND LAB',
    ];

    const categories = validCategories.map((cat) => ({
      id: cat,
      name: this.formatCategoryName(cat),
      hasSubcategories: !!validProductSubcategories[cat],
      subcategories:
        validProductSubcategories[cat]?.map((sub) => ({
          id: sub,
          name: sub,
        })) || [],
    }));

    categories.push({
      id: 'brands',
      name: 'Brands',
      hasSubcategories: true,
      subcategories: validBrands.map((brand) => ({
        id: brand,
        name: brand,
      })),
    });

    return categories;
  }
  
  //categorias - home
  getCategoriesForHome(): CategoryForHome[] {
  const filterState = this.filterState();
  return filterState.categories
    .filter(cat => cat.id !== 'brands')
    .slice(0, 4);
}
}
