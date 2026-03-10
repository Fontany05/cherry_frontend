import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { ProductsService } from 'src/app/services/product/product.service';
import { Product } from 'src/interfaces/product.inteface';
import { Store } from '@ngrx/store';
import { selectCartData } from 'src/app/store/cart/cart.selectors';
import * as CartActions from 'src/app/store/cart/cart.actions';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productsService = inject(ProductsService);
  private store = inject(Store);
  private authService = inject(AuthService);

  // Estado local para almacenar el producto
  public product = signal<Product | null>(null);

  // Estado para controlar si mostramos la confirmación (si lo usabas antes)
  public showConfirmation = signal(false);
  addedProduct = signal<Product | null>(null);

  public cart = this.store.selectSignal(selectCartData);

  // Acceso a las señales del servicio
  readonly loading = this.productsService.loading;
  readonly error = this.productsService.error;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const productId = params.get('id');
      if (productId) {
        this.productsService.error.set(null);
        this.loadProductDetail(productId);
      }
    });
  }

  loadProductDetail(id: string): void {
    this.productsService.getProductDetailById(id).subscribe({
      next: (productData) => {
        this.product.set(productData);
      },
      error: () => {
        console.log('Error al cargar el detalle');
      },
    });
  }

  onAddToCart() {
    const currentProduct = this.product();

    if (currentProduct) {
      // Solo disparamos la acción.
      // Si es anónimo, el Reducer actualiza el estado al instante.
      this.store.dispatch(
        CartActions.addItem({
          product: currentProduct,
          quantity: 1,
        }),
      );

      // Mostramos tu mensaje visual personalizado
      this.showConfirmation.set(true);

      // Auto-ocultar tras 3 segundos
      setTimeout(() => this.showConfirmation.set(false), 3000);
    }
  }

  buyNow(): void {
    const currentProduct = this.product();
    if (!currentProduct) return;

    // Si no está logueado, mandarlo a register
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/register']);
      return;
    }

    // Si está logueado, agregar al carrito y ir al checkout
    this.store.dispatch(
      CartActions.addItem({
        product: currentProduct,
        quantity: 1,
      }),
    );
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.showConfirmation.set(false);
  }
}
