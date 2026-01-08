// store/cart/cart.actions.ts
import { createAction, props } from '@ngrx/store';
import { Cart } from 'src/interfaces/cart.interface';
import { Product } from 'src/interfaces/product.inteface';

// intención: Quiero agregar un producto
export const addItem = createAction(
  '[Cart] Add Item',
  props<{ product: Product; quantity: number }>()
);

// con éxito: Node o LocalStorage ya guardaron el producto y aquí está el nuevo carrito
export const addItemSuccess = createAction(
  '[Cart] Add Item Success',
  props<{ cart: Cart }>()
);

export const addItemFailure = createAction(
  '[Cart] Add Item Failure',
  props<{ error: string }>() 
);

//incrementar product en carro
export const incrementQuantity = createAction(
  '[Cart] Increment Quantity',
  props<{ productId: string }>()
);

//dicrementar product en carro
export const decrementQuantity = createAction(
  '[Cart] Decrement Quantity',
  props<{ productId: string }>()
);

// Acción para eliminar un solo producto
export const removeItem = createAction(
  '[Cart] Remove Item',
  props<{ productId: string }>()
);

// Acción para vaciar todo el carrito
export const clearCart = createAction('[Cart] Clear Cart');


//Iniciar la carga desde la API
export const loadCart = createAction(
  '[Cart] Load Cart',
  props<{ userId: string }>()
);

//Cuando la API responde con éxito
export const loadCartSuccess = createAction(
  '[Cart] Load Cart Success',
  props<{ cart: Cart }>()
);

//Si la API falla
export const loadCartFailure = createAction(
  '[Cart] Load Cart Failure',
  props<{ error: string }>()
);