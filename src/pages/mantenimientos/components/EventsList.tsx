import React from "react";
import { Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EventsListProps } from "@/pages/mantenimientos/components/interfaces/eventsListProps";

export const EventsList: React.FC<EventsListProps> = ({
  events,
  estados,
  emptyMessage = "No hay eventos para esta fecha",
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
        const estadoInfo = estados.find((e) => e.value === event.estado);
        const Icon = estadoInfo?.icon || Clock;

        return (
          <Card key={event.id} className="shadow-sm">
            <CardContent className="p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{event.tipo}</h4>

                  {/* Nombres de activos */}
                  <p className="text-sm text-muted-foreground">
                    {event.mantenimiento_detalle
                      ?.map((detalle) => {
                        if (detalle.equipos)
                          return detalle.equipos.nombre_equipo;
                        if (detalle.impresoras)
                          return detalle.impresoras.nombre;
                        if (detalle.perifericos)
                          return detalle.perifericos.nombre;
                        return null;
                      })
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </p>

                  {/* Ubicación (sede del primer activo válido) */}
                  <p className="text-xs text-muted-foreground mt-1">
                    {event.mantenimiento_detalle?.find(
                      (detalle) =>
                        detalle.equipos?.estado_ubicacion?.[0]?.sucursales
                          ?.sedes?.nombre ||
                        detalle.impresoras?.sucursales?.sedes?.nombre ||
                        detalle.perifericos?.sucursales?.sedes?.nombre
                    )?.equipos?.estado_ubicacion?.[0]?.sucursales?.sedes
                      ?.nombre ||
                      event.mantenimiento_detalle?.find(
                        (d) => d.impresoras?.sucursales?.sedes?.nombre
                      )?.impresoras?.sucursales?.sedes?.nombre ||
                      event.mantenimiento_detalle?.find(
                        (d) => d.perifericos?.sucursales?.sedes?.nombre
                      )?.perifericos?.sucursales?.sedes?.nombre ||
                      "—"}
                  </p>

                  {/* Hora */}
                  <div className="grid grid-cols-1 gap-1 mt-2 text-xs text-muted-foreground">
                    {/* Tiempo estimado */}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-[#01242c] text-[13px]">
                        Duración:
                      </span>
                      <span className="ml-auto text-[13px]">
                        {event.tiempo_estimado || "—"}{" "}
                        <span className="text-[13px] text-muted-foreground">
                          hrs
                        </span>
                      </span>
                    </div>

                    {/* Responsable */}
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-[#01242c] text-[13px]">
                        Responsable:
                      </span>
                      <span className="ml-auto text-[13px]">
                        {event.usuarios?.nombre || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Estado */}
                <Badge
                  variant="outline"
                  className={`${estadoInfo?.color} text-white text-xs whitespace-nowrap`}
                >
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
