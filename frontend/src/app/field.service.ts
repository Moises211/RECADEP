import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Field } from './models/field.model';
import { environment } from './enviroment';
@Injectable({
  providedIn: 'root',
})
export class FieldService {
  private apiUrl: string;
  private API_ROUTE = '/api/field';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {

    if (isPlatformServer(this.platformId)) {

        this.apiUrl = `http://backend:8080${this.API_ROUTE}`;
    } else {

        this.apiUrl = this.API_ROUTE;
    }
  }
  /*constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.apiUrl = isPlatformServer(this.platformId)
    ? 'http://spring-backend:8080/api/field'
    : 'http://localhost:8080/api/field';
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

    this.apiUrl = baseUrl + '/field'; // O '/field' si es el FieldService
  }*/

  getAll(): Observable<Field[]> {
    return this.http.get<Field[]>(this.apiUrl);
  }

  getById(id: number): Observable<Field> {
    return this.http.get<Field>(`${this.apiUrl}/${id}`);
  }

  create(field: Field): Observable<Field> {
    return this.http.post<Field>(this.apiUrl, field);
  }

  update(id: number, field: Field): Observable<Field> {
    return this.http.put<Field>(`${this.apiUrl}/${id}`, field);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getFieldsByType(fieldType: string): Observable<Field[]> {
    return this.http.get<Field[]>(`${this.apiUrl}/by-type?type=${fieldType}`);
  }
}
