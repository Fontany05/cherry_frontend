import { Component } from '@angular/core';
import { ProductListItemComponent } from './product-list-item/product-list-item.component';

@Component({
  selector: 'app-product-list',
  imports: [ ProductListItemComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',

})
export class ProductListComponent { }
