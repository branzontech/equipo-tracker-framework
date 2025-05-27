
import React from "react";
import { format } from "date-fns";
import { EventIndicatorProps } from "@/pages/mantenimientos/components/interfaces/eventIndicatorProps";

export const EventIndicator: React.FC<EventIndicatorProps> = ({ 
  date, 
  daysWithEvents,
  estados 
}) => {
  const getEventCount = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return daysWithEvents[dateStr]?.count || 0;
  };

  const getEventStates = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return daysWithEvents[dateStr]?.states || {};
  };

  const count = getEventCount(date);
  if (count === 0) return null;
  
  const states = getEventStates(date);
  
  return (
    <div className="flex justify-center gap-1 mt-1">
      {Object.keys(states).map((state) => {
        const stateInfo = estados.find(s => s.value === state);
        return (
          <div 
            key={state}
            className={`w-1.5 h-1.5 rounded-full ${stateInfo?.color || 'bg-gray-400'}`}
          />
        );
      })}
    </div>
  );
};
