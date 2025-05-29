import { useSedes } from "@/pages/configuracion/maestros/hooks/use-sedes";

export const useCounts = () => {
  const { count } = useSedes();
  const sedesCount = count;

  // Aquí puedes agregar más hooks para obtener otros counts si es necesario
  // Por ejemplo, si tienes otro hook para obtener un count de "usuarios":
  // const { count: userCount } = useUsers();
  return { sedesCount };
};
