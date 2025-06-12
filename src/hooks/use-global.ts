import { saveSign } from "@/api/axios/prestamo.api";
import { getSedeById } from "./../api/axios/sedes.api";
import { useSedes } from "@/pages/configuracion/maestros/hooks/use-sedes";
import { Perifericos } from "@/pages/configuracion/maestros/interfaces/periferico";
import { useEquipos } from "@/pages/productos/hooks/use-equipos";
import { Equipo } from "@/pages/productos/interfaces/equipo";
import { useUser } from "@/pages/usuarios/hooks/use-user";
import { useState } from "react";
import { toast } from "sonner";

export const useGlobal = () => {
  const { count: sedesCount } = useSedes();
  const { count: userCount } = useUser();
  const {
    count: equiposCount,
    sedesConEquiposCount,
    getInfoEquipo,
  } = useEquipos();
  const [haBuscado, setHaBuscado] = useState(false);
  const [accesorios, setAccesorios] = useState<Perifericos[]>([]);
  const [equipo, setEquipo] = useState<Equipo[]>([
    {
      id_equipo: Date.now(),
      nombre_equipo: "",
      nro_serie: "",
      modelo: "",
      marca_id: 0,
      marcas: null,
      categoria_id: 0,
      categorias: null,
      tipo_activo: "",
      fecha_registro: "",
      sucursal_id: 0,
      sucursales: null,
      garantia_fecha_fin: "",
      estado_actual: "",
      perifericos: null,
    },
  ]);

  const formatFecha = (fechaIso?: string) => {
    if (!fechaIso) return "No disponible";
    return new Date(fechaIso).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatPrecio = (valor?: number | string) => {
    if (!valor) return "No disponible";
    // Convertir a número, por si viene como string
    const numero = typeof valor === "string" ? Number(valor) : valor;
    if (isNaN(numero)) return "No disponible";
    return numero.toLocaleString("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const buscarEquipo = async (serial: string): Promise<Equipo | null> => {
    try {
      const data = await getInfoEquipo(serial);
      if (data && data.id_equipo) {
        setEquipo([data]);
        setHaBuscado(true);
        setAccesorios(data.perifericos || []);
        return data;
      } else {
        toast.error("No se encontró el equipo.");
        setHaBuscado(false);
        setEquipo([]);
        setAccesorios([]);
        return null;
      }
    } catch (error) {
      toast.error("No se encontró el equipo.");
      setHaBuscado(false);
      setAccesorios([]);
      return null;
    }
  };

  const saveSign_ = async (
    firma_entrega: string,
    firma_salida: string,
    responsable_salida_id: number,
    responsable_entrada_id: number
  ) => {
    if (!firma_entrega || !firma_salida) {
      toast.error("Debe ingresar una firma");
      return;
    }
    try {
      const response = await saveSign(
        firma_entrega,
        firma_salida,
        responsable_salida_id,
        responsable_entrada_id
      );
      return response;
    } catch (error) {
      toast.error(error.message || "Error al guardar la firma");
    }
  };

  return {
    sedesCount,
    userCount,
    equiposCount,
    sedesConEquiposCount,
    formatFecha,
    formatPrecio,
    haBuscado,
    accesorios,
    equipo,
    setHaBuscado,
    setAccesorios,
    setEquipo,
    getInfoEquipo,
    buscarEquipo,
    saveSign_,
  };
};
