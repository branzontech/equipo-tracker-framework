/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Perifericos } from "../interfaces/periferico";
import {
  createPeriferico,
  deletePeriferico,
  getPerifericos,
} from "@/api/axios/periferico.api";
import { toast } from "sonner";

export const usePeriferico = () => {
  const [perifericos, setPerifericos] = useState<Perifericos[]>([]);
  const [newPeriferico, setNewPeriferico] = useState<Perifericos>({
    id_periferico: 0,
    nombre: "",
    tipo: "",
    estado: null,
    equipo_asociado_id: 0,
    equipos: null,
  });

  useEffect(() => {
    const fetchPerifericos = async () => {
      try {
        const response = await getPerifericos();
        const perifericos = response.map((periferico: any) => ({
          ...periferico,
          nombre_equipo: periferico.equipos?.nombre_equipo,
        }));
        setPerifericos(perifericos);
      } catch (error) {
        toast.error(error.message)
      }
    };
    fetchPerifericos();
  }, []);

  const handleCreatePeriferico = async (periferico: Perifericos) => {
    try {
      const response = await createPeriferico(periferico);
      if (response.success) {
        toast.success(response.message || "Periferico creado exitosamente");
      }
      return response;
    } catch (error) {
      toast.error(error.message)
    }
  };

  const handleDeletePeriferico = async (id: number) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este periferico?"))
      return;
    try {
      const response = await deletePeriferico(id);

      if (response.success) {
        toast.success(response.message || "Periferico eliminado exitosamente");
      }
      return response;
    } catch (error) {
      toast.error(error.message)
    }
  };
  return {
    handleCreatePeriferico,
    handleDeletePeriferico,
    perifericos,
    setPerifericos,
    newPeriferico,
    setNewPeriferico,
  };
};
