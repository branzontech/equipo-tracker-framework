import { useEffect, useState } from "react";
import { Mantenimiento, TableColumn } from "../interfaces/mantenimiento";
import {
  create,
  getAll,
  getById,
  updateStatus,
  uploadFiles,
} from "@/api/axios/mante.api";
import { toast } from "sonner";
import { Equipo } from "@/pages/productos/interfaces/equipo";
import { icons } from "@/components/interfaces/icons";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Clock,
  AlertCircle,
  Pause,
  Rocket,
  AlertTriangle,
} from "lucide-react";
import { useEquipos } from "@/pages/productos/hooks/use-equipos";

export const useMantenimiento = () => {
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [newMante, setNewMante] = useState<Mantenimiento>({
    id_mantenimiento: 0,
    tecnico_id: 0,
    usuarios: null,
    fecha_programada: null,
    fecha_realizada: null,
    tipo: "",
    prioridad: "",
    descripcion: "",
    tiempo_estimado: null,
    recomendaciones: "",
    observaciones_adi: "",
    estado: "Pendiente",
    progreso: 0,
    archivosmantenimiento: [],
    checklist_campos: [],
    plantilla_id: null,
    checklist_plantillas: null,
    mantenimiento_detalle: [],
  });
  const [currentTab, setCurrentTab] = useState("equipo");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [equiposSeleccionados, setEquiposSeleccionados] = useState<
    { tipo: "equipo" | "impresora" | "periferico"; id: number }[]
  >([]);

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
  const [tecnicoResponsable, setTecnicoResponsable] = useState(null);
  const [validEquipo, setValidEquipo] = useState(false);
  const [validDetalles, setValidDetalles] = useState(false);
  const [equipoChecklistSeleccionado, setEquipoChecklistSeleccionado] =
    useState<Equipo | null>(null);
  const [busquedaChecklist, setBusquedaChecklist] = useState("");
  const [sedeFilterChecklist, setSedeFilterChecklist] = useState("");
  const [equiposChecklistFiltrados, setEquiposChecklistFiltrados] = useState<
    Equipo[]
  >([]);
  const [itemsChecklist, setItemsChecklist] = useState<
    {
      id: string;
      texto: string;
      tipo: "checkbox" | "numeric" | "text";
      valor?: string | number;
      checked?: boolean;
      personalizado: boolean;
    }[]
  >([]);

  const [nuevoItemPersonalizado, setNuevoItemPersonalizado] = useState("");
  const [tipoNuevoItem, setTipoNuevoItem] = useState<
    "checkbox" | "numeric" | "text"
  >("checkbox");
  const [calificacionEquipo, setCalificacionEquipo] = useState(0);
  const [tipoCalificacion, setTipoCalificacion] = useState<
    "estrellas" | "escala" | "categorica"
  >("estrellas");
  const [calificacionEscala, setCalificacionEscala] = useState(1);
  const [calificacionCategorica, setCalificacionCategorica] = useState<
    "malo" | "bueno" | "excelente"
  >("bueno");
  const [observacionesChecklist, setObservacionesChecklist] = useState("");
  const [nombrePlantilla, setNombrePlantilla] = useState("");
  const [fechaEjecucion] = useState(new Date());
  const [vistaColumnas, setVistaColumnas] = useState<"1" | "2" | "3">("2");
  const [tipoVista, setTipoVista] = useState<"grid" | "list">("grid");
  const [isChecklistDialogOpen, setIsChecklistDialogOpen] = useState(false);
  const [itemsChequeo, setItemsChequeo] = useState<string[]>([]);
  const navigate = useNavigate();
  const { equipo } = useEquipos();

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
          updateStatus(mantenimiento.id_mantenimiento, "Iniciado");
        }

        const yaPaso = fechaProgramada < hoy;
        const noFinalizado =
          mantenimiento.estado !== "Finalizado" &&
          mantenimiento.estado !== "Completado";

        if (yaPaso && noFinalizado) {
          updateStatus(mantenimiento.id_mantenimiento, "Atrasado");
        }
      });

      setMantenimientos(mantenimientos);
    };
    fetchMantenimientos();
  }, []);

  const camposPorTab = {
    equipo: [
      {
        valor: newMante.mantenimiento_detalle.some(
          (detalle) =>
            detalle.equipos?.id_equipo ||
            detalle.impresoras?.id_impresora ||
            detalle.perifericos?.id_periferico
        ),
        mensaje: "Debe agregar al menos un equipo, impresora o periférico",
      },
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
      setValidEquipo(true);
      setCurrentTab("detalles");
    } else if (currentTab === "detalles") {
      setValidDetalles(true);
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
    if (value === "detalles" && !validEquipo) return;
    if (value === "programacion" && !validDetalles) return;

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
      mantenimiento.mantenimiento_detalle?.[0]?.equipos.nombre_equipo
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
      mantenimiento.mantenimiento_detalle?.[0]?.equipos?.nombre_equipo
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
      mantenimiento.mantenimiento_detalle?.[0]?.equipos?.estado_ubicacion?.sucursales?.sedes?.id_sede?.toString() ===
        selectedSede;

    const cumpleSucursal =
      selectedSucursal === "all" ||
      mantenimiento.mantenimiento_detalle?.[0]?.equipos?.estado_ubicacion?.sucursales?.id_sucursal?.toString() ===
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
      label: "Equipo(s)",
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
      case "Finalizado":
        return (
          <Badge
            variant="outline"
            className="bg-green-500 text-white flex items-center gap-1"
          >
            <Check className="h-3 w-3" />
            Finalizado
          </Badge>
        );
      case "Iniciado":
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
      case "Atrasado":
        return (
          <Badge
            variant="outline"
            className="bg-red-500  text-white px-4 py-1 w-fit min-w-[120px] justify-center items-center flex gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Atrasado
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
          navigate("/mantenimientos/documentacion");
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

  const handleSearchChecklist = (value: string) => {
    setBusquedaChecklist(value);
    filtrarEquiposChecklist(value, sedeFilterChecklist);
  };

  const handleSedeFilterChecklist = (sede: string) => {
    setSedeFilterChecklist(sede);
    filtrarEquiposChecklist(busquedaChecklist, sede);
  };

  const filtrarEquiposChecklist = (busqueda: string, sede: string) => {
    let filtrados = equipo;

    if (busqueda.length > 2) {
      filtrados = filtrados.filter(
        (equipo) =>
          equipo.nro_serie.toLowerCase().includes(busqueda.toLowerCase()) ||
          equipo.nombre_equipo.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (sede && sede !== "todas") {
      filtrados = filtrados.filter(
        (equipo) =>
          equipo?.estado_ubicacion?.[0]?.sucursales?.sedes?.id_sede?.toString() ===
          sede
      );
    }

    setEquiposChecklistFiltrados(filtrados);
  };

  const selectEquipoChecklist = (equipo: Equipo) => {
    setEquipoChecklistSeleccionado(equipo);
    setBusquedaChecklist(equipo.nombre_equipo);
    setEquiposChecklistFiltrados([]);
  };

  const toggleChecklistItem = (id: string) => {
    setItemsChecklist((prev) =>
      prev.map((item) =>
        item.id === id && item.tipo === "checkbox"
          ? { ...item, checked: !item.checked }
          : item
      )
    );
  };

  const updateItemValue = (id: string, valor: string | number) => {
    setItemsChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, valor } : item))
    );
  };

  const agregarItemPersonalizado = () => {
    if (nuevoItemPersonalizado.trim()) {
      const nuevoItem = {
        id: Date.now().toString(),
        texto: nuevoItemPersonalizado,
        tipo: tipoNuevoItem,
        ...(tipoNuevoItem === "checkbox" ? { checked: false } : { valor: "" }),
        personalizado: true,
      };
      setItemsChecklist((prev) => [...prev, nuevoItem]);
      setNuevoItemPersonalizado("");
    }
  };

  const eliminarItemPersonalizado = (id: string) => {
    setItemsChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const guardarPlantilla = () => {
    if (!nombrePlantilla.trim()) {
      toast.error("Debe ingresar un nombre para la plantilla");
      return;
    }

    const plantilla = {
      nombre: nombrePlantilla,
      items: itemsChecklist,
      tipoCalificacion: tipoCalificacion,
      fechaCreacion: new Date(),
    };

    console.log("Plantilla guardada:", plantilla);
    toast.success(`Plantilla "${nombrePlantilla}" guardada exitosamente`);
    setNombrePlantilla("");
  };

  const completarChecklist = () => {
    if (!equipoChecklistSeleccionado) {
      toast.error("Debe seleccionar un equipo");
      return;
    }

    if (!tecnicoResponsable) {
      toast.error("Debe seleccionar un técnico responsable");
      return;
    }

    const resultado = {
      equipo: equipoChecklistSeleccionado,
      items: itemsChecklist,
      tipoCalificacion: tipoCalificacion,
      calificacion:
        tipoCalificacion === "estrellas"
          ? calificacionEquipo
          : tipoCalificacion === "escala"
          ? calificacionEscala
          : calificacionCategorica,
      observaciones: observacionesChecklist,
      fechaEjecucion: fechaEjecucion,
      tecnicoResponsable: tecnicoResponsable,
      fechaCompletado: new Date(),
    };

    console.log("Checklist completado:", resultado);
    toast.success("Lista de chequeo completada exitosamente");
    setIsChecklistDialogOpen(false);

    // Resetear estados
    setEquipoChecklistSeleccionado(null);
    setBusquedaChecklist("");
    setSedeFilterChecklist("");
    setCalificacionEquipo(0);
    setCalificacionEscala(1);
    setCalificacionCategorica("bueno");
    setObservacionesChecklist("");
    setTecnicoResponsable("");
  };

  const toggleItem = (item: string, checked: boolean) => {
    if (checked) {
      setItemsChequeo((prev) => [...prev, item]);
    } else {
      setItemsChequeo((prev) => prev.filter((i) => i !== item));
    }
  };

  const uniqueResponsables = Array.from(
    new Set(mantenimientos.map((item) => item.usuarios?.nombre).filter(Boolean))
  );

  const uniqueEstados = Array.from(
    new Set(mantenimientos.map((item) => item.estado).filter(Boolean))
  );

  const filteredMantenimientos = mantenimientos.filter((mantenimiento) => {
    const fecha = new Date(mantenimiento.fecha_programada);

    const cumpleDesde = !filtroFechaDesde || fecha >= filtroFechaDesde;
    const cumpleHasta = !filtroFechaHasta || fecha <= filtroFechaHasta;

    return cumpleDesde && cumpleHasta;
  });

  return {
    filteredMantenimientos,
    uniqueResponsables,
    uniqueEstados,
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
    equiposSeleccionados,
    setEquiposSeleccionados,
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
    tecnicoResponsable,
    setTecnicoResponsable,
    validEquipo,
    validDetalles,
    navigate,

    // Checklist
    itemsChequeo,
    handleSearchChecklist,
    filtrarEquiposChecklist,
    selectEquipoChecklist,
    toggleChecklistItem,
    updateItemValue,
    agregarItemPersonalizado,
    eliminarItemPersonalizado,
    guardarPlantilla,
    completarChecklist,
    isChecklistDialogOpen,
    setIsChecklistDialogOpen,
    equipoChecklistSeleccionado,
    setEquipoChecklistSeleccionado,
    busquedaChecklist,
    sedeFilterChecklist,
    equiposChecklistFiltrados,
    setBusquedaChecklist,
    setSedeFilterChecklist,
    setEquiposChecklistFiltrados,
    handleSedeFilterChecklist,
    tipoVista,
    setTipoVista,
    vistaColumnas,
    setVistaColumnas,
    setItemsChequeo,
    setTipoCalificacion,
    setTipoNuevoItem,
    tipoNuevoItem,
    nuevoItemPersonalizado,
    setNuevoItemPersonalizado,
    itemsChecklist,
    setItemsChecklist,
    tipoCalificacion,
    calificacionEquipo,
    calificacionEscala,
    calificacionCategorica,
    observacionesChecklist,
    nombrePlantilla,
    fechaEjecucion,
    setCalificacionCategorica,
    setCalificacionEscala,
    setCalificacionEquipo,
    setObservacionesChecklist,
    setNombrePlantilla,
    toggleItem,
  };
};
