import { Sede } from "./sedes";

export interface Ubicacion {
  id_ubicacion: number;
  nombre: string;
  sede_id: Sede | number;
  sedes: Sede | null;
  tipo: string;
}

export interface UbicacionConEstado extends Ubicacion {
  estado: string;
  sede: string;   
}