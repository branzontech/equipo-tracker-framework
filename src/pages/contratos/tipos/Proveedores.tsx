
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Eye, FileEdit, FileX, Plus, Search, Grid3X3, LayoutGrid, MoreVertical, Building, Phone, Mail, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Tipo para proveedores
type Proveedor = {
  id: string;
  nombre: string;
  razonSocial: string;
  nit: string;
  tipoServicio: string[];
  contactoPrincipal: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  sitioWeb?: string;
  fechaRegistro: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
  calificacion: number;
  observaciones?: string;
};

// Datos de ejemplo
const proveedoresEjemplo: Proveedor[] = [
  {
    id: '1',
    nombre: 'Dell Technologies',
    razonSocial: 'Dell Technologies Colombia S.A.S.',
    nit: '830.077.634-8',
    tipoServicio: ['Mantenimiento Hardware', 'Soporte Técnico', 'Suministros'],
    contactoPrincipal: 'Juan Pérez',
    telefono: '+57 1 234 5678',
    email: 'ventas@dell.com.co',
    direccion: 'Calle 100 # 19-61',
    ciudad: 'Bogotá',
    sitioWeb: 'www.dell.com.co',
    fechaRegistro: '2023-01-15',
    estado: 'activo',
    calificacion: 4.5,
    observaciones: 'Proveedor confiable con excelente servicio técnico'
  },
  {
    id: '2',
    nombre: 'TechSupport Inc',
    razonSocial: 'TechSupport Colombia Ltda.',
    nit: '900.123.456-7',
    tipoServicio: ['Soporte Técnico', 'Mesa de Ayuda'],
    contactoPrincipal: 'Ana López',
    telefono: '+57 1 987 6543',
    email: 'soporte@techsupport.co',
    direccion: 'Carrera 15 # 85-32',
    ciudad: 'Bogotá',
    sitioWeb: 'www.techsupport.co',
    fechaRegistro: '2023-02-20',
    estado: 'activo',
    calificacion: 4.2,
    observaciones: 'Especialistas en soporte 24/7'
  },
  {
    id: '3',
    nombre: 'Networking Solutions',
    razonSocial: 'Networking Solutions S.A.S.',
    nit: '800.555.999-2',
    tipoServicio: ['Infraestructura de Red', 'Cableado Estructurado'],
    contactoPrincipal: 'Carlos Ruiz',
    telefono: '+57 1 555 9012',
    email: 'info@networking.co',
    direccion: 'Avenida 68 # 40-15',
    ciudad: 'Bogotá',
    fechaRegistro: '2022-11-10',
    estado: 'inactivo',
    calificacion: 3.8,
    observaciones: 'Proyecto finalizado, evaluar para futuros servicios'
  },
];

// Componente de formulario para agregar/editar proveedor
const FormularioProveedor = ({ proveedor, onSave, onCancel }: { 
  proveedor?: Proveedor; 
  onSave: (data: Omit<Proveedor, 'id'>) => void; 
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    nombre: proveedor?.nombre || '',
    razonSocial: proveedor?.razonSocial || '',
    nit: proveedor?.nit || '',
    tipoServicio: proveedor?.tipoServicio || [],
    contactoPrincipal: proveedor?.contactoPrincipal || '',
    telefono: proveedor?.telefono || '',
    email: proveedor?.email || '',
    direccion: proveedor?.direccion || '',
    ciudad: proveedor?.ciudad || '',
    sitioWeb: proveedor?.sitioWeb || '',
    fechaRegistro: proveedor?.fechaRegistro || new Date().toISOString().split('T')[0],
    estado: proveedor?.estado || 'activo' as const,
    calificacion: proveedor?.calificacion || 5,
    observaciones: proveedor?.observaciones || '',
  });

  const serviciosDisponibles = [
    'Mantenimiento Hardware',
    'Soporte Técnico',
    'Mesa de Ayuda',
    'Suministros',
    'Infraestructura de Red',
    'Cableado Estructurado',
    'Desarrollo Software',
    'Consultoría TI'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleServicioToggle = (servicio: string) => {
    setFormData(prev => ({
      ...prev,
      tipoServicio: prev.tipoServicio.includes(servicio)
        ? prev.tipoServicio.filter(s => s !== servicio)
        : [...prev.tipoServicio, servicio]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombre">Nombre Comercial *</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="razonSocial">Razón Social *</Label>
          <Input
            id="razonSocial"
            value={formData.razonSocial}
            onChange={(e) => setFormData(prev => ({ ...prev, razonSocial: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="nit">NIT *</Label>
          <Input
            id="nit"
            value={formData.nit}
            onChange={(e) => setFormData(prev => ({ ...prev, nit: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="contactoPrincipal">Contacto Principal *</Label>
          <Input
            id="contactoPrincipal"
            value={formData.contactoPrincipal}
            onChange={(e) => setFormData(prev => ({ ...prev, contactoPrincipal: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="telefono">Teléfono *</Label>
          <Input
            id="telefono"
            value={formData.telefono}
            onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="direccion">Dirección</Label>
          <Input
            id="direccion"
            value={formData.direccion}
            onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="ciudad">Ciudad</Label>
          <Input
            id="ciudad"
            value={formData.ciudad}
            onChange={(e) => setFormData(prev => ({ ...prev, ciudad: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="sitioWeb">Sitio Web</Label>
          <Input
            id="sitioWeb"
            value={formData.sitioWeb}
            onChange={(e) => setFormData(prev => ({ ...prev, sitioWeb: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="estado">Estado *</Label>
          <Select value={formData.estado} onValueChange={(value: any) => setFormData(prev => ({ ...prev, estado: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="calificacion">Calificación (1-5)</Label>
          <Input
            id="calificacion"
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={formData.calificacion}
            onChange={(e) => setFormData(prev => ({ ...prev, calificacion: Number(e.target.value) }))}
          />
        </div>
      </div>
      
      <div>
        <Label>Tipos de Servicio *</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {serviciosDisponibles.map(servicio => (
            <div key={servicio} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={servicio}
                checked={formData.tipoServicio.includes(servicio)}
                onChange={() => handleServicioToggle(servicio)}
                className="rounded"
              />
              <Label htmlFor={servicio} className="text-sm">{servicio}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea
          id="observaciones"
          value={formData.observaciones}
          onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {proveedor ? 'Actualizar' : 'Crear'} Proveedor
        </Button>
      </div>
    </form>
  );
};

// Componente de detalle del proveedor
const DetalleProveedorModal = ({ proveedor, open, onOpenChange }: { 
  proveedor: Proveedor | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
}) => {
  if (!proveedor) return null;

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-500';
      case 'inactivo': return 'bg-red-500';
      case 'pendiente': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStarRating = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Building className="h-6 w-6" />
            {proveedor.nombre}
          </DialogTitle>
          <DialogDescription>{proveedor.razonSocial}</DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información General</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Estado:</span>
                <Badge className={getBadgeColor(proveedor.estado)}>
                  {proveedor.estado.charAt(0).toUpperCase() + proveedor.estado.slice(1)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">NIT:</span>
                <span>{proveedor.nit}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Calificación:</span>
                <span className="text-yellow-500">{getStarRating(proveedor.calificacion)} ({proveedor.calificacion})</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Fecha Registro:</span>
                <span>{new Date(proveedor.fechaRegistro).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información de Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{proveedor.telefono}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{proveedor.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Contacto:</span>
                <span>{proveedor.contactoPrincipal}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Dirección:</span>
                <span>{proveedor.direccion}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Ciudad:</span>
                <span>{proveedor.ciudad}</span>
              </div>
              {proveedor.sitioWeb && (
                <div className="flex justify-between">
                  <span className="font-medium">Sitio Web:</span>
                  <a href={`https://${proveedor.sitioWeb}`} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:underline">
                    {proveedor.sitioWeb}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Servicios Ofrecidos</h3>
          <div className="flex flex-wrap gap-2">
            {proveedor.tipoServicio.map((servicio) => (
              <Badge key={servicio} variant="secondary">
                {servicio}
              </Badge>
            ))}
          </div>
        </div>

        {proveedor.observaciones && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Observaciones</h3>
            <p className="text-gray-700 leading-relaxed">{proveedor.observaciones}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Componente principal
const MaestroProveedores = () => {
  const [proveedores, setProveedores] = useState(proveedoresEjemplo);
  const [vista, setVista] = useState<'table' | 'cards'>('table');
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroServicio, setFiltroServicio] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);
  const [modalFormulario, setModalFormulario] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);
  const [editando, setEditando] = useState(false);

  // Filtrar proveedores
  const proveedoresFiltrados = proveedores.filter(proveedor => {
    const matchBusqueda = busqueda === '' || 
      proveedor.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      proveedor.razonSocial.toLowerCase().includes(busqueda.toLowerCase()) ||
      proveedor.nit.includes(busqueda) ||
      proveedor.contactoPrincipal.toLowerCase().includes(busqueda.toLowerCase());
    
    const matchEstado = filtroEstado === '' || filtroEstado === 'todos' || proveedor.estado === filtroEstado;
    const matchServicio = filtroServicio === '' || filtroServicio === 'todos' || 
      proveedor.tipoServicio.some(s => s === filtroServicio);
    
    return matchBusqueda && matchEstado && matchServicio;
  });

  // Paginación
  const totalPaginas = Math.ceil(proveedoresFiltrados.length / itemsPorPagina);
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const indiceFin = indiceInicio + itemsPorPagina;
  const proveedoresPaginados = proveedoresFiltrados.slice(indiceInicio, indiceFin);

  // Obtener servicios únicos
  const serviciosUnicos = [...new Set(proveedores.flatMap(p => p.tipoServicio))];

  const handleSaveProveedor = (data: Omit<Proveedor, 'id'>) => {
    if (editando && proveedorSeleccionado) {
      setProveedores(prev => prev.map(p => 
        p.id === proveedorSeleccionado.id ? { ...data, id: p.id } : p
      ));
      toast({ title: "Proveedor actualizado correctamente" });
    } else {
      const nuevoProveedor: Proveedor = {
        ...data,
        id: Date.now().toString()
      };
      setProveedores(prev => [nuevoProveedor, ...prev]);
      toast({ title: "Proveedor creado correctamente" });
    }
    setModalFormulario(false);
    setEditando(false);
    setProveedorSeleccionado(null);
  };

  const handleEditProveedor = (proveedor: Proveedor) => {
    setProveedorSeleccionado(proveedor);
    setEditando(true);
    setModalFormulario(true);
  };

  const handleEliminarProveedor = (id: string) => {
    setProveedores(prev => prev.filter(p => p.id !== id));
    toast({ title: "Proveedor eliminado correctamente" });
  };

  const handleVerDetalle = (proveedor: Proveedor) => {
    setProveedorSeleccionado(proveedor);
    setModalDetalle(true);
  };

  const handleLimpiarFiltros = () => {
    setBusqueda('');
    setFiltroEstado('');
    setFiltroServicio('');
    setPaginaActual(1);
  };

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Maestro de Proveedores</h1>
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
          <Dialog open={modalFormulario} onOpenChange={setModalFormulario}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditando(false); setProveedorSeleccionado(null); }}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Proveedor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  {editando ? 'Editar Proveedor' : 'Agregar Nuevo Proveedor'}
                </DialogTitle>
                <DialogDescription>
                  {editando ? 'Modifica la información del proveedor' : 'Completa los datos del nuevo proveedor'}
                </DialogDescription>
              </DialogHeader>
              <FormularioProveedor
                proveedor={editando ? proveedorSeleccionado : undefined}
                onSave={handleSaveProveedor}
                onCancel={() => setModalFormulario(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Buscar por nombre, razón social, NIT o contacto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroServicio} onValueChange={setFiltroServicio}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Tipo de servicio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los servicios</SelectItem>
                {serviciosUnicos.map(servicio => (
                  <SelectItem key={servicio} value={servicio}>{servicio}</SelectItem>
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
            {proveedoresFiltrados.length} proveedor{proveedoresFiltrados.length !== 1 ? 'es' : ''} encontrado{proveedoresFiltrados.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Vista de tabla o tarjetas */}
      {vista === 'table' ? (
        <div className="mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proveedor</TableHead>
                <TableHead>NIT</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Servicios</TableHead>
                <TableHead>Calificación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proveedoresPaginados.map((proveedor) => {
                const getBadgeColor = (estado: string) => {
                  switch (estado) {
                    case 'activo': return 'bg-green-500';
                    case 'inactivo': return 'bg-red-500';
                    case 'pendiente': return 'bg-yellow-500';
                    default: return 'bg-gray-500';
                  }
                };

                return (
                  <TableRow key={proveedor.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{proveedor.nombre}</div>
                        <div className="text-sm text-gray-500">{proveedor.razonSocial}</div>
                      </div>
                    </TableCell>
                    <TableCell>{proveedor.nit}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{proveedor.contactoPrincipal}</div>
                        <div className="text-sm text-gray-500">{proveedor.telefono}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {proveedor.tipoServicio.slice(0, 2).map(servicio => (
                          <Badge key={servicio} variant="secondary" className="text-xs">
                            {servicio}
                          </Badge>
                        ))}
                        {proveedor.tipoServicio.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{proveedor.tipoServicio.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span>{proveedor.calificacion}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getBadgeColor(proveedor.estado)}>
                        {proveedor.estado.charAt(0).toUpperCase() + proveedor.estado.slice(1)}
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
                          <DropdownMenuItem onClick={() => handleVerDetalle(proveedor)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditProveedor(proveedor)}>
                            <FileEdit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleEliminarProveedor(proveedor.id)}
                          >
                            <FileX className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {proveedoresFiltrados.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No se encontraron proveedores con los filtros seleccionados.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {proveedoresPaginados.map((proveedor) => {
            const getBadgeColor = (estado: string) => {
              switch (estado) {
                case 'activo': return 'bg-green-500';
                case 'inactivo': return 'bg-red-500';
                case 'pendiente': return 'bg-yellow-500';
                default: return 'bg-gray-500';
              }
            };

            return (
              <Card key={proveedor.id} className="w-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{proveedor.nombre}</CardTitle>
                    <Badge className={getBadgeColor(proveedor.estado)}>
                      {proveedor.estado.charAt(0).toUpperCase() + proveedor.estado.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>{proveedor.razonSocial}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">NIT:</span>
                      <span>{proveedor.nit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Contacto:</span>
                      <span>{proveedor.contactoPrincipal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Teléfono:</span>
                      <span>{proveedor.telefono}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Calificación:</span>
                      <span className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        {proveedor.calificacion}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Servicios:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proveedor.tipoServicio.slice(0, 2).map(servicio => (
                          <Badge key={servicio} variant="secondary" className="text-xs">
                            {servicio}
                          </Badge>
                        ))}
                        {proveedor.tipoServicio.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{proveedor.tipoServicio.length - 2}
                          </Badge>
                        )}
                      </div>
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
                      <DropdownMenuItem onClick={() => handleVerDetalle(proveedor)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditProveedor(proveedor)}>
                        <FileEdit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleEliminarProveedor(proveedor.id)}
                      >
                        <FileX className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            );
          })}

          {proveedoresFiltrados.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
              No se encontraron proveedores con los filtros seleccionados.
            </div>
          )}
        </div>
      )}

      {/* Paginación */}
      {proveedoresFiltrados.length > 0 && totalPaginas > 1 && (
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

      {/* Modal de detalle */}
      <DetalleProveedorModal 
        proveedor={proveedorSeleccionado} 
        open={modalDetalle} 
        onOpenChange={setModalDetalle} 
      />
    </div>
  );
};

export default MaestroProveedores;
