import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const expectedRoles = route.data['roles'] as string[];

  return auth.user$.pipe(
    map(user => {
      const roles = user?.['https://your-app.com/roles'] || []; // 👈 usa tu namespace
      const hasRole = expectedRoles.some(role => roles.includes(role));

      if (!hasRole) {
        router.navigate(['/unauthorized']);
      }

      return hasRole;
    }),
    tap(valid => {
      if (!valid) console.warn('Acceso denegado por rol');
    })
  );
};
