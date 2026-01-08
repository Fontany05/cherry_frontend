import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';

// 1. Seleccionamos la porción completa del estado llamada 'cart'
export const selectCartState = createFeatureSelector<CartState>('cart');

// 2. Selector para los datos del carrito (items, total, etc.)
export const selectCartData = createSelector(
  selectCartState,
  (state) => state.cart
);

// 3. Selector para el estado de carga (el spinner)
export const selectIsLoading = createSelector(
  selectCartState,
  (state) => state.loading
);

// 4. Selector para el mensaje de error (lo que faltaba)
export const selectError = createSelector(
  selectCartState,
  (state) => state.error
);