
import { Lock, ListChecks } from "lucide-react";

export const modulos = {
  inventario: {
    nombre: "Inventario",
    icono: ListChecks,
    permisos: [
      "Ver lista",
      "Crear equipo",
      "Editar equipo",
      "Eliminar equipo",
      "Exportar datos",
    ],
  },
  mantenimientos: {
    nombre: "Mantenimientos",
    icono: ListChecks,
    permisos: [
      "Ver calendario",
      "Programar mantenimiento",
      "Ejecutar mantenimiento",
      "Generar reportes",
    ],
  },
  toners: {
    nombre: "Toners",
    icono: ListChecks,
    permisos: [
      "Ver existencias",
      "Registrar entrada",
      "Registrar salida",
      "Gestionar alertas",
    ],
  },
  configuracion: {
    nombre: "Configuración",
    icono: Lock,
    permisos: [
      "Gestionar maestros",
      "Gestionar usuarios",
      "Gestionar permisos",
      "Configurar sistema",
    ],
  },
};