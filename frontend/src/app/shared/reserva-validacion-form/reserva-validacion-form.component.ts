import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldService } from '../../field.service';
import { ReservationService } from '../../reservation.service';
import { ReservaUtilsService } from '../../utils/reserva-utils.service';
 
@Component({
  selector: 'app-reserva-validacion-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-validacion-form.component.html',
  styleUrls: ['./reserva-validacion-form.component.css'],
})
export class ReservaValidacionFormComponent {
  @Input() initialValues: any = null;
  @Output() onDisponibilidad = new EventEmitter<boolean | null>();
  @Output() onDatosReserva = new EventEmitter<{
    canchaId: number;
    reservationDate: string;
    startTime: string;
    endTime: string;
  }>();

  fieldType = '';
  fieldList: any[] = [];
  selectedFieldId = '';
  fecha = '';
  horaInicio = '';
  horaFin = '';
  horaFinDisabled = true;
  disponibilidad: boolean | null = null;

  constructor(
    private fieldService: FieldService,
    private reservationService: ReservationService,
    private reservaUtilsService: ReservaUtilsService
  ) {}

  ngOnInit(): void {
    if (this.initialValues) {
      this.fieldType = this.initialValues.fieldType || '';
      this.selectedFieldId = this.initialValues.canchaId?.toString() || '';
      this.fecha = this.initialValues.fecha || '';
      this.horaInicio = this.initialValues.horaInicio || '';
      this.horaFin = this.initialValues.horaFin || '';
      this.horaFinDisabled = !this.horaInicio;
      if (this.fieldType) {
        this.fieldService
          .getFieldsByType(this.fieldType)
          .subscribe((fields) => {
            this.fieldList = fields;
          });
      }
    }
  }

  onFieldTypeChange() {
    this.selectedFieldId = '';
    this.fieldList = [];
    this.fecha = '';
    this.horaInicio = '';
    this.horaFin = '';
    this.horaFinDisabled = true;
    this.disponibilidad = null;

    if (this.fieldType) {
      this.fieldService.getFieldsByType(this.fieldType).subscribe((fields) => {
        this.fieldList = fields;
      });
    }
  }

  onHoraInicioChange() {
    this.horaFinDisabled = false;
    this.horaFin = '';
  }

  validarHoras(): boolean {
    return this.reservaUtilsService.validarHoras(this.horaInicio, this.horaFin);
  }

  consultarDisponibilidad() {
    if (
      !this.selectedFieldId ||
      !this.fecha ||
      !this.horaInicio ||
      !this.horaFin ||
      !this.validarHoras()
    ) {
      this.disponibilidad = null;
      this.onDisponibilidad.emit(null);
      return;
    }

    this.reservationService
      .checkCollision(
        Number(this.selectedFieldId),
        this.fecha,
        this.horaInicio,
        this.horaFin
      )
      .subscribe((hayColision: boolean) => {
        this.disponibilidad = !hayColision;
        this.onDisponibilidad.emit(this.disponibilidad);

        if (!hayColision) {
          this.onDatosReserva.emit({
            canchaId: Number(this.selectedFieldId),
            reservationDate: this.fecha,
            startTime: this.horaInicio,
            endTime: this.horaFin,
          });
        }
      });
  }
}
