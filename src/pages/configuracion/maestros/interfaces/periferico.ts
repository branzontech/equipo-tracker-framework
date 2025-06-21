import { Equipo } from "@/pages/productos/interfaces/equipo";

export interface Perifericos {
  id_periferico: number;
  nombre: string;
  estado: string; 
  tipo: string;
  equipo_asociado_id: Equipo | number;
  equipos: Equipo | null;
}

export const listTypes = [
  { name: "Monitor", value: "Monitor" },
  { name: "Teclado", value: "Teclado" },
  { name: "Mouse", value: "Mouse" },
  { name: "Cámara", value: "Camera" },
  { name: "Altavoces", value: "Altavoces" },
  { name: "Docking Station", value: "Docking Station" },
  { name: "Adaptador", value: "Adaptador" },
  { name: "Micrófono", value: "Micrófono" },
];