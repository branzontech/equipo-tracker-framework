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
  usuarios_devoluciones_usuario_entrega_idTousuarios: {
    id: number;
    nombre: string;
  };
  usuarios_devoluciones_usuario_recibe_idTousuarios: {
    id: number;
    nombre: string;
  };
}
