import { Usuario } from "../../usuarios/interfaces/usuarios";

export interface Sede {
  id_sede: number;
  nombre: string;
  usuarios: Usuario[];
  estado: boolean;
}

export type EstadoType = "Activo" | "Inactivo";
