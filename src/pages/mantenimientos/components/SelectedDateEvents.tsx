
import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { EventsList } from "./EventsList";
import { SelectedDateEventsProps } from "@/pages/mantenimientos/components/interfaces/selectedDateEventsProps";

export const SelectedDateEvents: React.FC<SelectedDateEventsProps> = ({
  selectedDate,
  events,
  estados
}) => {
  if (!selectedDate) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          Eventos del {format(selectedDate, "d 'de' MMMM", { locale: es })}
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto">
        <EventsList 
          events={events} 
          estados={estados} 
          emptyMessage="No hay eventos para esta fecha" 
        />
      </CardContent>
    </Card>
  );
};
