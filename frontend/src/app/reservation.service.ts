import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from './models/reservation.model';
import { environment } from './enviroment';
import { CreateReservationDto } from './models/create-reservation.dto';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.apiUrl = isPlatformServer(this.platformId)
    ? 'http://spring-backend:8080/api/reservation'
    : 'http://localhost:8080/api/reservation';
  }
  /*constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformServer(this.platformId)) {
      // Angular ejecutándose en SSR (Node.js)
      this.apiUrl = environment.springDocker + '/reservation';
    } else {
      // Angular ejecutándose en navegador
      // Detectar si está en Docker usando hostname o heurística
      const isDocker = window.location.hostname !== 'localhost';

      this.apiUrl = isDocker
        ? environment.springHostBridge + '/reservation'
        : environment.springLocal + '/reservation';
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
