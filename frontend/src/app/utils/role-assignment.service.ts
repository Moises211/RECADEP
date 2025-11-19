import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleAssignmentService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  assignRole(userId: string) {
    if (!userId) {
      console.error('RoleAssignmentService: userId vacío o inválido');
      return of({ status: 'error', message: 'userId inválido' });
    }

    return this.http.post<{ status: string; user_id: string }>(
      `${this.baseUrl}/assign-role`,
      { user_id: userId }
    ).pipe(
      map((resp) => {
        console.log('RoleAssignmentService: rol asignado →', resp);
        return resp;
      }),
      catchError((err) => {
        console.error('RoleAssignmentService: error al asignar rol →', err);
        return of({ status: 'error', message: 'No se pudo asignar el rol' });
      })
    );
  }
}
