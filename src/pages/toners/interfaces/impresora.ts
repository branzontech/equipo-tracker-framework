import { Marca } from "@/pages/configuracion/maestros/interfaces/marcas";
import { Sucursal } from "@/pages/configuracion/maestros/interfaces/sucursales";
import { Prestamo } from "@/pages/productos/interfaces/prestamo";
import { Traslado } from "@/pages/productos/interfaces/traslados";

export interface Impresora {
  id_impresora: number;
  nombre: string;
  modelo: string;
  serial: string;
  estado: string;
  sucursal_id: Sucursal | number;
  sucursales: Sucursal;
  marcas: Marca;
  tipo: string;

  prestamos?: Prestamo;
  traslado?: {
    traslados: Traslado;
  }[];
}
