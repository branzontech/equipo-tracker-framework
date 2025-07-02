import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Activity, AlertCircle, CheckCircle, XCircle, Clock, Grid, List, Eye, Edit } from "lucide-react";

interface RiesgoSemaforizado {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  nivelRiesgo: number;
  estado: "Verde" | "Amarillo" | "Rojo" | "Crítico";
  ultimaEvaluacion: string;
  proximaRevision: string;
  responsable: string;
  accionesRequeridas: string[];
  tendencia: "Mejorando" | "Estable" | "Empeorando";
}

const mockRiesgos: RiesgoSemaforizado[] = [
  {
    id: "1",
    codigo: "RG-001",
    nombre: "Falla en sistemas críticos",
    categoria: "Operacional",
    nivelRiesgo: 12,
    estado: "Rojo",
    ultimaEvaluacion: "2024-01-15",
    proximaRevision: "2024-02-15",
    responsable: "Juan Pérez",
    accionesRequeridas: ["Implementar redundancia", "Actualizar procedimientos"],
    tendencia: "Empeorando"
  },
  {
    id: "2",
    codigo: "RG-002",
    nombre: "Pérdida de datos confidenciales",
    categoria: "Tecnológico",
    nivelRiesgo: 10,
    estado: "Amarillo",
    ultimaEvaluacion: "2024-01-10",
    proximaRevision: "2024-02-10",
    responsable: "María García",
    accionesRequeridas: ["Reforzar capacitación", "Actualizar políticas"],
    tendencia: "Mejorando"
  },
  {
    id: "3",
    codigo: "RG-003",
    nombre: "Incumplimiento normativo",
    categoria: "Cumplimiento",
    nivelRiesgo: 8,
    estado: "Amarillo",
    ultimaEvaluacion: "2024-01-12",
    proximaRevision: "2024-02-12",
    responsable: "Carlos López",
    accionesRequeridas: ["Revisar documentación", "Capacitar personal"],
    tendencia: "Estable"
  },
  {
    id: "4",
    codigo: "RG-004",
    nombre: "Disponibilidad de servicios",
    categoria: "Operacional",
    nivelRiesgo: 4,
    estado: "Verde",
    ultimaEvaluacion: "2024-01-08",
    proximaRevision: "2024-03-08",
    responsable: "Ana Rodríguez",
    accionesRequeridas: [],
    tendencia: "Estable"
  }
];

const obtenerIconoEstado = (estado: string) => {
  switch (estado) {
    case "Verde":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "Amarillo":
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    case "Rojo":
      return <XCircle className="w-5 h-5 text-red-500" />;
    case "Crítico":
      return <XCircle className="w-5 h-5 text-red-700" />;
    default:
      return <Clock className="w-5 h-5 text-gray-500" />;
  }
};

const obtenerColorEstado = (estado: string) => {
  switch (estado) {
    case "Verde":
      return "bg-green-500";
    case "Amarillo":
      return "bg-yellow-500";
    case "Rojo":
      return "bg-red-500";
    case "Crítico":
      return "bg-red-700";
    default:
      return "bg-gray-500";
  }
};

const obtenerIconoTendencia = (tendencia: string) => {
  switch (tendencia) {
    case "Mejorando":
      return "↗️";
    case "Empeorando":
      return "↘️";
    case "Estable":
      return "→";
    default:
      return "→";
  }
};

// Definición de la matriz de riesgos
const probabilidadNiveles = [
  { id: 5, nombre: "CASI SEGURO", descripcion: "Muy probable" },
  { id: 4, nombre: "MUY PROBABLE", descripcion: "Muy probable" },
  { id: 3, nombre: "POSIBLE", descripcion: "Posible" },
  { id: 2, nombre: "POCO PROBABLE", descripcion: "Poco probable" },
  { id: 1, nombre: "RARO", descripcion: "Raro" }
];

const impactoNiveles = [
  { id: 1, nombre: "INSIGNIFICANTE", descripcion: "Insignificante" },
  { id: 2, nombre: "MENOR", descripcion: "Menor" },
  { id: 3, nombre: "MODERADO", descripcion: "Moderado" },
  { id: 4, nombre: "MAYOR", descripcion: "Mayor" },
  { id: 5, nombre: "CATASTRÓFICO", descripcion: "Catastrófico" }
];

const obtenerNivelRiesgoMatriz = (probabilidad: number, impacto: number) => {
  const valor = probabilidad * impacto;
  if (valor <= 3) return { nivel: "BAJO", color: "bg-green-500", textColor: "text-black" };
  if (valor <= 6) return { nivel: "MEDIO", color: "bg-yellow-400", textColor: "text-black" };
  if (valor <= 12) return { nivel: "ALTO", color: "bg-orange-500", textColor: "text-white" };
  if (valor <= 20) return { nivel: "ALTO", color: "bg-orange-600", textColor: "text-white" };
  return { nivel: "MUY ALTO", color: "bg-red-600", textColor: "text-white" };
};

const obtenerRiesgosEnCelda = (probabilidad: number, impacto: number, riesgos: RiesgoSemaforizado[]) => {
  return riesgos.filter(riesgo => {
    // Mapear nivel de riesgo a probabilidad e impacto aproximados
    const nivel = riesgo.nivelRiesgo;
    const probAprox = Math.min(5, Math.max(1, Math.ceil(nivel / 5)));
    const impactoAprox = Math.min(5, Math.max(1, Math.ceil(nivel / 4)));
    return probAprox === probabilidad && impactoAprox === impacto;
  });
};

export default function SemaforizacionRiesgos() {
  const [riesgos] = useState<RiesgoSemaforizado[]>(mockRiesgos);
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos");
  const [selectedCelda, setSelectedCelda] = useState<{probabilidad: number, impacto: number, riesgos: RiesgoSemaforizado[]} | null>(null);
  const [selectedRiesgo, setSelectedRiesgo] = useState<RiesgoSemaforizado | null>(null);

  const riesgosFiltrados = riesgos.filter(riesgo => {
    const cumpleEstado = filtroEstado === "todos" || riesgo.estado === filtroEstado;
    const cumpleCategoria = filtroCategoria === "todos" || riesgo.categoria === filtroCategoria;
    return cumpleEstado && cumpleCategoria;
  });

  const estadisticas = {
    verde: riesgos.filter(r => r.estado === "Verde").length,
    amarillo: riesgos.filter(r => r.estado === "Amarillo").length,
    rojo: riesgos.filter(r => r.estado === "Rojo").length,
    critico: riesgos.filter(r => r.estado === "Crítico").length,
    total: riesgos.length
  };

  const categorias = [...new Set(riesgos.map(r => r.categoria))];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Semaforización de Riesgos</h1>
          <p className="text-muted-foreground">Monitoreo visual del estado de los riesgos</p>
        </div>
      </div>

      {/* Panel de Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{estadisticas.verde}</p>
                <p className="text-xs text-muted-foreground">Verde</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{estadisticas.amarillo}</p>
                <p className="text-xs text-muted-foreground">Amarillo</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{estadisticas.rojo}</p>
                <p className="text-xs text-muted-foreground">Rojo</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-700 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{estadisticas.critico}</p>
                <p className="text-xs text-muted-foreground">Crítico</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{estadisticas.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Estado del Semáforo</label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="Verde">Verde</SelectItem>
                  <SelectItem value="Amarillo">Amarillo</SelectItem>
                  <SelectItem value="Rojo">Rojo</SelectItem>
                  <SelectItem value="Crítico">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Categoría</label>
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las categorías</SelectItem>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vistas de Semaforización */}
      <Tabs defaultValue="matriz" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Matriz de Semaforización
            </CardTitle>
            <CardDescription>
              Estado actual de todos los riesgos con indicadores visuales
            </CardDescription>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="matriz" className="flex items-center gap-2">
                <Grid className="w-4 h-4" />
                Vista Matriz
              </TabsTrigger>
              <TabsTrigger value="lista" className="flex items-center gap-2">
                <List className="w-4 h-4" />
                Vista Lista
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="matriz" className="space-y-6">
              {/* Matriz Visual de Riesgos */}
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-blue-600 mb-2">Matriz de riesgos</h3>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">IMPACTO O CONSECUENCIAS</p>
                </div>
                
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full">
                    {/* Header de impacto */}
                    <div className="grid grid-cols-7 gap-0 mb-0">
                      <div></div>
                      {impactoNiveles.map((impacto) => (
                        <div key={impacto.id} className="bg-gray-600 text-white p-3 text-center text-xs font-bold border border-gray-400">
                          {impacto.nombre}
                        </div>
                      ))}
                    </div>
                    
                    {/* Filas de la matriz */}
                    {probabilidadNiveles.map((probabilidad, probIndex) => (
                      <div key={probabilidad.id} className="grid grid-cols-7 gap-0">
                        {/* Label de probabilidad */}
                        {probIndex === 2 && (
                          <div className="bg-gray-600 text-white p-3 text-center text-xs font-bold border border-gray-400 row-span-5 flex items-center justify-center writing-mode-vertical-lr rotate-180">
                            <span className="transform rotate-90 whitespace-nowrap">PROBABILIDAD DE QUE OCURRA</span>
                          </div>
                        )}
                        {probIndex !== 2 && (
                          <div className="bg-gray-600 text-white p-3 text-center text-xs font-bold border border-gray-400 flex items-center justify-center">
                            {probabilidad.nombre}
                          </div>
                        )}
                        
                        {/* Celdas de la matriz */}
                        {impactoNiveles.map((impacto) => {
                          const riesgoInfo = obtenerNivelRiesgoMatriz(probabilidad.id, impacto.id);
                          const riesgosEnCelda = obtenerRiesgosEnCelda(probabilidad.id, impacto.id, riesgosFiltrados);
                          
                          return (
                            <div 
                              key={`${probabilidad.id}-${impacto.id}`}
                              className={`${riesgoInfo.color} ${riesgoInfo.textColor} p-3 text-center text-sm font-bold border border-gray-400 min-h-[80px] flex flex-col items-center justify-center relative group cursor-pointer hover:opacity-80 transition-opacity`}
                              onClick={() => {
                                if (riesgosEnCelda.length > 0) {
                                  setSelectedCelda({
                                    probabilidad: probabilidad.id,
                                    impacto: impacto.id,
                                    riesgos: riesgosEnCelda
                                  });
                                }
                              }}
                            >
                              <span className="text-xs mb-1">{riesgoInfo.nivel}</span>
                              {riesgosEnCelda.length > 0 && (
                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
                                  <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                    {riesgosEnCelda.length}
                                  </span>
                                </div>
                              )}
                              {riesgosEnCelda.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded shadow-lg p-2 z-10 hidden group-hover:block pointer-events-none">
                                  <div className="space-y-1">
                                    {riesgosEnCelda.map((riesgo) => (
                                      <div key={riesgo.id} className="text-xs text-black">
                                        <span className="font-medium">{riesgo.codigo}:</span> {riesgo.nombre}
                                      </div>
                                    ))}
                                    <div className="text-xs text-blue-600 font-medium mt-2">
                                      Click para ver detalles
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Leyenda */}
                <div className="flex justify-center gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500"></div>
                    <span className="text-sm">BAJO</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400"></div>
                    <span className="text-sm">MEDIO</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500"></div>
                    <span className="text-sm">ALTO</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-600"></div>
                    <span className="text-sm">MUY ALTO</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="lista" className="space-y-4">
              {riesgosFiltrados.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No se encontraron riesgos con los filtros aplicados.
                </div>
              ) : (
                <div className="space-y-4">
                  {riesgosFiltrados.map((riesgo) => (
                    <div key={riesgo.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {obtenerIconoEstado(riesgo.estado)}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">{riesgo.codigo}</Badge>
                              <Badge className={`${obtenerColorEstado(riesgo.estado)} text-white`}>
                                {riesgo.estado}
                              </Badge>
                              <span className="text-lg">{obtenerIconoTendencia(riesgo.tendencia)}</span>
                            </div>
                            <h3 className="font-semibold">{riesgo.nombre}</h3>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Nivel de Riesgo</p>
                          <p className="text-2xl font-bold">{riesgo.nivelRiesgo}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Categoría:</p>
                          <Badge variant="secondary">{riesgo.categoria}</Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Responsable:</p>
                          <p className="font-medium">{riesgo.responsable}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Última Evaluación:</p>
                          <p className="font-medium">{riesgo.ultimaEvaluacion}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Próxima Revisión:</p>
                          <p className="font-medium">{riesgo.proximaRevision}</p>
                        </div>
                      </div>

                      {riesgo.accionesRequeridas.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-muted-foreground mb-2">Acciones Requeridas:</p>
                          <div className="flex flex-wrap gap-2">
                            {riesgo.accionesRequeridas.map((accion, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {accion}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end mt-4 gap-2">
                        <Button variant="outline" size="sm">
                          Ver Detalles
                        </Button>
                        <Button variant="outline" size="sm">
                          Actualizar Estado
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      {/* Alertas y Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas y Notificaciones</CardTitle>
          <CardDescription>
            Riesgos que requieren atención inmediata
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {riesgos.filter(r => r.estado === "Rojo" || r.estado === "Crítico").map((riesgo) => (
              <div key={riesgo.id} className="flex items-center gap-3 p-3 border rounded-lg bg-red-50 border-red-200">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div className="flex-1">
                  <p className="font-medium">{riesgo.nombre} ({riesgo.codigo})</p>
                  <p className="text-sm text-muted-foreground">
                    Estado: {riesgo.estado} - Próxima revisión: {riesgo.proximaRevision}
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Revisar
                </Button>
              </div>
            ))}
            {riesgos.filter(r => r.estado === "Rojo" || r.estado === "Crítico").length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No hay riesgos críticos que requieran atención inmediata.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog para ver riesgos en una celda de la matriz */}
      <Dialog open={!!selectedCelda} onOpenChange={() => setSelectedCelda(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              Riesgos en Celda de Matriz
            </DialogTitle>
            <DialogDescription>
              {selectedCelda && (
                <>
                  Probabilidad: {probabilidadNiveles.find(p => p.id === selectedCelda.probabilidad)?.nombre} | 
                  Impacto: {impactoNiveles.find(i => i.id === selectedCelda.impacto)?.nombre}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedCelda && (
            <div className="space-y-4">
              {selectedCelda.riesgos.map((riesgo) => (
                <div key={riesgo.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {obtenerIconoEstado(riesgo.estado)}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{riesgo.codigo}</Badge>
                          <Badge className={`${obtenerColorEstado(riesgo.estado)} text-white`}>
                            {riesgo.estado}
                          </Badge>
                          <span className="text-lg">{obtenerIconoTendencia(riesgo.tendencia)}</span>
                        </div>
                        <h3 className="font-semibold">{riesgo.nombre}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Nivel de Riesgo</p>
                      <p className="text-2xl font-bold">{riesgo.nivelRiesgo}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">Categoría:</p>
                      <Badge variant="secondary">{riesgo.categoria}</Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Responsable:</p>
                      <p className="font-medium">{riesgo.responsable}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Última Evaluación:</p>
                      <p className="font-medium">{riesgo.ultimaEvaluacion}</p>
                    </div>
                  </div>

                  {riesgo.accionesRequeridas.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Acciones Requeridas:</p>
                      <div className="flex flex-wrap gap-2">
                        {riesgo.accionesRequeridas.map((accion, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {accion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedRiesgo(riesgo)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalle
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para ver detalle de un riesgo específico */}
      <Dialog open={!!selectedRiesgo} onOpenChange={() => setSelectedRiesgo(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle del Riesgo</DialogTitle>
            <DialogDescription>
              Información completa del riesgo seleccionado
            </DialogDescription>
          </DialogHeader>
          {selectedRiesgo && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                {obtenerIconoEstado(selectedRiesgo.estado)}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{selectedRiesgo.codigo}</Badge>
                    <Badge className={`${obtenerColorEstado(selectedRiesgo.estado)} text-white`}>
                      {selectedRiesgo.estado}
                    </Badge>
                    <span className="text-lg">{obtenerIconoTendencia(selectedRiesgo.tendencia)}</span>
                  </div>
                  <h3 className="text-xl font-semibold">{selectedRiesgo.nombre}</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Categoría</p>
                    <Badge variant="secondary">{selectedRiesgo.categoria}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Responsable</p>
                    <p className="font-medium">{selectedRiesgo.responsable}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tendencia</p>
                    <p className="font-medium flex items-center gap-2">
                      {selectedRiesgo.tendencia} {obtenerIconoTendencia(selectedRiesgo.tendencia)}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nivel de Riesgo</p>
                    <p className="text-3xl font-bold">{selectedRiesgo.nivelRiesgo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Última Evaluación</p>
                    <p className="font-medium">{selectedRiesgo.ultimaEvaluacion}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Próxima Revisión</p>
                    <p className="font-medium">{selectedRiesgo.proximaRevision}</p>
                  </div>
                </div>
              </div>

              {selectedRiesgo.accionesRequeridas.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Acciones Requeridas</p>
                  <div className="space-y-2">
                    {selectedRiesgo.accionesRequeridas.map((accion, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm">{accion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedRiesgo(null)}>
                  Cerrar
                </Button>
                <Button>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Riesgo
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}