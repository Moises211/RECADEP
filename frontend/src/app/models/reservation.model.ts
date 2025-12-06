import { Field } from "./field.model";
import { Customer } from "./customer.model";
import { Rent } from "./rent.model";

export interface Reservation {
  reservationId?: number;
  reservationDate: string;
  startTime: string;
  endTime: string;
  status: string;
  field: Field;
  customer: Customer;
  rents?: Rent;
}
