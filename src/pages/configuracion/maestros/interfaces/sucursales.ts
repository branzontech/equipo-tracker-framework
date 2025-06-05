import { Sede } from "./sedes";

export interface Sucursal {
  id_sucursal: number;
  nombre: string;
  sede_id: Sede | number;
  sedes: Sede | null;
  tipo: string;
  estado: boolean;
}

export interface SucursalConEstado extends Sucursal {
  sede: string;   
}