import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './enviroment';
export interface User {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private apiUrl: string;
  private API_ROUTE = '/api/users';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {

    if (isPlatformServer(this.platformId)) {

        this.apiUrl = `http://backend:8080${this.API_ROUTE}`;
    } else {

        this.apiUrl = this.API_ROUTE;
    }
  }
/*
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.apiUrl = isPlatformServer(this.platformId)
      ? 'http://host.docker.internal:8080/api/users'
      : 'http://localhost:8080/api/users';
      console.log('Is platform server?', isPlatformServer(this.platformId));
      console.log('Resolved API URL:', this.apiUrl);
  }
  /*constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformServer(this.platformId)) {
      // Angular ejecutándose en SSR (Node.js)
      this.apiUrl = environment.springDocker + '/users';
    } else {
      // Angular ejecutándose en navegador
      // Detectar si está en Docker usando hostname o heurística
      const isDocker = window.location.hostname !== 'localhost';

      this.apiUrl = isDocker
        ? environment.springHostBridge + '/users'
        : environment.springLocal + '/users';
    }
  }*/
    getUsers(): Observable < User[] > {
      return this.http.get<User[]>(this.apiUrl);
    }
  }
