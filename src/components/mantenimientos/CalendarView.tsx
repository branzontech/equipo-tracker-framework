
import React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CustomDayContent } from "./CustomDayContent";
import { EstadoInfo } from "@/types/mantenimiento";

interface CalendarViewProps {
  isMobile: boolean;
  selectedDate: Date | undefined;
  selectedMonth: Date;
  selectedPeriodo: string;
  periodos: { value: string; label: string }[];
  estados: EstadoInfo[];
  daysWithEvents: Record<string, { count: number; states: Record<string, boolean> }>;
  modifiers: any;
  modifiersStyles: any;
  onDayClick: (day: Date | undefined) => void;
  onMonthChange: (date: Date) => void;
  onPeriodoChange: (value: string) => void;
  navigateMonth: (direction: 'prev' | 'next') => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  isMobile,
  selectedDate,
  selectedMonth,
  selectedPeriodo,
  periodos,
  estados,
  daysWithEvents,
  modifiers,
  modifiersStyles,
  onDayClick,
  onMonthChange,
  onPeriodoChange,
  navigateMonth
}) => {
  return (
    <Card className={isMobile ? undefined : "lg:col-span-8"}>
      <CardHeader className={isMobile ? "p-4 flex flex-row items-center justify-between" : "pb-0"}>
        {isMobile ? (
          <>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigateMonth('prev')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h3 className="font-medium">
              {format(selectedMonth, "MMMM yyyy", { locale: es })}
            </h3>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigateMonth('next')}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Calendario de Mantenimientos</h3>
            <Select value={selectedPeriodo} onValueChange={onPeriodoChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                {periodos.map((periodo) => (
                  <SelectItem key={periodo.value} value={periodo.value}>
                    {periodo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      <CardContent className={isMobile ? "p-2" : "p-4"}>
        {isMobile && (
          <Select value={selectedPeriodo} onValueChange={onPeriodoChange}>
            <SelectTrigger className="w-full mb-3">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              {periodos.map((periodo) => (
                <SelectItem key={periodo.value} value={periodo.value}>
                  {periodo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {!isMobile && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="text-[#01242c]"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
              <h3 className="text-lg font-medium text-[#01242c]">
                {format(selectedMonth, "MMMM yyyy", { locale: es })}
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateMonth('next')}
                className="text-[#01242c]"
              >
                Siguiente
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDayClick}
              month={selectedMonth}
              onMonthChange={onMonthChange}
              locale={es}
              className="pointer-events-auto"
              classNames={{
                day: "h-14 w-14 p-0 font-normal aria-selected:opacity-100",
                caption: "text-base",
                day_today: "bg-gray-100",
              }}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              components={{
                DayContent: (props) => (
                  <CustomDayContent
                    {...props}
                    daysWithEvents={daysWithEvents}
                    estados={estados}
                  />
                )
              }}
            />
          </div>
        )}

        {isMobile && (
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDayClick}
            month={selectedMonth}
            onMonthChange={onMonthChange}
            locale={es}
            className="p-0"
            classNames={{
              day_today: "bg-gray-100",
            }}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            components={{
              DayContent: (props) => (
                <CustomDayContent
                  {...props}
                  daysWithEvents={daysWithEvents}
                  estados={estados}
                />
              )
            }}
          />
        )}
        
        {/* Leyenda del calendario */}
        <div className={`flex ${isMobile ? "justify-center mt-4" : "flex-wrap justify-center mt-6"} gap-${isMobile ? "3" : "4"}`}>
          {estados.map((estado) => (
            <div key={estado.value} className="flex items-center gap-2">
              <div className={`w-${isMobile ? "2" : "3"} h-${isMobile ? "2" : "3"} rounded-full ${estado.color}`} />
              <span className={`text-${isMobile ? "xs" : "sm"}`}>{estado.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
