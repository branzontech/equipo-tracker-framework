
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, FileEdit, FileX, Grid3X3, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Tipo para los contratos
type Contrato = {
  id: string;
  nombre: string;
  empresa: string;
  tipo: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
  descripcion: string;
};

// Datos de ejemplo
const contratosEjemplo: Contrato[] = [
  {
    id: '1',
    nombre: 'Contrato de Licencia Microsoft Office',
    empresa: 'Microsoft',
    tipo: 'licencia',
    fechaInicio: '2023-01-01',
    fechaFin: '2024-12-31',
    estado: 'activo',
    descripcion: 'Licencia para 100 usuarios de Microsoft Office 365'
  },
  {
    id: '2',
    nombre: 'Contrato Mantenimiento Servidores',
    empresa: 'Dell',
    tipo: 'proveedores',
    fechaInicio: '2023-03-15',
    fechaFin: '2024-03-14',
    estado: 'activo',
    descripcion: 'Mantenimiento preventivo y correctivo para servidores'
  },
  {
    id: '3',
    nombre: 'Licencia ERP Empresarial',
    empresa: 'SAP',
    tipo: 'software',
    fechaInicio: '2022-05-10',
    fechaFin: '2023-05-09',
    estado: 'inactivo',
    descripcion: 'Sistema ERP para gestión empresarial'
  },
  {
    id: '4',
    nombre: 'Contrato Soporte Técnico',
    empresa: 'TechSupport Inc',
    tipo: 'proveedores',
    fechaInicio: '2023-07-01',
    fechaFin: '2024-06-30',
    estado: 'activo',
    descripcion: 'Soporte técnico 24/7 para infraestructura TI'
  },
  {
    id: '5',
    nombre: 'Licencia Antivirus Corporativo',
    empresa: 'Norton',
    tipo: 'licencia',
    fechaInicio: '2023-02-01',
    fechaFin: '2024-01-31',
    estado: 'pendiente',
    descripcion: 'Protección antivirus para 200 equipos'
  },
];

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

const ContratosTable = ({ contratos }: { contratos: Contrato[] }) => {
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

  const diasRestantes = (fechaFin: string) => {
    const hoy = new Date();
    const fin = new Date(fechaFin);
    const diferencia = fin.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Empresa</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Fecha Inicio</TableHead>
          <TableHead>Fecha Fin</TableHead>
          <TableHead>Vigencia</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contratos.map((contrato) => {
          const restantes = diasRestantes(contrato.fechaFin);
          return (
            <TableRow key={contrato.id}>
              <TableCell className="font-medium">{contrato.nombre}</TableCell>
              <TableCell>{contrato.empresa}</TableCell>
              <TableCell className="capitalize">{contrato.tipo}</TableCell>
              <TableCell>{new Date(contrato.fechaInicio).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(contrato.fechaFin).toLocaleDateString()}</TableCell>
              <TableCell>
                <span className={`${restantes < 30 ? 'text-red-500' : restantes < 90 ? 'text-yellow-500' : 'text-green-500'} font-medium`}>
                  {restantes > 0 ? `${restantes} días` : 'Vencido'}
                </span>
              </TableCell>
              <TableCell>
                <Badge className={getBadgeColor(contrato.estado)}>
                  {contrato.estado.charAt(0).toUpperCase() + contrato.estado.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Eye size={16} /> Ver
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <FileEdit size={16} /> Editar
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 text-red-500 hover:text-red-700">
                    <FileX size={16} /> Inactivar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

const ListaContratos = () => {
  const [filtro, setFiltro] = useState('todos');
  const [vista, setVista] = useState<'table' | 'cards'>('table');
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
        <div className="flex gap-4 items-center">
          <div className="flex gap-2">
            <Button
              variant={vista === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setVista('table')}
              className="gap-1"
            >
              <Grid3X3 size={16} /> Tabla
            </Button>
            <Button
              variant={vista === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setVista('cards')}
              className="gap-1"
            >
              <LayoutGrid size={16} /> Tarjetas
            </Button>
          </div>
          <Button onClick={() => navigate('/contratos/agregar')}>Agregar Contrato</Button>
        </div>
      </div>
      
      <Tabs defaultValue="todos" className="w-full mb-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto">
          <TabsTrigger value="todos" onClick={() => setFiltro('todos')}>Todos</TabsTrigger>
          <TabsTrigger value="activos" onClick={() => setFiltro('activos')}>Activos</TabsTrigger>
          <TabsTrigger value="inactivos" onClick={() => setFiltro('inactivos')}>Inactivos</TabsTrigger>
          <TabsTrigger value="pendientes" onClick={() => setFiltro('pendientes')}>Pendientes</TabsTrigger>
        </TabsList>
      </Tabs>

      {vista === 'table' ? (
        <div className="mb-6">
          <ContratosTable contratos={contratosFiltrados} />
          {contratosFiltrados.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No se encontraron contratos con el filtro seleccionado.
            </div>
          )}
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default ListaContratos;
