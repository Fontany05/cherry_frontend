import { CartItem } from './cart.interface';

export interface PaymentItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  phone: string;
  notes?: string;
}

export interface CreatePaymentIntentRequest {
  userId: string;
  items: PaymentItem[];
  shippingAddress: ShippingAddress;
}

export interface CreatePaymentIntentResponse {
  error: boolean;
  data: {
    client_secret: string;
    orderId: string;
    total: number;
  };
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
}

export interface ConfirmPaymentResponse {
  error: boolean;
  data: {
    status: string;
    paymentIntent: any;
  };
}
