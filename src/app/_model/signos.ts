import { Paciente } from './paciente';
import { StickyDirection } from '@angular/cdk/table';
export class Signos {
  idSigno: number;
  paciente: Paciente;
  fecha: string;
  temperatura: number;
  ritmoRespiratorio: number;
  pulso: string;
}
