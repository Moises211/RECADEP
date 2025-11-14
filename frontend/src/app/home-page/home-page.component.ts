import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { MatDialog } from '@angular/material/dialog';
import { ReservaPreviewDialogComponent } from '../dialogs/reserva-preview-dialog/reserva-preview-dialog.component';
import { ReservaValidacionFormComponent } from '../shared/reserva-validacion-form/reserva-validacion-form.component';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, ReservaValidacionFormComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {
  disponibilidad: boolean | null = null;
  isAuthenticated = false;
  isAdmin = false;
  datosReserva: {
    canchaId: number;
    reservationDate: string;
    startTime: string;
    endTime: string;
  } | null = null;

  constructor(
    private router: Router,
    private auth: AuthService,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  onDisponibilidad(disponible: boolean | null) {
    this.disponibilidad = disponible;
  }

  onDatosReserva(datos: {
    canchaId: number;
    reservationDate: string;
    startTime: string;
    endTime: string;
  }) {
    this.datosReserva = datos;
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.auth.user$.subscribe((user) => {
        const roles = user?.['https://your-app.com/roles'] || [];
        this.isAdmin = roles.includes('admin');
      });

      this.auth.isAuthenticated$.subscribe((auth) => {
        this.isAuthenticated = auth;
      });
    }
  }

  iniciarReserva(): void {
    if (!this.datosReserva || !isPlatformBrowser(this.platformId)) return;

    const { canchaId, reservationDate, startTime, endTime } = this.datosReserva;

    this.auth.user$.subscribe((user) => {
      const roles = user?.['https://your-app.com/roles'] || [];
      const isAdmin = roles.includes('admin');

      this.auth.isAuthenticated$.subscribe((isAuth) => {
        if (!isAuth) {
          this.auth.loginWithRedirect({
            appState: {
              target: isAdmin ? '/admin-reservas' : '/reserva-usuario',
              canchaId,
              fechaInicio: `${reservationDate}T${startTime}`,
              fechaFin: `${reservationDate}T${endTime}`,
            },
          });
          return;
        }

        if (isAdmin) {
          this.router.navigate(['/admin-reservas']);
          return;
        }

        const dialogRef = this.dialog.open(ReservaPreviewDialogComponent, {
          data: {
            canchaId,
            fechaInicio: `${reservationDate}T${startTime}`,
            fechaFin: `${reservationDate}T${endTime}`,
          },
        });

        dialogRef.afterClosed().subscribe((confirmado) => {
          if (confirmado) {
            this.router.navigate(['/reserva-usuario'], {
              queryParams: {
                canchaId,
                fechaInicio: `${reservationDate}T${startTime}`,
                fechaFin: `${reservationDate}T${endTime}`,
              },
            });
          }
        });
      });
    });
  }
}
