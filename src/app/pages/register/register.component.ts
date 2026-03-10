import { Component, inject } from '@angular/core';
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.pattern('^[0-9]{7,15}$')]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      const { fullName, email, telephone, password, confirmPassword } =
        this.registerForm.value;

      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }

      const registerData: RegisterData = {
        fullName,
        email,
        telephone,
        password,
      };

      this.authService.signup(registerData).subscribe({
        next: () => {
          // Cargar carrito del backend al registrarse
          this.store.dispatch(
            CartActions.loadCart({ userId: this.authService.userId()! }),
          );
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error en registro:', error);
        },
      });
    }
  }
}
