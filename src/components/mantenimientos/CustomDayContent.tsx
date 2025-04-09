
import React from "react";
import { EventIndicator } from "./EventIndicator";
import { EstadoInfo } from "@/types/mantenimiento";

interface CustomDayContentProps {
  date: Date;
  displayMonth?: Date;
  daysWithEvents: Record<string, { count: number; states: Record<string, boolean> }>;
  estados: EstadoInfo[];
  children?: React.ReactNode;
}

export const CustomDayContent: React.FC<CustomDayContentProps> = ({ 
  date, 
  children,
  daysWithEvents,
  estados 
}) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center">
      {children}
      <EventIndicator 
        date={date} 
        daysWithEvents={daysWithEvents} 
        estados={estados} 
      />
    </div>
  );
};
