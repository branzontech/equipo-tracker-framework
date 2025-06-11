export interface Prestamo {
  id_prestamo: number;
  acta_id: number;
  responsable_salida_id: number;
  responsable_entrada_id: number;
  fecha_salida: Date;
  fecha_retorno: Date;
  estado: string;
  descripcion: string;
  equipos: {
    id_equipo: number;
    perifericos: number[]; // IDs de los periféricos asociados a este equipo
  }[];
}
