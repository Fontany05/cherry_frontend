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

    if (userId && userId !== 'null') {
      // Si hay usuario, pedimos al servidor
      this.store.dispatch(CartActions.loadCart({ userId }));
    } else {
      // SI ES ANÓNIMO: Buscamos en el bolsillo del navegador
      const savedCart = localStorage.getItem('cart_local');
      if (savedCart) {
        this.store.dispatch(
          CartActions.loadCartSuccess({ cart: JSON.parse(savedCart) })
        );
      }
    }
  }

  increaseQuantity(item: CartItem): void {
    // Enviamos el ._id que es lo que espera la Action
    this.store.dispatch(
      CartActions.incrementQuantity({ productId: item.productId._id })
    );
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.store.dispatch(
        CartActions.decrementQuantity({ productId: item.productId._id })
      );
    } else {
      // Si es 1, llamamos a borrar pasando el string del ID
      this.removeProduct(item.productId._id);
    }
  }

  removeProduct(productId: string): void {
    // Aquí ya recibimos el string desde el HTML o desde decreaseQuantity
    this.store.dispatch(CartActions.removeItem({ productId }));
  }
 

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

   //chequear carro, si esta vacio
  get isCartEmpty(): boolean {
  const cart = this.cart();
  return !cart || cart.items.length === 0;
}

}
