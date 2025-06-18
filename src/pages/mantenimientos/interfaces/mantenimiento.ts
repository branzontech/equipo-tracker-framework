import { Usuario } from "@/pages/configuracion/usuarios/interfaces/usuarios";
import { Equipo } from "@/pages/productos/interfaces/equipo";

export interface Mantenimiento {
  id_mantenimiento: number;
  id_equipo: number;
  equipos: Equipo | null;
  id_impresora: number;
  tecnico_id: number;
  usuarios: Usuario | null;
  fecha_programada: Date | string;
  fecha_realizada: Date | string;
  tipo: string;
  prioridad: string;
  descripcion: string;
  tiempo_estimado: number;
  recomendaciones: string;
  observaciones_adi: string;
  estado: string;
  progreso: number;

  archivosmantenimiento: {
    id_archivo: number;
    mantenimiento_id: number;
    nombre_archivo: string;
    tipo_archivo: string;
    archivos: File[];
    archivo: {
      content: string;
      nombre: string;
      tipo: string;
    };
    fecha_subida: Date;
  }[];
}

export interface TableColumn {
  id: string;
  label: string;
  accessor: string;
  isVisible: boolean;
  order: number;
  className?: string;
}
