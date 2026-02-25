import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CartService } from 'src/app/services/cart/cart.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as CartActions from './cart.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      mergeMap(() =>
        this.cartService.getCart().pipe( // Llamada limpia sin userId
          map((res) => CartActions.loadCartSuccess({ cart: res.data })),
          catchError((err) =>
            of(CartActions.loadCartFailure({ error: err.message }))
          )
        )
      )
    )
  );

  updateQty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.incrementQuantity, CartActions.decrementQuantity),
      mergeMap((action) => {
        const userId = this.authService.userId();

        // SI ES ANÓNIMO: Manejamos el LocalStorage (Tu lógica intacta)
        if (!userId || userId === 'null') {
          const localData = localStorage.getItem('cart_local');
          let cart = localData ? JSON.parse(localData) : null;

          if (cart) {
            cart.items = cart.items.map((item: any) => {
              if (item.productId._id === action.productId) {
                const change = action.type === '[Cart] Increment Quantity' ? 1 : -1;
                return {
                  ...item,
                  quantity: Math.max(1, item.quantity + change),
                };
              }
              return item;
            });

            cart.subtotal = cart.items.reduce(
              (acc: number, item: any) => acc + item.price * item.quantity,
              0
            );
            cart.total = cart.subtotal + (cart.shippingCost || 0);

            localStorage.setItem('cart_local', JSON.stringify(cart));
            return of(CartActions.loadCartSuccess({ cart }));
          }
          return of(CartActions.loadCartFailure({ error: 'Carrito local no encontrado' }));
        }

        // SI ESTÁ LOGUEADO
        // Calculamos la nueva cantidad (esto depende de cómo reciba tu backend el update)
        // Si el backend recibe "incremento (+1 o -1)", pasamos el cambio.
        // Si el backend recibe "cantidad final", hay que buscar la cantidad actual.
        
        const change = action.type === '[Cart] Increment Quantity' ? 1 : -1;
        
        return this.cartService
          .updateQuantity(action.productId, change) 
          .pipe(
            map((res) => CartActions.loadCartSuccess({ cart: res.data })),
            catchError((err) =>
              of(CartActions.loadCartFailure({ error: err.message }))
            )
          );
      })
    )
  );
}