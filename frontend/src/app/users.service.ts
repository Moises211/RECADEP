import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

// Define la interfaz de usuario (ajusta esto a tu estructura real)
export interface User {
  id?: number;
  email: string;
  name: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private API_ROUTE = '/api/users';
  // En SSR, usa el nombre del servicio Docker para el backend
  private apiUrl = isPlatformServer(this.platformId)
    ? `http://backend:8080${this.API_ROUTE}`
    : this.API_ROUTE;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // ... (otros métodos)

  getUserByEmail(email: string): Observable<User> {
    const isServer = isPlatformServer(this.platformId);

    if (isServer) {
      // 1. Log a warning about SSR, but DO NOT skip the call.
      // 2. The API URL must be the internal Docker network address.
      const url = `${this.apiUrl}/by-email?email=${email}`;
      console.log(`SSR detected: Fetching user from internal API: ${url}`);

      // Perform the actual HTTP call on the server
      return this.http.get<User>(url);
    } else {
      // Client-side logic remains
      return email
        ? this.http.get<User>(`${this.apiUrl}/by-email?email=${email}`)
        : of({ email: '', name: 'guest', roles: [] });
    }
  }
}
