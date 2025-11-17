import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { environment } from '../enviroment';
import { CreateReservationDto } from '../models/create-reservation.dto';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl: string;
  private API_ROUTE = '/api/reservation';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.apiUrl = isPlatformServer(this.platformId)
    ? 'http://spring-backend:8080/api/reservation'
    : 'http://localhost:8080/api/reservation';
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
  }*/

  getAll(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  getById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
  }

  create(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation);
  }

  update(id: number, reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}`, reservation);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  checkAvailabilityByFieldTypeAndTime(
    fieldType: string,
    fecha: string,
    horaInicio: string,
    horaFin: string
  ): Observable<boolean> {
    const params = { fieldType, fecha, horaInicio, horaFin };
    return this.http.get<boolean>('/api/reservations/check-collision-by-type', {
      params,
    });
  }

  checkCollision(
    field_id: number,
    reservationDate: string,
    startTime: string,
    endTime: string
  ): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/collision`, {
      params: {
        field_id,
        reservationDate,
        startTime,
        endTime,
      },
    });
  }
}
