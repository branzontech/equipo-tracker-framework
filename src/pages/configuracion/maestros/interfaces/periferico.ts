import { Equipo } from "@/pages/productos/interfaces/equipo";
import { Marca } from "./marcas";
import { Prestamo } from "@/pages/productos/interfaces/prestamo";
import { Traslado } from "@/pages/productos/interfaces/traslados";
import { Sucursal } from "./sucursales";

export interface Perifericos {
  id_periferico: number;
  nombre: string;
  estado: string;
  serial: string;
  id_sucursal: number;
  sucursales: Sucursal;
  marca_id: number;
  marcas: Marca;
  tipo: string;
  equipo_asociado_id: Equipo | number;
  equipos: Equipo | null;
  motivo: string;
  prestamos?: Prestamo;
  traslados?: Traslado;
}
