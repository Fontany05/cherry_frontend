import { Component, OnInit} from '@angular/core';
import { ProductsService } from 'src/app/services/product/product.service';
import { ProductListItemComponent } from './product-list-item/product-list-item.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ CommonModule,ProductListItemComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit{

  constructor(public productsService: ProductsService){}

   ngOnInit() {
    // Llama a getProducts() cuando se inicializa el componente
    this.productsService.getProducts();
  }

  get products(){
      return this.productsService.products()?.data ?? [];
  }
 
}
