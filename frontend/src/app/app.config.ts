import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, Injector, InjectionToken } from '@angular/core';
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { AuthModule, AuthConfig } from '@auth0/auth0-angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common'; // 👈 Importar DOCUMENT

// 1. Crear un token de inyección explícito para la configuración dinámica
const AUTH0_CONFIG_TOKEN = new InjectionToken<AuthConfig>('AUTH0_CONFIG_TOKEN');

// 2. Función de fábrica para la configuración condicional de Auth0 (SSR vs Browser)
// Ahora inyectamos DOCUMENT para acceder de forma segura a la ubicación.
export function auth0Factory(injector: Injector): AuthConfig {
  const platformId = injector.get(PLATFORM_ID);

  // 💡 Inyectamos el DOCUMENT de forma segura. Si estamos en SSR, será un stub,
  // pero solo lo usaremos si isPlatformBrowser es verdadero.
  const document = injector.get(DOCUMENT);

  // URL de fallback segura para el SSR.
  const fallbackRedirectUri = 'http://localhost:4200';

  let redirectUri: string;

  if (isPlatformBrowser(platformId)) {
    // Si estamos en el navegador, usamos document.location.origin, que es seguro.
    redirectUri = document.location.origin;
  } else {
    // Si estamos en el servidor, usamos el fallback.
    redirectUri = fallbackRedirectUri;
  }

  // Devuelve la configuración
  return {
    domain: 'dev-1xf2p1cnt6igj7cz.us.auth0.com',
    clientId: '1hw2tQ6FfezNmO2KDtTGpU5EF5Howorv',
    authorizationParams: {
      // Usamos la URI determinada por la comprobación de plataforma
      redirect_uri: redirectUri
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
    // Esto es un workaround. Mantenlo.
    importProvidersFrom(AuthModule.forRoot({
      // Proveedores estáticos para evitar errores en el import
      domain: '',
      clientId: ''
    })),

    // 4. Proveedor Dinámico: Sobrescribe la configuración estática usando la fábrica.
    {
      provide: AUTH0_CONFIG_TOKEN,
      useFactory: auth0Factory,
      // Solo necesitamos inyectar el Injector, ya que PlatformID y DOCUMENT se obtienen de él.
      deps: [Injector]
    },

    MatDialogModule,
    MatButtonModule
  ]
};
