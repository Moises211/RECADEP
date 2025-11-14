import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { AuthModule } from '@auth0/auth0-angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

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
