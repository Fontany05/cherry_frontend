import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { finalize } from 'rxjs/operators';
import { ProductData } from 'src/interfaces/product.inteface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  // Guardamos toda la estructura ProductData
  public products = signal<ProductData | null>(null);

  // Estado de carga y error
  public loading = signal(false);
  public error = signal<string | null>(null);

  readonly products$ = this.products.asReadonly();
  readonly loading$ = this.loading.asReadonly();
  readonly error$ = this.error.asReadonly();

  // Número de productos
  readonly productsCount = computed(() => this.products()?.data.length ?? 0);

  // Método para obtener productos
  getProducts() {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<ProductData>(this.apiUrl)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          // Guardar toda la respuesta en la señal
          this.products.set(response);
        },
        error: (err) => {
          console.error('Error al cargar productos:', err);
          this.error.set('Error al cargar productos');
        }
      });
  }
}