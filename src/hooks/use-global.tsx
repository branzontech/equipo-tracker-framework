import { saveSign } from "@/api/axios/prestamo.api";
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
import { getPerifericoBySerial } from "@/api/axios/periferico.api";
import { Impresora } from "@/pages/toners/interfaces/impresora";
import { getImpresoraBySerial } from "@/api/axios/impresora.api";
import { useMantenimiento } from "@/pages/mantenimientos/hooks/use-mantenimiento";

export const useGlobal = () => {
  const { count: sedesCount } = useSedes();
  const { count: userCount } = useUser();
  const {
    count: equiposCount,
    sedesConEquiposCount,
    getInfoEquipo,
  } = useEquipos();
  const { mantenimientosData, countAtrasados } = useMantenimiento();
  const {
    findEquipoByNroSerie,
    findPerifericoBySerial,
    findImpresoraBySerial,
  } = useActa();
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
      perifericos: null,
      motivo: "",
      tags: [],
      imagen: "",
      usuario_id: "",
    },
  ]);
  const [perifericos, setPerifericos] = useState<Perifericos[]>([
    {
      id_periferico: 0,
      nombre: "",
      estado: "",
      serial: "",
      tipo: "",
      equipo_asociado_id: 0,
      equipos: null,
      marca_id: 0,
      marcas: null,
      prestamos: null,
      traslados: null,
      motivo: "",
      id_sucursal: 0,
      sucursales: null,
    },
  ]);
  const [impresoras, setImpresoras] = useState<Impresora[]>([
    {
      id_impresora: 0,
      nombre: "",
      modelo: "",
      sucursal_id: 0,
      sucursales: null,
      serial: "",
      estado: null,
      marcas: null,
      tipo: "",
      prestamos: null,
      traslados: null,
      motivo: "",
      marca_id: 0,
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

  const buscarPeriferico = async (
    serial: string
  ): Promise<Perifericos | null> => {
    try {
      const disponibilidad = await findPerifericoBySerial(serial);

      if (!disponibilidad.disponible) {
        let mensaje = "El periferico no está disponible. ";
        if (disponibilidad.enPrestamo) mensaje += "Está en préstamo. ";
        if (disponibilidad.enBaja) mensaje += "Está dado de baja. ";
        if (disponibilidad.enTraslado) mensaje += "Está en traslado. ";
        if (disponibilidad.enMantenimiento)
          mensaje += "Está en mantenimiento. ";

        toast.error(mensaje, { icon: icons.error });
        setHaBuscado(false);
        return null;
      }

      const data = await getPerifericoBySerial(serial);
      return data;
    } catch (error) {
      toast.error("No se encontró el accesorio.", {
        icon: icons.error,
      });
      return null;
    }
  };

  const buscarImpresora = async (serial: string): Promise<Impresora | null> => {
    try {
      const disponibilidad = await findImpresoraBySerial(serial);

      if (!disponibilidad.disponible) {
        let mensaje = "La impresora no está disponible. ";
        if (disponibilidad.enPrestamo) mensaje += "Está en préstamo. ";
        if (disponibilidad.enBaja) mensaje += "Está dado de baja. ";
        if (disponibilidad.enTraslado) mensaje += "Está en traslado. ";
        if (disponibilidad.enMantenimiento)
          mensaje += "Está en mantenimiento. ";

        toast.error(mensaje, { icon: icons.error });
        setHaBuscado(false);
        return null;
      }

      const data = await getImpresoraBySerial(serial);
      return data;
    } catch (error) {
      toast.error("No se encontró la impresora.", {
        icon: icons.error,
      });
      return null;
    }
  };

  const openFileInNewTab = (archivo: {
    content: string;
    tipo: string;
    nombre: string;
  }) => {
    if (!archivo?.content) return;

    // Si viene como DataURL (ej: data:application/pdf;base64,...)
    const base64Data = archivo.content.includes(",")
      ? archivo.content.split(",")[1]
      : archivo.content;

    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length)
        .fill(0)
        .map((_, i) => slice.charCodeAt(i));
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    const blob = new Blob(byteArrays, { type: archivo.tipo });
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");

    // Limpieza del objeto URL tras un tiempo
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  // Function to download a file
  const downloadFile = (archivo: {
    content: string;
    tipo: string;
    nombre: string;
  }) => {
    // If the file has no content, exit the function
    if (!archivo?.content) return;

    const base64Data = archivo.content.includes(",")
      ? archivo.content.split(",")[1]
      : archivo.content;

    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    // Convert the base64 string into byte arrays
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length)
        .fill(0)
        .map((_, i) => slice.charCodeAt(i));
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    // Create a Blob from the byte arrays
    const blob = new Blob(byteArrays, { type: archivo?.tipo });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = archivo?.nombre; // Set the file name for the download
    link.click(); // Trigger the download by simulating a click on the link
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
    buscarPeriferico,
    perifericos,
    setPerifericos,
    impresoras,
    setImpresoras,
    buscarImpresora,
    openFileInNewTab,
    downloadFile,
    mantenimientosData,
    countAtrasados
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
