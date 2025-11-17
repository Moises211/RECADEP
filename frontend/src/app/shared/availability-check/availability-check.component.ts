import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-availability-check',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './availability-check.component.html',
})
export class AvailabilityCheckComponent {
  fieldId: number = 1;
  reservationDate: string = '';
  startTime: string = '';
  endTime: string = '';
  available: boolean | null = null;

  constructor(private reservationService: ReservationService) {}

  checkAvailability() {
    this.reservationService.checkCollision(this.fieldId, this.reservationDate, this.startTime, this.endTime)
      .subscribe(result => {
        this.available = result;
      });
  }
}

