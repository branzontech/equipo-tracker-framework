
import React from "react";
import { EventIndicator } from "./EventIndicator";
import { CustomDayContentProps } from "@/pages/mantenimientos/components/interfaces/customDayContentProps";

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
