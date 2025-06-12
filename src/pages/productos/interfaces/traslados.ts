
export interface Traslado {
  id_traslado: number;
  acta_id: number;
  fecha_traslado: Date | null;
  motivo: string;
  observaciones: string;
  responsable_salida_id: number;
  responsable_entrada_id: number;
  sucursal_destino_id: number;
  equipos: {
    id_equipo: number;
    perifericos: number[]; 
  }[];
}
