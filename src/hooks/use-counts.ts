import { useSedes } from "@/pages/configuracion/maestros/hooks/use-sedes";
import { useUser } from "@/pages/usuarios/hooks/use-user";

export const useCounts = () => {
  const { count: sedesCount } = useSedes();
  const { count: userCount } = useUser();

  // Aquí puedes agregar más hooks para obtener otros counts si es necesario
  // Por ejemplo, si tienes otro hook para obtener un count de "usuarios":
  // const { count: userCount } = useUsers();
  return { sedesCount, userCount };
};
