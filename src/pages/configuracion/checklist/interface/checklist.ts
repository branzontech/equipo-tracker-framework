export interface Checklist {
  id_plantilla: number;
  nombre: string;
  tipo_equipo: string;
  tipo_calificacion: "ESTRELLAS" | "PORCENTAJE";
  campos: string[];
  creado_por: string;
  usuarios: {
    id_usuario: number;
    nombre: string;
  };
}