import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { LoginData } from 'src/interfaces/auth.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], 
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router 
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;

      // Crear un objeto que cumple con LoginData
      const loginData: LoginData = {
        email: formValue.email,
        password: formValue.password,
      };

      this.authService.signin(loginData).subscribe({
        next: response => {
          this.router.navigate(['/products']);
        },
        error: error => {
          console.error('Error en login:', error);
          // Mostrar mensaje de error al usuario
        }
      });
    }
  }
}