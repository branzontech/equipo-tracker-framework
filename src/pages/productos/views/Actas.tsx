import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { format } from "date-fns";
import { VerActaDialog } from "../components/VerActaDialog";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type TipoActa =
  | "prestamo"
  | "traslado"
  | "baja"
  | "donacion"
  | "venta"
  | "reposicion";
type EstadoActa =
  | "vigente"
  | "finalizada"
  | "en_proceso"
  | "cancelada"
  | "pendiente_devolucion";

type Acta = {
  id: string;
  tipo: TipoActa;
  fecha: Date;
  usuario: string;
  estado: EstadoActa;
  descripcion: string;
  equipos?: {
    serial: string;
    marca: string;
    activoFijo: string;
    accesorios: string;
    descripcion?: string;
  }[];
  firmaEntrega?: string;
  firmaRecibe?: string;
  regionalDestino?: string;
  bodegaDestino?: string;
  motivoTraslado?: string;
  fechaDevolucion?: Date;
  observaciones?: string;
  motivoBaja?: string;
  autorizadoPor?: string;
  valorVenta?: number;
  empresaCompradora?: string;
  tipoReposicion?: "garantia" | "seguro" | "otro";
  anexos?: string[];
};

const actasEjemplo: Acta[] = [
  {
    id: "ACT001",
    tipo: "prestamo",
    fecha: new Date(),
    usuario: "Juan Pérez",
    estado: "vigente",
    descripcion: "Préstamo de equipos para proyecto de desarrollo",
    equipos: [
      {
        serial: "LP2023001",
        marca: "Dell",
        descripcion: "Laptop Dell XPS 15 - i7 11th Gen",
        activoFijo: "AF001",
        accesorios: "Cargador, Mouse, Maletín",
      },
      {
        serial: "LP2023002",
        marca: "HP",
        descripcion: "Laptop HP EliteBook - i5 12th Gen",
        activoFijo: "AF002",
        accesorios: "Cargador, Teclado externo",
      },
    ],
    firmaEntrega: "Carlos Rodriguez",
    firmaRecibe: "",
    fechaDevolucion: new Date(new Date().setDate(new Date().getDate() + 30)),
  },
  {
    id: "ACT002",
    tipo: "traslado",
    fecha: new Date(),
    usuario: "María González",
    estado: "finalizada",
    descripcion: "Traslado de equipos por apertura de nueva sede",
    equipos: [
      {
        serial: "PC2023001",
        marca: "Lenovo",
        descripcion: "PC Lenovo ThinkCentre - i7 12th Gen",
        activoFijo: "AF003",
        accesorios: "Monitor, Teclado, Mouse",
      },
      {
        serial: "PC2023002",
        marca: "HP",
        descripcion: "PC HP ProDesk - i7 13th Gen",
        activoFijo: "AF004",
        accesorios: "Monitor Doble, Dock Station",
      },
    ],
    regionalDestino: "Medellín",
    bodegaDestino: "Sede Principal",
    motivoTraslado: "Apertura nueva sede regional",
    firmaEntrega: "Ana Martínez",
    firmaRecibe: "Pedro Gómez",
  },
  {
    id: "ACT003",
    tipo: "prestamo",
    fecha: new Date(),
    usuario: "Luis Torres",
    estado: "vigente",
    descripcion: "Préstamo temporal para trabajo remoto",
    equipos: [
      {
        serial: "LP2023003",
        marca: "MacBook",
        descripcion: "MacBook Pro 16' - M2 Pro",
        activoFijo: "AF005",
        accesorios: "Cargador, Adaptador HDMI, Mouse Magic",
      },
    ],
    firmaEntrega: "Diana Castro",
    firmaRecibe: "Luis Torres",
    fechaDevolucion: new Date(new Date().setDate(new Date().getDate() + 15)),
  },
  {
    id: "ACT004",
    tipo: "baja",
    fecha: new Date(new Date().setDate(new Date().getDate() - 45)),
    usuario: "Roberto Méndez",
    estado: "finalizada",
    descripcion: "Baja de equipos obsoletos",
    equipos: [
      {
        serial: "PC2020001",
        marca: "Dell",
        descripcion: "PC Dell Optiplex - i5 8th Gen",
        activoFijo: "AF006",
        accesorios: "Monitor, Teclado",
      },
    ],
    firmaEntrega: "Roberto Méndez",
    firmaRecibe: "Departamento de Activos",
    motivoBaja: "Obsolescencia tecnológica",
    autorizadoPor: "Junta Directiva",
    observaciones: "Equipos con más de 5 años de uso, fuera de soporte técnico",
  },
  {
    id: "ACT005",
    tipo: "donacion",
    fecha: new Date(new Date().setDate(new Date().getDate() - 60)),
    usuario: "Carolina Ramírez",
    estado: "finalizada",
    descripcion: "Donación de equipos a fundación educativa",
    equipos: [
      {
        serial: "LP2021001",
        marca: "Lenovo",
        descripcion: "Laptop Lenovo ThinkPad - i5 10th Gen",
        activoFijo: "AF007",
        accesorios: "Cargador",
      },
      {
        serial: "LP2021002",
        marca: "Lenovo",
        descripcion: "Laptop Lenovo ThinkPad - i5 10th Gen",
        activoFijo: "AF008",
        accesorios: "Cargador",
      },
    ],
    firmaEntrega: "Carolina Ramírez",
    firmaRecibe: "Fundación Educativa Futuro",
    observaciones: "Equipos reacondicionados para uso educativo",
  },
  {
    id: "ACT006",
    tipo: "venta",
    fecha: new Date(new Date().setDate(new Date().getDate() - 30)),
    usuario: "Jorge Alvarez",
    estado: "finalizada",
    descripcion: "Venta de equipos usados a empresa externa",
    equipos: [
      {
        serial: "PC2022001",
        marca: "HP",
        descripcion: "PC HP EliteDesk - i7 10th Gen",
        activoFijo: "AF009",
        accesorios: "Monitor, Teclado, Mouse",
      },
      {
        serial: "PC2022002",
        marca: "HP",
        descripcion: "PC HP EliteDesk - i7 10th Gen",
        activoFijo: "AF010",
        accesorios: "Monitor, Teclado, Mouse",
      },
    ],
    firmaEntrega: "Jorge Alvarez",
    firmaRecibe: "Representante TechBuyers Inc",
    valorVenta: 2500000,
    empresaCompradora: "TechBuyers Inc",
  },
  {
    id: "ACT007",
    tipo: "reposicion",
    fecha: new Date(new Date().setDate(new Date().getDate() - 15)),
    usuario: "Andrea Suárez",
    estado: "en_proceso",
    descripcion: "Reposición de equipo por garantía",
    equipos: [
      {
        serial: "LP2023010",
        marca: "Dell",
        descripcion: "Laptop Dell Latitude - i7 13th Gen",
        activoFijo: "AF011",
        accesorios: "Cargador, Dock Station",
      },
    ],
    firmaEntrega: "Andrea Suárez",
    firmaRecibe: "Soporte Técnico Dell",
    tipoReposicion: "garantia",
    observaciones: "Equipo presenta fallas en la placa madre",
  },
];

const Actas = () => {
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [tipoFiltro, setTipoFiltro] = useState<string>("todos");
  const [estadoFiltro, setEstadoFiltro] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [selectedActa, setSelectedActa] = useState<Acta | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actasData, setActasData] = useState<Acta[]>(actasEjemplo);
  const [managementSheetOpen, setManagementSheetOpen] = useState(false);
  const [currentActa, setCurrentActa] = useState<Acta | null>(null);
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleVerActa = (acta: Acta) => {
    setSelectedActa(acta);
    setDialogOpen(true);
  };

  const handleManageActa = (acta: Acta) => {
    setCurrentActa(acta);
    setManagementSheetOpen(true);
  };

  const filtrarActas = () => {
    return actasData.filter((acta) => {
      const cumpleTipo = tipoFiltro === "todos" || acta.tipo === tipoFiltro;
      const cumpleEstado =
        estadoFiltro === "todos" || acta.estado === estadoFiltro;
      const cumpleBusqueda =
        acta.id.toLowerCase().includes(busqueda.toLowerCase()) ||
        acta.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
        acta.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      return cumpleTipo && cumpleBusqueda && cumpleEstado;
    });
  };

  const handleStatusChange = (acta: Acta, newStatus: EstadoActa) => {
    const updatedActas = actasData.map((item) =>
      item.id === acta.id ? { ...item, estado: newStatus } : item
    );

    setActasData(updatedActas);

    toast({
      title: "Estado actualizado",
      description: `El acta ${acta.id} ahora tiene el estado: ${getEstadoLabel(
        newStatus
      )}`,
    });

    if (currentActa && currentActa.id === acta.id) {
      setCurrentActa({ ...acta, estado: newStatus });
    }
  };

  const handleProcessReturn = (acta: Acta) => {
    if (
      acta.tipo === "prestamo" &&
      (acta.estado === "vigente" || acta.estado === "pendiente_devolucion")
    ) {
      const updatedActas = actasData.map((item) =>
        item.id === acta.id
          ? { ...item, estado: "finalizada" as EstadoActa }
          : item
      );

      setActasData(updatedActas);

      toast({
        title: "Devolución procesada",
        description: `Los equipos del acta ${acta.id} han sido devueltos correctamente.`,
      });

      setManagementSheetOpen(false);
    }
  };

  const handleCancelActa = (acta: Acta) => {
    if (
      acta.estado === "vigente" ||
      acta.estado === "en_proceso" ||
      acta.estado === "pendiente_devolucion"
    ) {
      const updatedActas = actasData.map((item) =>
        item.id === acta.id
          ? { ...item, estado: "cancelada" as EstadoActa }
          : item
      );

      setActasData(updatedActas);

      toast({
        title: "Acta cancelada",
        description: `El acta ${acta.id} ha sido cancelada.`,
      });

      setManagementSheetOpen(false);
    }
  };

  const handleRequestReturn = (acta: Acta) => {
    if (acta.tipo === "prestamo" && acta.estado === "vigente") {
      const updatedActas = actasData.map((item) =>
        item.id === acta.id
          ? { ...item, estado: "pendiente_devolucion" as EstadoActa }
          : item
      );

      setActasData(updatedActas);

      toast({
        title: "Devolución solicitada",
        description: `Se ha solicitado la devolución de los equipos del acta ${acta.id}.`,
      });

      if (currentActa && currentActa.id === acta.id) {
        setCurrentActa({ ...acta, estado: "pendiente_devolucion" });
      }
    }
  };

  const getTipoIcon = (tipo: TipoActa) => {
    switch (tipo) {
      case "prestamo":
        return <Banknote className="h-5 w-5 text-blue-500" />;
      case "traslado":
        return <Truck className="h-5 w-5 text-green-500" />;
      case "baja":
        return <FileX className="h-5 w-5 text-red-500" />;
      case "donacion":
        return <ArrowUpFromLine className="h-5 w-5 text-purple-500" />;
      case "venta":
        return <Tag className="h-5 w-5 text-orange-500" />;
      case "reposicion":
        return <RotateCw className="h-5 w-5 text-teal-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getEstadoLabel = (estado: Acta["estado"]) => {
    const labels: Record<Acta["estado"], string> = {
      vigente: "Vigente",
      finalizada: "Finalizada",
      en_proceso: "En proceso",
      cancelada: "Cancelada",
      pendiente_devolucion: "Pendiente de devolución",
    };
    return labels[estado] || estado;
  };

  const getEstadoColor = (estado: Acta["estado"]) => {
    switch (estado) {
      case "vigente":
        return "text-green-600";
      case "finalizada":
        return "text-gray-600";
      case "en_proceso":
        return "text-blue-600";
      case "cancelada":
        return "text-red-600";
      case "pendiente_devolucion":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const getEstadoBadge = (estado: Acta["estado"]) => {
    const variants: Record<Acta["estado"], string> = {
      vigente: "bg-green-100 text-green-800",
      finalizada: "bg-gray-100 text-gray-800",
      en_proceso: "bg-blue-100 text-blue-800",
      cancelada: "bg-red-100 text-red-800",
      pendiente_devolucion: "bg-orange-100 text-orange-800",
    };
    return variants[estado] || "bg-gray-100 text-gray-800";
  };

  const getTipoLabel = (tipo: TipoActa) => {
    const labels: Record<TipoActa, string> = {
      prestamo: "Préstamo",
      traslado: "Traslado",
      baja: "Baja",
      donacion: "Donación",
      venta: "Venta",
      reposicion: "Reposición",
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

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {currentActas.map((acta) => (
        <Card key={acta.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getTipoIcon(acta.tipo)}
              {acta.id}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              {format(acta.fecha, "PPP")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span>{acta.usuario}</span>
              </div>
              <div>
                <Badge className={`capitalize ${getEstadoBadge(acta.estado)}`}>
                  {getEstadoLabel(acta.estado)}
                </Badge>
              </div>
              <div>
                <span className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                  Tipo:
                </span>{" "}
                <span className="capitalize">{getTipoLabel(acta.tipo)}</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {acta.descripcion}
              </p>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleVerActa(acta)}
                >
                  Ver Acta
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => handleManageActa(acta)}
                >
                  Gestionar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const TableView = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentActas.map((acta) => (
            <TableRow key={acta.id}>
              <TableCell className="font-medium">{acta.id}</TableCell>
              <TableCell>{format(acta.fecha, "PPP")}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getTipoIcon(acta.tipo)}
                  <span className="capitalize">{getTipoLabel(acta.tipo)}</span>
                </div>
              </TableCell>
              <TableCell>{acta.usuario}</TableCell>
              <TableCell>
                <Badge className={`capitalize ${getEstadoBadge(acta.estado)}`}>
                  {getEstadoLabel(acta.estado)}
                </Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {acta.descripcion}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVerActa(acta)}
                >
                  Ver
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleManageActa(acta)}
                >
                  Gestionar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const ActaManagementSheet = () => {
    if (!currentActa) return null;

    return (
      <Sheet open={managementSheetOpen} onOpenChange={setManagementSheetOpen}>
        <SheetContent className="w-full md:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {getTipoIcon(currentActa.tipo)}
              Gestionar Acta {currentActa.id}
            </SheetTitle>
          </SheetHeader>

          <div className="py-6 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Información del Acta</h3>
                  <p className="text-sm text-muted-foreground">
                    Detalles generales
                  </p>
                </div>
                <Badge className={`${getEstadoBadge(currentActa.estado)}`}>
                  {getEstadoLabel(currentActa.estado)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tipo</p>
                  <p className="font-medium">
                    {getTipoLabel(currentActa.tipo)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-medium">
                    {format(currentActa.fecha, "PPP")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Usuario</p>
                  <p className="font-medium">{currentActa.usuario}</p>
                </div>

                {currentActa.tipo === "prestamo" &&
                  currentActa.fechaDevolucion && (
                    <div>
                      <p className="text-sm text-gray-500">
                        Fecha de devolución
                      </p>
                      <p className="font-medium">
                        {format(currentActa.fechaDevolucion, "PPP")}
                      </p>
                    </div>
                  )}

                {currentActa.tipo === "traslado" &&
                  currentActa.regionalDestino && (
                    <div>
                      <p className="text-sm text-gray-500">Destino</p>
                      <p className="font-medium">
                        {currentActa.regionalDestino} -{" "}
                        {currentActa.bodegaDestino}
                      </p>
                    </div>
                  )}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">Cambiar estado</h3>
              <div className="flex flex-wrap gap-2">
                {currentActa.estado !== "vigente" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex gap-2"
                    onClick={() => handleStatusChange(currentActa, "vigente")}
                  >
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Marcar como vigente
                  </Button>
                )}

                {currentActa.estado !== "finalizada" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex gap-2"
                    onClick={() =>
                      handleStatusChange(currentActa, "finalizada")
                    }
                  >
                    <CheckCircle className="h-4 w-4 text-gray-500" />
                    Marcar como finalizada
                  </Button>
                )}

                {currentActa.estado !== "en_proceso" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex gap-2"
                    onClick={() =>
                      handleStatusChange(currentActa, "en_proceso")
                    }
                  >
                    <RotateCw className="h-4 w-4 text-blue-500" />
                    Marcar en proceso
                  </Button>
                )}

                {currentActa.estado !== "cancelada" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex gap-2"
                    onClick={() => handleStatusChange(currentActa, "cancelada")}
                  >
                    <XCircle className="h-4 w-4 text-red-500" />
                    Marcar como cancelada
                  </Button>
                )}
              </div>
            </div>

            {currentActa.tipo === "prestamo" && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-semibold">
                    Acciones específicas de préstamo
                  </h3>
                  <div className="space-y-2">
                    {currentActa.estado === "vigente" && (
                      <Button
                        className="w-full flex gap-2"
                        onClick={() => handleRequestReturn(currentActa)}
                      >
                        <AlertCircle className="h-4 w-4" />
                        Solicitar devolución
                      </Button>
                    )}

                    {(currentActa.estado === "vigente" ||
                      currentActa.estado === "pendiente_devolucion") && (
                      <Button
                        variant="secondary"
                        className="w-full flex gap-2"
                        onClick={() => handleProcessReturn(currentActa)}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Procesar devolución
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}

            {(currentActa.estado === "vigente" ||
              currentActa.estado === "en_proceso") && (
              <>
                <Separator />
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleCancelActa(currentActa)}
                >
                  Cancelar acta
                </Button>
              </>
            )}
          </div>

          <SheetFooter className="mt-6">
            <Button
              className="w-full"
              onClick={() => handleVerActa(currentActa)}
            >
              Ver todos los detalles
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#040d50]">Actas Generadas</h1>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("table")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Buscar por ID, usuario o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los tipos</SelectItem>
            <SelectItem value="prestamo">Préstamos</SelectItem>
            <SelectItem value="traslado">Traslados</SelectItem>
            <SelectItem value="baja">Bajas</SelectItem>
            <SelectItem value="donacion">Donaciones</SelectItem>
            <SelectItem value="venta">Ventas</SelectItem>
            <SelectItem value="reposicion">Reposiciones</SelectItem>
          </SelectContent>
        </Select>

        <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="vigente">Vigente</SelectItem>
            <SelectItem value="finalizada">Finalizada</SelectItem>
            <SelectItem value="en_proceso">En proceso</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
            <SelectItem value="pendiente_devolucion">
              Pendiente devolución
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {actasFiltradas.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium">No se encontraron actas</h3>
          <p className="text-gray-500 mt-1">
            Pruebe con otros filtros de búsqueda
          </p>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? <GridView /> : <TableView />}
          <PaginationControls />
        </>
      )}

      <VerActaDialog
        acta={selectedActa}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <ActaManagementSheet />
    </div>
  );
};

export default Actas;
