import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { roleGuard } from './role.guard';
export const routes: Routes = [
  /*{
    path: '',
    loadComponent: () =>
      import('./user-list/user-list.component').then(m => m.UserListComponent)
  },*/
  {
  path: '',
  redirectTo: '/home',
  pathMatch: 'full'
  },
  {
  path: 'collision',
  loadComponent: () => import('./availability-check/availability-check.component').then(m => m.AvailabilityCheckComponent),
  canActivate: [AuthGuard]
  },
  {
    path: 'reserva-usuario',
    loadComponent: () => import('./reserva-usuario/reserva-usuario.component').then(m => m.ReservaUsuarioComponent),
    canActivate: [AuthGuard, roleGuard], // Protección con Auth0 y rol
    data: { roles: ['customer'] } // Solo usuarios con rol 'admin' pueden acceder

  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home-page/home-page.component').then(m => m.HomePageComponent)
  },
  {
    path: 'admin-reservas',
    loadComponent: () =>
      import('./admin-reservas-list/admin-reservas-list.component').then(m => m.AdminReservasListComponent),
    canActivate: [AuthGuard, roleGuard], // Protección con Auth0 y rol
    data: { roles: ['admin'] } // Solo usuarios con rol 'admin' pueden acceder
  }

];
