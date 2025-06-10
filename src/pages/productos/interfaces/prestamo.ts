
export interface Prestamo {
  id_prestamo: number;
  acta_id: number;
  equipo_id: number;
  responsable_salida_id: number;
  responsable_entrada_id: number;
  ubicacion_destino_id: number;
  fecha_salida: Date;
  fecha_retorno: Date;
  estado: string;
  firma_entrega: string;
  firma_recibe: string;
}
