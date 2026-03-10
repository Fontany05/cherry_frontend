import { createReducer, on } from '@ngrx/store';
import * as CartActions from './cart.actions';
import { Cart } from 'src/interfaces/cart.interface';

export interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

const emptyCart: Cart = {
  _id: '',
  userId: '',
  items: [],
  subtotal: 0,
  shippingCost: 0,
  total: 0,
};

const getInitialCart = (): Cart => {
  const saved = localStorage.getItem('shopping_cart');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return emptyCart;
    }
  }
  return emptyCart;
};

export const initialState: CartState = {
  cart: getInitialCart(),
  loading: false,
  error: null,
};

export const cartReducer = createReducer(
  initialState,

  on(CartActions.loadCart, (state) => ({ ...state, loading: true })),

  on(CartActions.loadCartSuccess, (state, { cart }) => {
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
    return { ...state, cart, loading: false };
  }),

  // Solo pone loading true, el effect hace el trabajo
  on(CartActions.addItem, (state) => ({ ...state, loading: true })),

  on(CartActions.addItemSuccess, (state, { cart }) => {
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
    return { ...state, cart, loading: false };
  }),

  // Solo pone loading true, el effect hace el trabajo
  on(CartActions.incrementQuantity, (state) => ({ ...state, loading: true })),
  on(CartActions.decrementQuantity, (state) => ({ ...state, loading: true })),
  on(CartActions.removeItem, (state) => ({ ...state, loading: true })),
  on(CartActions.clearCart, (state) => ({ ...state, loading: true })),

  on(CartActions.loadCartFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),
);