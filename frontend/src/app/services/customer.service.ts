import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Customer } from '../models/customer.model';
import { environment } from '../enviroment';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private API_ENDPOINT = '/customer';
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Inicializa la URL al construir el servicio
    this.apiUrl = this.getApiUrl();
  }

  /**
   * Determina la URL base del backend basándose en el entorno de ejecución.
   * CUMPLIMIENTO 2: Lógica de Detección de URL (Local/Render).
   */
  private getApiUrl(): string {
    // 1. Lógica para Servidor/SSR (entorno de compilación/Docker)
    if (isPlatformServer(this.platformId)) {
      // Usamos la URL interna de Docker para comunicación entre contenedores.
      console.log('API URL: Usando Docker/SSR URL.');
      return environment.springDocker + this.API_ENDPOINT;
    }

    // 2. Lógica para Navegador (Cliente)
    //const hostname = window.location.hostname;
    let hostname = '';
    if (isPlatformBrowser(this.platformId)) {
      hostname = window.location.hostname;
    }

    // Detectar si estamos en el dominio de Render (Producción)
    const isRenderProduction = hostname.includes('onrender.com');
    // Detectar si estamos en local
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

    if (isRenderProduction) {
      console.log('API URL: Usando Render Production URL.');
      // Usar la URL pública y real del servicio de Render
      return environment.springRender + this.API_ENDPOINT;
    }

    if (isLocal) {
      console.log('API URL: Usando Local Development URL.');
      // Usar localhost para desarrollo
      return environment.springLocal + this.API_ENDPOINT;
    }

    // Caso de un entorno desconocido
    console.log(
      `API URL: Usando Fallback de Producción para Host: ${hostname}.`
    );
    return environment.springRender + this.API_ENDPOINT;
  }

  /**
   * Manejador de Errores Centralizado para llamadas HTTP.
   * CUMPLIMIENTO 3: Manejo de Errores Seguro (Ocultar URL sensible).
   */
  private handleError(error: HttpErrorResponse, source: string) {
    let errorMessage = '';

    // Log del error completo para el desarrollador (SOLO para debugging)

    console.error(
      `%c[FIELD SERVICE - ERROR ${source}] Ocurrió un error en la API:`,
      'color: orange; font-weight: bold;',
      error
    );

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de red
      errorMessage = `Error de red: ${error.error.message}`;
    } else {
      // El backend retornó un código de respuesta sin éxito
      errorMessage = `[Código: ${error.status}] Falló la conexión con el servicio.`;
    }

    // Retornamos un Observable con un mensaje genérico.
    // Esto evita que el error original (con la URL sensible) se propague al suscriptor
    // y evita que HttpClient logee el error con la URL en la consola por defecto.
    console.log(
      `%c[ERROR VISIBLE AL USUARIO] Fallo la conexión con el servidor. Por favor, inténtalo de nuevo.`,
      'color: red; font-weight: bold;'
    );

    // Lanzamos un error genérico (sin la URL) para que el componente suscriptor sepa que falló.
    return throwError(() => new Error(errorMessage));
  }

  getAll(): Observable<Customer[]> {
    return this.http
      .get<Customer[]>(this.apiUrl)
      .pipe(catchError((err) => this.handleError(err, 'getAll')));
  }

  getById(id: number): Observable<Customer> {
    return this.http
      .get<Customer>(`${this.apiUrl}/${id}`)
      .pipe(catchError((err) => this.handleError(err, 'getById')));
  }

  create(customer: Customer): Observable<Customer> {
    return this.http
      .post<Customer>(this.apiUrl, customer)
      .pipe(catchError((err) => this.handleError(err, 'create')));
  }

  update(id: number, customer: Customer): Observable<Customer> {
    return this.http
      .put<Customer>(`${this.apiUrl}/${id}`, customer)
      .pipe(catchError((err) => this.handleError(err, 'update')));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError((err) => this.handleError(err, 'delete')));
  }

  getCustomerByEmail(email: string): Observable<Customer> {
    return this.http
      .get<Customer>(`${this.apiUrl}/by-email?email=${email}`)
      .pipe(catchError((err) => this.handleError(err, 'getCustomerByEmail')));
  }
}
