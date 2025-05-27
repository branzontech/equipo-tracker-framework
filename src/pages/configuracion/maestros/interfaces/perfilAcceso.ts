
export interface PerfilAcceso {
  id: string;
  nombre: string;
  descripcion: string;
  fechaCreacion: string;
}

export const perfilesAcceso = [
  {
    id: "admin",
    nombre: "Administrador",
    descripcion: "Acceso total al sistema",
  },
  {
    id: "tecnico",
    nombre: "Técnico",
    descripcion: "Gestión de mantenimientos e inventario",
  },
  {
    id: "auditor",
    nombre: "Auditor",
    descripcion: "Consulta y reportes",
  },
  {
    id: "auxiliar",
    nombre: "Auxiliar",
    descripcion: "Operaciones básicas",
  },
];