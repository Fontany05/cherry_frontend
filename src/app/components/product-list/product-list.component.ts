import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductListItemComponent } from './product-list-item/product-list-item.component';
import type { Product } from 'src/interfaces/product.inteface';
import { Store } from '@ngrx/store';

import * as CartActions from 'src/app/store/cart/cart.actions';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductListItemComponent],
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

  // Métodos para manejar los eventos de ProductListItemComponent
  onProductDetailRequested(product: Product): void {
    this.router.navigate(['/products', product._id.toString()]);
    return;
  }

  onAddToCartRequested(product: Product): void {
    this.store.dispatch(CartActions.addItem({
      product,
      quantity: 1
    }));
  }

  onBuyNowRequested(product: Product): void {
  this.onAddToCartRequested(product);
  this.router.navigate(['/cart']);
  }

  onProductSelected(product: Product): void {
    // Si quieres que al hacer click en cualquier parte del producto también navegue al detalle
    this.onProductDetailRequested(product);
  }
}
