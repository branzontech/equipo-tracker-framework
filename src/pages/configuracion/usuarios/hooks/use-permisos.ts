import { useEffect, useState } from "react";
import { Permiso } from "../interfaces/permisos";
import { asignarPermisosPerfil, getPermisos } from "@/api/axios/permisos.api";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";

export const usePermisos = () => {
  const [permisos, setPermisos] = useState<Permiso[]>([]);

  useEffect(() => {
    const fetchPermisos = async () => {
      const permisos = await getPermisos();
      setPermisos(permisos);
    };

    fetchPermisos();
  }, []);

  const asignarPermisos = async (perfilId: number, permisoIds: number[]) => {
    const res = await asignarPermisosPerfil(perfilId, permisoIds);
    if (res.success) {
      toast.success("Permisos asignados correctamente", {
        icon: icons.success,
      });
      setTimeout(() => {
        window.location.reload();
      }, 4500);
    } else {
      toast.error("No se pudieron asignar los permisos", {
        icon: icons.error,
      });
    }
  };

  return {
    permisos,
    setPermisos,
    asignarPermisos,
  };
};
