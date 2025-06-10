import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, FileEdit, FileX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  ContratoLicencia,
  licenciasEjemplo,
} from "@/pages/contratos/interfaces/contratoLicencia";
import { Contrato } from "../interfaces/contrato";
import { useContrato } from "../hooks/use-contrato";

const ContratoLicenciaCard = ({ licencia }: { licencia: Contrato }) => {
  const { getBadgeColor } = useContrato();
  const diasRestantes = () => {
    const hoy = new Date();
    const fin = new Date(licencia.fecha_fin);
    const diferencia = fin.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  };

  const restantes = diasRestantes();

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{licencia.nombre}</CardTitle>
          <Badge className={getBadgeColor(licencia.estado)}>
            {licencia.estado.charAt(0).toUpperCase() + licencia.estado.slice(1)}
          </Badge>
        </div>
        <CardDescription>{licencia.empresa_nombre}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Tipo:</span>
            <span>{licencia.tipo_contrato}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Usuarios:</span>
            <span>{licencia.usuarios}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Vigencia:</span>
            <span
              className={`${
                restantes < 30
                  ? "text-red-500"
                  : restantes < 90
                  ? "text-yellow-500"
                  : "text-green-500"
              } font-medium`}
            >
              {restantes > 0 ? `${restantes} días` : "Vencido"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button variant="outline" size="sm" className="gap-1">
          <Eye size={16} /> Ver
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <FileEdit size={16} /> Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 text-red-500 hover:text-red-700"
        >
          <FileX size={16} /> Inactivar
        </Button>
      </CardFooter>
    </Card>
  );
};

const ContratosLicencias = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contratos de Licencias</h1>
        <Button onClick={() => navigate("/contratos/agregar")}>
          Agregar Licencia
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {licenciasEjemplo.map((licencia) => (
          <ContratoLicenciaCard key={licencia.id} licencia={licencia} />
        ))}
      </div>
    </div>
  );
};

export default ContratosLicencias;
