import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Product } from 'src/interfaces/product.inteface';

@Component({
  selector: 'app-product-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./product-list-item.component.html',
})
export class ProductListItemComponent {
  @Input() product!: Product;
  @Input() showStars: boolean = true;
  @Input() showButtons: boolean = true;
  @Output() productSelected = new EventEmitter<Product>();
  //product detail
  @Output() productDetailRequested = new EventEmitter<Product>(); // Para ver detalle
  @Output() addToCartRequested = new EventEmitter<Product>();
  @Output() buyNowRequested = new EventEmitter<Product>();

  onViewDetail(): void {
    this.productDetailRequested.emit(this.product);
  }

  onAddToCart(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    //emitir el producto al componente padre - product list component
    this.addToCartRequested.emit(this.product);
  }
  onBuyNow(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.buyNowRequested.emit(this.product);
  }

  onProductSelect(): void {
    this.productSelected.emit(this.product);
  }
}
