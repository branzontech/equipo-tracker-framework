
import React from "react";
import { EventIndicator } from "./EventIndicator";
import { EstadoInfo } from "@/types/mantenimiento";

interface CustomDayContentProps extends React.HTMLProps<HTMLDivElement> {
  date: Date;
  daysWithEvents: Record<string, { count: number; states: Record<string, boolean> }>;
  estados: EstadoInfo[];
}

export const CustomDayContent: React.FC<CustomDayContentProps> = ({ 
  date, 
  daysWithEvents,
  estados,
  ...rest 
}) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center">
      <div {...rest} />
      <EventIndicator 
        date={date} 
        daysWithEvents={daysWithEvents} 
        estados={estados} 
      />
    </div>
  );
};
