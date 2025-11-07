import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, Injector, InjectionToken } from '@angular/core';
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { AuthModule, AuthConfig } from '@auth0/auth0-angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// 1. Crear un token de inyección explícito para la configuración dinámica
const AUTH0_CONFIG_TOKEN = new InjectionToken<AuthConfig>('AUTH0_CONFIG_TOKEN');

// 2. Función de fábrica para la configuración condicional de Auth0 (SSR vs Browser)
export function auth0Factory(injector: Injector): AuthConfig {
  const platformId = injector.get(PLATFORM_ID);

  // URL de fallback segura para el SSR. Puede ser cualquier URL válida.
  const fallbackRedirectUri = 'http://localhost:4200';

  // Devuelve la configuración
  return {
    domain: 'dev-1xf2p1cnt6igj7cz.us.auth0.com',
    clientId: '1hw2tQ6FfezNmO2KDtTGpU5EF5Howorv',
    authorizationParams: {
      // Acceso seguro a window.location.origin
      redirect_uri: isPlatformBrowser(platformId) ? window.location.origin : fallbackRedirectUri
    },
    cacheLocation: 'localstorage',
    useRefreshTokens: true
  };
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideAnimationsAsync(),

    // 3. Proveedor Estático/Mínimo: Se requiere para que AuthModule funcione.
    importProvidersFrom(AuthModule.forRoot({
      // Proveedores estáticos para evitar errores en el import
      domain: '',
      clientId: ''
    })),

    // 4. Proveedor Dinámico: Sobrescribe la configuración estática usando la fábrica.
    {
      provide: AUTH0_CONFIG_TOKEN, // Usamos el token explícito para la inyección
      useFactory: auth0Factory,
      deps: [Injector] // Inyectamos Injector para obtener PLATFORM_ID
    },

    MatDialogModule,
    MatButtonModule
  ]
};
