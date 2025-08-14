import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/product/product.service';
import { ProductListComponent } from 'src/app/components/product-list/product-list.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductListComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export default class ProductComponent implements OnInit {
  constructor(public productsService: ProductsService) {}

  ngOnInit() {
    this.productsService.getProducts();
  }
}
