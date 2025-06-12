import { useEffect, useState } from "react";
import { Baja } from "../interfaces/bajas";
import { createBaja, getAllBajas } from "@/api/axios/baja.api";
import { toast } from "sonner";
import { useGlobal } from "@/hooks/use-global";

export const useBaja = () => {
  const [bajas, setbajas] = useState<Baja[]>([]);
  const [newBaja, setNewBaja] = useState<Baja>({
    id_baja: 0,
    acta_id: 0,
    fecha_baja: "",
    observaciones_adicionales: "",
    estado: "",
    responsable_autorizacion_id: 0,
    responsable_solicitud_id: 0,
    equipos: [],
  });
  const { buscarEquipo, saveSign_ } = useGlobal();

  useEffect(() => {
    const fetchBajas = async () => {
      const res = await getAllBajas();
      if (res.success) {
        setbajas(res.data);
      } else {
        toast.error("Error al obtener las bajas");
      }
    };
    fetchBajas();
  }, []);

  const addBaja = async (
    baja: Baja,
    firma_entrega: string,
    firma_salida: string
  ) => {
    try {
      await saveSign_(
        firma_entrega,
        firma_salida,
        baja.responsable_autorizacion_id,
        baja.responsable_solicitud_id
      );
      const res = await createBaja(baja);
      if (res.success) {
        toast.success("La baja se ha agregado correctamente");
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      } else {
        toast.error("Error al agregar la baja");
      }
    } catch (error) {
      toast.error("Error al agregar la baja");
    }
  };

  return {
    addBaja,
    bajas,
    newBaja,
    setNewBaja,
  };
};
