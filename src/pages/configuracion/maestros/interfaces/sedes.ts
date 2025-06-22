import { Usuario } from "../../usuarios/interfaces/usuarios";
import { Sucursal } from "./sucursales";

export interface Sede {
  id_sede: number;
  nombre: string;
  estado: string;
  sucursales?: Sucursal[];
  usuario_sede: {
    usuarios: Usuario;
  }[];
}
