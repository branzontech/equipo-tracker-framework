
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventsList } from "./EventsList";
import { MobileMantenimientosListProps } from "@/pages/mantenimientos/components/interfaces/mobileManteniminetosListProps";

export const MobileMantenimientosList: React.FC<MobileMantenimientosListProps> = ({
  mantenimientos,
  estados
}) => {
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          Mantenimientos ({mantenimientos.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="p-3">
            <EventsList 
              events={mantenimientos} 
              estados={estados} 
              emptyMessage="No hay mantenimientos que coincidan con los filtros" 
            />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
