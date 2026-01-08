import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Product } from 'src/interfaces/product.inteface';
import { ProductsService } from 'src/app/services/product/product.service';
import { ProductListComponent } from '../product-list/product-list.component';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, ProductListComponent],
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.css'],
})
export class FeaturedProductsComponent implements OnInit {
  featuredProducts = signal<Product[]>([]);
  productService = inject(ProductsService);
  loading = this.productService.loading$;

  ngOnInit() {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts() {
    this.productService.getFeaturedProducts().subscribe({
      next: (products: Product[]) => {
        this.featuredProducts.set(products);
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
      }
    });
  }
}