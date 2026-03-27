import { Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { LoginData } from 'src/interfaces/auth.interface';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import * as CartActions from 'src/app/store/cart/cart.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  private store = inject(Store);
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);

    const loginData: LoginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService.signin(loginData).subscribe({
      next: () => {
        this.store.dispatch(
          CartActions.loadCart({ userId: this.authService.userId()! }),
        );
        this.router.navigate(['/products']);
      },
      error: (error) => {
        if (error.status === 404) {
          this.errorMessage.set('User not found');
        } else if (error.status === 401) {
          this.errorMessage.set('Invalid password');
        } else {
          this.errorMessage.set('An error occurred. Please try again.');
        }
      },
    });
  }
}
