/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";

export const useSedes = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchSedesCount = async () => {
      try {
        const response = await axios.get("http://192.168.1.4:3003/api/get");
        const data = response.data?.sedes;
        if (Array.isArray(data)) {
          setCount(data.length);
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
