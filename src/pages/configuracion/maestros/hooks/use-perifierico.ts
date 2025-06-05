/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Perifericos } from "../interfaces/periferico";
import {
  createPeriferico,
  deletePeriferico,
  getPerifericos,
} from "@/api/axios/periferico.api";

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
        throw new Error(error.message);
      }
    };
    fetchPerifericos();
  }, []);

  const handleCreatePeriferico = async (periferico: Perifericos) => {
    try {
      const response = await createPeriferico(periferico);
      if (response.success) {
        window.location.reload();
      }
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const handleDeletePeriferico = async (id: number) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este periferico?"))
      return;
    try {
      const response = await deletePeriferico(id);

      if (response.success) {
        window.location.reload();
      }
      return response;
    } catch (error) {
      throw new Error(error.message);
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
