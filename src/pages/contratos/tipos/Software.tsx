
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, FileEdit, FileX } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Tipo para contratos de software
type ContratoSoftware = {
  id: string;
  nombre: string;
  empresa: string;
  tipoSoftware: string;
  version: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
};

// Datos de ejemplo
const softwareEjemplo: ContratoSoftware[] = [
  {
    id: '1',
    nombre: 'Sistema ERP Empresarial',
    empresa: 'SAP',
    tipoSoftware: 'ERP',
    version: '2023.1',
    fechaInicio: '2023-01-15',
    fechaFin: '2024-01-14',
    estado: 'activo',
  },
  {
    id: '2',
    nombre: 'Sistema de Gestión de Proyectos',
    empresa: 'Atlassian',
    tipoSoftware: 'Gestión de Proyectos',
    version: '10.5',
    fechaInicio: '2023-04-01',
    fechaFin: '2024-03-31',
    estado: 'activo',
  },
  {
    id: '3',
    nombre: 'Software de Contabilidad',
    empresa: 'Contasoft',
    tipoSoftware: 'Contabilidad',
    version: '2023',
    fechaInicio: '2022-11-10',
    fechaFin: '2023-11-09',
    estado: 'pendiente',
  },
];

const ContratoSoftwareCard = ({ software }: { software: ContratoSoftware }) => {
  const diasRestantes = () => {
    const hoy = new Date();
    const fin = new Date(software.fechaFin);
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
          <CardTitle className="text-lg">{software.nombre}</CardTitle>
          <Badge className={getBadgeColor(software.estado)}>
            {software.estado.charAt(0).toUpperCase() + software.estado.slice(1)}
          </Badge>
        </div>
        <CardDescription>{software.empresa}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Tipo:</span>
            <span>{software.tipoSoftware}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Versión:</span>
            <span>{software.version}</span>
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

const ContratosSoftware = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contratos de Software</h1>
        <Button onClick={() => navigate('/contratos/agregar')}>Agregar Software</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {softwareEjemplo.map(software => (
          <ContratoSoftwareCard key={software.id} software={software} />
        ))}
      </div>
    </div>
  );
};

export default ContratosSoftware;
