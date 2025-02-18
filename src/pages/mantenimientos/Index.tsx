
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ClipboardList, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MantenimientosIndex = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#040d50] mb-6">Gestión de Mantenimientos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/mantenimientos/programacion")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#040d50]" />
              <span className="text-[#040d50]">Programación</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Programa y gestiona los mantenimientos preventivos y correctivos.</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/mantenimientos/ejecucion")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-[#040d50]" />
              <span className="text-[#040d50]">Ejecución</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Registra y actualiza los mantenimientos en curso.</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/mantenimientos/documentacion")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#040d50]" />
              <span className="text-[#040d50]">Documentación</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Gestiona la documentación y evidencias de los mantenimientos.</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/mantenimientos/auditoria")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-[#040d50]" />
              <span className="text-[#040d50]">Auditoría</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Revisa y audita los mantenimientos realizados.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MantenimientosIndex;
