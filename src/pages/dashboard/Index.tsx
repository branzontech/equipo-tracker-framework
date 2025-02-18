import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, Wrench, Building2, Printer, GripVertical } from "lucide-react";

const equiposData = [
  { name: 'Laptops', cantidad: 120 },
  { name: 'Desktops', cantidad: 80 },
  { name: 'Monitores', cantidad: 150 },
  { name: 'Impresoras', cantidad: 45 },
  { name: 'Servidores', cantidad: 20 },
];

const mantenimientosData = [
  { name: 'Al día', value: 75, color: '#4ade80' },
  { name: 'Próximos', value: 15, color: '#fbbf24' },
  { name: 'Vencidos', value: 10, color: '#f87171' },
];

const tonerData = [
  { name: 'Disponibles', value: 85, color: '#4ade80' },
  { name: 'Alerta', value: 15, color: '#f87171' },
];

const sedesData = [
  { name: 'Sede A', cantidad: 150 },
  { name: 'Sede B', cantidad: 120 },
  { name: 'Sede C', cantidad: 80 },
  { name: 'Sede D', cantidad: 65 },
];

type DashboardItem = {
  id: string;
  order: number;
  title: string;
  size: 'small' | 'large';
  component?: JSX.Element;
  chartType?: 'bar' | 'pie';
  data?: any[];
};

export default function Dashboard() {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([
    {
      id: 'total-equipos',
      order: 0,
      title: 'Total Equipos',
      size: 'small',
      component: (
        <div className="w-full">
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Total Equipos</span>
          </div>
          <div className="text-2xl font-bold mt-2">415</div>
          <p className="text-xs text-muted-foreground mt-1 truncate">Activos en inventario</p>
        </div>
      )
    },
    {
      id: 'mantenimientos',
      order: 1,
      title: 'Mantenimientos Vencidos',
      size: 'small',
      component: (
        <div className="w-full">
          <div className="flex items-center gap-2 text-sm">
            <Wrench className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Mantenimientos Vencidos</span>
          </div>
          <div className="text-2xl font-bold mt-2 text-red-500">12</div>
          <p className="text-xs text-muted-foreground mt-1 truncate">Requieren atención inmediata</p>
        </div>
      )
    },
    {
      id: 'toner',
      order: 2,
      title: 'Tóner Disponible',
      size: 'small',
      component: (
        <div className="w-full">
          <div className="flex items-center gap-2 text-sm">
            <Printer className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Tóner Disponible</span>
          </div>
          <div className="text-2xl font-bold mt-2">85%</div>
          <p className="text-xs text-muted-foreground mt-1 truncate">Stock saludable</p>
        </div>
      )
    },
    {
      id: 'sedes',
      order: 3,
      title: 'Sedes Activas',
      size: 'small',
      component: (
        <div className="w-full">
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Sedes Activas</span>
          </div>
          <div className="text-2xl font-bold mt-2">8</div>
          <p className="text-xs text-muted-foreground mt-1 truncate">Con equipos asignados</p>
        </div>
      )
    },
    {
      id: 'distribucion-equipos',
      order: 4,
      title: 'Distribución de Equipos por Tipo',
      size: 'large',
      chartType: 'bar',
      data: equiposData,
      component: <></>
    },
    {
      id: 'estado-mantenimientos',
      order: 5,
      title: 'Estado de Mantenimientos',
      size: 'large',
      chartType: 'pie',
      data: mantenimientosData,
      component: <></>
    },
    {
      id: 'estado-toner',
      order: 6,
      title: 'Estado de Tóner',
      size: 'large',
      chartType: 'pie',
      data: tonerData,
      component: <></>
    },
    {
      id: 'equipos-sede',
      order: 7,
      title: 'Equipos por Sede',
      size: 'large',
      chartType: 'bar',
      data: sedesData,
      component: <></>
    }
  ]);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.classList.add('opacity-50', 'cursor-grabbing');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.classList.remove('opacity-50', 'cursor-grabbing');
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetItemId) return;
    
    const targetElement = e.currentTarget as HTMLElement;
    targetElement.classList.add('bg-muted', 'transition-colors', 'duration-200');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const targetElement = e.currentTarget as HTMLElement;
    targetElement.classList.remove('bg-muted', 'transition-colors', 'duration-200');
  };

  const handleDrop = (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetItemId) return;

    const targetElement = e.currentTarget as HTMLElement;
    targetElement.classList.remove('bg-muted', 'transition-colors', 'duration-200');

    setDashboardItems(prevItems => {
      const draggedItemOrder = prevItems.find(item => item.id === draggedItem)?.order || 0;
      const targetItemOrder = prevItems.find(item => item.id === targetItemId)?.order || 0;

      return prevItems.map(item => {
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
  const smallItems = sortedItems.filter(item => item.size === 'small');
  const largeItems = sortedItems.filter(item => item.size === 'large');

  const renderChart = (item: DashboardItem) => {
    if (item.chartType === 'bar' && item.data) {
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
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="cantidad" fill="#3b82f6" />
        </BarChart>
      );
    } else if (item.chartType === 'pie' && item.data) {
      return (
        <PieChart>
          <Pie
            data={item.data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
            wrapperStyle={{ fontSize: '12px' }}
            verticalAlign="bottom"
            height={36}
          />
        </PieChart>
      );
    }
    return item.component;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        {smallItems.map((item) => (
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
        {largeItems.map((item) => (
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
    </div>
  );
}
