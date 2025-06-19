
export interface Traslado {
  id_traslado: number;
  acta_id: number;
  fecha_traslado: Date | null;
  motivo: string;
  observaciones: string;
  responsable_salida_id: number;
  responsable_entrada_id: number;
  usuarios: {
    id_usuario: number;
    nombre: string;
  }
  sucursal_destino_id: number;
  sucursales: {
    id_sucursal: number;
    nombre: string;
    sedes: {
      id_sede: number;
      nombre: string;
      usuarios: {
        id_usuario: number;
        nombre: string;
      }[];
    }[];
  }
  equipos: {
    id_equipo: number;
    perifericos: number[]; 
  }[];
}
