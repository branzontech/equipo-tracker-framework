import {
  get,
  getInfoEquipo,
  getInfoPeriferico,
  updateStatus,
} from "@/api/axios/acta.api";
import { useEffect, useState } from "react";
import { Acta } from "../interfaces/acta";
import {
  FileText,
  Grid,
  LayoutGrid,
  CheckCircle,
  XCircle,
  RotateCw,
  Truck,
  Banknote,
  ArrowUpFromLine,
  FileX,
  AlertCircle,
  User,
  Calendar,
  Tag,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";
import { vi } from "date-fns/locale";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { ActaEntregaPDF } from "../views/ActaEntregaPDF";

export const useActa = () => {
  const [acta, setActa] = useState<Acta[]>([]);
  const [dataActa, setDataActa] = useState<Acta>({
    id_acta: 0,
    tipo: null,
    fecha: null,
    prestamos: [],
    bajas: [],
    traslados: [],
    devoluciones: [],
  });
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [tipoFiltro, setTipoFiltro] = useState<string>("todos");
  const [estadoFiltro, setEstadoFiltro] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [selectedActa, setSelectedActa] = useState<Acta | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actasData, setActasData] = useState<Acta[]>([]);
  const [managementSheetOpen, setManagementSheetOpen] = useState(false);
  const [currentActa, setCurrentActa] = useState<Acta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getActas = async () => {
      const res = await get();
      setActa(res);
    };
    getActas();
  }, []);

  const itemsPerPage = 6;

  const handleVerActa = (acta: Acta) => {
    setSelectedActa(acta);
    setDialogOpen(true);
  };

  const handleManageActa = (acta: Acta) => {
    setCurrentActa(acta);
    setManagementSheetOpen(true);
  };

  const getActaData = (acta: Acta) => {
    switch (acta.tipo) {
      case "Prestamo": {
        const prestamo = acta.prestamos[0];
        return {
          usuario:
            prestamo?.usuarios_prestamos_responsable_salida_idTousuarios
              ?.nombre ?? "Sin usuario",
          estado: prestamo?.estado ?? "Sin estado",
          descripcion: prestamo?.descripcion ?? "Sin descripción",
        };
      }
      case "Baja": {
        const baja = acta.bajas[0];
        return {
          usuario:
            baja?.usuarios_bajas_responsable_solicitud_idTousuarios?.nombre ??
            "Sin usuario",
          estado: baja?.estado ?? "Sin estado",
          descripcion: baja?.observaciones_adicionales ?? "Sin descripción",
        };
      }
      case "Traslado": {
        const traslado = acta.traslados[0];
        return {
          usuario:
            traslado?.usuarios_traslados_responsable_salida_idTousuarios
              ?.nombre ?? "Sin usuario",
          estado: traslado?.estado ?? "Sin estado",
          descripcion: traslado?.motivo ?? "Sin descripción",
        };
      }
      case "Devolucion": {
        const devolucion = acta.devoluciones[0];
        return {
          usuario:
            devolucion?.usuarios_devoluciones_usuario_entrega_idTousuarios
              ?.nombre ?? "Sin usuario",
          estado: devolucion?.estado ?? "Sin estado",
          descripcion: devolucion?.observaciones ?? "Sin descripción",
        };
      }
      default:
        return {
          usuario: "Desconocido",
          estado: "N/A",
          descripcion: "",
        };
    }
  };

  const filtrarActas = () => {
    return acta.filter((acta) => {
      const { usuario, estado, descripcion } = getActaData(acta);

      const cumpleTipo = tipoFiltro === "todos" || acta.tipo === tipoFiltro;
      const cumpleEstado =
        estadoFiltro === "todos" ||
        estado.toLowerCase() === estadoFiltro.toLowerCase();
      const cumpleBusqueda =
        acta.id_acta
          .toString()
          .toLowerCase()
          .includes(busqueda.toLowerCase()) ||
        usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
        descripcion.toLowerCase().includes(busqueda.toLowerCase());

      return cumpleTipo && cumpleEstado && cumpleBusqueda;
    });
  };

  const getTipoIcon = (tipo: Acta["tipo"]) => {
    switch (tipo) {
      case "Prestamo":
        return <Banknote className="h-5 w-5 text-blue-500" />;
      case "Traslado":
        return <Truck className="h-5 w-5 text-green-500" />;
      case "Baja":
        return <FileX className="h-5 w-5 text-red-500" />;
      case "Devolucion":
        return <RotateCw className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getEstadoFromActa = (acta: Acta): string => {
    if (acta.tipo === "Prestamo" && acta.prestamos.length > 0) {
      return acta.prestamos[0].estado ?? "desconocido";
    }
    if (acta.tipo === "Traslado" && acta.traslados.length > 0) {
      return acta.traslados[0].estado ?? "desconocido";
    }
    if (acta.tipo === "Baja" && acta.bajas.length > 0) {
      return acta.bajas[0].estado ?? "desconocido";
    }
    if (acta.tipo === "Devolucion" && acta.devoluciones.length > 0) {
      return acta.devoluciones[0].estado ?? "desconocido";
    }
    return "desconocido";
  };

  const getEstadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      Pendiente: "Pendiente",
      Finalizado: "Finalizado",
      "En proceso": "En proceso",
      Satisfactoria: "Satisfactoria",
      desconocido: "Desconocido",
    };
    return labels[estado] || estado;
  };

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, string> = {
      Pendiente: "bg-green-100 text-green-800",
      Finalizado: "bg-gray-100 text-gray-800",
      "En proceso": "bg-blue-100 text-blue-800",
      desconocido: "bg-red-100 text-red-800",
      Satisfactoria: "bg-yellow-100 text-yellow-800",
      Vigente: "bg-orange-100 text-orange-800",
    };
    return variants[estado] || "bg-gray-100 text-gray-800";
  };

  const getTipoLabel = (tipo: Acta["tipo"]) => {
    const labels: Record<Acta["tipo"], string> = {
      prestamo: "Préstamo",
      traslado: "Traslado",
      baja: "Baja",
      devolucion: "Devolución",
    };
    return labels[tipo] || tipo;
  };

  const actasFiltradas = filtrarActas();
  const totalPages = Math.ceil(actasFiltradas.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentActas = actasFiltradas.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const findEquipoByNroSerie = async (nroSeries: string) => {
    const response = await getInfoEquipo(nroSeries);
    return response;
  };

  const findPerifericoBySerial = async (serial: string) => {
    const response = await getInfoPeriferico(serial);
    return response;
  };

  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {pageNumbers.map((number) => (
            <PaginationItem key={number}>
              <PaginationLink
                isActive={currentPage === number}
                onClick={() => handlePageChange(number)}
              >
                {number}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const getEquiposFromActa = (acta: Acta) => {
    const equipos: {
      serial?: string;
      nombre?: string;
      marca?: string;
      activoFijo?: string;
      tipo?: string;
      accesorios?: string;
      esPerifericoDirecto?: boolean;
    }[] = [];

    if (acta.tipo === "Prestamo") {
      const prestamo = acta.prestamos[0];
      prestamo?.prestamo_equipos.forEach((item) => {
        const equipo = item.equipos;
        const perifericos = item.prestamo_perifericos
          .map((p) => p.perifericos?.nombre)
          .filter(Boolean)
          .join(", ");
        if (equipo) {
          equipos.push({
            serial: equipo.nro_serie,
            nombre: equipo.nombre_equipo,
            marca: equipo.marcas?.nombre || "-",
            activoFijo: equipo.tipo_activo || "-",
            accesorios: perifericos || "-",
            esPerifericoDirecto: false,
          });
        }
      });

      prestamo?.prestamo_perifericos_directos.forEach((item) => {
        const periferico = item.perifericos;
        if (periferico) {
          equipos.push({
            serial: periferico.serial || "-", 
            nombre: periferico.nombre || "-",
            marca: periferico.marcas?.nombre || "-",
            tipo: periferico.tipo || "-",
            esPerifericoDirecto: true,
          });
        }
      });
    }

    if (acta.tipo === "Traslado") {
      const traslado = acta.traslados[0];
      traslado?.traslados_equipos.forEach((item) => {
        const equipo = item.equipos;
        const perifericos = item.traslados_perifericos
          .map((p) => p.perifericos?.nombre)
          .filter(Boolean)
          .join(", ");
        if (equipo) {
          equipos.push({
            serial: equipo.nro_serie,
            nombre: equipo.nombre_equipo,
            marca: equipo.marcas?.nombre || "-",
            activoFijo: equipo.tipo_activo || "-",
            accesorios: perifericos || "-",
          });
        }
      });
    }

    if (acta.tipo === "Baja") {
      const baja = acta.bajas[0];
      baja?.bajas_equipos.forEach((item) => {
        const equipo = item.equipos;
        if (equipo) {
          equipos.push({
            serial: equipo.nro_serie,
            nombre: equipo.nombre_equipo,
            marca: equipo.marcas?.nombre || "-",
            activoFijo: equipo.tipo_activo || "-",
          });
        }
      });
    }

    if (acta.tipo === "Devolucion") {
      const devolucion = acta.devoluciones[0];

      if (devolucion?.prestamos) {
        devolucion.prestamos.prestamo_equipos.forEach((item) => {
          const equipo = item.equipos;
          const perifericos = item.prestamo_perifericos
            .map((p) => p.perifericos?.nombre)
            .filter(Boolean)
            .join(", ");
          if (equipo) {
            equipos.push({
              serial: equipo.nro_serie,
              nombre: equipo.nombre_equipo,
              marca: equipo.marcas?.nombre || "-",
              activoFijo: equipo.tipo_activo || "-",
              accesorios: perifericos || "-",
            });
          }
        });
      }

      if (devolucion?.traslados) {
        devolucion.traslados.traslados_equipos.forEach((item) => {
          const equipo = item.equipos;
          const perifericos = item.traslados_perifericos
            .map((p) => p.perifericos?.nombre)
            .filter(Boolean)
            .join(", ");
          if (equipo) {
            equipos.push({
              serial: equipo.nro_serie,
              nombre: equipo.nombre_equipo,
              marca: equipo.marcas?.nombre || "-",
              activoFijo: equipo.tipo_activo || "-",
              accesorios: perifericos || "-",
            });
          }
        });
      }
    }

    return equipos;
  };

  const getFirmas = (acta: Acta) => {
    let firmaEntrega = null;
    let nombreEntrega = null;
    let firmaRecibe = null;
    let nombreRecibe = null;

    if (acta.tipo === "Prestamo") {
      firmaEntrega =
        acta.prestamos[0].usuarios_prestamos_responsable_salida_idTousuarios
          ?.firma || null;
      nombreEntrega =
        acta.prestamos[0].usuarios_prestamos_responsable_salida_idTousuarios
          ?.nombre || null;

      firmaRecibe =
        acta.prestamos[0].usuarios_prestamos_responsable_entrada_idTousuarios
          ?.firma || null;
      nombreRecibe =
        acta.prestamos[0].usuarios_prestamos_responsable_entrada_idTousuarios
          ?.nombre || null;
    }

    if (acta.tipo === "Traslado") {
      firmaEntrega =
        acta.traslados[0].usuarios_traslados_responsable_salida_idTousuarios
          ?.firma || firmaEntrega;
      nombreEntrega =
        acta.traslados[0].usuarios_traslados_responsable_salida_idTousuarios
          ?.nombre || nombreEntrega;

      firmaRecibe =
        acta.traslados[0].usuarios_traslados_responsable_entrada_idTousuarios
          ?.firma || firmaRecibe;
      nombreRecibe =
        acta.traslados[0].usuarios_traslados_responsable_entrada_idTousuarios
          ?.nombre || nombreRecibe;
    }

    if (acta.tipo === "Baja") {
      firmaEntrega =
        acta.bajas[0].usuarios_bajas_responsable_autorizacion_idTousuarios
          ?.firma || firmaEntrega;
      nombreEntrega =
        acta.bajas[0].usuarios_bajas_responsable_autorizacion_idTousuarios
          ?.nombre || nombreEntrega;

      firmaRecibe =
        acta.bajas[0].usuarios_bajas_responsable_solicitud_idTousuarios
          ?.firma || firmaRecibe;
      nombreRecibe =
        acta.bajas[0].usuarios_bajas_responsable_solicitud_idTousuarios
          ?.nombre || nombreRecibe;
    }

    if (acta.tipo === "Devolucion") {
      firmaEntrega =
        acta.devoluciones[0].usuarios_devoluciones_usuario_entrega_idTousuarios
          ?.firma || firmaEntrega;
      nombreEntrega =
        acta.devoluciones[0].usuarios_devoluciones_usuario_entrega_idTousuarios
          ?.nombre || nombreEntrega;

      firmaRecibe =
        acta.devoluciones[0].usuarios_devoluciones_usuario_recibe_idTousuarios
          ?.firma || firmaRecibe;
      nombreRecibe =
        acta.devoluciones[0].usuarios_devoluciones_usuario_recibe_idTousuarios
          ?.nombre || nombreRecibe;
    }

    return {
      firmaEntrega,
      nombreEntrega,
      firmaRecibe,
      nombreRecibe,
    };
  };

  const handleStatusChange = async (acta: Acta, newStatus: string) => {
    try {
      let id: number;

      if (acta.tipo === "Prestamo") {
        id = acta.prestamos[0]?.id_prestamo;
      } else if (acta.tipo === "Traslado") {
        id = acta.traslados[0]?.id_traslado;
      } else if (acta.tipo === "Baja") {
        id = acta.bajas[0]?.id_baja;
      }

      if (!id) {
        toast.error("No se pudo obtener el ID del acta correspondiente");
        return;
      }

      const res = await updateStatus(
        id,
        newStatus,
        acta.tipo,
        acta.bajas[0]?.bajas_equipos
      );

      if (res) {
        toast.success("Estado actualizado correctamente", {
          icon: icons.success,
        });

        setManagementSheetOpen(false);

        setTimeout(() => {
          window.location.reload();
        }, 4500);
      } else {
        toast.error("Error al actualizar el estado", {
          icon: icons.error,
        });
      }
    } catch (error) {
      toast.error("Error al actualizar el estado", {
        icon: icons.error,
      });
    }
  };

  const generarYDescargarPDF = async (data: Acta) => {
    if (!data || !data.tipo) {
      toast.error("Debe ingresar un acta válida", {
        icon: icons.error,
      });
      return;
    }

    try {
      const blob = await pdf(<ActaEntregaPDF data={data} />).toBlob();

      const tipo = data.tipo;
      let nombre: string;

      switch (tipo) {
        case "Prestamo":
          nombre = "Acta de Salida de Equipos en Condición de Préstamo";
          break;
        case "Traslado":
          nombre = "Acta de Traslado de Equipos";
          break;
        case "Baja":
          nombre = "Acta de Baja de Equipos";
          break;
        case "Devolucion":
          nombre = "Acta de Devolución de Equipos";
          break;
        default:
          nombre = "Acta de Salida de Equipos en Condición de Préstamo";
          break;
      }
      saveAs(blob, nombre + ".pdf");
    } catch (error) {
      toast.error("Error al generar el PDF" + error, {
        icon: icons.error,
      });
    }
  };

  return {
    acta,
    setActa,
    dataActa,
    setDataActa,
    viewMode,
    setViewMode,
    itemsPerPage,
    handleVerActa,
    handleManageActa,
    getActaData,
    filtrarActas,
    getTipoIcon,
    getEstadoFromActa,
    getEstadoLabel,
    getEstadoBadge,
    getTipoLabel,
    actasFiltradas,
    totalPages,
    indexOfLastItem,
    indexOfFirstItem,
    currentActas,
    pageNumbers,
    handlePageChange,
    PaginationControls,
    setBusqueda,
    setTipoFiltro,
    setEstadoFiltro,
    busqueda,
    tipoFiltro,
    estadoFiltro,
    setDialogOpen,
    dialogOpen,
    selectedActa,
    setSelectedActa,
    getEquiposFromActa,
    getFirmas,
    currentActa,
    actasData,
    managementSheetOpen,
    setManagementSheetOpen,
    handleStatusChange,
    generarYDescargarPDF,
    findEquipoByNroSerie,
    findPerifericoBySerial,
  };
};
