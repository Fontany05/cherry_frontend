import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
//import { Router } from '@angular/router'; // Asegúrate de importar Router si vas a navegar
import { LoginData } from 'src/interfaces/auth.interfaces';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], 
})
export default class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    //private router: Router // Añade Router si quieres redirigir después del login
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
          console.log('Respuesta del backend:', response);
          // Aquí puedes guardar el token, redirigir, etc.
          // Ejemplo:
          // localStorage.setItem('token', response.token);
          // this.router.navigate(['/dashboard']);
        },
        error: error => {
          console.error('Error en login:', error);
          // Mostrar mensaje de error al usuario
        }
      });
    }
  }
}