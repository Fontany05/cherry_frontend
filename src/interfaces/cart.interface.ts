export interface CartItem {
  productId: string;
  name: string;    
  brand: string;   
  image: string;   
  price: number;
  quantity: number;
  _id?: string;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
}

export interface CartResponse {
  error: boolean;
  data: Cart;
}