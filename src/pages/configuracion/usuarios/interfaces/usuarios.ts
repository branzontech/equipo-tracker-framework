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
  sede_id: number;
  sedes: Sede | null;
  sucursales: Sucursal | null;
  estado: string;
  firma_entrega: string;
  firma_recibe: string;
  firma: string;
  telefono?: string;
};

export interface Firma extends Usuario {
  firma: string;
}
