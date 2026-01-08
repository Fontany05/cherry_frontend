import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { finalize } from 'rxjs/operators';
import { Observable, map } from 'rxjs';
import {
  Product,
  ProductData,
  ProductDetailResponse,
} from 'src/interfaces/product.inteface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  public products = signal<ProductData | null>(null);
  public loading = signal(false);
  public error = signal<string | null>(null);

  readonly products$ = this.products.asReadonly();
  readonly loading$ = this.loading.asReadonly();
  readonly error$ = this.error.asReadonly();

  readonly productsCount = computed(() => this.products()?.data.length ?? 0);

  //metodo para obtener productos
  getProductsObservable(): Observable<ProductData> {
    this.loading.set(true);
    this.error.set(null);

    return this.http
      .get<ProductData>(this.apiUrl)
      .pipe(finalize(() => this.loading.set(false)));
  }

  //metodo para obtener el producto por ID(para product-detail)
  getProductDetailById(id: string): Observable<Product> {
    // 1. Empezamos la carga
    this.loading.set(true);
    this.error.set(null);

    return this.http
      .get<ProductDetailResponse>(`${this.apiUrl}/${id}`) // La URL es correcta: apiUrl es /products, y se le añade /ID
      .pipe(
        // 2. Finalizamos la carga (éxito o error)
        finalize(() => this.loading.set(false)),
        // 3. Manejamos el mapeo de la respuesta
        map((response) => {
          if (response.error || !response.data) {
            throw new Error(
              `Failed to load product with ID ${id}: ${
                response.error ? 'Server error' : 'Data not found'
              }`
            );
          }
          return response.data;
        }))
  }

  //metodo para listar productos destacados(basado en la categoria sets)
  getFeaturedProducts(): Observable<Product[]> {
    return this.getProductsObservable().pipe(
      map((response: ProductData) =>
        response.data
          .filter((p: Product) => p.categories === 'sets' && p.active === true)
          .slice(0, 4)
      )
    );
  }

  //metodo para cargar productos y actualizar el estado
  loadProducts(): void {
    this.getProductsObservable().subscribe({
      next: (data) => {
        // Actualiza la señal con los datos de los productos
        this.products.set(data);
      },
      error: (err) => {
        //Maneja el error y actualiza la señal de error
        console.error('Error loading products:', err);
        this.error.set('Failed to load products.');
      },
    });
  }
}
