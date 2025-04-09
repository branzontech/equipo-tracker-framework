
import React from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Search, CalendarIcon, Filter } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EstadoInfo } from "@/types/mantenimiento";

interface FiltersPanelProps {
  searchTerm: string;
  dateRange: DateRange | undefined;
  selectedResponsable: string | undefined;
  tipoMantenimiento: string | undefined;
  selectedEstados: string[];
  estados: EstadoInfo[];
  uniqueResponsables: string[];
  uniqueTipos: string[];
  onSearchChange: (value: string) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onResponsableChange: (value: string) => void;
  onTipoChange: (value: string) => void;
  toggleEstado: (estado: string) => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  searchTerm,
  dateRange,
  selectedResponsable,
  tipoMantenimiento,
  selectedEstados,
  estados,
  uniqueResponsables,
  uniqueTipos,
  onSearchChange,
  onDateRangeChange,
  onResponsableChange,
  onTipoChange,
  toggleEstado
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Filter className="h-5 w-5 mr-2" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar mantenimientos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Rango de Fechas</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
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
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={onDateRangeChange}
                initialFocus
                locale={es}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Responsable</h3>
          <Select value={selectedResponsable} onValueChange={onResponsableChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar responsable" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {uniqueResponsables.map((responsable) => (
                <SelectItem key={responsable} value={responsable}>
                  {responsable}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Tipo de Mantenimiento</h3>
          <Select value={tipoMantenimiento} onValueChange={onTipoChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {uniqueTipos.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Estado</h3>
          <div className="space-y-2">
            {estados.map((estado) => {
              const Icon = estado.icon;
              const isSelected = selectedEstados.includes(estado.value);
              return (
                <button
                  key={estado.value}
                  className={`w-full flex items-center gap-2 p-2 rounded-md transition-colors ${
                    isSelected 
                      ? estado.color + " text-white hover:opacity-90" 
                      : "border hover:bg-[#01242c]/10 text-[#01242c]"
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
      </CardContent>
    </Card>
  );
};
