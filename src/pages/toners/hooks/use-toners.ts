import { useEffect, useState } from "react";
import { Toner } from "../interfaces/toners";
import { createToner, getTonerById, getToners, updateToner } from "@/api/axios/toners.api";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";

export const useToners = () => {
  const [toner, setToner] = useState<Toner[]>([]);
  const [newToner, setNewToner] = useState<Toner>({
    id_toner: 0,
    modelo: "",
    color: "",
    estado: "",
    cantidad: 0,
    stock_actual: 0,
    stock_minimo_alerta: 0,
    impresoras: [],
    toner_impresora: [],
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
    if (!toner.modelo) {
      toast.error("Debe ingresar un modelo", {
        icon: icons.error,
      });
      return;
    }

    if (!toner.color) {
      toast.error("Debe seleccionar un color", {
        icon: icons.error,
      });
      return;
    }

    if (!toner.stock_minimo_alerta) {
      toast.error("Debe ingresar un stock mínimo de alerta", {
        icon: icons.error,
      });
      return;
    }

    if (!toner.impresoras.length) {
      toast.error("Debe seleccionar una impresora", {
        icon: icons.error,
      });
      return;
    }

    if (!toner.stock_actual) {
      toast.error("Debe ingresar un stock actual", {
        icon: icons.error,
      });
      return;
    }

    if (!toner.cantidad) {
      toast.error("Debe ingresar una cantidad", {
        icon: icons.error,
      });
      return;
    }

    try {
      const response = await createToner(toner);
      if (response.success) {
        toast.success(response.message || "Toner creado exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message, {
        icon: icons.error,
      });
    }
  };

  const getById = async (id: number) => {
    try {
      const response = await getTonerById(id);
      setNewToner(response);
    } catch (error) {
      toast.error(error.message, {
        icon: icons.error,
      });
    }
  };

  const update = async (id: number, toner: Toner) => {
    try {
      const response = await updateToner(id, toner);
      if (response.success) {
        toast.success(response.message || "Toner actualizado exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message, {
        icon: icons.error,
      });
    }
  };

  return {
    toner,
    setToner,
    newToner,
    setNewToner,
    create,
    getById,
    update,
  };
};
