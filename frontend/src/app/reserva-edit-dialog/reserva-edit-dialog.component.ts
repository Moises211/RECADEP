import { co } from '@fullcalendar/core/internal-common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FieldService } from '../services/field.service';
import { ReservaUtilsService } from '../utils/reserva-utils.service';
import { MatDialogModule } from '@angular/material/dialog';
import { Reservation } from '../models/reservation.model';

@Component({
  selector: 'app-reserva-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatDialogModule,

  ],
  templateUrl: './reserva-edit-dialog.component.html',
})
export class ReservaEditDialogComponent implements OnInit {
  reserva: any;
  date = '';
  fieldList: any[] = [];
  selectedField: any = null;
  fecha = new Date();
  fechaMin = new Date();
  horaInicio = '';
  horaFin = '';
  horaFinDisabled = true;
  fieldType = '';
  isAdmin: boolean;
  statusList: string[] = ['Pendiente', 'Confirmada', 'Cancelada', 'Completada'];
  status= '';
  constructor(
    private dialogRef: MatDialogRef<ReservaEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fieldService: FieldService,
    private reservaUtils: ReservaUtilsService
  ) {
    this.reserva = data.reservation;
    this.isAdmin = data.context === 'admin';
  }

  ngOnInit(): void {
    const start = new Date(this.reserva.reservationDate);
    this.date = start.toISOString().split('T')[0];
    if (this.reserva.reservationDate) {
      const parsed = new Date(this.date);
      this.fecha = isNaN(parsed.getTime()) ? new Date() : parsed;
      this.fechaMin = isNaN(parsed.getTime()) ? new Date() : parsed;
      console.log('Fecha parseada desde data.date:', this.fechaMin);
    } else {
      this.fecha = new Date();
      console.log('Usando fecha actual:', this.fecha);
    }
    this.status = this.reserva.status || 'Pendiente';
    this.horaInicio = this.reserva.startTime || '';
    this.horaFin = this.reserva.endTime || '';
    this.horaFinDisabled = !this.horaInicio;
    this.fieldType = this.reserva.field.fieldType || '';
    console.log('Data recibida en el diálogo:', this.data);
    console.log('Hora inicio:', this.horaInicio);
    console.log('Hora fin:', this.horaFin);
    if (this.fieldType) {
      this.fieldService.getFieldsByType(this.fieldType).subscribe((fields) => {
        this.fieldList = fields;
        const canchaActual = fields.find(
          (f) => f.fieldId.toString() === this.selectedField
        );
        if (canchaActual) {
          this.fieldType = canchaActual.fieldType;
        }
        console.log('Campos filtrados type:', fields);
      });
      console.log('Campos filtrados por tipo:', this.fieldList);
    }
    if (this.reserva.field.fieldId && this.fieldType) {
      this.fieldService.getFieldsByType(this.fieldType).subscribe((fields) => {
        this.fieldList = fields;
        this.selectedField =
          fields.find((f) => f.fieldId === this.reserva.field.fieldId) || null;
      });
    }
  }

  onHoraInicioChange() {
    this.horaFinDisabled = false;
    this.horaFin = '';
  }

  validarHoras(): boolean {
    return this.reservaUtils.validarHoras(this.horaInicio, this.horaFin);
  }

  guardar() {
    if (
      !this.selectedField ||
      !this.fecha ||
      !this.horaInicio ||
      !this.horaFin ||
      !this.status ||
      !this.validarHoras()

    ) {
      alert(
        '⛔ Verifica los campos: duración entre 30 min y 2 horas, fin ≤ 21:30'
      );
      return;
    }
    const updatedReservation : Reservation = {
      reservationId: this.reserva.reservationId,
      reservationDate: this.fecha.toISOString().split('T')[0],
      startTime: this.horaInicio,
      endTime: this.horaFin,
      status: this.status ,
      field: this.selectedField,
      customer: this.reserva.customer,
    };

    this.dialogRef.close(
      updatedReservation
      /*{
      reservationId: this.data.id,
      fieldId: Number(this.selectedFieldId),
      reservationDate: this.fecha,
      startTime: this.horaInicio,
      endTime: this.horaFin,
    }*/);
  }

  cancelar() {
    this.dialogRef.close();
  }
}
