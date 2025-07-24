import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router'; // Para redirigir después del registro
import { RegisterData } from 'src/interfaces/auth.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export default class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    //private router: Router // Para navegación
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
      const { fullName, email, telephone, password, confirmPassword } = this.registerForm.value;

      // Validar que las contraseñas coincidan
      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }

      // Crear objeto tipado con la interfaz
      const registerData: RegisterData = {
        fullName,
        email,
        telephone,
        password,
      };

      this.authService.signup(registerData).subscribe({
        next: response => {
          console.log('Respuesta del backend:', response);
          // Aquí puedes guardar token o redirigir
          // Ejemplo:
          // localStorage.setItem('token', response.token);
          //ejemplo: this.router.navigate(['/login']); // O donde quieras redirigir
        },
        error: error => {
          console.error('Error en registro:', error);
          // Mostrar mensaje de error al usuario
        }
      });
    }
  }
}