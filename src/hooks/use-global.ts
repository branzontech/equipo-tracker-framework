import { useSedes } from "@/pages/configuracion/maestros/hooks/use-sedes";
import { useUser } from "@/pages/usuarios/hooks/use-user";

export const useGlobal = () => {
  const { count: sedesCount } = useSedes();
  const { count: userCount } = useUser();

  const formatFecha = (fechaIso?: string) => {
    if (!fechaIso) return "No disponible";
    return new Date(fechaIso).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatPrecio = (valor?: number | string) => {
    if (!valor) return "No disponible";
    // Convertir a número, por si viene como string
    const numero = typeof valor === "string" ? Number(valor) : valor;
    if (isNaN(numero)) return "No disponible";
    return numero.toLocaleString("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Aquí puedes agregar más hooks para obtener otros counts si es necesario
  // Por ejemplo, si tienes otro hook para obtener un count de "usuarios":
  // const { count: userCount } = useUsers();
  return { sedesCount, userCount, formatFecha, formatPrecio };
};
