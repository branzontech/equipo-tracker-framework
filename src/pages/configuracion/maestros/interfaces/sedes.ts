import { Usuario } from "../../usuarios/interfaces/usuarios";

export interface Sede {
  id_sede: number;
  descripcion: string;
  usuarios: Usuario[];
  estado: "Activo" | "Inactivo";
  ubicaciones: string[];
}
