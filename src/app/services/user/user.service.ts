import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

export interface UserProfile {
  fullName: string;
  email: string;
  address?: string;
  telephone?: string;
}

export interface UserProfileResponse {
  error: boolean;
  data: UserProfile;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getProfile(): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${this.apiUrl}/profile`, {
      withCredentials: true,
    });
  }
}
