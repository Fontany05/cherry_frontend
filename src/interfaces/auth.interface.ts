// auth.models.ts

export interface RegisterData {
  fullName: string;
  email: string;
  telephone?: string; // opcional
  password: string;
  confirmPassword?: string; 
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LogoutResponse {
  error: boolean;
  data: string;
}

export interface AuthResponse {
  error: boolean;
  data: {
    token: string;
  };

  
}