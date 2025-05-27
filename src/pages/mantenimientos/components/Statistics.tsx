
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { StatisticsProps } from "@/pages/mantenimientos/components/interfaces/statisticsProps";

export const Statistics: React.FC<StatisticsProps> = ({ statistics }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Estadísticas</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {statistics.map((estado) => (
          <div 
            key={estado.value} 
            className={`p-3 rounded-lg flex flex-col items-center ${estado.color} bg-opacity-20`}
          >
            <span className="text-sm font-medium text-[#01242c]">{estado.label}</span>
            <span className="text-xl font-bold mt-1">{estado.count}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
