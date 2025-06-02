/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSedes, createSede } from "@/api/axios/sedes.api";
import { useEffect, useState } from "react";
import { Sede } from "../interfaces/sedes";

export const useSedes = () => {
  const [count, setCount] = useState(0);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [newSede, setNewSede] = useState<Sede>({
    id_sede: 0,
    descripcion: "",
    usuarios: [],
    estado: null,
  });

  useEffect(() => {
    const fetchSedesCount = async () => {
      try {
        const sedes = await getSedes();
        setSedes(sedes);

        if (Array.isArray(sedes)) {
          setCount(sedes.length);
        } else {
          throw new Error("Formato inesperado en la respuesta");
        }
      } catch (err: any) {
        throw new Error(
          err.response?.data?.error || "Sedes no pudieron ser obtenidas"
        );
      }
    };
    fetchSedesCount();
  }, []);

  const create = async (sede: Sede) => {
    try {
      const response = await createSede(sede);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return { count, sedes, setSedes, create, newSede, setNewSede };
};
