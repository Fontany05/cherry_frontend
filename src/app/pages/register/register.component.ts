import { Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { RegisterData } from 'src/interfaces/auth.interface';
import { Store } from '@ngrx/store';
import * as CartActions from 'src/app/store/cart/cart.actions';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  private store = inject(Store);
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.pattern('^[0-9]{7,15}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { fullName, email, telephone, password, confirmPassword } =
      this.registerForm.value;

    if (password !== confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    this.errorMessage.set(null);

    const registerData: RegisterData = {
      fullName,
      email,
      telephone,
      password,
    };

    this.authService.signup(registerData).subscribe({
      next: () => {
        this.store.dispatch(
          CartActions.loadCart({ userId: this.authService.userId()! }),
        );
        this.router.navigate(['/products']);
      },
      error: (error) => {
        if (error.status === 409) {
          this.errorMessage.set('Email already in use');
        } else {
          this.errorMessage.set('An error occurred. Please try again.');
        }
      },
    });
  }
}
