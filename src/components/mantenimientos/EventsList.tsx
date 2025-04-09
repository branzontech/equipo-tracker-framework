
import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MantenimientoItem, EstadoInfo } from "@/types/mantenimiento";

interface EventsListProps {
  events: MantenimientoItem[];
  estados: EstadoInfo[];
  emptyMessage?: string;
}

export const EventsList: React.FC<EventsListProps> = ({ 
  events, 
  estados,
  emptyMessage = "No hay eventos para esta fecha" 
}) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => {
        const estadoInfo = estados.find(e => e.value === event.estado);
        const Icon = estadoInfo?.icon || Clock;
        
        return (
          <Card key={event.id} className="shadow-sm">
            <CardContent className="p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{event.tipo}</h4>
                  <p className="text-sm text-muted-foreground">{event.equipo}</p>
                  <p className="text-xs text-muted-foreground mt-1">{event.ubicacion}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs">{event.hora}</span>
                  </div>
                </div>
                <Badge variant="outline" className={`${estadoInfo?.color} text-white text-xs whitespace-nowrap`}>
                  <Icon className="h-3 w-3 mr-1" />
                  {estadoInfo?.label}
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
