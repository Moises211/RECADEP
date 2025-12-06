import { Employeer } from "./employee.model";
import { Customer } from "./customer.model";
import { Reservation } from "./reservation.model";
import { Field } from "./field.model";

export interface Rent {
  rentId: number;
  rentDate: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  reservation: Reservation;
  employee: Employeer;
  customer: Customer;
  field: Field;
}
