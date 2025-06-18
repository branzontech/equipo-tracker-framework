import { useEffect, useState } from "react";
import { Mantenimiento, TableColumn } from "../interfaces/mantenimiento";
import {
  create,
  getAll,
  getById,
  getFiles,
  updateStatus,
  uploadFiles,
} from "@/api/axios/mante.api";
import { toast } from "sonner";
import { Equipo } from "@/pages/productos/interfaces/equipo";
import { icons } from "@/components/interfaces/icons";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, AlertCircle, Pause, Play, Rocket } from "lucide-react";

const listadoChequeo = [
  "Limpieza de hardware",
  "Actualización de software",
  "Verificación de componentes",
  "Pruebas de rendimiento",
  "Respaldo de información",
  "Limpieza de ventiladores",
  "Verificación de temperatura",
  "Revisión de batería",
  "Actualización de drivers",
  "Desfragmentación de disco",
];

export const useMantenimiento = () => {
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [newMante, setNewMante] = useState<Mantenimiento>({
    id_mantenimiento: 0,
    id_equipo: 0,
    equipos: null,
    id_impresora: 0,
    tecnico_id: 0,
    usuarios: null,
    fecha_programada: null,
    fecha_realizada: null,
    tipo: "",
    prioridad: "",
    descripcion: "",
    tiempo_estimado: 0,
    recomendaciones: "",
    observaciones_adi: "",
    estado: "Pendiente",
    progreso: 0,

    archivosmantenimiento: [],
  });
  const [currentTab, setCurrentTab] = useState("equipo");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(
    null
  );
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtroResponsable, setFiltroResponsable] = useState<string>("all");
  const [filtroEstado, setFiltroEstado] = useState<string>("all");
  const [filtroFechaDesde, setFiltroFechaDesde] = useState<Date | undefined>(
    undefined
  );
  const [filtroFechaHasta, setFiltroFechaHasta] = useState<Date | undefined>(
    undefined
  );
  const [isSearching, setIsSearching] = useState(false);
  const [tipoMantenimiento, setTipoMantenimiento] = useState("todos");
  const [selectedSede, setSelectedSede] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSucursal, setSelectedSucursal] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMantenimientos = async () => {
      const mantenimientos = await getAll();

      // verificar que la fecha del mantenimeinto sea igual a la de hoy
      // y actulizar el estado
      const hoy = new Date();
      mantenimientos.forEach((mantenimiento) => {
        const fechaProgramada = new Date(mantenimiento.fecha_programada);

        const esHoy =
          fechaProgramada.getUTCDate() === hoy.getUTCDate() &&
          fechaProgramada.getUTCMonth() === hoy.getUTCMonth() &&
          fechaProgramada.getUTCFullYear() === hoy.getUTCFullYear();

        if (esHoy && mantenimiento.estado === "Pendiente") {
          updateStatus(mantenimiento.id_mantenimiento, "iniciado");
        }
      });
      setMantenimientos(mantenimientos);
    };
    fetchMantenimientos();
  }, []);

  const camposPorTab = {
    equipo: [
      { valor: newMante.id_equipo, mensaje: "Debe seleccionar un equipo" },
    ],
    detalles: [
      {
        valor: newMante.tipo,
        mensaje: "Debe seleccionar un tipo de mantenimiento",
      },
      { valor: newMante.prioridad, mensaje: "Debe seleccionar una prioridad" },
      { valor: newMante.tecnico_id, mensaje: "Debe seleccionar un técnico" },
      {
        valor: newMante.descripcion,
        mensaje: "Debe ingresar una descripción",
      },
    ],
    programacion: [
      {
        valor: newMante.tiempo_estimado,
        mensaje: "Debe ingresar un tiempo estimado",
      },
      {
        valor: newMante.fecha_programada,
        mensaje: "Debe ingresar una fecha de programación",
      },
      {
        valor: newMante.recomendaciones,
        mensaje: "Debe ingresar las recomendaciones",
      },
      {
        valor: newMante.observaciones_adi,
        mensaje: "Debe ingresar las observaciones adicionales",
      },
    ],
  };

  const nextTab = () => {
    const campos = camposPorTab[currentTab];

    const error = campos.some((campo) => {
      if (!campo.valor) {
        toast.error(campo.mensaje, {
          icon: icons.error,
        });
        return true;
      }
      return false;
    });

    if (error) return;

    if (currentTab === "equipo") {
      setCurrentTab("detalles");
    } else if (currentTab === "detalles") {
      setCurrentTab("programacion");
    }
  };

  const previousTab = () => {
    if (currentTab === "detalles") {
      setCurrentTab("equipo");
    } else if (currentTab === "programacion") {
      setCurrentTab("detalles");
    }
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  const onSubmit = async (data: Mantenimiento) => {
    try {
      const response = await create(data);
      if (response.success) {
        toast.success("Mantenimiento creado exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          navigate("/mantenimientos/programacion");
        }, 4500);
      }
    } catch (error) {
      toast.error("Error al crear mantenimiento", {
        icon: icons.error,
      });
    }
  };

  const mantenimientosFiltrados = mantenimientos.filter((mantenimiento) => {
    const cumpleBusqueda =
      !searchTerm ||
      mantenimiento.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mantenimiento.equipos.nombre_equipo
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      mantenimiento.usuarios.nombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      mantenimiento.usuarios.nombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const cumpleTipo =
      tipoMantenimiento === "todos" ||
      mantenimiento.tipo.toLowerCase() === tipoMantenimiento.toLowerCase();

    const cumpleSearch =
      !searchQuery ||
      mantenimiento.equipos.nombre_equipo
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      mantenimiento.usuarios.nombre
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      mantenimiento.estado.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mantenimiento.tipo.toLowerCase().includes(searchQuery.toLowerCase());

    const cumpleResponsable =
      filtroResponsable === "all" ||
      mantenimiento.usuarios.nombre === filtroResponsable;

    const cumpleEstado =
      filtroEstado === "all" || mantenimiento.estado === filtroEstado;

    const fechaProgramada = new Date(mantenimiento.fecha_programada);
    const cumpleFechaDesde =
      !filtroFechaDesde || fechaProgramada >= filtroFechaDesde;

    const cumpleFechaHasta =
      !filtroFechaHasta || fechaProgramada <= filtroFechaHasta;

    const cumpleSede =
      selectedSede === "all" ||
      mantenimiento.equipos?.sucursales?.sedes?.id_sede?.toString() ===
        selectedSede;

    const cumpleSucursal =
      selectedSucursal === "all" ||
      mantenimiento.equipos?.sucursales?.id_sucursal?.toString() ===
        selectedSucursal;

    return (
      cumpleBusqueda &&
      cumpleTipo &&
      cumpleSearch &&
      cumpleResponsable &&
      cumpleEstado &&
      cumpleFechaDesde &&
      cumpleFechaHasta &&
      cumpleSede &&
      cumpleSucursal
    );
  });

  const resetFilters = () => {
    setTipoMantenimiento("todos");
    setSearchQuery("");
    setFiltroResponsable("all");
    setFiltroEstado("all");
    setFiltroFechaDesde(undefined);
    setFiltroFechaHasta(undefined);
    setIsSearching(false);
  };

  const handleSearch = () => {
    setIsSearching(true);
    toast.success("Filtros aplicados correctamente");
  };

  const [mainTableColumns, setMainTableColumns] = useState<TableColumn[]>([
    {
      id: "equipo_id",
      label: "Equipo",
      accessor: "equipo_id",
      isVisible: true,
      order: 1,
    },
    {
      id: "tipo",
      label: "Tipo",
      accessor: "tipo",
      isVisible: true,
      order: 2,
      className: "hidden sm:table-cell",
    },
    {
      id: "fecha_programada",
      label: "Fecha Programada",
      accessor: "fecha_programada",
      isVisible: true,
      order: 3,
    },
    {
      id: "usuarios",
      label: "Responsable",
      accessor: "usuarios",
      isVisible: true,
      order: 4,
      className: "hidden sm:table-cell",
    },
    {
      id: "estado",
      label: "Estado",
      accessor: "estado",
      isVisible: true,
      order: 5,
      className: "hidden sm:table-cell",
    },
    {
      id: "acciones",
      label: "Acciones",
      accessor: "",
      isVisible: true,
      order: 6,
    },
  ]);

  const [equipoTableColumns, setEquipoTableColumns] = useState<TableColumn[]>([
    {
      id: "checkbox",
      label: "",
      accessor: "",
      isVisible: true,
      order: 0,
      className: "w-[50px]",
    },
    {
      id: "grip",
      label: "",
      accessor: "",
      isVisible: true,
      order: 1,
      className: "w-[50px]",
    },
    {
      id: "nombre",
      label: "Equipo",
      accessor: "nombre",
      isVisible: true,
      order: 2,
    },
    {
      id: "tipo",
      label: "Tipo",
      accessor: "tipo",
      isVisible: true,
      order: 3,
      className: "hidden sm:table-cell",
    },
    {
      id: "sede",
      label: "Sede",
      accessor: "sede",
      isVisible: true,
      order: 4,
      className: "hidden sm:table-cell",
    },
    {
      id: "area",
      label: "Área",
      accessor: "area",
      isVisible: true,
      order: 5,
      className: "hidden sm:table-cell",
    },
  ]);

  const handleColumnDragStart = (
    e: React.DragEvent<HTMLTableCellElement>,
    columnId: string
  ) => {
    setDraggedColumn(columnId);
    e.currentTarget.classList.add("opacity-70");
    e.dataTransfer.effectAllowed = "move";
  };

  const handleColumnDragOver = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleColumnDragEnter = (
    e: React.DragEvent<HTMLTableCellElement>,
    columnId: string
  ) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === columnId) return;
    e.currentTarget.classList.add("bg-slate-100");
  };

  const handleColumnDragLeave = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.currentTarget.classList.remove("bg-slate-100");
  };

  const handleColumnDrop = (
    e: React.DragEvent<HTMLTableCellElement>,
    targetColumnId: string,
    isMainTable: boolean
  ) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnId) return;

    e.currentTarget.classList.remove("bg-slate-100");

    const columns = isMainTable ? mainTableColumns : equipoTableColumns;
    const setColumns = isMainTable
      ? setMainTableColumns
      : setEquipoTableColumns;

    const draggedCol = columns.find((col) => col.id === draggedColumn);
    const targetCol = columns.find((col) => col.id === targetColumnId);

    if (!draggedCol || !targetCol) return;

    const newColumns = columns.map((col) => {
      if (col.id === draggedColumn) {
        return { ...col, order: targetCol.order };
      }
      if (col.id === targetColumnId) {
        return { ...col, order: draggedCol.order };
      }
      return col;
    });

    setColumns(newColumns);
    toast.success(
      `Columnas reordenadas: ${draggedCol.label} y ${targetCol.label}`
    );
  };

  const handleColumnDragEnd = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.currentTarget.classList.remove("opacity-70");
    setDraggedColumn(null);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "en_proceso":
        return (
          <Badge
            variant="outline"
            className="bg-blue-500 text-white px-4 py-1 w-fit min-w-[120px] justify-center items-center flex gap-2"
          >
            <Clock className="h-3 w-3" />
            En Proceso
          </Badge>
        );
      case "pausado":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500 text-white px-4 py-1 w-fit min-w-[120px] justify-center items-center flex gap-2"
          >
            <Pause className="h-3 w-3" />
            Pausado
          </Badge>
        );
      case "finalizado":
        return (
          <Badge
            variant="outline"
            className="bg-green-500 text-white flex items-center gap-1"
          >
            <Check className="h-3 w-3" />
            Finalizado
          </Badge>
        );
      case "iniciado":
        return (
          <Badge
            variant="outline"
            className="bg-purple-500 text-white px-4 py-1 w-fit min-w-[120px] justify-center items-center flex gap-2"
          >
            <Rocket className="h-3 w-3" />
            Iniciado
          </Badge>
        );
      case "Pendiente":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500 text-white px-4 py-1 w-fit min-w-[120px] justify-center items-center flex gap-2"
          >
            <AlertCircle className="h-3 w-3" />
            Pendiente
          </Badge>
        );
      default:
        return null;
    }
  };

  const getProgresoBar = (progreso: number) => {
    const color = progreso === 100 ? "bg-green-500" : "bg-blue-500";
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${color}`}
          style={{ width: `${progreso}%` }}
        ></div>
      </div>
    );
  };

  const getInfoById = async (id) => {
    const info = await getById(id);
    setNewMante(info);
  };

  const update = async (id, status) => {
    try {
      const res = await updateStatus(id, status);
      if (res.success) {
        toast.success(res.message || "Mantenimiento actualizado exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => window.location.reload(), 4500);
      } else {
        toast.error(res.message || "Error al actualizar mantenimiento", {
          icon: icons.error,
        });
      }
    } catch (error) {
      toast.error(error.message || "Error al actualizar mantenimiento", {
        icon: icons.error,
      });
    }
  };

  const estadosLegibles: Record<string, string> = {
    pendiente: "PENDIENTE",
    en_proceso: "EN PROCESO",
    finalizado: "FINALIZADO",
    cancelado: "CANCELADO",
  };

  const upload = async (id, files) => {
    try {
      const res = await uploadFiles(id, files);
      if (res.success) {
        toast.success(res.message || "Archivos subidos exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          navigate("/mantenimientos/programacion");
        }, 4500);
      }
    } catch (error) {
      toast.error(error.message || "Error al subir archivos", {
        icon: icons.error,
      });
    }
  };

  const openFileInNewTab = (archivo: {
    content: string;
    tipo: string;
    nombre: string;
  }) => {
    if (!archivo?.content) return;

    const byteCharacters = atob(archivo.content);
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

    // Decode the base64 content of the archivo?
    const byteCharacters = atob(archivo?.content);
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
    downloadFile,
    openFileInNewTab,
    upload,
    estadosLegibles,
    update,
    getInfoById,
    mantenimientos,
    newMante,
    setNewMante,
    currentTab,
    setCurrentTab,
    isDialogOpen,
    setIsDialogOpen,
    nextTab,
    previousTab,
    handleTabChange,
    equipoSeleccionado,
    setEquipoSeleccionado,
    onSubmit,
    mantenimientosFiltrados,
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDragEnter,
    handleColumnDragLeave,
    handleColumnDrop,
    handleColumnDragEnd,
    mainTableColumns,
    equipoTableColumns,
    setMainTableColumns,
    setEquipoTableColumns,
    resetFilters,
    handleSearch,
    isSearching,
    showAdvancedFilters,
    setShowAdvancedFilters,
    filtroResponsable,
    setFiltroResponsable,
    filtroEstado,
    setFiltroEstado,
    filtroFechaDesde,
    setFiltroFechaDesde,
    filtroFechaHasta,
    setFiltroFechaHasta,
    setSearchQuery,
    searchQuery,
    tipoMantenimiento,
    setTipoMantenimiento,
    selectedSede,
    setSelectedSede,
    selectedSucursal,
    setSelectedSucursal,
    setSearchTerm,
    searchTerm,
    getEstadoBadge,
    getProgresoBar,
  };
};
