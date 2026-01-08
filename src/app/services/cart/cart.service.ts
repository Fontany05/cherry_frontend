import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { CartResponse } from 'src/interfaces/cart.interface';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/carts`;


  getCart(userId: string): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.apiUrl}/${userId}`);
  }

  // Este método servirá tanto para añadir como para actualizar cantidad
  updateQuantity(userId: string, productId: string, quantity: number): Observable<CartResponse> {
    return this.http.put<CartResponse>(`${this.apiUrl}/${userId}/update`, {
      productId,
      quantity,
    });
  }

  removeFromCart(userId: string, productId: string): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.apiUrl}/${userId}/remove`, {
      body: { productId },
    });
  }

  clearCart(userId: string): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.apiUrl}/${userId}/clear`);
  }
}