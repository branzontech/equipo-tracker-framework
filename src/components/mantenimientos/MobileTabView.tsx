
import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarView } from "./CalendarView";
import { SelectedDateEvents } from "./SelectedDateEvents";
import { FiltersPanel } from "./FiltersPanel";
import { Statistics } from "./Statistics";
import { DateRange } from "react-day-picker";
import { EstadoInfo, MantenimientoItem, StatItem } from "@/types/mantenimiento";

interface MobileTabViewProps {
  activeTab: string;
  selectedDate: Date | undefined;
  selectedMonth: Date;
  selectedPeriodo: string;
  periodos: { value: string; label: string }[];
  searchTerm: string;
  dateRange: DateRange | undefined;
  selectedResponsable: string | undefined;
  tipoMantenimiento: string | undefined;
  selectedEstados: string[];
  daysWithEvents: Record<string, { count: number; states: Record<string, boolean> }>;
  modifiers: any;
  modifiersStyles: any;
  estados: EstadoInfo[];
  statistics: StatItem[];
  selectedDateEvents: MantenimientoItem[];
  uniqueResponsables: string[];
  uniqueTipos: string[];
  onTabChange: (value: string) => void;
  onDayClick: (day: Date | undefined) => void;
  onMonthChange: (date: Date) => void;
  onPeriodoChange: (value: string) => void;
  navigateMonth: (direction: 'prev' | 'next') => void;
  onSearchChange: (value: string) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onResponsableChange: (value: string) => void;
  onTipoChange: (value: string) => void;
  toggleEstado: (estado: string) => void;
}

export const MobileTabView: React.FC<MobileTabViewProps> = ({
  activeTab,
  selectedDate,
  selectedMonth,
  selectedPeriodo,
  periodos,
  searchTerm,
  dateRange,
  selectedResponsable,
  tipoMantenimiento,
  selectedEstados,
  daysWithEvents,
  modifiers,
  modifiersStyles,
  estados,
  statistics,
  selectedDateEvents,
  uniqueResponsables,
  uniqueTipos,
  onTabChange,
  onDayClick,
  onMonthChange,
  onPeriodoChange,
  navigateMonth,
  onSearchChange,
  onDateRangeChange,
  onResponsableChange,
  onTipoChange,
  toggleEstado
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="calendar">Calendario</TabsTrigger>
        <TabsTrigger value="events">Eventos</TabsTrigger>
        <TabsTrigger value="filters">Filtros</TabsTrigger>
      </TabsList>

      {/* Contenido de pestañas */}
      <TabsContent value="calendar" className="mt-0">
        <CalendarView
          isMobile={true}
          selectedDate={selectedDate}
          selectedMonth={selectedMonth}
          selectedPeriodo={selectedPeriodo}
          periodos={periodos}
          estados={estados}
          daysWithEvents={daysWithEvents}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          onDayClick={onDayClick}
          onMonthChange={onMonthChange}
          onPeriodoChange={onPeriodoChange}
          navigateMonth={navigateMonth}
        />
      </TabsContent>

      <TabsContent value="events" className="mt-0">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {selectedDate 
                ? `Eventos del ${format(selectedDate, "d 'de' MMMM", { locale: es })}`
                : "Seleccione una fecha"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EventsList 
              events={selectedDateEvents} 
              estados={estados} 
              emptyMessage="No hay eventos para esta fecha" 
            />
          </CardContent>
        </Card>
        
        <Statistics statistics={statistics} />
      </TabsContent>

      <TabsContent value="filters" className="mt-0">
        <FiltersPanel
          searchTerm={searchTerm}
          dateRange={dateRange}
          selectedResponsable={selectedResponsable}
          tipoMantenimiento={tipoMantenimiento}
          selectedEstados={selectedEstados}
          estados={estados}
          uniqueResponsables={uniqueResponsables}
          uniqueTipos={uniqueTipos}
          onSearchChange={onSearchChange}
          onDateRangeChange={onDateRangeChange}
          onResponsableChange={onResponsableChange}
          onTipoChange={onTipoChange}
          toggleEstado={toggleEstado}
        />
        
        <div className="mt-4 px-4">
          <Button 
            className="w-full bg-[#01242c] text-white hover:bg-[#01242c]/90 hover:text-[#bff036]"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};
