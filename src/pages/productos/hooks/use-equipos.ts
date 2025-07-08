/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Equipo } from "../interfaces/equipo";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createEquipo,
  deleteEquipo,
  getEquipos,
  getEquiposByNroSerie,
  getTrazabilidadByEquipoId,
  updateEquipo,
} from "@/api/axios/equipo.api";
import { ColumnConfig } from "@/pages/configuracion/maestros/interfaces/columns";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { getUserByName } from "@/api/axios/user.api";
import Cookies from "js-cookie";

export const useEquipos = () => {
  const [equipo, setEquipo] = useState<Equipo[]>([]);
  const [count, setCountEquipo] = useState<number>(0);
  const [newEquipo, setNewEquipo] = useState<Equipo>({
    sedes: null,
    id_equipo: 0,
    nombre_equipo: "",
    nro_serie: "",
    modelo: "",
    marca_id: 0,
    marcas: null,
    categoria_id: 0,
    categorias: null,
    fecha_registro: new Date().toISOString().split("T")[0],
    tipo_activo: "",
    observaciones: "",
    tags: [],
    imagen: "",
    motivo: "",
    usuario_id: "",
    especificaciones: {
      procesador: "",
      memoria_ram: "",
      almacenamiento: "",
      tipo_discoduro: "",
      pantalla: "",
      sistema_operativo: "",
      bateria: "",
      puertos: "",
    },
    seguridad: {
      nivel_acceso: "",
      software_seguridad: "",
      cifrado_disco: "",
      politicas_aplicadas: [],
    },
    adquisicion: {
      orden_compra: "",
      fecha_compra: "",
      precio_compra: 0,
      forma_pago: "",
      plazo_pago: "",
      numero_factura: "",
      proveedor_id: 0,
      proveedores: {
        id_proveedor: 0,
        tipo_proveedor: "",
        nombre: "",
        identificacion: "",
        contacto: "",
        telefono: "",
        correo: "",
        direccion: "",
        estado: "",
      },
      inicio_garantia: "",
      garantia_fecha_fin: "",
    },
    estado_ubicacion: {
      estado_actual: "",
      sucursal_id: 0,
      sucursales: {
        id_sucursal: 0,
        nombre: "",
        sede_id: 0,
        sedes: {
          id_sede: 0,
          nombre: "",
          usuario_sede: [],
          estado: null,
        },
        tipo: "",
        estado: null,
        area: "",
      },
      departamento: "",
      responsable_id: 0,
      usuarios: null,
      disponibilidad: "",
      condicion_fisica: "",
    },
    administrativa: {
      codigo_inventario: "",
      centro_coste: "",
      autorizado_por_id: "",
      usuarios: null,
      fecha_activacion: "",
      estado_contable: "",
      valor_depreciado: 0,
      vida_util_restante: "",
    },
    perifericos: {
      id_periferico: 0,
      nombre: "",
      estado: "",
      tipo: "",
      equipo_asociado_id: 0,
      equipos: null,
      prestamos: null,
      traslados: null,
      serial: "",
      id_sede: 0,
      sedes: null,
      marca_id: 0,
      marcas: null,
      motivo: "",
    },
    trazabilidad: {
      prestamo_equipos: [],
      traslados_equipos: [],
      mantenimiento_detalle: [],
      devoluciones: [],
      historial: [],
    },
    mantenimiento: {
      frecuencia_mantenimiento: "",
      ultima_fecha_mantenimiento: "",
      proveedor_servicio_id: 0,
      proveedores: {
        id_proveedor: 0,
        tipo_proveedor: "",
        nombre: "",
        identificacion: "",
        contacto: "",
        telefono: "",
        correo: "",
        direccion: "",
        sitio_web: "",
        estado: "",
      },
    },
  });
  const navigate = useNavigate();
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("inventario");
  const [sedesConEquiposCount, setSedesConEquiposCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [responsableRecibeInput, setResponsableRecibeInput] = useState(null);
  const [responsableEntregaInput, setResponsableEntregaInput] = useState(null);
  const [sugerenciasResponsable, setSugerenciasResponsable] = useState<any[]>(
    []
  );
  const [archivosEquipo, setArchivosEquipo] = useState<
    {
      nombre_archivo: string;
      tipo_archivo: string;
      contenido: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEquipos();
        const equipos = response.map((equipo: any) => ({
          ...equipo,
          sucursales:
            equipo.estado_ubicacion?.[0]?.sucursales?.nombre || "Sin Sucursal",
          sedes:
            equipo.estado_ubicacion?.[0]?.sucursales?.sedes?.nombre ||
            "Sin Sede",
          tipo: equipo.estado_ubicacion?.[0]?.sucursales?.tipo || "Sin Tipo",
          marcas: equipo.marcas?.nombre || "Sin Marca",
          categorias: equipo.categorias?.nombre || "Sin Categoria",
          estadoActual:
            equipo.estado_ubicacion?.[0]?.estado_actual || "Sin estado",
        }));
        const equiposActivos = equipos.filter(
          (equipo: any) => equipo.estadoActual === "Activo"
        );
        setEquipo(equipos);
        setCountEquipo(equiposActivos.length);

        const sedesConEquipos = new Set(
          response
            .filter(
              (equipo: any) =>
                equipo.estado_ubicacion?.[0]?.sucursales?.sedes?.id_sede
            )
            .map(
              (equipo: any) =>
                equipo.estado_ubicacion?.[0]?.sucursales?.sedes?.id_sede
            )
        );

        setSedesConEquiposCount(sedesConEquipos.size);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const [filters, setFilters] = useState({
    marcas: "",
    categorias: "",
    estado: "",
    sucursales: "",
    sedes: "",
  });

  const [columns, setColumns] = useState<ColumnConfig[]>([
    {
      id: "nro_serie",
      label: "N° Serie",
      key: "nro_serie",
      isVisible: true,
      order: 0,
    },
    {
      id: "nombre_equipo",
      label: "Nombre del Equipo",
      key: "nombre_equipo",
      isVisible: true,
      order: 1,
    },
    { id: "marcas", label: "Marca", key: "marcas", isVisible: true, order: 2 },
    {
      id: "categorias",
      label: "Categoria",
      key: "categorias",
      isVisible: true,
      order: 3,
    },
    { id: "sedes", label: "Sede", key: "sedes", isVisible: true, order: 5 },
    {
      id: "estado_actual",
      label: "Estado",
      key: "estado_actual",
      isVisible: true,
      order: 4,
    },
    {
      id: "sucursales",
      label: "Sucursal",
      key: "sucursales",
      isVisible: true,
      order: 6,
    },
  ]);

  const aplicarFiltros = () => {
    const hayFiltros = Object.values(filters).some(
      (valor) => valor !== "todas" && valor !== "todos" && valor !== ""
    );

    if (!hayFiltros) {
      toast.error("Debe seleccionar al menos un filtro", {
        icon: icons.error,
      });
      return;
    }

    // Simular clic al botón oculto que tiene SheetClose
    document.getElementById("close-sheet-btn")?.click();
  };

  const handleDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedColumn(columnId);
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.classList.add("opacity-50", "cursor-grabbing");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.classList.remove("opacity-50", "cursor-grabbing");
    setDraggedColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnId) return;

    const targetElement = e.currentTarget as HTMLElement;
    targetElement.classList.add(
      "bg-muted",
      "transition-colors",
      "duration-200"
    );
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const targetElement = e.currentTarget as HTMLElement;
    targetElement.classList.remove(
      "bg-muted",
      "transition-colors",
      "duration-200"
    );
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnId) return;

    const targetElement = e.currentTarget as HTMLElement;
    targetElement.classList.remove(
      "bg-muted",
      "transition-colors",
      "duration-200"
    );

    setColumns((prevColumns) => {
      const draggedColumnOrder =
        prevColumns.find((col) => col.id === draggedColumn)?.order || 0;
      const targetColumnOrder =
        prevColumns.find((col) => col.id === targetColumnId)?.order || 0;

      return prevColumns.map((column) => {
        if (column.id === draggedColumn) {
          return { ...column, order: targetColumnOrder };
        }
        if (column.id === targetColumnId) {
          return { ...column, order: draggedColumnOrder };
        }
        return column;
      });
    });
  };

  const toggleColumnVisibility = (columnId: string, isChecked: boolean) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId ? { ...column, isVisible: isChecked } : column
      )
    );
  };

  const applyFilters = (data: typeof equipo) => {
    const visibleKeys = columns
      .filter((col) => col.isVisible)
      .map((col) => col.key);

    return data.filter((item) => {
      const matchesSearch = visibleKeys.some((key) => {
        const value = item[key];
        return (
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      });

      if (!matchesSearch) return false;

      if (
        filters.marcas &&
        filters.marcas !== "todas" &&
        item.marcas?.toString() !== filters.marcas
      )
        return false;

      if (
        filters.categorias &&
        filters.categorias !== "todas" &&
        item.categorias?.toString() !== filters.categorias
      )
        return false;

      const estadoActual =
        item.estado_ubicacion?.[0]?.estado_actual?.toLowerCase();
      if (
        filters.estado &&
        filters.estado !== "todos" &&
        estadoActual !== filters.estado.toLowerCase()
      )
        return false;

      if (
        filters.sucursales &&
        filters.sucursales !== "todas" &&
        item.estado_ubicacion?.[0]?.sucursales?.nombre !== filters.sucursales
      )
        return false;

      return true;
    });
  };

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      marcas: "",
      categorias: "",
      estado: "",
      sucursales: "",
      sedes: "",
    });
    setCurrentPage(1);
  };

  const filteredData = applyFilters(equipo);

  const sortedData = [...filteredData].sort((a: any, b: any) => {
    if (!sortField) return 0;
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    }
    return a[sortField] < b[sortField] ? 1 : -1;
  });

  const formSchema = z.object({
    // Información Básica
    nombre_equipo: z.string().min(1, "El nombre del equipo es requerido"),
    nro_serie: z.string().min(1, "El número de serie es requerido"),
    modelo: z.string().min(1, "El modelo es requerido"),
    numeroActivoFijo: z
      .string()
      .min(1, "El número de activo fijo es requerido"),
    marca: z.string().min(1, "La marca es requerida"),
    ubicacion_id: z.string().min(1, "La ubicación es requerida"),
    categoria: z.string().min(1, "La categoría es requerida"),
    fecha_registro: z.string().min(1, "La fecha de registro es requerida"),
    tipo_activo: z.string().min(1, "El tipo de activo es requerido"),
    garantia_fecha_fin: z.date().optional(),
    observaciones: z.string().optional(),
    // imagen: z.any(),

    // Especificaciones Técnicas
    procesador: z.string().min(1, "El procesador es requerido"),
    memoria_ram: z.string().min(1, "La memoria RAM es requerida"),
    almacenamiento: z.string().min(1, "El almacenamiento es requerido"),
    tarjeta_grafica: z.string().min(1, "La tarjeta gráfica es requerida"),
    pantalla: z.string().min(1, "La pantalla es requerida"),
    sistema_operativo: z.string().min(1, "El sistema operativo es requerido"),
    bateria: z.string().min(1, "La batería es requerida"),
    puertos: z.string().min(1, "Los puertos es requeridos"),

    // Seguridad
    nivel_acceso: z.string().min(1, "El nivel de acceso es requerido"),
    software_seguridad: z
      .string()
      .min(1, "El software de seguridad es requerido"),
    cifrado_disco: z.string().min(1, "El cifrado de disco es requerido"),
    politicas_aplicadas: z
      .array(z.string())
      .min(1, "Debe seleccionar al menos una política"),

    // Información de Adquisición
    orden_compra: z.string().min(1, "El orden de compra es requerido"),
    fecha_compra: z.string().min(1, "La fecha de compra es requerida"),
    precio_compra: z.number().min(1, "El precio de compra es requerido"),
    forma_pago: z.string().min(1, "El forma de pago es requerido"),
    plazo_pago: z.string().min(1, "El plazo de pago es requerido"),
    numero_factura: z.string().min(1, "El número de factura es requerido"),
    proveedor: z.string().min(1, "El proveedor es requerido"),

    // Información Administrativa
    codigo_inventario: z
      .string()
      .min(1, "El código de inventario es requerido"),
    centro_coste: z.string().min(1, "El centro de coste es requerido"),
    autorizado_por: z.string().min(1, "El autorizado por es requerido"),
    fecha_activacion: z.string().min(1, "La fecha de activación es requerida"),
    estado_contable: z.string().min(1, "El estado contable es requerido"),
    valor_depreciado: z
      .number()
      .min(0, "El valor depreciado debe ser positivo"),
    vida_util_restante: z.string().min(1, "La vida útil restante es requerida"),

    // Mantenimiento
    // frecuenciaMantenimiento: z.string(),
    // ultimaFechaMantenimiento: z.date().optional(),
    // proximaFechaMantenimiento: z.date().optional(),
    // proveedorServicio: z.string().optional(),

    // Documentación Relacionada
    // manualUsuario: z.any().optional(),
    // manualServicio: z.any().optional(),
    // certificados: z.any().optional(),
    // polizasSeguro: z.any().optional(),
    // documentosGarantia: z.any().optional(),
    // fotosAdicionales: z.any().optional(),

    // Campos Personalizables
    // tags: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...newEquipo,
      fecha_registro: new Date().toISOString().split("T")[0],
      garantia_fecha_fin: null,
      imagen: null,
    },
  });

  const handleVolver = () => {
    navigate("/productos/lista");
  };

  const handleNuevoProducto = () => {
    navigate("/productos/ingreso");
  };

  const camposRequeridos = [
    { valor: newEquipo.nombre_equipo, mensaje: "Debe ingresar un nombre" },
    { valor: newEquipo.nro_serie, mensaje: "Debe ingresar un número de serie" },
    {
      valor: newEquipo.tipo_activo,
      mensaje: "Debe seleccionar un tipo de activo",
    },
    { valor: newEquipo.marca_id, mensaje: "Debe seleccionar una marca" },
    {
      valor: newEquipo.categoria_id,
      mensaje: "Debe seleccionar una categoría",
    },
    {
      valor: newEquipo.estado_ubicacion.sucursal_id,
      mensaje: "Debe seleccionar una sucursal",
    },
    { valor: newEquipo.modelo, mensaje: "Debe ingresar un modelo" },
    {
      valor: newEquipo.adquisicion.garantia_fecha_fin,
      mensaje: "Debe ingresar una fecha de garantía",
    },

    // Especificaciones técnicas
    {
      valor: newEquipo.especificaciones.procesador,
      mensaje: "Debe ingresar un procesador",
    },
    {
      valor: newEquipo.especificaciones.memoria_ram,
      mensaje: "Debe ingresar una memoria RAM",
    },
    {
      valor: newEquipo.especificaciones.almacenamiento,
      mensaje: "Debe ingresar un almacenamiento",
    },
    {
      valor: newEquipo.especificaciones.tipo_discoduro,
      mensaje: "Debe ingresar una tarjeta gráfica",
    },
    {
      valor: newEquipo.especificaciones.sistema_operativo,
      mensaje: "Debe ingresar un sistema operativo",
    },
    {
      valor: newEquipo.especificaciones.bateria,
      mensaje: "Debe ingresar una batería",
    },
    {
      valor: newEquipo.especificaciones.puertos,
      mensaje: "Debe ingresar los puertos",
    },

    // Adquisición
    {
      valor: newEquipo.adquisicion.fecha_compra,
      mensaje: "Debe ingresar la fecha de compra",
    },
    {
      valor: newEquipo.adquisicion.proveedor_id,
      mensaje: "Debe ingresar el proveedor",
    },
    {
      valor: newEquipo.adquisicion.numero_factura,
      mensaje: "Debe ingresar el número de factura",
    },
    {
      valor: newEquipo.adquisicion.precio_compra,
      mensaje: "Debe ingresar el precio de compra",
    },
    {
      valor: newEquipo.adquisicion.forma_pago,
      mensaje: "Debe ingresar la forma de pago",
    },
    {
      valor: newEquipo.adquisicion.plazo_pago,
      mensaje: "Debe ingresar el plazo de pago",
    },
    {
      valor: newEquipo.adquisicion.orden_compra,
      mensaje: "Debe ingresar el número de orden de compra",
    },

    // Seguridad
    {
      valor: newEquipo.seguridad.nivel_acceso,
      mensaje: "Debe seleccionar un nivel de acceso",
    },
    {
      valor: newEquipo.seguridad.software_seguridad,
      mensaje: "Debe ingresar un software de seguridad",
    },
    {
      valor: newEquipo.seguridad.cifrado_disco,
      mensaje: "Debe ingresar un cifrado de disco",
    },
    {
      valor: newEquipo.seguridad.politicas_aplicadas,
      mensaje: "Debe ingresar las políticas de aplicación",
    },

    // Información administrativa
    {
      valor: newEquipo.administrativa.codigo_inventario,
      mensaje: "Debe ingresar el código de inventario",
    },
    {
      valor: newEquipo.administrativa.centro_coste,
      mensaje: "Debe ingresar el centro de coste",
    },
    {
      valor: newEquipo.administrativa.autorizado_por_id,
      mensaje: "Debe ingresar el autorizado por",
    },
    {
      valor: newEquipo.administrativa.fecha_activacion,
      mensaje: "Debe ingresar la fecha de activación",
    },
    {
      valor: newEquipo.administrativa.estado_contable,
      mensaje: "Debe seleccionar un estado de contabilidad",
    },
    {
      valor: newEquipo.administrativa.valor_depreciado,
      mensaje: "Debe ingresar un valor depreciado",
    },
    {
      valor: newEquipo.administrativa.vida_util_restante,
      mensaje: "Debe ingresar la vida útil restante",
    },

    // Observaciones
    {
      valor: newEquipo.observaciones,
      mensaje: "Debe ingresar las observaciones",
    },
  ];

  const handleSubmit = async (data: Equipo) => {
    for (const campo of camposRequeridos) {
      if (!campo.valor) {
        toast.error(campo.mensaje, {
          icon: icons.error,
        });
        return;
      }
    }

    try {
      const dataSend = {
        ...data,
        fecha_registro: new Date(data.fecha_registro).toISOString(),
      };

      const response = await createEquipo(dataSend);
      if (response.success) {
        toast.success(response.message || "Equipo creado exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          navigate("/productos/lista");
          window.location.reload();
        }, 4500);
      } else {
        toast.error(response.message || "Error al crear el equipo", {
          icon: icons.error,
        });
      }
    } catch (error) {
      toast.error(error.message || "Error al crear el equipo", {
        icon: icons.error,
      });
    }
  };

  const update = async (data: Equipo) => {
    for (const campo of camposRequeridos) {
      if (!campo.valor) {
        toast.error(campo.mensaje, {
          icon: icons.error,
        });
        return;
      }
    }

    const userId = Cookies.get("userId");

    try {
      const dataSend = {
        ...data,
        fecha_registro: new Date(data.fecha_registro).toISOString(),
        usuario_id: userId,
      };

      const response = await updateEquipo(dataSend);
      if (response.success) {
        toast.success(response.message || "Equipo actualizado exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          navigate("/productos/lista");
          window.location.reload();
        }, 4500);
      } else {
        toast.error(response.message || "Error al actualizar el equipo", {
          icon: icons.error,
        });
      }
    } catch (error) {
      toast.error(error.message || "Error al actualizar el equipo", {
        icon: icons.error,
      });
    }
  };

  const formatNumber = (value: number | string) => {
    const num = typeof value === "number" ? value.toString() : value;
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDownload = () => {
    const csvContent = [
      Object.keys(equipo[0]).join(","),
      ...filteredData.map((item) => Object.values(item).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "inventario.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const uniqueMarcas = Array.from(new Set(equipo.map((item) => item.marcas)));

  const uniqueCategorias = Array.from(
    new Set(equipo.map((item) => item.categorias))
  );

  const uniqueEstados = Array.from(
    new Set(equipo.map((item) => item.estado_ubicacion?.[0]?.estado_actual))
  );

  const uniqueSucursales = Array.from(
    new Set(
      equipo.map((item) => item.estado_ubicacion?.[0]?.sucursales?.nombre)
    )
  );

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value && value !== "todas" && value !== "todos"
  ).length;

  const getInfoEquipo = async (nroSeries: string) => {
    setIsLoading(true);
    const response = await getEquiposByNroSerie(nroSeries);
    const trazabilidad = await getTrazabilidadByEquipoId(response.id_equipo);
    const seguridadRaw = response.seguridad?.[0] || {};

    const tagsProcesadas =
      typeof response.tags === "string"
        ? response.tags.split(",").map((tag) => tag.trim())
        : Array.isArray(response.tags)
        ? response.tags
        : [];

    const especificacionesProcesadas = response.especificaciones?.[0] || {
      id_especificacion: 0,
      procesador: "",
      memoria_ram: "",
      almacenamiento: "",
      tarjeta_grafica: "",
      pantalla: "",
      sistema_operativo: "",
      bateria: "",
      puertos: "",
      tienecargador: false,
      serialcargador: "",
      tipo_discoduro: "",
    };

    const seguridadProcesada = {
      ...seguridadRaw,
      politicas_aplicadas:
        typeof seguridadRaw.politicas_aplicadas === "string"
          ? seguridadRaw.politicas_aplicadas.split(",").map((p) => p.trim())
          : [],
    };

    const adquisicionProcesada = response.adquisicion?.[0] || {
      id_adquisicion: 0,
      orden_compra: "",
      fecha_compra: "",
      precio_compra: 0,
      forma_pago: "",
      plazo_pago: "",
      numero_factura: "",
      proveedor: "",
      inicio_garantia: "",
      garantia_fecha_fin: "",
      proveedores: {
        id_proveedor: 0,
        tipo_proveedor: "",
        nombre: "",
        identificacion: "",
        contacto: "",
        telefono: "",
        correo: "",
        direccion: "",
        sitio_web: "",
      },
    };

    const estado_ubicacionProcesada = response.estado_ubicacion?.[0] || {
      estado_actual: "",
      sucursal_id: 0,
      sucursales: {
        id_sucursal: 0,
        nombre: "",
        sede_id: 0,
        sedes: {
          id_sede: 0,
          nombre: "",
          usuario_sede: [],
          estado: null,
        },
        tipo: "",
        estado: null,
        area: "",
      },
      departamento: "",
      responsable: "",
      disponibilidad: "",
      condicion_fisica: "",
    };

    const administrativaProcesada = response.administrativa?.[0] || {
      id_admin: 0,
      codigo_inventario: "",
      centro_coste: "",
      autorizado_por: "",
      fecha_activacion: "",
      estado_contable: "",
      valor_depreciado: 0,
      vida_util_restante: "",
    };

    const mantenimientoProcesada = {
      frecuencia_mantenimiento: response.frecuencia_mantenimiento || "",
      ultima_fecha_mantenimiento: response.ultima_fecha_mantenimiento || "",
      proveedor_servicio_id: response.proveedor_servicio_id || 0,
      proveedores: response.proveedores || {
        id_proveedor: 0,
        tipo_proveedor: "",
        nombre: "",
        identificacion: "",
        contacto: "",
        telefono: "",
        correo: "",
        direccion: "",
        sitio_web: "",
      },
    };

    setNewEquipo({
      ...response,
      tags: tagsProcesadas,
      especificaciones: especificacionesProcesadas,
      seguridad: seguridadProcesada,
      adquisicion: adquisicionProcesada,
      administrativa: administrativaProcesada,
      estado_ubicacion: estado_ubicacionProcesada,
      trazabilidad,
      mantenimiento: mantenimientoProcesada,
    });
    setIsLoading(false);
    return response;
  };

  const deleteEquipoById = async (id: number) => {
    ConfirmDialog({
      title: "¿Está seguro de que desea eliminar este equipo?",
      message: "Esta acción no se puede deshacer.",
      onConfirm: async () => {
        try {
          const res = await deleteEquipo(id);
          if (res.success) {
            toast.success(res.message || "Equipo eliminado exitosamente", {
              icon: icons.success,
            });
            setTimeout(() => window.location.reload(), 4500);
          } else {
            toast.error(res.message || "No se pudo eliminar el equipo", {
              icon: icons.error,
            });
          }
        } catch (error) {
          toast.error(error.message, {
            icon: icons.error,
          });
        }
      },
    });
  };

  const equiposData = useMemo(() => {
    const conteo: Record<string, number> = {};

    equipo.forEach((item) => {
      const nombreCategoria =
        typeof item.categorias === "string"
          ? item.categorias
          : item.categorias?.nombre || "Sin categoría";
      conteo[nombreCategoria] = (conteo[nombreCategoria] || 0) + 1;
    });

    return Object.entries(conteo).map(([name, cantidad]) => ({
      name,
      cantidad,
    }));
  }, [equipo]);

  const sedesData = useMemo(() => {
    const conteo: Record<string, number> = {};

    equipo.forEach((item) => {
      const nombreSede = item.sedes;
      conteo[nombreSede] = (conteo[nombreSede] || 0) + 1;
    });

    return Object.entries(conteo).map(([name, cantidad]) => ({
      name,
      cantidad,
    }));
  }, [equipo]);

  function formatearVidaUtil(vidaUtilDecimal: number): string {
    const años = Math.floor(vidaUtilDecimal);
    const meses = Math.round((vidaUtilDecimal - años) * 12);

    const parteAños = años > 0 ? `${años} año${años !== 1 ? "s" : ""}` : "";
    const parteMeses =
      meses > 0 ? `${meses} mes${meses !== 1 ? "es" : ""}` : "";

    if (parteAños && parteMeses) return `${parteAños} y ${parteMeses}`;
    if (parteAños) return parteAños;
    if (parteMeses) return parteMeses;
    return "0 meses";
  }

  const handleResponsable = async (name: string) => {
    setResponsableEntregaInput(name);

    if (name.length >= 3) {
      try {
        const res = await getUserByName(name);
        setSugerenciasResponsable(res);
      } catch (err) {
        console.error("Error buscando usuarios:", err);
      }
    } else {
      setSugerenciasResponsable([]);
    }
  };

  const handleArchivosChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    const archivosConvertidos = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                nombre_archivo: file.name,
                tipo_archivo: file.type,
                contenido: reader.result as string,
              });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    );

    const nuevosArchivos = archivosConvertidos as {
      nombre_archivo: string;
      tipo_archivo: string;
      contenido: string;
    }[];

    setArchivosEquipo(nuevosArchivos);
    setNewEquipo((prev) => ({
      ...prev,
      archivosequipo: nuevosArchivos.map((archivo) => ({
        id_archivo: 0,
        ...archivo,
        archivo: {
          content: archivo.contenido,
          nombre: archivo.nombre_archivo,
          tipo: archivo.tipo_archivo,
        },
      })),
    }));
  };

  return {
    setResponsableEntregaInput,
    responsableEntregaInput,
    handleResponsable,
    sugerenciasResponsable,
    setSugerenciasResponsable,
    formatearVidaUtil,
    aplicarFiltros,
    update,
    isLoading,
    setIsLoading,
    sedesData,
    equiposData,
    deleteEquipoById,
    getInfoEquipo,
    equipo,
    setEquipo,
    newEquipo,
    setNewEquipo,
    handleVolver,
    form,
    handleSubmit,
    formatNumber,
    handleNuevoProducto,
    activeTab,
    setActiveTab,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    toggleColumnVisibility,
    handleFilterChange,
    resetFilters,
    sortedColumns,
    totalPages,
    paginatedData,
    handleSort,
    handleDownload,
    uniqueMarcas,
    uniqueEstados,
    uniqueSucursales,
    activeFiltersCount,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    filteredData,
    navigate,
    currentPage,
    setCurrentPage,
    columns,
    uniqueCategorias,
    filters,
    count,
    sedesConEquiposCount,
    setResponsableRecibeInput,
    responsableRecibeInput,
    archivosEquipo,
    setArchivosEquipo,
    handleArchivosChange,
  };
};
