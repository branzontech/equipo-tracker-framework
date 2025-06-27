/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Toner } from "../interfaces/toners";
import {
  createSalidaToner,
  createToner,
  deleteToner,
  getBySerial,
  getTonerById,
  getToners,
  updateToner,
} from "@/api/axios/toners.api";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { SalidaToner } from "../interfaces/salidaToner";

export const useToners = () => {
  const [toner, setToner] = useState<Toner[]>([]);
  const [newToner, setNewToner] = useState<Toner>({
    id_toner: 0,
    modelo: "",
    serial: "",
    color: "",
    estado: "",
    cantidad: 0,
    stock_actual: 0,
    stock_minimo_alerta: 0,
    impresoras: [],
    toner_impresora: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [salidaToner, setSalidaToner] = useState<SalidaToner[]>([]);
  const [newSalidaToner, setNewSalidaToner] = useState<SalidaToner>({
    id_movimiento: 0,
    toner_id: 0,
    cantidad: 0,
    fecha: new Date(),
    impresora_destino_id: 0,
    usuario_id: 0,
    sucursal_id: 0,
    observaciones: "",
  });
  const [serialToner, setSerialToner] = useState("");
  const [sugerenciasToner, setSugerenciasToner] = useState<any[]>([]);

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
    setIsLoading(true);
    try {
      const response = await getTonerById(id);

      const cleaned = {
        ...response,
        toner_impresora:
          response.toner_impresora?.map((rel) => ({
            impresora_id: rel.impresora_id,
          })) ?? [],
      };

      setNewToner(cleaned);
      setIsLoading(false);
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

  const deleteTonerById = async (id: number) => {
    ConfirmDialog({
      title: "¿Está seguro de que desea eliminar esta toner?",
      message: "Esta acción no se puede deshacer.",
      onConfirm: async () => {
        try {
          const res = await deleteToner(id);
          if (res.success) {
            toast.success(res.message || "Toner eliminado exitosamente", {
              icon: icons.success,
            });
            setTimeout(() => window.location.reload(), 4500);
          } else {
            toast.error(res.message, {
              icon: icons.error,
            });
          }
        } catch (error) {
          toast.error(error.message, {
            icon: icons.error,
          });
        }
      },
    });
  };

  const getTonerBySerial = async (serial: string) => {
    setSerialToner(serial);
    if (serial.length >= 3) {
      try {
        const response = await getBySerial(serial);
        setSugerenciasToner(response || null);
      } catch (error) {
        toast.error(error.message, { icon: icons.error });
      }
    } else {
      setSugerenciasToner(null);
    }
  };

  const createSalida = async (salidaToner: SalidaToner) => {
    try {
      const response = await createSalidaToner(salidaToner);
      if (response.success) {
        toast.success(response.message || "Salida creada exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al crear la salida", {
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
    deleteTonerById,
    isLoading,
    setIsLoading,
    salidaToner,
    setSalidaToner,
    newSalidaToner,
    setNewSalidaToner,
    getTonerBySerial,
    serialToner,
    setSerialToner,
    sugerenciasToner,
    setSugerenciasToner,
    createSalida
  };
};
