import { useEffect, useState } from "react";
import { Estados } from "../interfaces/estado";
import { createEstado, getAllEstados } from "@/api/axios/estado.api";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";

export const useEstado = () => {
  const [estados, setEstados] = useState<Estados[]>([]);
  const [newEstado, setNewEstado] = useState<Estados>({
    id_estado: 0,
    nombre_estado: "",
  });

  useEffect(() => {
    const fetchEstados = async () => {
      const estados = await getAllEstados();
      setEstados(estados);
    };
    fetchEstados();
  }, []);

  const addEstado = async (estado: Estados) => {
    if (!estado.nombre_estado) {
      toast.error("Debe ingresar un nombre", {
        icon: icons.error,
      });
      return;
    }

    try {
      const response = await createEstado(estado);

      if (response.success) {
        toast.success(response.message || "Estado creado exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al crear el estado", {
        icon: icons.error,
      });
    }
  };

  return {
    estados,
    setEstados,
    newEstado,
    setNewEstado,
    addEstado,
  };
};
