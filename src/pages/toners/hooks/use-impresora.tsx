import { useEffect, useState } from "react";
import { Impresora } from "../interfaces/impresora";
import { getImpresora, createImpresora } from "@/api/axios/impresora.api";
import { toast } from "sonner";

export const useImpresora = () => {
  const [impresora, setImpresa] = useState<Impresora[]>([]);
  const [newImpresora, setNewImpresora] = useState<Impresora>({
    id_impresora: 0,
    nombre: "",
    modelo: "",
    sucursal_id: 0,
  });

  useEffect(() => {
    const getAllImpresora = async () => {
      try {
        const data = await getImpresora();
        setImpresa(data);
      } catch (error) {
        toast.error(error.message)
      }
    };

    getAllImpresora();
  }, []);

  const create = async (impresora: Impresora) => {
    try {
      const response = await createImpresora(impresora);
      if (response.data.success) {
        toast.success(response.data.message || "Impresora creada exitosamente");
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }
      return response;
    } catch (error) {
      toast.error(error.message)
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
