import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rent } from './models/rent.model';
import { environment } from './enviroment';
@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl: string;
  private API_ROUTE = '/api/rent';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {

    if (isPlatformServer(this.platformId)) {
        // Opción 1: Cuando corre en el servidor (SSR/Docker), usa el nombre del servicio Docker
        // Nota: Asumo que el endpoint completo es '/api/reservation'
        this.apiUrl = `http://backend:8080${this.API_ROUTE}`;
    } else {
        // Opción 2: Cuando corre en el navegador (Browser/Client), usa la ruta relativa.
        // Esto permite que el proxy (si lo tienes) o el Nginx/Ingress redireccione la llamada
        // al backend, sin depender de 'localhost'.
        this.apiUrl = this.API_ROUTE;
    }
  }
  /*constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.apiUrl = isPlatformServer(this.platformId)
    ? 'http://spring-backend:8080/api/rent'
    : 'http://localhost:8080/api/rent';
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

    this.apiUrl = baseUrl + '/rent'; // O '/field' si es el FieldService
  }*/

  getAll(): Observable<Rent[]> {
    return this.http.get<Rent[]>(this.apiUrl);
  }

  getById(id: number): Observable<Rent> {
    return this.http.get<Rent>(`${this.apiUrl}/${id}`);
  }

  create(rent: Rent): Observable<Rent> {
    return this.http.post<Rent>(this.apiUrl, rent);
  }

  update(id: number, rent: Rent): Observable<Rent> {
    return this.http.put<Rent>(`${this.apiUrl}/${id}`, rent);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
