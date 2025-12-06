import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReservaUtilsService {

  constructor() {}

  parseHora(horaStr: string): Date {
    const [h, m] = horaStr.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  }

  validarHoras(horaInicio: string, horaFin: string): boolean {
    if (!horaInicio || !horaFin) return false;

    const inicio = this.parseHora(horaInicio);
    const fin = this.parseHora(horaFin);
    const duracion = (fin.getTime() - inicio.getTime()) / (1000 * 60); // minutos

    return (
      fin >= inicio &&
      duracion >= 30 &&
      duracion <= 120 &&
      fin <= this.parseHora('21:30')
    );
  }
}
