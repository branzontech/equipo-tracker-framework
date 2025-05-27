
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileEdit, FileX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Contrato, contratosEjemplo } from '@/pages/contratos/interfaces/contrato';

const ContratoCard = ({ contrato }: { contrato: Contrato }) => {
  const diasRestantes = () => {
    const hoy = new Date();
    const fin = new Date(contrato.fechaFin);
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
          <CardTitle className="text-lg">{contrato.nombre}</CardTitle>
          <Badge className={getBadgeColor(contrato.estado)}>
            {contrato.estado.charAt(0).toUpperCase() + contrato.estado.slice(1)}
          </Badge>
        </div>
        <CardDescription>{contrato.empresa}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Tipo:</span>
            <span className="capitalize">{contrato.tipo}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Inicio:</span>
            <span>{new Date(contrato.fechaInicio).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Fin:</span>
            <span>{new Date(contrato.fechaFin).toLocaleDateString()}</span>
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

const ListaContratos = () => {
  const [filtro, setFiltro] = useState('todos');
  const navigate = useNavigate();

  const contratosFiltrados = filtro === 'todos' 
    ? contratosEjemplo 
    : contratosEjemplo.filter(c => 
        filtro === 'activos' ? c.estado === 'activo' :
        filtro === 'inactivos' ? c.estado === 'inactivo' :
        filtro === 'pendientes' ? c.estado === 'pendiente' : true
      );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Contratos</h1>
        <Button onClick={() => navigate('/contratos/agregar')}>Agregar Contrato</Button>
      </div>
      
      <Tabs defaultValue="todos" className="w-full mb-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto">
          <TabsTrigger value="todos" onClick={() => setFiltro('todos')}>Todos</TabsTrigger>
          <TabsTrigger value="activos" onClick={() => setFiltro('activos')}>Activos</TabsTrigger>
          <TabsTrigger value="inactivos" onClick={() => setFiltro('inactivos')}>Inactivos</TabsTrigger>
          <TabsTrigger value="pendientes" onClick={() => setFiltro('pendientes')}>Pendientes</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contratosFiltrados.map(contrato => (
          <ContratoCard key={contrato.id} contrato={contrato} />
        ))}

        {contratosFiltrados.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            No se encontraron contratos con el filtro seleccionado.
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaContratos;
