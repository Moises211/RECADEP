import { Rent } from "./rent.model";
import { Reservation } from "./reservation.model";

export interface Field {
  fieldId: number;
  fieldType: string;
  area: number;
  rents: Rent[];
  reservations: Reservation[];
}
