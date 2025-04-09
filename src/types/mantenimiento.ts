
import { LucideIcon } from "lucide-react";

export interface MantenimientoItem {
  id: number;
  tipo: string;
  equipo: string;
  ubicacion: string;
  estado: string;
  hora: string;
  responsable: string;
  fecha: Date;
}

export interface EstadoInfo {
  value: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

export interface StatItem extends EstadoInfo {
  count: number;
}
