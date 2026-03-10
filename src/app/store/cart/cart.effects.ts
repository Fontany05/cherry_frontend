import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CartService } from 'src/app/services/cart/cart.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Store } from '@ngrx/store';
import * as CartActions from './cart.actions';
import { selectCartData } from './cart.selectors';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private store = inject(Store);

  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      mergeMap(() =>
        this.cartService.getCart().pipe(
          map((res) => CartActions.loadCartSuccess({ cart: res.data })),
          catchError((err) =>
            of(CartActions.loadCartFailure({ error: err.message })),
          ),
        ),
      ),
    ),
  );

  addItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addItem),
      mergeMap((action) => {
        const userId = this.authService.userId();

        if (!userId || userId === 'null') {
          const localData = localStorage.getItem('cart_local');
          let cart = localData
            ? JSON.parse(localData)
            : { items: [], subtotal: 0, total: 0, shippingCost: 0 };

          const existingItem = cart.items.find(
            (item: any) => item.productId._id === action.product._id,
          );

          if (existingItem) {
            existingItem.quantity += action.quantity;
          } else {
            cart.items.push({
              productId: action.product,
              quantity: action.quantity,
              price: action.product.price,
            });
          }

          cart.subtotal = cart.items.reduce(
            (acc: number, item: any) => acc + item.price * item.quantity,
            0,
          );
          cart.total = cart.subtotal + (cart.shippingCost || 0);

          localStorage.setItem('cart_local', JSON.stringify(cart));
          return of(CartActions.addItemSuccess({ cart }));
        }

        return this.cartService
          .addToCart(action.product._id, action.quantity, action.product.price)
          .pipe(
            map((res) => CartActions.addItemSuccess({ cart: res.data })),
            catchError((err) =>
              of(CartActions.addItemFailure({ error: err.message })),
            ),
          );
      }),
    ),
  );

  updateQty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.incrementQuantity, CartActions.decrementQuantity),
      withLatestFrom(this.store.select(selectCartData)),
      mergeMap(([action, cart]) => {
        const userId = this.authService.userId();

        if (!userId || userId === 'null') {
          const localData = localStorage.getItem('cart_local');
          let localCart = localData ? JSON.parse(localData) : null;

          if (localCart) {
            localCart.items = localCart.items.map((item: any) => {
              if (item.productId._id === action.productId) {
                const change = action.type === '[Cart] Increment Quantity' ? 1 : -1;
                return { ...item, quantity: Math.max(1, item.quantity + change) };
              }
              return item;
            });

            localCart.subtotal = localCart.items.reduce(
              (acc: number, item: any) => acc + item.price * item.quantity, 0,
            );
            localCart.total = localCart.subtotal + (localCart.shippingCost || 0);

            localStorage.setItem('cart_local', JSON.stringify(localCart));
            return of(CartActions.loadCartSuccess({ cart: localCart }));
          }
          return of(CartActions.loadCartFailure({ error: 'Carrito local no encontrado' }));
        }

        // LOGUEADO: calcular cantidad final
        const currentItem = cart?.items.find(
          (item) => item.productId._id === action.productId
        );
        const currentQty = currentItem?.quantity || 1;
        const change = action.type === '[Cart] Increment Quantity' ? 1 : -1;
        const newQuantity = Math.max(1, currentQty + change);

        return this.cartService.updateQuantity(action.productId, newQuantity).pipe(
          map((res) => CartActions.loadCartSuccess({ cart: res.data })),
          catchError((err) =>
            of(CartActions.loadCartFailure({ error: err.message })),
          ),
        );
      }),
    ),
  );

  removeItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.removeItem),
      mergeMap((action) => {
        const userId = this.authService.userId();

        if (!userId || userId === 'null') {
          const localData = localStorage.getItem('cart_local');
          const cart = localData ? JSON.parse(localData) : null;
          if (cart) {
            cart.items = cart.items.filter(
              (item: any) => item.productId._id !== action.productId
            );
            cart.subtotal = cart.items.reduce(
              (acc: number, item: any) => acc + item.price * item.quantity, 0
            );
            cart.total = cart.subtotal + (cart.shippingCost || 0);
            localStorage.setItem('cart_local', JSON.stringify(cart));
            return of(CartActions.loadCartSuccess({ cart }));
          }
          return of(CartActions.loadCartFailure({ error: 'Carrito no encontrado' }));
        }

        return this.cartService.removeFromCart(action.productId).pipe(
          map((res) => CartActions.loadCartSuccess({ cart: res.data })),
          catchError((err) =>
            of(CartActions.loadCartFailure({ error: err.message })),
          ),
        );
      }),
    ),
  );

  clearCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.clearCart),
      mergeMap(() => {
        const userId = this.authService.userId();

        if (!userId || userId === 'null') {
          localStorage.removeItem('cart_local');
          return of(CartActions.loadCartSuccess({
            cart: { _id: '', userId: '', items: [], subtotal: 0, shippingCost: 0, total: 0 }
          }));
        }

        return this.cartService.clearCart().pipe(
          map((res) => CartActions.loadCartSuccess({ cart: res.data })),
          catchError((err) =>
            of(CartActions.loadCartFailure({ error: err.message })),
          ),
        );
      }),
    ),
  );
}