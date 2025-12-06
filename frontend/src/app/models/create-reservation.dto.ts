export interface CreateReservationDto {
  reservationDate: string;
  startTime: string;
  endTime: string;
  status: string;
  fieldId: number;
  customerId: bigint;
}
