import { useEffect, useState } from "react";
import { Impresora } from "../interfaces/impresora";
import { getImpresora, createImpresora } from "@/api/axios/impresora.api";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";

export const useImpresora = () => {
  const [impresora, setImpresa] = useState<Impresora[]>([]);
  const [newImpresora, setNewImpresora] = useState<Impresora>({
    id_impresora: 0,
    nombre: "",
    modelo: "",
    sucursal_id: 0,
    sucursales: null,
    serial: "",
    estado: null,
  });

  useEffect(() => {
    const getAllImpresora = async () => {
      try {
        const data = await getImpresora();
        setImpresa(data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    getAllImpresora();
  }, []);

  const create = async (impresora: Impresora) => {
    if (!impresora.nombre) {
      toast.error("Debe ingresar un nombre", {
        icon: icons.error,
      });
      return;
    }

    if (!impresora.modelo) {
      toast.error("Debe ingresar un modelo", {
        icon: icons.error,
      });
      return;
    }

    if (!impresora.sucursal_id) {
      toast.error("Debe seleccionar una sucursal", {
        icon: icons.error,
      });
      return;
    }

    try {
      const response = await createImpresora(impresora);
      if (response.data.success) {
        toast.success(
          response.data.message || "Impresora creada exitosamente",
          {
            icon: icons.success,
          }
        );
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }
      return response;
    } catch (error) {
      toast.error(error.message, {
        icon: icons.error,
      });
    }
  };

  return {
    impresora,
    setImpresa,
    newImpresora,
    setNewImpresora,
    create,
  };
};
