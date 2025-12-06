import { Component, OnInit, ViewChild } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../models/reservation.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { ReservaEditDialogComponent } from '../../reserva-edit-dialog/reserva-edit-dialog.component';

@Component({
  selector: 'app-admin-reservas-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    A11yModule,
  ],
  templateUrl: './admin-reservas-list.component.html',
  styleUrls: ['./admin-reservas-list.component.css'],
})
export class AdminReservasListComponent implements OnInit {
  // Método para abrir el diálogo de edición de reserva
  editReserva(reserva: Reservation): void {
    this.dialog
      .open(ReservaEditDialogComponent, {
        width: '500px',
        data: {
          reservation: reserva,
          context: 'admin', // indicar que viene de admin
        },
      })
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.reservationService
            .update(result.reservationId, result)
            .subscribe(() => {
              alert('✅ Reserva actualizada correctamente.');
              this.ngOnInit(); // Refrescar la lista
            });
        }
      });
    console.log('Editar reserva:', reserva);
  }
  // Definición de las columnas a mostrar en la tabla
  displayedColumns: string[] = [
    'reservationId',
    'fieldId',
    'fieldType',
    'reservationDate',
    'startTime',
    'endTime',
    'customerName',
    'email',
    'telephone',
    'status',
    'actions',
  ];
  searchForm!: FormGroup;
  reservas: Reservation[] = [];
  dataSource = new MatTableDataSource<Reservation>(this.reservas);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private reservationService: ReservationService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}
  // Inicialización del componente
  ngOnInit(): void {
    this.searchForm = this.fb.group({
      reservationId: [''],
      customerName: [''],
      documentNumber: [''],
      fieldType: [''],
      reservationDate: [''],
    });
    // Cargar todas las reservas
    this.reservationService.getAll().subscribe((data) => {
      this.reservas = data;
      this.dataSource.data = this.reservas;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // Configuración personalizada para ordenar por reservationId
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'reservationId':
            return item.reservationId;
          default:
            return (item as any)[property];
        }
      };
      this.sort.active = 'reservationId';
      this.sort.direction = 'asc';
      this.sort.sortChange.emit({
        active: this.sort.active,
        direction: this.sort.direction,
      });
      // Configuración del filtro personalizado
      this.dataSource.filterPredicate = (
        reserva: Reservation,
        filter: string
      ) => {
        const criteria = JSON.parse(filter);

        const matchesReservationId =
          !criteria.reservationId ||
          (reserva.reservationId?.toString() || '')
            .toLowerCase()
            .includes(criteria.reservationId.toLowerCase());

        const matchesCustomerName =
          !criteria.customerName ||
          (
            reserva.customer.users.username +
            ' ' +
            reserva.customer.users.lastname
          )
            .toLowerCase()
            .includes(criteria.customerName.toLowerCase());

        const matchesDocument =
          !criteria.documentNumber ||
          (reserva.customer.users.documentNumber || '')
            .toString()
            .toLowerCase()
            .includes(criteria.documentNumber.toLowerCase());

        const matchesFieldType =
          !criteria.fieldType ||
          reserva.field.fieldType
            .toLowerCase()
            .includes(criteria.fieldType.toLowerCase());

        const matchesDate =
          !criteria.reservationDate ||
          reserva.reservationDate.toString().includes(criteria.reservationDate);

        return (
          matchesReservationId &&
          matchesCustomerName &&
          matchesDocument &&
          matchesFieldType &&
          matchesDate
        );
      };
    });
  }
  // Aplicar el filtro basado en el formulario de búsqueda
  applyFilter(): void {
    const filterValues = this.searchForm.value;
    this.dataSource.filter = JSON.stringify(filterValues);
  }
  // Limpiar el formulario de búsqueda y el filtro aplicado
  clearFilter(): void {
    this.searchForm.reset();
    this.dataSource.filter = JSON.stringify(this.searchForm.value);
    this.ngOnInit();
  }
}
