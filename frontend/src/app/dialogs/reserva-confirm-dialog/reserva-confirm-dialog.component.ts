import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reserva-confirm-dialog',
  templateUrl: './reserva-confirm-dialog.component.html',
  styleUrls: ['./reserva-confirm-dialog.component.css']
})
export class ReservaConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ReservaConfirmDialogComponent>
  ) {}

  confirmar(): void {
    this.dialogRef.close(true);
    window.location.reload();
  }

  cancelar(): void {
    this.dialogRef.close(false);
    window.location.reload();
  }
}
