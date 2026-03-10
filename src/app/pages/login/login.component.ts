import { Component, inject } from '@angular/core';
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData: LoginData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };

      this.authService.signin(loginData).subscribe({
        next: () => {
          // Cargar carrito del backend al loguearse
          this.store.dispatch(
            CartActions.loadCart({ userId: this.authService.userId()! }),
          );
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error en login:', error);
        },
      });
    }
  }
}
