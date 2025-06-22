import { Usuario } from "../../usuarios/interfaces/usuarios";
import { Sucursal } from "./sucursales";

export interface Sede {
  id_sede: number;
  nombre: string;
  usuarios: Usuario[];
  estado: string;
  sucursales?: Sucursal[];
}
