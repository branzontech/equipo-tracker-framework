import { useEffect, useState } from "react";
import { Tipos } from "../interfaces/tipos";
import { createTipo, getAllTipos } from "@/api/axios/tipos.api";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";

export const useTipos = () => {
  const [tipos, setTipos] = useState<Tipos[]>([]);
  const [newTipo, setNewTipo] = useState<Tipos>({ id_tipo: 0, nombre_tipo: "" });

  useEffect(() => {
    const fetchTipos = async () => {
      const tipos = await getAllTipos();
      setTipos(tipos);
    };
    fetchTipos();
  }, []);

  const addTipo = async (tipo: Tipos) => {
    if (!tipo.nombre_tipo) {
      toast.error("Debe ingresar un nombre", {
        icon: icons.error,
      });
      return;
    }

    try {
      const response = await createTipo(tipo);
      if (response.success) {
        toast.success(response.message || "Tipo creado exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al crear el tipo", {
        icon: icons.error,
      });
    }
  };

  return {
    tipos,
    setTipos,
    newTipo,
    setNewTipo,
    addTipo,
  };
};
