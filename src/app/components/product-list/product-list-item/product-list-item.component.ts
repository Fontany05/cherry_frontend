import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importa las interfaces desde tu archivo separado
import { Product } from 'src/interfaces/product.inteface';

@Component({
  selector: 'app-product-list-item',
  templateUrl: './product-list-item.component.html',
  imports: [CommonModule],
  standalone: true
})
export class ProductListItemComponent {
  @Input() product!: Product;
  @Output() productSelected = new EventEmitter<Product>();
}