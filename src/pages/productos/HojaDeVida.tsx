
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Activity,
  ChevronLeft,
  Wrench,
  Truck,
  User,
  Calendar,
  Clipboard,
  AlertCircle,
  CheckCircle2,
  ArrowRightLeft,
  Timer,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Datos de ejemplo
const equipoInfo = {
  id: "EQ001",
  numeroSerie: "SN123456",
  descripcion: "Laptop Dell XPS 15",
  marca: "Dell",
  modelo: "XPS 15 9520",
  estado: "Activo",
  fechaIngreso: "2023-01-15",
  tipoActivo: "Equipo de Cómputo",
  garantia: "2025-01-15",
  proveedor: "Dell Colombia",
  valor: 5000000,
  ubicacionActual: {
    sede: "Sede Principal",
    area: "Desarrollo",
    responsable: "Juan Pérez"
  }
};

const historialEventos = [
  {
    id: 1,
    tipo: "ingreso",
    fecha: "2023-01-15",
    descripcion: "Ingreso inicial del equipo",
    responsable: "María González",
    detalles: {
      proveedor: "Dell Colombia",
      factura: "FAC-001",
      valor: 5000000
    }
  },
  {
    id: 2,
    tipo: "mantenimiento_preventivo",
    fecha: "2023-04-15",
    descripcion: "Mantenimiento preventivo trimestral",
    responsable: "Carlos Rodríguez",
    detalles: {
      actividades: ["Limpieza general", "Actualización de software", "Revisión de hardware"],
      duracion: "2 horas",
      resultado: "Satisfactorio"
    }
  },
  {
    id: 3,
    tipo: "traslado",
    fecha: "2023-06-01",
    descripcion: "Traslado entre áreas",
    responsable: "Ana Martínez",
    detalles: {
      origen: "Área TI",
      destino: "Desarrollo",
      motivo: "Reasignación de recursos"
    }
  },
  {
    id: 4,
    tipo: "mantenimiento_correctivo",
    fecha: "2023-08-15",
    descripcion: "Reemplazo de batería",
    responsable: "Pedro López",
    detalles: {
      problema: "Batería no retiene carga",
      solucion: "Instalación de batería nueva",
      repuestos: ["Batería original Dell"],
      garantia: "1 año"
    }
  },
  {
    id: 5,
    tipo: "mantenimiento_preventivo",
    fecha: "2023-10-15",
    descripcion: "Mantenimiento preventivo trimestral",
    responsable: "Carlos Rodríguez",
    detalles: {
      actividades: ["Limpieza general", "Actualización de software", "Revisión de hardware"],
      duracion: "2 horas",
      resultado: "Satisfactorio"
    }
  }
];

const estadisticasMantenimiento = [
  { name: 'Preventivos', value: 8 },
  { name: 'Correctivos', value: 3 },
];

const disponibilidadMensual = [
  { mes: 'Ene', disponibilidad: 100 },
  { mes: 'Feb', disponibilidad: 98 },
  { mes: 'Mar', disponibilidad: 100 },
  { mes: 'Abr', disponibilidad: 95 },
  { mes: 'May', disponibilidad: 100 },
  { mes: 'Jun', disponibilidad: 99 },
];

const COLORS = ['#0088FE', '#FF8042'];

const HojaDeVida = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("informacion");

  const getIconoEvento = (tipo: string) => {
    switch (tipo) {
      case "ingreso":
        return <Clipboard className="h-6 w-6 text-green-500" />;
      case "mantenimiento_preventivo":
        return <Wrench className="h-6 w-6 text-blue-500" />;
      case "mantenimiento_correctivo":
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case "traslado":
        return <Truck className="h-6 w-6 text-orange-500" />;
      default:
        return <Info className="h-6 w-6" />;
    }
  };

  const getBadgeEvento = (tipo: string) => {
    switch (tipo) {
      case "ingreso":
        return (
          <Badge variant="outline" className="bg-green-500 text-white">
            Ingreso
          </Badge>
        );
      case "mantenimiento_preventivo":
        return (
          <Badge variant="outline" className="bg-blue-500 text-white">
            Preventivo
          </Badge>
        );
      case "mantenimiento_correctivo":
        return (
          <Badge variant="outline" className="bg-red-500 text-white">
            Correctivo
          </Badge>
        );
      case "traslado":
        return (
          <Badge variant="outline" className="bg-orange-500 text-white">
            Traslado
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            Otro
          </Badge>
        );
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/productos/lista")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-[#040d50]">Hoja de Vida del Equipo</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Identificación
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipoInfo.numeroSerie}</div>
            <p className="text-xs text-muted-foreground">
              {equipoInfo.descripcion}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ubicación Actual
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipoInfo.ubicacionActual.area}</div>
            <p className="text-xs text-muted-foreground">
              {equipoInfo.ubicacionActual.sede} - {equipoInfo.ubicacionActual.responsable}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Estado Actual
            </CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant="outline" className="bg-green-500 text-white">
                {equipoInfo.estado}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Última actualización: {format(new Date(), "PPP", { locale: es })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="informacion">Información General</TabsTrigger>
          <TabsTrigger value="timeline">Línea de Tiempo</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="informacion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Equipo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Información Básica</h3>
                  <div className="space-y-2">
                    <p><span className="text-muted-foreground">Marca:</span> {equipoInfo.marca}</p>
                    <p><span className="text-muted-foreground">Modelo:</span> {equipoInfo.modelo}</p>
                    <p><span className="text-muted-foreground">Tipo:</span> {equipoInfo.tipoActivo}</p>
                    <p><span className="text-muted-foreground">Fecha Ingreso:</span> {format(new Date(equipoInfo.fechaIngreso), "PPP", { locale: es })}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Información Adicional</h3>
                  <div className="space-y-2">
                    <p><span className="text-muted-foreground">Garantía hasta:</span> {format(new Date(equipoInfo.garantia), "PPP", { locale: es })}</p>
                    <p><span className="text-muted-foreground">Proveedor:</span> {equipoInfo.proveedor}</p>
                    <p><span className="text-muted-foreground">Valor:</span> ${equipoInfo.valor.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial del Equipo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-8">
                {historialEventos.map((evento, index) => (
                  <div key={evento.id} className="flex gap-4">
                    <div className="flex-none">
                      <div className="bg-background p-2 rounded-full border">
                        {getIconoEvento(evento.tipo)}
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {getBadgeEvento(evento.tipo)}
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(evento.fecha), "PPP", { locale: es })}
                        </span>
                      </div>
                      <h4 className="font-semibold">{evento.descripcion}</h4>
                      <p className="text-sm text-muted-foreground">
                        Responsable: {evento.responsable}
                      </p>
                      {evento.detalles && (
                        <div className="bg-muted p-3 rounded-md text-sm">
                          {Object.entries(evento.detalles).map(([key, value]) => (
                            <p key={key} className="capitalize">
                              <span className="font-medium">{key.replace(/_/g, " ")}:</span>{" "}
                              {Array.isArray(value) ? value.join(", ") : value}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estadisticas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Mantenimientos</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={estadisticasMantenimiento}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {estadisticasMantenimiento.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disponibilidad Mensual</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={disponibilidadMensual}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="disponibilidad" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HojaDeVida;
