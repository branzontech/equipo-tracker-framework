import { useEffect, useState } from "react";
import { Permiso } from "../interfaces/permisos";
import {
  asignarPermisosPerfil,
  createPermiso,
  getPermisos,
  updatePermiso,
} from "@/api/axios/permisos.api";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";

export const usePermisos = () => {
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [newPermiso, setNewPermiso] = useState<Permiso>({
    id: 0,
    nombre_permiso: "",
    descripcion: "",
    ruta_opcional: "",
  });

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

  const create = async (data: Permiso) => {
    const res = await createPermiso(data);
    if (res.success) {
      toast.success("Permiso creado correctamente", {
        icon: icons.success,
      });
      setTimeout(() => {
        window.location.reload();
      }, 4500);
    } else {
      toast.error("No se pudo crear el permiso", {
        icon: icons.error,
      });
    }
  };

  const update = async (id: number, data: Permiso) => {
    const res = await updatePermiso(id, data);
    if (res.success) {
      toast.success("Permiso actualizado correctamente", {
        icon: icons.success,
      });
      setTimeout(() => {
        window.location.reload();
      }, 4500);
    } else {
      toast.error("No se pudo actualizar el permiso", {
        icon: icons.error,
      });
    }
  };

  return {
    permisos,
    setPermisos,
    asignarPermisos,
    newPermiso,
    setNewPermiso,
    create,
    update,
  };
};
