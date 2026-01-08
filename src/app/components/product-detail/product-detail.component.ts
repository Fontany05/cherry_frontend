import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from 'src/app/services/product/product.service';
import { Product } from 'src/interfaces/product.inteface';
import { Store } from '@ngrx/store';
import { selectCartData } from 'src/app/store/cart/cart.selectors';
import * as CartActions from 'src/app/store/cart/cart.actions';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  private store = inject(Store);

  // Estado local para almacenar el producto
  public product = signal<Product | null>(null);
  
  // Estado para controlar si mostramos la confirmación (si lo usabas antes)
  public showConfirmation = signal(false);

  public cart = this.store.selectSignal(selectCartData);

  // Acceso a las señales del servicio
  readonly loading = this.productsService.loading;
  readonly error = this.productsService.error;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const productId = params.get('id');
      if (productId) {
        this.productsService.error.set(null);
        this.loadProductDetail(productId);
      }
    });
  }

  loadProductDetail(id: string): void {
    this.productsService.getProductDetailById(id).subscribe({
      next: (productData) => {
        this.product.set(productData);
      },
      error: () => {
        console.log('Error al cargar el detalle');
      },
    });
  }

  onAddToCart() {
    const currentProduct = this.product();
    
    if (currentProduct) {
      // 1. DISPARAR LA ACCIÓN AL STORE
      this.store.dispatch(CartActions.addItem({ 
        product: currentProduct, 
        quantity: 1 
      }));

      alert(`${currentProduct.name} ha sido añadido al carrito`);
      this.showConfirmation.set(true);

      // Opcional: Ocultar el mensaje automáticamente tras 3 segundos
      setTimeout(() => this.showConfirmation.set(false), 3000);
    }
  }
  continueShopping() {
    this.showConfirmation.set(false);
  }
}