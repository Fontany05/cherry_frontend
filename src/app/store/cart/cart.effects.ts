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
      mergeMap(({ userId }) =>
        this.cartService.getCart(userId).pipe(
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
        const change = action.type === '[Cart] Increment Quantity' ? 1 : -1;
        // Importante: tu servicio debe recibir el cambio o la cantidad final
        return this.cartService
          .updateQuantity(userId!, action.productId, change)
          .pipe(
            map((res) => CartActions.loadCartSuccess({ cart: res.data })),
            catchError((err) =>
              of(CartActions.loadCartFailure({ error: err.message }))
            )
          );
      })
    )
  );

  clearCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.clearCart),
      mergeMap(() => {
        const userId = this.authService.userId();
        return this.cartService.clearCart(userId!).pipe(
          // Al tener éxito, la API suele devolver el carrito vacío
          map((res) => CartActions.loadCartSuccess({ cart: res.data })),
          catchError((error) =>
            of(CartActions.loadCartFailure({ error: error.message }))
          )
        );
      })
    )
  );
}
