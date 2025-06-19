import { Acta } from "./acta";

export interface Prestamo {
  id_prestamo: number;
  acta_id: number;
  actas: Acta | null;
  responsable_salida_id: number;
  responsable_entrada_id: number;
  usuarios_prestamos_responsable_salida_idTousuarios: {
    id_usuario: number;
    nombre: string;
  };
  fecha_salida: Date | null;
  fecha_retorno: Date | null;
  estado: string;
  descripcion: string;
  equipos: {
    id_equipo: number;
    perifericos: number[]; 
  }[];
}
