import { Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListItemComponent } from './product-list-item/product-list-item.component';
import type { Product } from 'src/interfaces/product.inteface';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductListItemComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  @Input() products: Product[] = [];
  @Input() title?: string;
  @Input() showButtons: boolean = true;
  @Input() showStars: boolean = false;
  
}