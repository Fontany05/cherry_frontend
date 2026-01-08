import { createReducer, on } from '@ngrx/store';
import * as CartActions from './cart.actions';
import { Cart } from 'src/interfaces/cart.interface';

export interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

// Función para recuperar datos del LocalStorage al arrancar
const getInitialCart = (): Cart => {
  const saved = localStorage.getItem('shopping_cart');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return { items: [], total: 0 } as any;
    }
  }
  // Retornamos un objeto que cumpla mínimamente con la interfaz usando 'as any'
  return { items: [], total: 0 } as any;
};

export const initialState: CartState = {
  cart: getInitialCart(),
  loading: false,
  error: null,
};

export const cartReducer = createReducer(
  initialState,

  // --- CARGAR CARRITO (Desde la API) ---
  on(CartActions.loadCart, (state) => ({
    ...state,
    loading: true,
  })),

  on(CartActions.loadCartSuccess, (state, { cart }) => {
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
    return { ...state, cart, loading: false };
  }),

  // --- AGREGAR PRODUCTO (Híbrido) ---
  on(CartActions.addItem, (state, { product, quantity }) => {
    const currentCart = state.cart || { items: [], total: 0 };
    
    // Buscamos si el producto ya existe
    const existingItemIndex = currentCart.items.findIndex(
      (item) => item._id === product._id || item.productId === product._id
    );

    let updatedItems;

    if (existingItemIndex > -1) {
      updatedItems = currentCart.items.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // IMPORTANTE: Mapeamos 'productId' para cumplir con tu interfaz CartItem
      updatedItems = [
        ...currentCart.items,
        {
          ...product,
          productId: product._id, // Requerido por tu interfaz
          quantity: quantity
        },
      ];
    }

    const updatedTotal = updatedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Creamos el objeto Cart con las propiedades mínimas que pide tu interfaz
    const updatedCart: Cart = {
      ...currentCart, // Mantenemos IDs o userId si existieran
      items: updatedItems,
      total: updatedTotal,
      subtotal: updatedTotal,   // Requerido por tu interfaz
      shippingCost: 0,          // Requerido por tu interfaz
    } as any;

    localStorage.setItem('shopping_cart', JSON.stringify(updatedCart));

    return {
      ...state,
      cart: updatedCart,
      loading: false,
    };
  }),

  // --- ÉXITO AL AGREGAR (Sincronización con API) ---
  on(CartActions.addItemSuccess, (state, { cart }) => {
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
    return { ...state, cart, loading: false };
  }),

  // --- ELIMINAR PRODUCTO ---
  on(CartActions.removeItem, (state, { productId }) => {
    if (!state.cart) return state;

    const updatedItems = state.cart.items.filter(
      (item) => item._id !== productId && item.productId !== productId
    );
    
    const updatedTotal = updatedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const updatedCart = {
      ...state.cart,
      items: updatedItems,
      total: updatedTotal,
      subtotal: updatedTotal
    } as any;

    localStorage.setItem('shopping_cart', JSON.stringify(updatedCart));
    return { ...state, cart: updatedCart };
  }),
  

  // --- VACIAR TODO ---
  on(CartActions.clearCart, (state) => {
    localStorage.removeItem('shopping_cart');
    return {
      ...state,
      cart: { items: [], total: 0 } as any,
    };
  })
);