import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment.development';
import { LoginData, RegisterData } from 'src/interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  // login
  signin(credentials: LoginData) {
    return this.http.post(`${this.apiUrl}/signin`, credentials, {
      withCredentials: true,
    });
  }
  
  //register
  signup(credentials: RegisterData) {
    return this.http.post(`${this.apiUrl}/signup`, credentials, {
      withCredentials: true,
    });
  }
}