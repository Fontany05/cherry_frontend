import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Product } from 'src/interfaces/product.inteface';

@Component({
  selector: 'app-product-list-item',
  templateUrl: './product-list-item.component.html',
  imports: [CommonModule],
  standalone: true,
})
export class ProductListItemComponent {
  @Input() product!: Product;
  @Input() showStars: boolean = true;
  @Input() showButtons: boolean = true;
  @Output() productSelected = new EventEmitter<Product>();
}
