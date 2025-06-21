import { saveSign } from "@/api/axios/prestamo.api";
import { getSedeById } from "../api/axios/sedes.api";
import { useSedes } from "@/pages/configuracion/maestros/hooks/use-sedes";
import { Perifericos } from "@/pages/configuracion/maestros/interfaces/periferico";
import { useEquipos } from "@/pages/productos/hooks/use-equipos";
import { Equipo } from "@/pages/productos/interfaces/equipo";
import { useUser } from "@/pages/usuarios/hooks/use-user";
import { useState } from "react";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";
import { useActa } from "@/pages/productos/hooks/use-acta";
import {
  CheckCircle,
  FileX,
  Wrench,
  ArrowRightLeft,
  Truck,
  XCircle,
} from "lucide-react";
import { format, toZonedTime } from "date-fns-tz";
import { es } from "date-fns/locale";
import { parseISO } from "date-fns";

export const useGlobal = () => {
  const { count: sedesCount } = useSedes();
  const { count: userCount } = useUser();
  const {
    count: equiposCount,
    sedesConEquiposCount,
    getInfoEquipo,
  } = useEquipos();
  const { findEquipoByNroSerie } = useActa();
  const [haBuscado, setHaBuscado] = useState(false);
  const [accesorios, setAccesorios] = useState<Perifericos[]>([]);
  const [equipo, setEquipo] = useState<Equipo[]>([
    {
      sedes: null,
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
      motivo: "",
    },
  ]);

  const formatPrecio = (valor?: number | string) => {
    if (!valor) return "No disponible";
    const numero = typeof valor === "string" ? Number(valor) : valor;
    if (isNaN(numero)) return "No disponible";
    return numero.toLocaleString("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const buscarEquipo = async (serial: string): Promise<Equipo | null> => {
    try {
      // 1. Consultar disponibilidad ANTES de buscar el equipo completo
      const disponibilidad = await findEquipoByNroSerie(serial);

      if (!disponibilidad.disponible) {
        let mensaje = "El equipo no está disponible. ";
        if (disponibilidad.enPrestamo) mensaje += "Está en préstamo. ";
        if (disponibilidad.enBaja) mensaje += "Está dado de baja. ";
        if (disponibilidad.enTraslado) mensaje += "Está en traslado. ";
        if (disponibilidad.enMantenimiento)
          mensaje += "Está en mantenimiento. ";

        toast.error(mensaje, { icon: icons.error });
        setHaBuscado(false);
        return null;
      }

      const data = await getInfoEquipo(serial);

      if (data && data.id_equipo) {
        setEquipo((prevEquipos) => {
          // Busca el índice del equipo que tenga ese serial
          const index = prevEquipos.findIndex((e) => e.nro_serie === serial);

          if (index !== -1) {
            const equipoAnterior = prevEquipos[index];
            // Mantén los datos ya escritos (como el motivo) y actualiza el resto
            const actualizado = {
              ...equipoAnterior,
              ...data, // sobrescribe con lo que vino del backend
              motivo: equipoAnterior.motivo, // mantiene el motivo si lo tenía
            };

            const nuevos = [...prevEquipos];
            nuevos[index] = actualizado;
            return nuevos;
          }

          // Si no lo encontró, lo agrega al final
          return [...prevEquipos, data];
        });

        setHaBuscado(true);
        const equipoConPerifericos = {
          ...data,
          perifericos: data.perifericos || [],
        };

        setEquipo((prevEquipos) => {
          const index = prevEquipos.findIndex((e) => e.nro_serie === serial);

          if (index !== -1) {
            const actualizado = {
              ...prevEquipos[index],
              ...equipoConPerifericos,
              motivo: prevEquipos[index].motivo,
            };

            const nuevos = [...prevEquipos];
            nuevos[index] = actualizado;
            return nuevos;
          }

          return [...prevEquipos, equipoConPerifericos];
        });

        return data;
      } else {
        toast.error("No se encontró el equipo.", {
          icon: icons.error,
        });
        setHaBuscado(false);
        return null;
      }
    } catch (error) {
      toast.error("No se encontró el equipo.", {
        icon: icons.error,
      });
      setHaBuscado(false);
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
      toast.error("Debe ingresar una firma", {
        icon: icons.error,
      });
      return;
    }

    if (!responsable_salida_id) {
      toast.error("Debe seleccionar un responsable de salida", {
        icon: icons.error,
      });
      return;
    }

    if (!responsable_entrada_id) {
      toast.error("Debe seleccionar un responsable de entrada", {
        icon: icons.error,
      });
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
      toast.error(error.message || "Error al guardar la firma", {
        icon: icons.error,
      });
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const normalized = status.toLowerCase();

    switch (normalized) {
      case "activo":
        return (
          <div className="flex items-center space-x-1 text-green-700">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Activo</span>
          </div>
        );
      case "inactivo":
        return (
          <div className="flex items-center space-x-1 text-red-700">
            <XCircle className="h-4 w-4 text-red-500" />
            <span>Inactivo</span>
          </div>
        );
      case "fuera de servicio":
        return (
          <div className="flex items-center space-x-1 text-gray-700">
            <FileX className="mr-2 h-4 w-4 text-gray-500" />
            <span>Fuera de servicio</span>
          </div>
        );
      case "en mantenimiento":
        return (
          <div className="flex items-center space-x-1 text-red-700">
            <Wrench className="h-4 w-4 text-red-500" />
            <span>Mantenimiento</span>
          </div>
        );
      case "en préstamo":
        return (
          <div className="flex items-center space-x-1 text-amber-700">
            <ArrowRightLeft className="h-4 w-4 text-amber-500" />
            <span>En prestamo</span>
          </div>
        );
      case "en traslado":
        return (
          <div className="flex items-center space-x-1 text-blue-700">
            <Truck className="h-4 w-4 text-blue-500" />
            <span>En traslado</span>
          </div>
        );

      default:
        return (
          <div className="flex items-center space-x-1 text-slate-600">
            <FileX className="h-4 w-4 text-slate-400" />
            <span>{status}</span>
          </div>
        );
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
    StatusBadge,
  };
};

export const formatFecha = (fechaIso?: string | Date) => {
  if (!fechaIso) return "No disponible";

  const zona = "America/Bogota";
  let fecha: Date;

  if (typeof fechaIso === "string") {
    // Parseamos la cadena ISO a objeto Date
    fecha = parseISO(fechaIso);

    // Si la hora es medianoche UTC, hay riesgo de que al convertir a zona horaria se reste un día
    // Por eso, forzamos la hora a las 12:00 UTC
    const isMedianocheUTC =
      fecha.getUTCHours() === 0 &&
      fecha.getUTCMinutes() === 0 &&
      fecha.getUTCSeconds() === 0;

    if (isMedianocheUTC) {
      fecha.setUTCHours(12, 0, 0, 0); // 👈 evita que se reste un día al convertir a Bogotá
    }
  } else {
    fecha = fechaIso;
  }

  const fechaZonificada = toZonedTime(fecha, zona);

  return format(fechaZonificada, "d 'de' MMMM 'de' yyyy", {
    timeZone: zona,
    locale: es,
  });
};
