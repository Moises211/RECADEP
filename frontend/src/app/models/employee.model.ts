import { Users } from "./users.model";
import { Rent } from "./rent.model";

export interface Employeer{
  employeeId: number;
  dateHire:string;
  position: string;
  users: Users;
  rents: Rent[];
}
