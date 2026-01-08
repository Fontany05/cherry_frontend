import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // 1. Añadimos Router aquí
import { Store } from '@ngrx/store';

import { AuthService } from 'src/app/services/auth/auth.service';
import * as CartActions from 'src/app/store/cart/cart.actions';
import {
  selectCartData,
  selectIsLoading,
  selectError,
} from 'src/app/store/cart/cart.selectors';
import { CartItem } from 'src/interfaces/cart.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  private store = inject(Store);
  private authService = inject(AuthService);
  private router = inject(Router); // 2. Inyectamos el Router

  public cart = this.store.selectSignal(selectCartData);
  public loading = this.store.selectSignal(selectIsLoading);
  public error = this.store.selectSignal(selectError);

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const userId = this.authService.userId();
    if (userId) {
      this.store.dispatch(CartActions.loadCart({ userId }));
    }
  }

  increaseQuantity(item: CartItem): void {
    this.store.dispatch(
      CartActions.incrementQuantity({ productId: item.productId })
    );
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.store.dispatch(
        CartActions.decrementQuantity({ productId: item.productId })
      );
    } else {
      this.removeProduct(item.productId);
    }
  }

  removeProduct(productId: string): void {
    this.store.dispatch(CartActions.removeItem({ productId }));
  }

  clearCart(): void {
    // Solo disparamos la acción. El Effect y el Reducer hacen el resto.
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      this.store.dispatch(CartActions.clearCart());
    }
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
