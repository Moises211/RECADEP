import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { AuthConfig, provideAuth0 } from '@auth0/auth0-angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';


/**
 * Función que genera la configuración de Auth0 de forma segura para SSR.
 */
const provideAuth0SSRSafe = (config: AuthConfig): EnvironmentProviders => {
  const platformId = inject(PLATFORM_ID);
  const document = inject(DOCUMENT);

  // 1. Clonar la configuración base
  let safeConfig: AuthConfig = { ...config };

  // 2. Solo si estamos en el navegador, configuramos el redirect_uri dinámico
  if (isPlatformBrowser(platformId)) {
    // Usamos document.location.origin, que es seguro aquí.
    const origin = document.location.origin;

    safeConfig.authorizationParams = {
        ...safeConfig.authorizationParams,
        // Configuración sensible a 'location': se construye con el origen real.
        redirect_uri: `${origin}/home` // Asumiendo que /home es tu ruta de callback
    };

    // La configuración de caché sólo debe estar activa en el navegador
    safeConfig.cacheLocation = 'localstorage';
    safeConfig.useRefreshTokens = true;

  } else {
    // Si estamos en el servidor (SSR), usamos una configuración mínima y fija.
    safeConfig = {
      domain: config.domain, // Usar el dominio real de la configuración
      clientId: config.clientId, // Usar el Client ID real de la configuración
      authorizationParams: {
        // Usamos un valor fijo y seguro para el servidor
        redirect_uri: 'http://localhost:4200/home' // Valor fijo para evitar fallos de compilación
      }
    };
  }

  // 3. Devolvemos el proveedor envuelto correctamente usando makeEnvironmentProviders
  return makeEnvironmentProviders([provideAuth0(safeConfig)]);
};


// Función para obtener redirect_uri según entorno
function getRedirectUri(): string {
  if (typeof window !== 'undefined') {
    // Navegador
    return window.location.origin;
  }
  // SSR (Node) → fallback seguro
  return process.env['AUTH0_REDIRECT_URI'] || 'http://localhost:4200';
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(
      AuthModule.forRoot({
        domain: 'dev-1xf2p1cnt6igj7cz.us.auth0.com',
        clientId: '1hw2tQ6FfezNmO2KDtTGpU5EF5Howorv',
        authorizationParams: {
          redirect_uri: getRedirectUri()
        },
        cacheLocation: 'localstorage',
        useRefreshTokens: true
      }),
      MatDialogModule,
      MatButtonModule
    )
  ],
};

/*import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { AuthModule } from '@auth0/auth0-angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(
      AuthModule.forRoot({
        domain: 'dev-1xf2p1cnt6igj7cz.us.auth0.com',
        clientId: '1hw2tQ6FfezNmO2KDtTGpU5EF5Howorv',
        authorizationParams: { redirect_uri: window.location.origin },
        cacheLocation: 'localstorage',
        useRefreshTokens: true,
      }),
      MatDialogModule,
      MatButtonModule
    ),
  ],
};
/*import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, PLATFORM_ID } from '@angular/core';
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { AuthModule } from '@auth0/auth0-angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { isPlatformBrowser } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideAnimationsAsync(),
    // Condicionamos la inicialización de Auth0
    {
      provide: 'auth0-providers',
      useFactory: (platformId: Object) => {
        if (isPlatformBrowser(platformId)) {
          return importProvidersFrom(
            AuthModule.forRoot({
              domain: 'dev-1xf2p1cnt6igj7cz.us.auth0.com',
              clientId: '1hw2tQ6FfezNmO2KDtTGpU5EF5Howorv',
              authorizationParams: {
                redirect_uri: window.location.origin
              },
              cacheLocation: 'localstorage',
              useRefreshTokens: true
            }),
            MatDialogModule,
            MatButtonModule
          );
        }
        // En SSR devolvemos un array vacío para que no se inicialice
        return [];
      },
      deps: [PLATFORM_ID]
    }
  ]
};*/
