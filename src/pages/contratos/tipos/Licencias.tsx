
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, FileEdit, FileX } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Tipo para contratos de licencia
type ContratoLicencia = {
  id: string;
  nombre: string;
  empresa: string;
  tipoLicencia: string;
  usuarios: number;
  fechaInicio: string;
  fechaFin: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
};

// Datos de ejemplo
const licenciasEjemplo: ContratoLicencia[] = [
  {
    id: '1',
    nombre: 'Microsoft Office 365',
    empresa: 'Microsoft',
    tipoLicencia: 'Suscripción Anual',
    usuarios: 100,
    fechaInicio: '2023-01-01',
    fechaFin: '2024-12-31',
    estado: 'activo',
  },
  {
    id: '2',
    nombre: 'Adobe Creative Cloud',
    empresa: 'Adobe',
    tipoLicencia: 'Suscripción Anual',
    usuarios: 25,
    fechaInicio: '2023-02-15',
    fechaFin: '2024-02-14',
    estado: 'activo',
  },
  {
    id: '3',
    nombre: 'Antivirus Corporativo',
    empresa: 'Norton',
    tipoLicencia: 'Perpetua',
    usuarios: 200,
    fechaInicio: '2023-03-10',
    fechaFin: '2024-03-09',
    estado: 'pendiente',
  },
];

const ContratoLicenciaCard = ({ licencia }: { licencia: ContratoLicencia }) => {
  const diasRestantes = () => {
    const hoy = new Date();
    const fin = new Date(licencia.fechaFin);
    const diferencia = fin.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  };

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-500';
      case 'inactivo':
        return 'bg-red-500';
      case 'pendiente':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
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
        <CardDescription>{licencia.empresa}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Tipo:</span>
            <span>{licencia.tipoLicencia}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Usuarios:</span>
            <span>{licencia.usuarios}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Vigencia:</span>
            <span className={`${restantes < 30 ? 'text-red-500' : restantes < 90 ? 'text-yellow-500' : 'text-green-500'} font-medium`}>
              {restantes > 0 ? `${restantes} días` : 'Vencido'}
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
        <Button variant="outline" size="sm" className="gap-1 text-red-500 hover:text-red-700">
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
        <Button onClick={() => navigate('/contratos/agregar')}>Agregar Licencia</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {licenciasEjemplo.map(licencia => (
          <ContratoLicenciaCard key={licencia.id} licencia={licencia} />
        ))}
      </div>
    </div>
  );
};

export default ContratosLicencias;
