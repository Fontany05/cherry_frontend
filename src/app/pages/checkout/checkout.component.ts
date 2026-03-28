import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  loadStripe,
  Stripe,
  StripeElements,
  StripeCardElement,
} from '@stripe/stripe-js';
import { environment } from '@environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { selectCartData } from 'src/app/store/cart/cart.selectors';
import * as CartActions from 'src/app/store/cart/cart.actions';
import { Cart } from 'src/interfaces/cart.interface';
import { ShippingAddress } from 'src/interfaces/payment.interface';
import { UserService } from 'src/app/services/user/user.service';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private store = inject(Store);
  private authService = inject(AuthService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  // Pasos del stepper
  currentStep = signal(1);

  // Estado del pago
  loading = signal(false);
  error = signal<string | null>(null);
  orderId = signal<string | null>(null);
  clientSecret = signal<string | null>(null);
  paymentIntentId = signal<string | null>(null);

  // Stripe
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private cardElement: StripeCardElement | null = null;

  // Carrito
  cart = this.store.selectSignal(selectCartData);

  // Formulario de dirección
  shippingForm: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: [''],
    zipCode: ['', Validators.required],
    country: ['Argentina', Validators.required],
    phone: ['', Validators.required],
    notes: [''],
  });

  async ngOnInit(): Promise<void> {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/register']);
      return;
    }

    const cart = this.cart();
    if (!cart || cart.items.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    // Cargar perfil del usuario
    this.userService.getProfile().subscribe({
      next: (res) => {
        this.shippingForm.patchValue({
          fullName: res.data.fullName || '',
          phone: res.data.telephone || '',
          address: res.data.address || '',
        });
      },
      error: (err) => {
        console.log('Error profile:', err.status);
      },
    });

    // Inicializar Stripe
    this.stripe = await loadStripe(environment.stripePublicKey);
  }

  // Paso 1 → Paso 2: guardar dirección y crear payment intent
  async goToPayment(): Promise<void> {
    if (this.shippingForm.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    const cart = this.cart() as Cart;
    const shippingAddress: ShippingAddress = this.shippingForm.value;

    const items = cart.items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      brand: item.productId.brand,
      image: item.productId.image,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    }));

    this.paymentService
      .createPaymentIntent({
        userId: this.authService.userId()!,
        items,
        shippingAddress,
      })
      .subscribe({
        next: (res) => {
          this.clientSecret.set(res.data.client_secret);
          this.orderId.set(res.data.orderId);
          this.currentStep.set(2);
          this.loading.set(false);
          setTimeout(() => this.mountCardElement(), 100);
        },
        error: (err) => {
          this.error.set('Error al crear el pago. Intentá de nuevo.');
          this.loading.set(false);
        },
      });
  }

  // Montar el formulario de tarjeta de Stripe
  mountCardElement(): void {
    if (!this.stripe) return;

    this.elements = this.stripe.elements();
    this.cardElement = this.elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#374151',
          '::placeholder': { color: '#9CA3AF' },
        },
      },
    });
    this.cardElement.mount('#card-element');
  }

  // Paso 2 → Confirmar pago
  async confirmPayment(): Promise<void> {
    if (!this.stripe || !this.cardElement || !this.clientSecret()) return;

    this.loading.set(true);
    this.error.set(null);

    const { error, paymentIntent } = await this.stripe.confirmCardPayment(
      this.clientSecret()!,
      { payment_method: { card: this.cardElement } },
    );

    if (error) {
      this.error.set(error.message || 'Error al procesar el pago.');
      this.loading.set(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      this.paymentIntentId.set(paymentIntent.id);
      this.store.dispatch(CartActions.clearCart());
      this.currentStep.set(3);
      this.loading.set(false);
    }
  }

  // Volver al paso anterior
  goBack(): void {
    this.currentStep.update((step) => step - 1);
  }

  // Ir a productos al finalizar
  goToProducts(): void {
    this.router.navigate(['/products']);
  }
}
