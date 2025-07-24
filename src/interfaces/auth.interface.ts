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
