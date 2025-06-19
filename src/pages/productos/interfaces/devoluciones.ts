export interface Devolucion {
  equipo_id: number;
  id_devolucion: number;
  prestamo_id: number;
  traslado_id: number;
  fecha_devolucion: Date;
  motivo: string;
  estado_equipo: string;
  observaciones: string;
  usuario_entrega_id: number;
  usuario_recibe_id: number;
}
