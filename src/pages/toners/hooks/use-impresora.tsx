import { useEffect, useState } from "react";
import { Impresora } from "../interfaces/impresora";
import { getImpresora, createImpresora } from "@/api/axios/impresora.api";

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
        console.log(error);
      }
    };

    getAllImpresora();
  }, []);

  const create = async (impresora: Impresora) => {
    try {
      const response = await createImpresora(impresora);
      if (response.data.success) {
        alert("Impresora registrada exitosamente");
        window.location.reload();
      }
      return response;
    } catch (error) {
      throw new Error(error.message);
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
