import { Usuario } from "../../usuarios/interfaces/usuarios";

export interface Sede {
  id_sede: number;
  nombre: string;
  regional: string;
  usuarios: Usuario[];
  estado: string;
}
