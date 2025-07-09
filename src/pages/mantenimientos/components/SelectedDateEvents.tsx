import React from "react";
import { formatFecha } from "@/hooks/use-global";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { EventsList } from "./EventsList";
import { SelectedDateEventsProps } from "@/pages/mantenimientos/components/interfaces/selectedDateEventsProps";

export const SelectedDateEvents: React.FC<SelectedDateEventsProps> = ({
  selectedDate,
  events,
  estados,
}) => {
  if (!selectedDate) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          Eventos del {formatFecha(selectedDate)}
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
