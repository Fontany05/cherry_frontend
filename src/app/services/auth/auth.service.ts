import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import type { LoginData, RegisterData, AuthResponse, LogoutResponse } from 'src/interfaces/auth.interface';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  public isAuthenticated = signal(false);
  public userId = signal<string | null>(null);

  constructor(private http: HttpClient) {
    this.checkAuth();
  }

  // Verificar si está autenticado (chequea si la cookie existe)
  checkAuth(): void {
    const hasToken = document.cookie.includes('access_token');
    this.isAuthenticated.set(!!hasToken);
  }

  // Login
  signin(credentials: LoginData): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/signin`, credentials, {
    withCredentials: true,
  }).pipe(
    tap((response) => {
      if (!response.error) {
        this.isAuthenticated.set(true);
        const token = response.data.token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userId.set(payload.id);
      }
    })
  );
}
//register
signup(credentials: RegisterData): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, credentials, {
    withCredentials: true,
  }).pipe(
    tap((response) => {
      if (!response.error) {
        this.isAuthenticated.set(true);
        const token = response.data.token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userId.set(payload.id);
      }
    })
  );
}

  // Logout
  logout(): Observable<LogoutResponse> {
  return this.http.post<LogoutResponse>(`${this.apiUrl}/logout`, {}, {
    withCredentials: true,
  }).pipe(
    tap(() => {
      this.isAuthenticated.set(false);
      this.userId.set(null);
    })
  );
}
}