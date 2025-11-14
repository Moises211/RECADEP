import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
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

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.apiUrl = isPlatformServer(this.platformId)
    ? 'http://spring-backend:8080/api/rent'
    : 'http://localhost:8080/api/rent';
  }
  /*constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformServer(this.platformId)) {
      // Angular ejecutándose en SSR (Node.js)
      this.apiUrl = environment.springDocker + '/rent';
    } else {
      // Angular ejecutándose en navegador
      // Detectar si está en Docker usando hostname o heurística
      const isDocker = window.location.hostname !== 'localhost';

      this.apiUrl = isDocker
        ? environment.springHostBridge + '/rent'
        : environment.springLocal + '/rent';
    }
  }*/

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
