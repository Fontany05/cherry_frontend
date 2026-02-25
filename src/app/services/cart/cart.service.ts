import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { CartResponse } from 'src/interfaces/cart.interface';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/carts`;

  // Obtener carrito 
  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.apiUrl}`, {
      withCredentials: true 
    });
  }

  // 2. Actualizar cantidad e
  updateQuantity(productId: string, quantity: number): Observable<CartResponse> {
    return this.http.put<CartResponse>(
      `${this.apiUrl}/update`, 
      { productId, quantity }, 
      { withCredentials: true }  
    );
  }

  // Eliminar producto 
  removeFromCart(productId: string): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.apiUrl}/remove`, {
      body: { productId },
      withCredentials: true
    });
  }

  // Vaciar carrito 
  clearCart(): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.apiUrl}/clear`, {
      withCredentials: true
    });
  }
}