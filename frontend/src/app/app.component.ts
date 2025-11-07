import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { UsersService } from './users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit { // Agregamos OnInit
  isAuthenticated = false;
  isAdmin = false;
  isCustomer = false;
  redireccionado = false;

  constructor(
    public auth: AuthService,
    private usersService: UsersService,
    private router: Router
  ) {}

  logout(): void {
    sessionStorage.removeItem('adminRedirected');
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe((auth) => {
      this.isAuthenticated = auth;

      if (auth) {
        this.auth.user$.subscribe((user) => {

          // 🛑 SOLUCIÓN AL ERROR TS2554: Llama al servicio AQUI
          if (user && user.email) {
            this.usersService.getUserByEmail(user.email).subscribe({ // 👈 Le pasamos el email
              next: () => console.log('Usuario sincronizado correctamente'),
              error: (err) => console.error('Error al sincronizar usuario:', err),
            });
          }
          // ----------------------------------------------------

          console.log('Usuario: ', user?.email);
          console.log('Nombre: ', user?.name);
          console.log('Sub (ID Auth0): ', user?.sub);

          const roles = user?.['https://your-app.com/roles'] || [];
          console.log('Roles:', roles);

          this.isAdmin = roles.includes('admin');
          this.isCustomer = roles.includes('customer');

          this.auth.appState$.subscribe((state) => {
            const target = state?.target;
            const canchaId = state?.['canchaId'];
            const fechaInicio = state?.['fechaInicio'];
            const fechaFin = state?.['fechaFin'];

            // Redirigir admin solo si no viene de una reserva
            if (this.isAdmin && !sessionStorage.getItem('adminRedirected')) {
              sessionStorage.setItem('adminRedirected', 'true');
              this.router.navigate(['/admin-reservas']);
              if (!target || target === '/home') {
                return;
              }
            }

            // Redirigir customer si viene de reserva
            if (this.isCustomer && target === '/reserva-usuario') {
              this.router.navigate(['/reserva-usuario'], {
                queryParams: { canchaId, fechaInicio, fechaFin },
              });
            }
          });
        });
      }
    });

    // ❌ LÍNEAS ELIMINADAS (estaban fuera del contexto de usuario)
    // this.usersService.getUserByEmail().subscribe({
    //   next: () => console.log('Usuario sincronizado correctamente'),
    //   error: (err) => console.error('Error al sincronizar usuario:', err),
    // });
  }
}
