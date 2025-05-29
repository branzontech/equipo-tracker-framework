import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  Package,
  Wrench,
  Building2,
  Printer,
  GripVertical,
  Gauge,
  ChartBar,
  ChartLine,
  ChartPie,
  ActivitySquare,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DashboardItem,
  equiposData,
  incidentesData,
  mantenimientosData,
  rendimientoEquiposData,
  rendimientoTonerData,
  sedesData,
  serviciosActivosData,
  solicitudesData,
  tiempoRespuestaData,
  tonerData,
} from "@/pages/dashboard/interfaces/dashboardItem";
import { useCounts } from "@/hooks/use-counts";

export default function Dashboard() {
  const { sedesCount } = useCounts();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("general");

  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([
    {
      id: "total-equipos",
      order: 0,
      title: "Total Equipos",
      size: "small",
      tab: "general",
      component: (
        <div className="w-full">
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Total Equipos</span>
          </div>
          <div className="text-2xl font-bold mt-2">415</div>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            Activos en inventario
          </p>
        </div>
      ),
    },
    {
      id: "mantenimientos",
      order: 1,
      title: "Mantenimientos Vencidos",
      size: "small",
      tab: "general",
      component: (
        <div className="w-full">
          <div className="flex items-center gap-2 text-sm">
            <Wrench className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Mantenimientos Vencidos</span>
          </div>
          <div className="text-2xl font-bold mt-2 text-red-500">12</div>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            Requieren atención inmediata
          </p>
        </div>
      ),
    },
    {
      id: "toner",
      order: 2,
      title: "Tóner Disponible",
      size: "small",
      tab: "general",
      component: (
        <div className="w-full">
          <div className="flex items-center gap-2 text-sm">
            <Printer className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Tóner Disponible</span>
          </div>
          <div className="text-2xl font-bold mt-2">85%</div>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            Stock saludable
          </p>
        </div>
      ),
    },
    {
      id: "sedes",
      order: 3,
      title: "Sedes Activas",
      size: "small",
      tab: "general",
      component: (
        <div className="w-full">
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Sedes Activas</span>
          </div>
          <div className="text-2xl font-bold mt-2">{sedesCount}</div>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            Con equipos asignados
          </p>
        </div>
      ),
    },

    {
      id: "rendimiento-promedio",
      order: 4,
      title: "Rendimiento Promedio",
      size: "small",
      tab: "rendimiento",
      component: (
        <div className="w-full">
          <div className="flex items-center gap-2 text-sm">
            <Gauge className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Rendimiento Promedio</span>
          </div>
          <div className="text-2xl font-bold mt-2 text-blue-500">88%</div>
          <div className="mt-2">
            <Progress value={88} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            Todos los equipos
          </p>
        </div>
      ),
    },
    {
      id: "tiempo-respuesta",
      order: 5,
      title: "Tiempo de Respuesta",
      size: "small",
      tab: "rendimiento",
      component: (
        <div className="w-full">
          <div className="flex items-center gap-2 text-sm">
            <TrendingDown className="h-4 w-4 flex-shrink-0 text-green-500" />
            <span className="truncate">Tiempo de Respuesta</span>
          </div>
          <div className="text-2xl font-bold mt-2">
            3.2 <span className="text-sm font-normal">hrs</span>
          </div>
          <p className="text-xs text-green-500 mt-1 truncate">
            ↓ 12% vs mes anterior
          </p>
        </div>
      ),
    },
    {
      id: "incidentes-mes",
      order: 6,
      title: "Incidentes del Mes",
      size: "small",
      tab: "rendimiento",
      component: (
        <div className="w-full">
          <div className="flex items-center gap-2 text-sm">
            <ActivitySquare className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Incidentes del Mes</span>
          </div>
          <div className="text-2xl font-bold mt-2">38</div>
          <p className="text-xs text-red-500 mt-1 truncate">
            ↑ 5% vs mes anterior
          </p>
        </div>
      ),
    },
    {
      id: "satisfaccion",
      order: 7,
      title: "Satisfacción Usuario",
      size: "small",
      tab: "rendimiento",
      component: (
        <div className="w-full">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 flex-shrink-0 text-green-500" />
            <span className="truncate">Satisfacción Usuario</span>
          </div>
          <div className="text-2xl font-bold mt-2 text-green-500">92%</div>
          <div className="mt-2">
            <Progress value={92} className="h-2 bg-muted" />
          </div>
          <p className="text-xs text-green-500 mt-1 truncate">
            ↑ 3% vs mes anterior
          </p>
        </div>
      ),
    },

    {
      id: "distribucion-equipos",
      order: 8,
      title: "Distribución de Equipos por Tipo",
      size: "large",
      tab: "general",
      chartType: "bar",
      data: equiposData,
      component: <></>,
    },
    {
      id: "estado-mantenimientos",
      order: 9,
      title: "Estado de Mantenimientos",
      size: "large",
      tab: "general",
      chartType: "pie",
      data: mantenimientosData,
      component: <></>,
    },
    {
      id: "estado-toner",
      order: 10,
      title: "Estado de Tóner",
      size: "large",
      tab: "general",
      chartType: "pie",
      data: tonerData,
      component: <></>,
    },
    {
      id: "equipos-sede",
      order: 11,
      title: "Equipos por Sede",
      size: "large",
      tab: "general",
      chartType: "bar",
      data: sedesData,
      component: <></>,
    },

    {
      id: "rendimiento-toner",
      order: 12,
      title: "Rendimiento de Tóner",
      size: "large",
      tab: "rendimiento",
      chartType: "line",
      data: rendimientoTonerData,
      component: <></>,
    },
    {
      id: "incidentes-por-mes",
      order: 13,
      title: "Incidentes por Mes",
      size: "large",
      tab: "rendimiento",
      chartType: "area",
      data: incidentesData,
      component: <></>,
    },
    {
      id: "solicitudes-tipo",
      order: 14,
      title: "Solicitudes por Tipo",
      size: "large",
      tab: "rendimiento",
      chartType: "pie",
      data: solicitudesData,
      component: <></>,
    },
    {
      id: "rendimiento-equipos",
      order: 15,
      title: "Rendimiento por Equipo",
      size: "large",
      tab: "rendimiento",
      chartType: "bar",
      data: rendimientoEquiposData.map((item) => ({
        name: item.nombre,
        cantidad: item.rendimiento,
      })),
      component: <></>,
    },

    {
      id: "servicios-activos",
      order: 16,
      title: "Servicios Activos",
      size: "large",
      tab: "servicios",
      chartType: "bar",
      data: serviciosActivosData.map((item) => ({
        name: item.name,
        cantidad: item.valor,
      })),
      component: <></>,
    },
    {
      id: "tiempo-respuesta-chart",
      order: 17,
      title: "Evolución Tiempo de Respuesta",
      size: "large",
      tab: "servicios",
      chartType: "line",
      data: tiempoRespuestaData.map((item) => ({
        name: item.name,
        cantidad: item.tiempo,
      })),
      component: <></>,
    },
  ]);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.classList.add("opacity-50", "cursor-grabbing");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.classList.remove("opacity-50", "cursor-grabbing");
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetItemId) return;

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

  const handleDrop = (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetItemId) return;

    const targetElement = e.currentTarget as HTMLElement;
    targetElement.classList.remove(
      "bg-muted",
      "transition-colors",
      "duration-200"
    );

    setDashboardItems((prevItems) => {
      const draggedItemOrder =
        prevItems.find((item) => item.id === draggedItem)?.order || 0;
      const targetItemOrder =
        prevItems.find((item) => item.id === targetItemId)?.order || 0;

      return prevItems.map((item) => {
        if (item.id === draggedItem) {
          return { ...item, order: targetItemOrder };
        }
        if (item.id === targetItemId) {
          return { ...item, order: draggedItemOrder };
        }
        return item;
      });
    });
  };

  const sortedItems = [...dashboardItems].sort((a, b) => a.order - b.order);

  const getFilteredItems = (tab: string) => {
    return sortedItems.filter((item) => item.tab === tab);
  };

  const getSmallItems = (tab: string) => {
    return getFilteredItems(tab).filter((item) => item.size === "small");
  };

  const getLargeItems = (tab: string) => {
    return getFilteredItems(tab).filter((item) => item.size === "large");
  };

  const renderChart = (item: DashboardItem) => {
    if (item.chartType === "bar" && item.data) {
      return (
        <BarChart data={item.data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Bar dataKey="cantidad" fill="#3b82f6" />
        </BarChart>
      );
    } else if (item.chartType === "pie" && item.data) {
      return (
        <PieChart>
          <Pie
            data={item.data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={window.innerWidth < 640 ? 80 : 100}
            fill="#8884d8"
            dataKey="value"
          >
            {item.data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            wrapperStyle={{ fontSize: "12px" }}
            verticalAlign="bottom"
            height={36}
          />
        </PieChart>
      );
    } else if (item.chartType === "line" && item.data) {
      return (
        <LineChart data={item.data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Line
            type="monotone"
            dataKey="cantidad"
            stroke="#3b82f6"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      );
    } else if (item.chartType === "area" && item.data) {
      return (
        <AreaChart data={item.data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="hardware"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
          />
          <Area
            type="monotone"
            dataKey="software"
            stackId="1"
            stroke="#8b5cf6"
            fill="#8b5cf6"
          />
        </AreaChart>
      );
    }
    return item.component;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
        Dashboard
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="rendimiento">Rendimiento</TabsTrigger>
          <TabsTrigger value="servicios">Servicios</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
            {getSmallItems("general").map((item) => (
              <Card
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, item.id)}
                className="cursor-grab transition-all duration-200 hover:bg-muted/50 group"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 sm:p-6">
                  <CardTitle className="text-sm sm:text-base font-medium w-full">
                    <div className="flex items-center gap-2 w-full">
                      <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      {item.component}
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            {getLargeItems("general").map((item) => (
              <Card
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, item.id)}
                className="cursor-grab transition-all duration-200 hover:bg-muted/50 group"
              >
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                    <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="h-[250px] sm:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      {renderChart(item)}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rendimiento" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
            {getSmallItems("rendimiento").map((item) => (
              <Card
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, item.id)}
                className="cursor-grab transition-all duration-200 hover:bg-muted/50 group"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 sm:p-6">
                  <CardTitle className="text-sm sm:text-base font-medium w-full">
                    <div className="flex items-center gap-2 w-full">
                      <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      {item.component}
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            {getLargeItems("rendimiento").map((item) => (
              <Card
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, item.id)}
                className="cursor-grab transition-all duration-200 hover:bg-muted/50 group"
              >
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                    <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="h-[250px] sm:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      {renderChart(item)}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="servicios" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-6">
            {getLargeItems("servicios").map((item) => (
              <Card
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, item.id)}
                className="cursor-grab transition-all duration-200 hover:bg-muted/50 group"
              >
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                    <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="h-[250px] sm:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      {renderChart(item)}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Licencias Activas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Software</TableHead>
                    <TableHead>Licencias</TableHead>
                    <TableHead>Utilizadas</TableHead>
                    <TableHead>Disponibles</TableHead>
                    <TableHead>Renovación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Office 365</TableCell>
                    <TableCell>250</TableCell>
                    <TableCell>230</TableCell>
                    <TableCell>20</TableCell>
                    <TableCell>15/12/2024</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Adobe Creative Cloud
                    </TableCell>
                    <TableCell>100</TableCell>
                    <TableCell>85</TableCell>
                    <TableCell>15</TableCell>
                    <TableCell>30/09/2024</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Antivirus Corporativo
                    </TableCell>
                    <TableCell>400</TableCell>
                    <TableCell>350</TableCell>
                    <TableCell>50</TableCell>
                    <TableCell>01/01/2025</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Software Desarrollo
                    </TableCell>
                    <TableCell>50</TableCell>
                    <TableCell>40</TableCell>
                    <TableCell>10</TableCell>
                    <TableCell>10/11/2024</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      ERP Empresarial
                    </TableCell>
                    <TableCell>150</TableCell>
                    <TableCell>125</TableCell>
                    <TableCell>25</TableCell>
                    <TableCell>22/07/2024</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
