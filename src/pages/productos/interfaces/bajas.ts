export interface Baja {
  id_baja: number;
  acta_id: number;
  fecha_baja: Date | string;
  observaciones_adicionales: string;
  estado: string;
  responsable_autorizacion_id: number;
  responsable_solicitud_id: number;
  equipos: {
    id_equipo: number;
    motivo: string;
  }[];
}
