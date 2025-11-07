import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employeer } from './models/employee.model';
import { environment } from './enviroment';
@Injectable({
  providedIn: 'root',
})
export class EmployeerService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.apiUrl = isPlatformServer(this.platformId)
    ? 'http://spring-backend:8080/api/employee'
    : 'http://localhost:8080/api/employee';
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

    this.apiUrl = baseUrl + '/employee'; // O '/field' si es el FieldService
  }*/

  getAll(): Observable<Employeer[]> {
    return this.http.get<Employeer[]>(this.apiUrl);
  }

  getById(id: number): Observable<Employeer> {
    return this.http.get<Employeer>(`${this.apiUrl}/${id}`);
  }

  create(employee: Employeer): Observable<Employeer> {
    return this.http.post<Employeer>(this.apiUrl, employee);
  }

  update(id: number, employee: Employeer): Observable<Employeer> {
    return this.http.put<Employeer>(`${this.apiUrl}/${id}`, employee);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
