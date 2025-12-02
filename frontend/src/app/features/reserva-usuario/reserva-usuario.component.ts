import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReservaValidacionFormComponent } from '../../shared/reserva-validacion-form/reserva-validacion-form.component';
import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '@auth0/auth0-angular';
import { UsersService } from '../../services/users.service';
import { CustomerService } from '../../services/customer.service';
import { Reservation } from '../../models/reservation.model';
import { firstValueFrom } from 'rxjs';
import { FieldService } from '../../services/field.service';
import { MatDialog } from '@angular/material/dialog';
import { ReservaConfirmDialogComponent } from '../../dialogs/reserva-confirm-dialog/reserva-confirm-dialog.component';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import {
  FullCalendarModule,
  FullCalendarComponent,
} from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { ReservaEditDialogComponent } from '../../reserva-edit-dialog/reserva-edit-dialog.component';
import { co } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-reserva-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReservaValidacionFormComponent,
    FullCalendarModule,
    FormsModule,
    MatTabsModule,
  ],
  templateUrl: './reserva-usuario.component.html',
  styleUrls: ['./reserva-usuario.component.css'],
  encapsulation: ViewEncapsulation.None,
})
// Componente para gestionar las reservas de un usuario
export class ReservaUsuarioComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  currentView: string = 'dayGridMonth';
  calendarOptions: any = {
    height: '100%',
    contentHeight: 'auto',
    aspectRatio: 1.35,
    slotMinTime: '06:00:00',
    slotMaxTime: '22:00:00',
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
    allDaySlot: false,
    expandRows: true,
    nowIndicator: true,
    slotDuration: '01:00:00',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth',
    },
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    events: [], // se llenará dinámicamente
    viewDidMount: (arg: any) => {
      this.currentView = arg.view.type;
      console.log('Vista inicial:', this.currentView);
    },
    datesSet: (arg: any) => {
      this.currentView = arg.view.type;
      console.log('Vista cambiada:', this.currentView);
    },
    eventContent: function (arg: any) {
      const start = new Date(arg.event.start).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      const end = new Date(arg.event.end).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      return {
        html: `
        <div class="fc-event-custom">
          <span class="fc-time">${start} - ${end}</span>
          <span class="fc-title">${arg.event.title}</span>
        </div>`,
      };
    },
    eventClick: (info: any) => {
      const start = new Date(info.event.start);

      this.dialog
        .open(ReservaEditDialogComponent, {
          width: '400px',
          data: {
            title: info.event.title,
            //date: start.toISOString().split('T')[0],
            reservation: info.event.extendedProps.reservation,
          },
        })
        .afterClosed()
        .subscribe((result: any) => {
          if (result) {
            // Aquí actualizas el evento en tu backend y refrescas el calendario
            this.reservationService
              .update(result.reservationId, result)
              .subscribe(() => {
                alert('✅ Reserva actualizada');
                this.reservationService
                  .getReservationsByCustomer(result.customer)
                  .subscribe((reservations) => {
                    this.calendarOptions.events = reservations.map((r) => ({
                      id: r.reservationId,
                      title: `${r.field.fieldType.toUpperCase()} ${
                        r.field.fieldId
                      }`,
                      start: `${r.reservationDate}T${r.startTime}`,
                      end: `${r.reservationDate}T${r.endTime}`,
                      extendedProps: { reservation: r },
                    }));
                    console.log('actualizado', this.calendarOptions.events);
                  });
              });
            console.log('Reserva editada:', result, result.reservationId);
            const calendarApi = this.calendarComponent.getApi(); // referencia al calendario
            const event = calendarApi.getEventById(result.reservationId);
          }
        });
      /*alert(
        `Reserva seleccionada:\n${info.event.title}\nInicio: ${info.event.start}\nFin: ${info.event.end}`
      );*/
    },
  };
  modo: 'crear' | 'ver' = 'crear';
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
  // Inicialización del componente
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.auth.user$.subscribe((user) => {
        const email = user?.email;
        if (email) {
          this.customerService
            .getCustomerByEmail(email)
            .subscribe((customer) => {
              this.usuarioId = customer.customerId;

              this.reservationService
                .getReservationsByCustomer(customer)
                .subscribe((reservations) => {
                  console.log('Reservas del usuario:', reservations);
                  this.calendarOptions.events = reservations.map((r) => ({
                    id: r.reservationId,
                    title: `${r.field.fieldType.toLocaleUpperCase()} ${
                      r.field.fieldId
                    }`,
                    start: `${r.reservationDate}T${r.startTime}`,
                    end: `${r.reservationDate}T${r.endTime}`,
                    extendedProps: {
                      reservation: r,
                    },
                  }));
                  console.log(this.calendarOptions.events);
                });
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
