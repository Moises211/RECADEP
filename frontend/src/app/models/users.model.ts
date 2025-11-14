import {Customer} from './customer.model';
import { Employeer } from './employee.model';

export interface Users {
  usersId: number;
  username: string;
  lastname: string;
  bithdate: string;
  documentNumber: number;
  employee: Employeer;
  customer: Customer;
  email: string;
  telephone: string;
}
