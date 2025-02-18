import { useState } from "react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
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
import { FileText, Grid, LayoutGrid } from "lucide-react";
import { format } from "date-fns";
import { VerActaDialog } from "./components/VerActaDialog";

// Tipo de acta para TypeScript
type Acta = {
  id: string;
  tipo: "prestamo" | "traslado";
  fecha: Date;
  usuario: string;
  estado: "vigente" | "finalizada";
  descripcion: string;
  equipos?: {
    serial: string;
    marca: string;
    activoFijo: string;
    accesorios: string;
  }[];
  firmaEntrega?: string;
  firmaRecibe?: string;
  regionalDestino?: string;
  bodegaDestino?: string;
  motivoTraslado?: string;
};

// Datos de ejemplo más completos
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
        activoFijo: "AF001",
        accesorios: "Cargador, Mouse, Maletín",
      },
      {
        serial: "LP2023002",
        marca: "HP",
        activoFijo: "AF002",
        accesorios: "Cargador, Teclado externo",
      }
    ],
    firmaEntrega: "Carlos Rodriguez",
    firmaRecibe: "",
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
        activoFijo: "AF003",
        accesorios: "Monitor, Teclado, Mouse",
      },
      {
        serial: "PC2023002",
        marca: "HP",
        activoFijo: "AF004",
        accesorios: "Monitor Doble, Dock Station",
      }
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
        activoFijo: "AF005",
        accesorios: "Cargador, Adaptador HDMI, Mouse Magic",
      }
    ],
    firmaEntrega: "Diana Castro",
    firmaRecibe: "Luis Torres",
  }
];

const Actas = () => {
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [tipoFiltro, setTipoFiltro] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [selectedActa, setSelectedActa] = useState<Acta | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleVerActa = (acta: Acta) => {
    setSelectedActa(acta);
    setDialogOpen(true);
  };

  const filtrarActas = () => {
    return actasEjemplo.filter((acta) => {
      const cumpleTipo = tipoFiltro === "todos" || acta.tipo === tipoFiltro;
      const cumpleBusqueda = 
        acta.id.toLowerCase().includes(busqueda.toLowerCase()) ||
        acta.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
        acta.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      return cumpleTipo && cumpleBusqueda;
    });
  };

  const actasFiltradas = filtrarActas();

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {actasFiltradas.map((acta) => (
        <Card key={acta.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {acta.id}
            </CardTitle>
            <CardDescription>
              {format(acta.fecha, "PPP")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Tipo:</span>{" "}
                <span className="capitalize">{acta.tipo}</span>
              </div>
              <div>
                <span className="font-semibold">Usuario:</span>{" "}
                {acta.usuario}
              </div>
              <div>
                <span className="font-semibold">Estado:</span>{" "}
                <span className={`capitalize ${
                  acta.estado === "vigente" ? "text-green-600" : "text-gray-600"
                }`}>
                  {acta.estado}
                </span>
              </div>
              <p className="text-sm text-gray-600">{acta.descripcion}</p>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => handleVerActa(acta)}
              >
                Ver Acta
              </Button>
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
          {actasFiltradas.map((acta) => (
            <TableRow key={acta.id}>
              <TableCell className="font-medium">{acta.id}</TableCell>
              <TableCell>{format(acta.fecha, "PPP")}</TableCell>
              <TableCell className="capitalize">{acta.tipo}</TableCell>
              <TableCell>{acta.usuario}</TableCell>
              <TableCell>
                <span className={`capitalize ${
                  acta.estado === "vigente" ? "text-green-600" : "text-gray-600"
                }`}>
                  {acta.estado}
                </span>
              </TableCell>
              <TableCell className="max-w-xs truncate">{acta.descripcion}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleVerActa(acta)}
                >
                  Ver Acta
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

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

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
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
          </SelectContent>
        </Select>
      </div>

      {viewMode === "grid" ? <GridView /> : <TableView />}

      <VerActaDialog 
        acta={selectedActa} 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Actas;
