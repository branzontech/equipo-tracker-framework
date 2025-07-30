import { Checklist } from "@/pages/configuracion/checklist/interface/checklist";
import { Perifericos } from "@/pages/configuracion/maestros/interfaces/periferico";
import { Usuario } from "@/pages/configuracion/usuarios/interfaces/usuarios";
import { Equipo } from "@/pages/productos/interfaces/equipo";
import { Impresora } from "@/pages/toners/interfaces/impresora";
import { LucideIcon } from "lucide-react";

export interface Mantenimiento {
  id_mantenimiento: number;

  mantenimiento_detalle: {
    equipos: Equipo | null;
    impresoras: Impresora | null;
    perifericos: Perifericos | null;
    plantilla_id?: number;
    checklist_campos?: string[];
    checklist_plantillas?: Checklist;
  }[];

  tecnico_id: number;
  usuarios: Usuario | null;
  fecha_programada: Date | string;
  fecha_realizada: Date | string;
  tipo: string;
  prioridad: string;
  descripcion: string;
  tiempo_estimado: number | null;
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

export interface EstadoInfo {
  value: string;
  label: string;
  icon: LucideIcon;
  color: string;
}