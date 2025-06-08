import { useEffect, useState } from "react";
import { TonerImpresora } from "../interfaces/toner-impresora";
import { getTonerImpresora } from "@/api/axios/toner-impresora.api";

const useTonerImpresora = () => {
  const [tonerImpresora, setTonerImpresora] = useState<TonerImpresora[]>([]);
  const [newTonerImpresora, setNewTonerImpresora] = useState<TonerImpresora>({
    toner_id: 0,
    impresora_id: 0,
    toner: {
      id_toner: 0,
      modelo: "",
      color: "",
      cantidad: 0,
      stock_actual: 0,
      stock_minimo_alerta: 0,
      impresoras: [],
    },
    impresora: {
      id_impresora: 0,
      nombre: "",
      modelo: "",
      sucursal_id: 0,
      sucursales: {
        id_sucursal: 0,
        nombre: "",
        sede_id: 0,
        tipo: "",
        estado: null,
        sedes: {
          id_sede: 0,
          nombre: "",
          usuarios: [],
          estado: null,
        },
      },
    },
  });

  useEffect(() => {
    const getAllTonerImpresora = async () => {
      try {
        const data = await getTonerImpresora();
        setTonerImpresora(data);
      } catch (error) {
        console.log(error);
      }
    };

    getAllTonerImpresora();
  }, []);

  return {};
};

export default useTonerImpresora;
