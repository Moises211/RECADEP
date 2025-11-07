import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from './models/users.model';
import { environment } from './enviroment';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.apiUrl = isPlatformServer(this.platformId)
    ? 'http://spring-backend:8080/api/users'
    : 'http://localhost:8080/api/users';
  }
  /*constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    let baseUrl: string;

    // 1. Si estamos en el Servidor (SSR/Node.js)
    if (isPlatformServer(this.platformId)) {
      baseUrl = environment.springDocker;

      // 2. Si NO estamos en el servidor, usamos una verificación SEGURA.
      // Solo accedemos a window si typeof window es 'object' (es decir, existe)
    } else if (typeof window !== 'undefined') {
      // Si estamos aquí, sabemos que estamos en el navegador.
      const isDocker = window.location.hostname !== 'localhost';

      baseUrl = isDocker
        ? environment.springHostBridge
        : environment.springLocal;
    } else {
      // Si no es SSR ni el navegador (ej. pruebas unitarias), usamos local
      baseUrl = environment.springLocal;
    }

    this.apiUrl = baseUrl + '/users'; // O '/field' si es el FieldService
  }*/

  getAll(): Observable<Users[]> {
    return this.http.get<Users[]>(this.apiUrl);
  }

  getById(id: number): Observable<Users> {
    return this.http.get<Users>(`${this.apiUrl}/${id}`);
  }

  create(users: Users): Observable<Users> {
    return this.http.post<Users>(this.apiUrl, users);
  }

  update(id: number, users: Users): Observable<Users> {
    return this.http.put<Users>(`${this.apiUrl}/${id}`, users);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Nuevo método para sincronizar usuario con el backend por Auth0 con correo
  sincronizarUsuario(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/sync`, {});
  }

  getUserByEmail(email: string): Observable<Users> {
    return this.http.get<Users>(`${this.apiUrl}/by-email?email=${email}`);
  }
}
