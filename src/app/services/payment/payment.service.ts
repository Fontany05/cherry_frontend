import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { 
  CreatePaymentIntentRequest, 
  CreatePaymentIntentResponse,
  ConfirmPaymentResponse,
} from 'src/interfaces/payment.interface';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/payments`;

  createPaymentIntent(payload: CreatePaymentIntentRequest): Observable<CreatePaymentIntentResponse> {
    return this.http.post<CreatePaymentIntentResponse>(
      `${this.apiUrl}/create-intent`, 
      payload,
      { withCredentials: true }
    );
  }

  confirmPayment(paymentIntentId: string): Observable<ConfirmPaymentResponse> {
    return this.http.post<ConfirmPaymentResponse>(
      `${this.apiUrl}/confirm`,
      { paymentIntentId },
      { withCredentials: true }
    );
  }

  cancelPayment(paymentIntentId: string): Observable<ConfirmPaymentResponse> {
    return this.http.post<ConfirmPaymentResponse>(
      `${this.apiUrl}/cancel`,
      { paymentIntentId },
      { withCredentials: true }
    );
  }
}