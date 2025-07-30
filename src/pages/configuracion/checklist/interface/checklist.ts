export interface Checklist {
  id_plantilla: number;
  nombre: string;
  tipo_equipo: string;
  tipo_calificacion: "ESTRELLAS" | "CATEGORIA" | "ESCALA";
  campos: string[];
  creado_por: string;
  usuarios: {
    id_usuario: number;
    nombre: string;
  };
  estado: "Habilitado" | "Deshabilitado";
}

export interface ChecklistRespuestaData {
  mantenimientoId: number;
  detalleId: number;
  plantillaId?: number;
  tecnicoId?: number;
  respuestas?: Record<string, boolean>;
  calificacion?: number;
  observaciones?: string;
  fechaRealizacion?: Date;
}
