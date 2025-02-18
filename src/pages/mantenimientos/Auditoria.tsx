
import { useState } from "react";
import { ChevronLeft, Search, Download, Clock, Check, Pause, AlertCircle, CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";

const estados = [
  { value: "ejecutado", label: "Ejecutado", icon: Check, color: "bg-green-500" },
  { value: "pendiente", label: "Pendiente", icon: Pause, color: "bg-yellow-500" },
  { value: "programado", label: "Programado", icon: Clock, color: "bg-blue-500" },
  { value: "atrasado", label: "Atrasado", icon: AlertCircle, color: "bg-red-500" },
];

const AuditoriaMantenimiento = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstados, setSelectedEstados] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: undefined,
  });

  const toggleEstado = (estado: string) => {
    setSelectedEstados(prev =>
      prev.includes(estado)
        ? prev.filter(e => e !== estado)
        : [...prev, estado]
    );
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/mantenimientos")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-[#040d50]">Auditoría de Mantenimientos</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panel de Calendario */}
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              locale={es}
              className="w-full [&_.rdp-day]:w-12 [&_.rdp-day]:h-12 [&_.rdp-head_th]:w-12 [&_.rdp-nav]:h-8"
              numberOfMonths={2}
            />
          </CardContent>
        </Card>

        {/* Panel de Filtros */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Filtros</h3>
              
              {/* Filtro de Rango de Fechas */}
              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-medium">Rango de Fechas</h4>
                <div className="grid gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${!dateRange?.from && "text-muted-foreground"}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange?.to ? (
                            <>
                              {format(dateRange.from, "P", { locale: es })} -{" "}
                              {format(dateRange.to, "P", { locale: es })}
                            </>
                          ) : (
                            format(dateRange.from, "P", { locale: es })
                          )
                        ) : (
                          <span>Seleccione un rango de fechas</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar mantenimientos..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium mb-2">Estado</h4>
                <div className="space-y-2">
                  {estados.map((estado) => {
                    const Icon = estado.icon;
                    const isSelected = selectedEstados.includes(estado.value);
                    return (
                      <button
                        key={estado.value}
                        className={`w-full flex items-center gap-2 p-2 rounded-md transition-colors ${
                          isSelected ? estado.color + " text-white" : "hover:bg-accent"
                        }`}
                        onClick={() => toggleEstado(estado.value)}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{estado.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Estadísticas</h3>
              <div className="space-y-2">
                {estados.map((estado) => (
                  <div key={estado.value} className="flex justify-between items-center">
                    <span className="text-sm">{estado.label}</span>
                    <Badge variant="outline" className={estado.color + " text-white"}>
                      0
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Reporte
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Mantenimientos del Día Seleccionado */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Mantenimientos para el período seleccionado
          </h3>
          <div className="space-y-4">
            {/* Ejemplo de mantenimiento */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-blue-500 text-white">
                  Programado
                </Badge>
                <div>
                  <h4 className="font-medium">Mantenimiento Preventivo</h4>
                  <p className="text-sm text-muted-foreground">Equipo XYZ - Sede Principal</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">09:00 AM</p>
                <p className="text-sm text-muted-foreground">Juan Pérez</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditoriaMantenimiento;
