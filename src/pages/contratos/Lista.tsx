
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, FileEdit, FileX, Grid3X3, LayoutGrid, FileText, Download, Search, MoreVertical } from "lucide-react";
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
  valor?: string;
  responsable?: string;
  telefono?: string;
  email?: string;
  documentos?: Array<{
    id: string;
    nombre: string;
    tipo: string;
    url: string;
  }>;
};

// Función para obtener el estado de vigencia
const getEstadoVigencia = (fechaFin: string) => {
  const hoy = new Date();
  const fin = new Date(fechaFin);
  const diferencia = fin.getTime() - hoy.getTime();
  const diasRestantes = Math.ceil(diferencia / (1000 * 3600 * 24));
  
  if (diasRestantes < 0) {
    return { estado: 'vencido', dias: diasRestantes, color: 'bg-red-500', textColor: 'text-red-500', badge: 'destructive' };
  } else if (diasRestantes <= 30) {
    return { estado: 'critico', dias: diasRestantes, color: 'bg-red-500', textColor: 'text-red-500', badge: 'destructive' };
  } else if (diasRestantes <= 90) {
    return { estado: 'advertencia', dias: diasRestantes, color: 'bg-yellow-500', textColor: 'text-yellow-500', badge: 'secondary' };
  } else {
    return { estado: 'vigente', dias: diasRestantes, color: 'bg-green-500', textColor: 'text-green-500', badge: 'default' };
  }
};

// Componente de semaforización
const SemaforoVigencia = ({ fechaFin, size = 'sm' }: { fechaFin: string; size?: 'sm' | 'md' | 'lg' }) => {
  const vigencia = getEstadoVigencia(fechaFin);
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5'
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} rounded-full ${vigencia.color} flex-shrink-0`} />
      <span className={`font-medium ${vigencia.textColor}`}>
        {vigencia.dias < 0 ? 'Vencido' : `${vigencia.dias} días`}
      </span>
    </div>
  );
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
    descripcion: 'Licencia para 100 usuarios de Microsoft Office 365',
    valor: '$25,000',
    responsable: 'Juan Pérez',
    telefono: '+57 300 123 4567',
    email: 'juan.perez@empresa.com',
    documentos: [
      { id: '1', nombre: 'Contrato_Microsoft_2023.pdf', tipo: 'PDF', url: '/docs/contrato1.pdf' },
      { id: '2', nombre: 'Anexo_Licencias.docx', tipo: 'DOCX', url: '/docs/anexo1.docx' }
    ]
  },
  {
    id: '2',
    nombre: 'Contrato Mantenimiento Servidores',
    empresa: 'Dell',
    tipo: 'proveedores',
    fechaInicio: '2023-03-15',
    fechaFin: '2024-03-14',
    estado: 'activo',
    descripcion: 'Mantenimiento preventivo y correctivo para servidores',
    valor: '$18,500',
    responsable: 'María González',
    telefono: '+57 301 987 6543',
    email: 'maria.gonzalez@empresa.com',
    documentos: [
      { id: '3', nombre: 'Contrato_Dell_Mantenimiento.pdf', tipo: 'PDF', url: '/docs/contrato2.pdf' }
    ]
  },
  {
    id: '3',
    nombre: 'Licencia ERP Empresarial',
    empresa: 'SAP',
    tipo: 'software',
    fechaInicio: '2022-05-10',
    fechaFin: '2023-05-09',
    estado: 'inactivo',
    descripcion: 'Sistema ERP para gestión empresarial',
    valor: '$45,000',
    responsable: 'Carlos Rodríguez',
    telefono: '+57 310 456 7890',
    email: 'carlos.rodriguez@empresa.com',
    documentos: [
      { id: '4', nombre: 'Contrato_SAP_ERP.pdf', tipo: 'PDF', url: '/docs/contrato3.pdf' },
      { id: '5', nombre: 'Manual_Usuario.pdf', tipo: 'PDF', url: '/docs/manual.pdf' }
    ]
  },
  {
    id: '4',
    nombre: 'Contrato Soporte Técnico',
    empresa: 'TechSupport Inc',
    tipo: 'proveedores',
    fechaInicio: '2023-07-01',
    fechaFin: '2024-06-30',
    estado: 'activo',
    descripcion: 'Soporte técnico 24/7 para infraestructura TI',
    valor: '$12,000',
    responsable: 'Ana Martínez',
    telefono: '+57 320 111 2233',
    email: 'ana.martinez@empresa.com',
    documentos: [
      { id: '6', nombre: 'Contrato_Soporte_Tecnico.pdf', tipo: 'PDF', url: '/docs/contrato4.pdf' }
    ]
  },
  {
    id: '5',
    nombre: 'Licencia Antivirus Corporativo',
    empresa: 'Norton',
    tipo: 'licencia',
    fechaInicio: '2023-02-01',
    fechaFin: '2024-01-31',
    estado: 'pendiente',
    descripcion: 'Protección antivirus para 200 equipos',
    valor: '$8,500',
    responsable: 'Luis Herrera',
    telefono: '+57 315 998 7766',
    email: 'luis.herrera@empresa.com',
    documentos: [
      { id: '7', nombre: 'Propuesta_Norton.pdf', tipo: 'PDF', url: '/docs/propuesta.pdf' }
    ]
  },
];

const DetalleContratoModal = ({ contrato, open, onOpenChange }: { 
  contrato: Contrato | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
}) => {
  if (!contrato) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{contrato.nombre}</DialogTitle>
          <DialogDescription>{contrato.empresa}</DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información General</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Estado:</span>
                <Badge className={getBadgeColor(contrato.estado)}>
                  {contrato.estado.charAt(0).toUpperCase() + contrato.estado.slice(1)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Tipo:</span>
                <span className="capitalize">{contrato.tipo}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Valor:</span>
                <span className="font-semibold text-green-600">{contrato.valor || 'No especificado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Fecha de Inicio:</span>
                <span>{new Date(contrato.fechaInicio).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Fecha de Fin:</span>
                <span>{new Date(contrato.fechaFin).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Vigencia:</span>
                <SemaforoVigencia fechaFin={contrato.fechaFin} size="md" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información de Contacto</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Responsable:</span>
                <span>{contrato.responsable || 'No asignado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Teléfono:</span>
                <span>{contrato.telefono || 'No especificado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{contrato.email || 'No especificado'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Descripción</h3>
          <p className="text-gray-700 leading-relaxed">{contrato.descripcion}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Documentos Adjuntos</h3>
          {contrato.documentos && contrato.documentos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {contrato.documentos.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-blue-600" />
                    <div>
                      <p className="font-medium">{doc.nombre}</p>
                      <p className="text-sm text-gray-500">{doc.tipo}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download size={16} /> Descargar
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay documentos adjuntos</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ContratoCard = ({ contrato, onVerDetalle }: { contrato: Contrato; onVerDetalle: (contrato: Contrato) => void }) => {
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
          <div className="flex justify-between items-center">
            <span className="font-medium">Vigencia:</span>
            <SemaforoVigencia fechaFin={contrato.fechaFin} size="sm" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => onVerDetalle(contrato)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileEdit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <FileX className="mr-2 h-4 w-4" />
              Inactivar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

const ContratosTable = ({ contratos, onVerDetalle }: { contratos: Contrato[]; onVerDetalle: (contrato: Contrato) => void }) => {
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
                <SemaforoVigencia fechaFin={contrato.fechaFin} size="md" />
              </TableCell>
              <TableCell>
                <Badge className={getBadgeColor(contrato.estado)}>
                  {contrato.estado.charAt(0).toUpperCase() + contrato.estado.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={() => onVerDetalle(contrato)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileEdit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <FileX className="mr-2 h-4 w-4" />
                      Inactivar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

const ListaContratos = () => {
  const [vista, setVista] = useState<'table' | 'cards'>('table');
  const [contratoSeleccionado, setContratoSeleccionado] = useState<Contrato | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEmpresa, setFiltroEmpresa] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);
  const navigate = useNavigate();

  // Filtrar contratos basado en todos los criterios
  const contratosFiltrados = contratosEjemplo.filter(contrato => {
    const matchBusqueda = busqueda === '' || 
      contrato.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      contrato.empresa.toLowerCase().includes(busqueda.toLowerCase()) ||
      contrato.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    
    const matchEmpresa = filtroEmpresa === '' || filtroEmpresa === 'todas' || contrato.empresa === filtroEmpresa;
    const matchTipo = filtroTipo === '' || filtroTipo === 'todos' || contrato.tipo === filtroTipo;
    const matchEstado = filtroEstado === '' || filtroEstado === 'todos' || contrato.estado === filtroEstado;
    
    return matchBusqueda && matchEmpresa && matchTipo && matchEstado;
  });

  // Calcular paginación
  const totalPaginas = Math.ceil(contratosFiltrados.length / itemsPorPagina);
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const contratosPaginados = contratosFiltrados.slice(indiceInicio, indiceFin);

  // Obtener valores únicos para filtros
  const empresas = [...new Set(contratosEjemplo.map(c => c.empresa))];
  const tipos = [...new Set(contratosEjemplo.map(c => c.tipo))];
  const estados = [...new Set(contratosEjemplo.map(c => c.estado))];

  const handleVerDetalle = (contrato: Contrato) => {
    setContratoSeleccionado(contrato);
    setModalAbierto(true);
  };

  const handleLimpiarFiltros = () => {
    setBusqueda('');
    setFiltroEmpresa('');
    setFiltroTipo('');
    setFiltroEstado('');
    setPaginaActual(1);
  };

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
      
      {/* Filtros de búsqueda */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Buscar por nombre, empresa o descripción..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={filtroEmpresa} onValueChange={setFiltroEmpresa}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las empresas</SelectItem>
                {empresas.map(empresa => (
                  <SelectItem key={empresa} value={empresa}>{empresa}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                {tipos.map(tipo => (
                  <SelectItem key={tipo} value={tipo} className="capitalize">{tipo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                {estados.map(estado => (
                  <SelectItem key={estado} value={estado} className="capitalize">{estado}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleLimpiarFiltros}>
              Limpiar
            </Button>
          </div>
        </div>
        
        {/* Configuración de paginación */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Mostrar:</span>
            <Select value={itemsPorPagina.toString()} onValueChange={(value) => {
              setItemsPorPagina(Number(value));
              setPaginaActual(1);
            }}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">elementos</span>
          </div>
          <div className="text-sm text-gray-600">
            {contratosFiltrados.length} contrato{contratosFiltrados.length !== 1 ? 's' : ''} encontrado{contratosFiltrados.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {vista === 'table' ? (
        <div className="mb-6">
          <ContratosTable contratos={contratosPaginados} onVerDetalle={handleVerDetalle} />
          {contratosFiltrados.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No se encontraron contratos con el filtro seleccionado.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {contratosPaginados.map(contrato => (
            <ContratoCard key={contrato.id} contrato={contrato} onVerDetalle={handleVerDetalle} />
          ))}

          {contratosFiltrados.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
              No se encontraron contratos con el filtro seleccionado.
            </div>
          )}
        </div>
      )}

      {/* Paginación */}
      {contratosFiltrados.length > 0 && totalPaginas > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                  className={paginaActual === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                <PaginationItem key={pagina}>
                  <PaginationLink
                    onClick={() => setPaginaActual(pagina)}
                    isActive={paginaActual === pagina}
                    className="cursor-pointer"
                  >
                    {pagina}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                  className={paginaActual === totalPaginas ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <DetalleContratoModal 
        contrato={contratoSeleccionado} 
        open={modalAbierto} 
        onOpenChange={setModalAbierto} 
      />
    </div>
  );
};

export default ListaContratos;
