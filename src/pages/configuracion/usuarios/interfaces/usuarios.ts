
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
  activo: boolean;
};
