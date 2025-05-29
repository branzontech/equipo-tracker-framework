/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSedes } from "@/api/axios/sedes.api";
import { useEffect, useState } from "react";

export const useSedes = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchSedesCount = async () => {
      try {
        const sedes = await getSedes();

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

  return { count };
};
