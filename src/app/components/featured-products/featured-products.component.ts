import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Product } from 'src/interfaces/product.inteface';
import { ProductsService } from 'src/app/services/product/product.service';
import { ProductListComponent } from '../product-list/product-list.component';

@Component({
  selector: 'app-featured-products',
  imports: [CommonModule, ProductListComponent],
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.css'],
})
export class FeaturedProductsComponent implements OnInit {
  featuredProducts: Product[] = [];
  loading = false;
  private productService = inject(ProductsService);

  ngOnInit() {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts() {
    this.loading = true;
    this.productService.getFeaturedProducts().subscribe({
      next: (products: Product[]) => {
        this.featuredProducts = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
        this.loading = false;
      }
    });
  }
}