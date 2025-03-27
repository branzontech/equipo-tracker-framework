
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, FileEdit, FileX } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Tipo para contratos de proveedores
type ContratoProveedor = {
  id: string;
  nombre: string;
  empresa: string;
  tipoServicio: string;
  contacto: string;
  telefono: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
};

// Datos de ejemplo
const proveedoresEjemplo: ContratoProveedor[] = [
  {
    id: '1',
    nombre: 'Mantenimiento de Servidores',
    empresa: 'Dell',
    tipoServicio: 'Mantenimiento preventivo y correctivo',
    contacto: 'Juan Pérez',
    telefono: '555-1234',
    fechaInicio: '2023-03-15',
    fechaFin: '2024-03-14',
    estado: 'activo',
  },
  {
    id: '2',
    nombre: 'Soporte Técnico 24/7',
    empresa: 'TechSupport Inc',
    tipoServicio: 'Soporte técnico',
    contacto: 'Ana López',
    telefono: '555-5678',
    fechaInicio: '2023-07-01',
    fechaFin: '2024-06-30',
    estado: 'activo',
  },
  {
    id: '3',
    nombre: 'Instalación Red de Datos',
    empresa: 'Networking Solutions',
    tipoServicio: 'Instalación y configuración',
    contacto: 'Carlos Ruiz',
    telefono: '555-9012',
    fechaInicio: '2023-05-20',
    fechaFin: '2023-11-19',
    estado: 'inactivo',
  },
];

const ContratoProveedorCard = ({ proveedor }: { proveedor: ContratoProveedor }) => {
  const diasRestantes = () => {
    const hoy = new Date();
    const fin = new Date(proveedor.fechaFin);
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
          <CardTitle className="text-lg">{proveedor.nombre}</CardTitle>
          <Badge className={getBadgeColor(proveedor.estado)}>
            {proveedor.estado.charAt(0).toUpperCase() + proveedor.estado.slice(1)}
          </Badge>
        </div>
        <CardDescription>{proveedor.empresa}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Servicio:</span>
            <span>{proveedor.tipoServicio}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Contacto:</span>
            <span>{proveedor.contacto}</span>
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

const ContratosProveedores = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contratos de Proveedores</h1>
        <Button onClick={() => navigate('/contratos/agregar')}>Agregar Proveedor</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proveedoresEjemplo.map(proveedor => (
          <ContratoProveedorCard key={proveedor.id} proveedor={proveedor} />
        ))}
      </div>
    </div>
  );
};

export default ContratosProveedores;
