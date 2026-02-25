import { Component, input, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductListItemComponent } from './product-list-item/product-list-item.component';
import type { Product } from 'src/interfaces/product.inteface';
import { Store } from '@ngrx/store';
import { selectCartData } from 'src/app/store/cart/cart.selectors';
import * as CartActions from 'src/app/store/cart/cart.actions';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductListItemComponent, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  products = input<Product[]>([]);
  title = input<string>();
  showButtons = input<boolean>(true); // valor por defecto
  showStars = input<boolean>(false);
  private store = inject(Store);
  private router = inject(Router);

  // señales
  showConfirmation = signal(false);
  addedProduct = signal<Product | null>(null);
  private lastCartCount = 0;

  constructor() {
    // El 'effect' vigila los cambios en el Store de NgRx
    effect(() => {
      const cart = this.store.selectSignal(selectCartData)();
      const currentCount = cart?.items?.length || 0;

      // Si el número de productos aumentó y tenemos uno pendiente de confirmar
      if (currentCount > this.lastCartCount && this.addedProduct()) {
        this.showConfirmation.set(true);

        // El mensaje se cierra automáticamente tras 4 segundos
        setTimeout(() => {
          this.showConfirmation.set(false);
        }, 4000);
      }

      this.lastCartCount = currentCount;
    });
  }

  // Métodos para manejar los eventos de ProductListItemComponent
  onProductDetailRequested(product: Product): void {
    this.router.navigate(['/products', product._id.toString()]);
    return;
  }

  onAddToCartRequested(product: Product): void {
    // Setear producto agregado para que el effect lo detecte
    this.addedProduct.set(product);

    // Dispatch al store
    this.store.dispatch(
      CartActions.addItem({
        product,
        quantity: 1,
      })
    );

    // Opcional: si querés mostrar confirmación directamente
    this.showConfirmation.set(true);

    // Auto-ocultar tras 4 segundos
    setTimeout(() => this.showConfirmation.set(false), 4000);
  }

  onBuyNowRequested(product: Product): void {
    this.onAddToCartRequested(product);
    this.router.navigate(['/cart']);
  }

  onProductSelected(product: Product): void {
    // Si quieres que al hacer click en cualquier parte del producto también navegue al detalle
    this.onProductDetailRequested(product);
  }

  continueShopping() {
    this.showConfirmation.set(false);
  }
}
