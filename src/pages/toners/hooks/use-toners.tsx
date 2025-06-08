import { useEffect, useState } from "react";
import { Toner } from "../interfaces/toners";
import { createToner, getToners } from "@/api/axios/toners.api";
import { toast } from "sonner";

export const useToners = () => {
  const [toner, setToner] = useState<Toner[]>([]);
  const [newToner, setNewToner] = useState<Toner>({
    id_toner: 0,
    modelo: "",
    color: "",
    cantidad: 0,
    stock_actual: 0,
    stock_minimo_alerta: 0,
    impresoras: [],
  });

  useEffect(() => {
    const getAllToners = async () => {
      try {
        const data = await getToners();
        setToner(data);
      } catch (error) {
        console.log(error);
      }
    };

    getAllToners();
  }, []);

  const create = async (toner: Toner) => {
    try {
      const response = await createToner(toner);
      if (response.success) {
        toast.success(response.message || "Toner creado exitosamente");
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message);
    }
  };

  return {
    toner,
    setToner,
    newToner,
    setNewToner,
    create,
  };
};
