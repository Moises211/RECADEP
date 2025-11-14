import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../reservation.service';
import { Reservation } from '../models/reservation.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-reservas-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-reservas-list.component.html',
  styleUrls: ['./admin-reservas-list.component.css']
})
export class AdminReservasListComponent implements OnInit {
  reservas: Reservation[] = [];

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.reservationService.getAll().subscribe((data) => {
      this.reservas = data;
    });
  }
}
