import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Field } from '../models/field.model';
import { environment } from '../enviroment';
@Injectable({
  providedIn: 'root',
})
export class FieldService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.apiUrl = isPlatformServer(this.platformId)
    ? 'http://spring-backend:8080/api/field'
    : 'https://recadep-zox1.onrender.com/api/field'
      //'http://localhost:8080/api/field';
  }
  /*constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformServer(this.platformId)) {
      // Angular ejecutándose en SSR (Node.js)
      this.apiUrl = environment.springDocker + '/field';
    } else {
      // Angular ejecutándose en navegador
      // Detectar si está en Docker usando hostname o heurística
      const isDocker = window.location.hostname !== 'localhost';

      this.apiUrl = isDocker
        ? environment.springHostBridge + '/field'
        : environment.springLocal + '/field';
    }
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
