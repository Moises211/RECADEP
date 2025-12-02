import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { UsersService } from './services/users.service';
import { RoleAssignmentService } from './utils/role-assignment.service';
import { Router } from '@angular/router';
import { Users } from './models/users.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isAuthenticated = false;
  isAdmin = false;
  isCustomer = false;

  constructor(
    public auth: AuthService,
    private usersService: UsersService,
    private roleSvc: RoleAssignmentService, // <-- nuevo
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.auth.isAuthenticated$.subscribe((auth) => {
        this.isAuthenticated = auth;

        if (auth) {
          this.auth.user$.subscribe((user) => {
            console.log('Usuario: ', user?.email);
            const roles = user?.['https://your-app.com/roles'] || [];
            console.log('Roles:', user?.['https://your-app.com/roles']);

            // Aquí llamamos al backend para asignar rol
            if (user?.sub && roles.length === 0) {
              this.roleSvc.assignRole(user.sub).subscribe((resp) => {
                if (resp.status === 'rol_asignado') {
                  console.log(
                    'Rol asignado correctamente al usuario',
                    (resp as { status: string; user_id: string }).user_id
                  );
                  // Forzar re-login para que el token traiga roles
                  if (isPlatformBrowser(this.platformId)) {
                    this.logout();
                    this.auth.loginWithRedirect();
                  }
                } else {
                  console.warn(
                    'No se pudo asignar rol:',
                    (resp as { status: string; message: string }).message
                  );
                }
              });
            } else {
              console.log('Usuario ya tiene roles, no se asigna nada.');
            }
            this.isAdmin = roles?.includes('admin');
            this.isCustomer = roles?.includes('customer');
            console.log('isCustomer:', roles?.includes('customer'));
            console.log('isAdmin:', roles?.includes('admin'));

            try {
              const namespace = 'https://your-app.com/';

              const payload: Users = {
                email: user?.email,
                username: user?.[`${namespace}username`] || null,
                lastname: user?.[`${namespace}lastname`] || null,
                birthdate: user?.[`${namespace}birthdate`]
                  ? user?.[`${namespace}birthdate`].toString()
                  : null,
                documentNumber: user?.[`${namespace}document_number`] || null,
                telephone: user?.[`${namespace}telephone`] || null,
              };

              //console.log('Payload construido:', payload);

              // Sincronizar con backend
              this.usersService.sincronizarUsuario(payload).subscribe({
                next: () => console.log('Usuario sincronizado correctamente'),
                error: (err) =>
                  console.error('Error al sincronizar usuario:', err),
              });
            } catch (err) {
              console.error('Error construyendo payload de usuario:', err);
            }

            this.auth.appState$.subscribe((state) => {
              if (this.isAdmin && !sessionStorage.getItem('adminRedirected')) {
                sessionStorage.setItem('adminRedirected', 'true');
                this.router.navigate(['/admin-reservas']);
              }

              if (this.isCustomer && state?.target === '/reserva-usuario') {
                this.router.navigate(['/reserva-usuario'], {
                  queryParams: {
                    canchaId: state?.['canchaId'],
                    fechaInicio: state?.['fechaInicio'],
                    fechaFin: state?.['fechaFin'],
                  },
                });
              }
            });
          });
        }
      });

      // Sincronizar usuario solo en navegador
      /*this.usersService.sincronizarUsuario().subscribe({
        next: () => console.log('Usuario sincronizado correctamente'),
        error: (err) => console.error('Error al sincronizar usuario:', err),
      });*/
    }
  }
}
