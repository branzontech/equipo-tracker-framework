import { Sede } from "../../maestros/interfaces/sedes";
import { Sucursal } from "../../maestros/interfaces/sucursales";

export const usuarios = [
  { id: "user1", nombre: "Juan Pérez", perfil: "Técnico" },
  { id: "user2", nombre: "María García", perfil: "Administrador" },
  { id: "user3", nombre: "Carlos López", perfil: "Auditor" },
];

export type Usuario = {
  id_usuario: number;
  nombre: string;
  contraseña: string;
  email: string;
  rol: string;
  sucursales: Sucursal | null;
  usuario_sede: {
    id: number;
    id_usuario: number;
    id_sede: number;
    sedes: Sede;
  }[];

  estado: string;
  firma_entrega: string;
  firma_recibe: string;
  firma: string;
  telefono?: string;
};

export interface Firma extends Usuario {
  firma: string;
}
