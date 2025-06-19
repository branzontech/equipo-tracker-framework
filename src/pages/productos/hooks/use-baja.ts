import { useEffect, useState } from "react";
import { Baja } from "../interfaces/bajas";
import { createBaja, getAllBajas } from "@/api/axios/baja.api";
import { toast } from "sonner";
import { useGlobal } from "@/hooks/use-global";
import { icons } from "@/components/interfaces/icons";
import { useNavigate } from "react-router-dom";

export const useBaja = () => {
  const [bajas, setbajas] = useState<Baja[]>([]);
  const [newBaja, setNewBaja] = useState<Baja>({
    id_baja: 0,
    acta_id: 0,
    fecha_baja: "",
    observaciones_adicionales: "",
    estado: "Vigente",
    responsable_autorizacion_id: 0,
    responsable_solicitud_id: 0,
    equipos: [],
  });
  const { buscarEquipo, saveSign_ } = useGlobal();
  const navigate = useNavigate();

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
    const equiposWithinMotivo = baja.equipos.some((e) => !e.motivo);
    const allEquiposWithinMotivo = baja.equipos.every((e) => !e.motivo);

    if (!baja.fecha_baja) {
      toast.error("Debe ingresar la fecha de la baja", {
        icon: icons.error,
      });
      return;
    }

    if (!baja.estado) {
      toast.error("Debe ingresar el estado de la baja", {
        icon: icons.error,
      });
      return;
    }

    if (!baja.equipos.length) {
      toast.error("Debe agregar al menos un equipo", {
        icon: icons.error,
      });
      return;
    }

    if (allEquiposWithinMotivo) {
      toast.error("Debe agregar el motivo de la baja a todos los equipos", {
        icon: icons.error,
      });
      return;
    }

    if (equiposWithinMotivo) {
      toast.error("Debe ingresar el motivo de la baja", {
        icon: icons.error,
      });
      return;
    }

    if (!baja.responsable_autorizacion_id) {
      toast.error("Debe seleccionar un responsable de autorización", {
        icon: icons.error,
      });
      return;
    }

    if (!baja.responsable_solicitud_id) {
      toast.error("Debe seleccionar un responsable de solicitud", {
        icon: icons.error,
      });
      return;
    }

    try {
      await saveSign_(
        firma_entrega,
        firma_salida,
        baja.responsable_autorizacion_id,
        baja.responsable_solicitud_id
      );
      const res = await createBaja(baja);
      if (res.success) {
        toast.success("La baja se ha agregado correctamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          navigate("/productos/actas");
          window.location.reload();
        }, 4500);
      } else {
        toast.error("Error al agregar la baja", {
          icon: icons.error,
        });
      }
    } catch (error) {
      toast.error("Error al agregar la baja", {
        icon: icons.error,
      });
    }
  };

  return {
    addBaja,
    bajas,
    newBaja,
    setNewBaja,
  };
};
