import { createReducer, on } from '@ngrx/store';
import * as CartActions from './cart.actions';
import { Cart, CartItem } from 'src/interfaces/cart.interface';

export interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

// Objeto base para tipado estricto
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

  // --- AGREGAR PRODUCTO (Maneja el objeto productId) ---
  on(CartActions.addItem, (state, { product, quantity }) => {
    const currentCart = state.cart || emptyCart;

    const existingItemIndex = currentCart.items.findIndex(
      (item) => item.productId._id === product._id
    );

    let updatedItems: CartItem[];

    if (existingItemIndex > -1) {
      updatedItems = currentCart.items.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedItems = [
        ...currentCart.items,
        {
          productId: {
            _id: product._id,
            name: product.name,
            brand: product.brand,
            image: product.image,
          },
          price: product.price,
          quantity: quantity,
        },
      ];
    }

    const subtotal = updatedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const updatedCart: Cart = {
      ...currentCart,
      items: updatedItems,
      subtotal: subtotal,
      total: subtotal + (currentCart.shippingCost || 0),
    };

    localStorage.setItem('shopping_cart', JSON.stringify(updatedCart));
    return { ...state, cart: updatedCart, loading: false };
  }),

  // --- INCREMENTAR CANTIDAD (Botón +) ---
  on(CartActions.incrementQuantity, (state, { productId }) => {
    if (!state.cart) return state;

    const updatedItems = state.cart.items.map((item) =>
      item.productId._id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    const subtotal = updatedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const updatedCart: Cart = {
      ...state.cart,
      items: updatedItems,
      subtotal: subtotal,
      total: subtotal + (state.cart.shippingCost || 0),
    };

    localStorage.setItem('shopping_cart', JSON.stringify(updatedCart));
    return { ...state, cart: updatedCart };
  }),

  // --- DECREMENTAR CANTIDAD (Botón -) ---
  on(CartActions.decrementQuantity, (state, { productId }) => {
    if (!state.cart) return state;

    const updatedItems = state.cart.items.map((item) => {
      if (item.productId._id === productId) {
        // Restar pero nunca menos de 1
        return { ...item, quantity: Math.max(item.quantity - 1, 1) };
      }
      return item;
    });

    const subtotal = updatedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const updatedCart: Cart = {
      ...state.cart,
      items: updatedItems,
      subtotal,
      total: subtotal + (state.cart.shippingCost || 0),
    };

    localStorage.setItem('shopping_cart', JSON.stringify(updatedCart));
    return { ...state, cart: updatedCart };
  }),

  // --- ELIMINAR PRODUCTO ---
  on(CartActions.removeItem, (state, { productId }) => {
    if (!state.cart) return state;

    const updatedItems = state.cart.items.filter(
      (item) => item.productId._id !== productId
    );

    const subtotal = updatedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const updatedCart: Cart = {
      ...state.cart,
      items: updatedItems,
      subtotal: subtotal,
      total: subtotal + (state.cart.shippingCost || 0),
    };

    localStorage.setItem('shopping_cart', JSON.stringify(updatedCart));
    return { ...state, cart: updatedCart };
  }),

  // --- VACIAR CARRITO ---
  on(CartActions.clearCart, (state) => {
    localStorage.removeItem('shopping_cart');
    return { ...state, cart: emptyCart };
  })
);
