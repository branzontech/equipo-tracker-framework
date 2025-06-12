import { useState } from "react";
import { Traslado } from "../interfaces/traslados";
import { useGlobal } from "@/hooks/use-global";
import { useSedes } from "@/pages/configuracion/maestros/hooks/use-sedes";
import { useSucursales } from "@/pages/configuracion/maestros/hooks/use-sucursales";
import { create } from "@/api/axios/traslado.api";
import { toast } from "sonner";

export const useTraslados = () => {
  const [traslados, setTraslados] = useState<Traslado[]>([]);
  const [newTraslado, setNewTraslado] = useState<Traslado>({
    id_traslado: 0,
    acta_id: 0,
    fecha_traslado: null,
    motivo: "",
    observaciones: "",
    responsable_salida_id: 0,
    responsable_entrada_id: 0,
    sucursal_destino_id: 0,
    equipos: [],
  });
  const [regionalSeleccionado, setRegionalSeleccionado] = useState("");
  const [sedesSelect, setSedesSelect] = useState<number | null>(null);
  const { sedes } = useSedes();
  const { sucursales } = useSucursales();
  const { buscarEquipo, saveSign_ } = useGlobal();

  const buscarEquipotraslados = async (serial: string) => {
    const data = await buscarEquipo(serial);
    if (data && data.id_equipo) {
      setNewTraslado((prev) => ({
        ...prev,
        equipos: [
          ...prev.equipos,
          {
            id_equipo: data.id_equipo,
            perifericos: Array.isArray(data.perifericos)
              ? data.perifericos.map((p) => p.id_periferico)
              : [],
          },
        ],
      }));
    }
  };

  const sedesFiltradas = sedes.filter(
    (sede) => sede.regional.toLowerCase() === regionalSeleccionado.toLowerCase()
  );

  const sucursalesFiltradas = sedesSelect
    ? sucursales.filter(
        (sucursal) => Number(sucursal.sedes?.id_sede) === Number(sedesSelect)
      )
    : [];

  const registerTraslado = async (traslado: Traslado, firma_entrega: string, firma_salida: string) => {
    if (!traslado.fecha_traslado) {
      toast.error("Debe ingresar una fecha de traslado");
      return;
    }

    if (!traslado.motivo) {
      toast.error("Debe ingresar un motivo");
      return;
    }

    if (!traslado.observaciones) {
      toast.error("Debe ingresar observaciones");
      return;
    }

    if (!traslado.sucursal_destino_id) {
      toast.error("Debe ingresar una sucursal de destino");
      return;
    }

    try {
      await saveSign_(
        firma_entrega,
        firma_salida,
        traslado.responsable_salida_id,
        traslado.responsable_entrada_id
      );

      const res = await create(traslado);
      if (res.success) {
        toast.success(res.message || "Traslado creado exitosamente");
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return res;
    } catch (error) {
      toast.error(error.message || "Error al crear el traslado");
    }
  };

  return {
    traslados,
    newTraslado,
    setNewTraslado,
    setTraslados,
    buscarEquipo: buscarEquipotraslados,
    sedesFiltradas,
    regionalSeleccionado,
    setRegionalSeleccionado,
    sucursalesFiltradas,
    sedesSelect,
    setSedesSelect,
    registerTraslado,
  };
};
