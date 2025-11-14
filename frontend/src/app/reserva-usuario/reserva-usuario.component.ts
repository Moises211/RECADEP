import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReservaValidacionFormComponent } from '../shared/reserva-validacion-form/reserva-validacion-form.component';
import { ReservationService } from '../reservation.service';
import { AuthService } from '@auth0/auth0-angular';
//import { CreateReservationDto } from '../models/create-reservation.dto';
import { UsersService } from '../users.service';
import { CustomerService } from '../customer.service';
import { Reservation } from '../models/reservation.model';
import { firstValueFrom } from 'rxjs';
import { FieldService } from '../field.service';
import { MatDialog } from '@angular/material/dialog';
import { ReservaConfirmDialogComponent } from '../dialogs/reserva-confirm-dialog/reserva-confirm-dialog.component';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-reserva-usuario',
  standalone: true,
  imports: [CommonModule, ReservaValidacionFormComponent],
  templateUrl: './reserva-usuario.component.html',
  styleUrls: ['./reserva-usuario.component.css'],
})
export class ReservaUsuarioComponent implements OnInit {
  initialValues: any = null;
  disponibilidad: boolean | null = null;
  datosReserva: {
    canchaId: number;
    reservationDate: string;
    startTime: string;
    endTime: string;
  } | null = null;
  usuarioId: number | '' = '';

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private auth: AuthService,
    private usersService: UsersService,
    private customerService: CustomerService,
    private fieldService: FieldService,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.auth.user$.subscribe((user) => {
        const email = user?.email;
        if (email) {
          this.customerService
            .getCustomerByEmail(email)
            .subscribe((customer) => {
              this.usuarioId = customer.customerId;
            });
        }
      });
    }

    this.route.queryParams.subscribe((params) => {
      this.initialValues = {
        canchaId: params['canchaId'],
        fecha: params['fechaInicio']?.split('T')[0],
        horaInicio: params['fechaInicio']?.split('T')[1],
        horaFin: params['fechaFin']?.split('T')[1],
      };
    });
  }

  onDisponibilidad(disponible: boolean | null) {
    console.log('Disponibilidad recibida:', disponible);
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

  async abrirModalConfirmacion() {
    if (!this.datosReserva || !this.usuarioId) return;

    const customer = await firstValueFrom(
      this.customerService.getById(this.usuarioId)
    );
    const field = await firstValueFrom(
      this.fieldService.getById(this.datosReserva.canchaId)
    );

    const reserva: Reservation = {
      reservationDate: this.datosReserva.reservationDate,
      startTime: this.datosReserva.startTime,
      endTime: this.datosReserva.endTime,
      status: 'Pendiente',
      field: field,
      customer: customer,
    };

    const dialogRef = this.dialog.open(ReservaConfirmDialogComponent, {
      data: {
        customer: customer,
        reserva: reserva,
      },
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.reservationService.create(reserva).subscribe(() => {
          alert('✅ Reserva confirmada');
        });
      }
    });
    console.log('Confirmar reserva ejecutado' + this.usuarioId);
  }
}
