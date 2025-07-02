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
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Semaforización de Riesgos
        </h1>
        <p className="text-lg text-muted-foreground">
          Monitoreo visual del estado de los riesgos organizacionales
        </p>
      </div>

      {/* Statistics Dashboard */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Resumen Ejecutivo</CardTitle>
          <CardDescription>Estado actual de la cartera de riesgos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <span className="text-2xl font-bold text-white">{estadisticas.verde}</span>
              </div>
              <div>
                <p className="font-semibold text-green-700">BAJO</p>
                <p className="text-xs text-muted-foreground">Riesgos controlados</p>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <span className="text-2xl font-bold text-white">{estadisticas.amarillo}</span>
              </div>
              <div>
                <p className="font-semibold text-yellow-700">MEDIO</p>
                <p className="text-xs text-muted-foreground">Requieren atención</p>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <span className="text-2xl font-bold text-white">{estadisticas.rojo}</span>
              </div>
              <div>
                <p className="font-semibold text-orange-700">ALTO</p>
                <p className="text-xs text-muted-foreground">Acción inmediata</p>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <span className="text-2xl font-bold text-white">{estadisticas.critico}</span>
              </div>
              <div>
                <p className="font-semibold text-red-700">CRÍTICO</p>
                <p className="text-xs text-muted-foreground">Máxima prioridad</p>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <span className="text-2xl font-bold text-white">{estadisticas.total}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-700">TOTAL</p>
                <p className="text-xs text-muted-foreground">Riesgos registrados</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Filtros de Visualización
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Estado del Semáforo</label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">🎯 Todos los estados</SelectItem>
                  <SelectItem value="Verde">🟢 Verde - Bajo</SelectItem>
                  <SelectItem value="Amarillo">🟡 Amarillo - Medio</SelectItem>
                  <SelectItem value="Rojo">🔴 Rojo - Alto</SelectItem>
                  <SelectItem value="Crítico">🚨 Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Categoría de Riesgo</label>
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">📋 Todas las categorías</SelectItem>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>
                      📁 {categoria}
                    </SelectItem>
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
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-blue-600 mb-2">Matriz de Riesgos</h3>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">IMPACTO O CONSECUENCIAS</p>
                </div>
                
                <div className="flex justify-center">
                  <div className="inline-block bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
                    {/* Header de impacto */}
                    <div className="grid grid-cols-6 gap-0 mb-0">
                      {impactoNiveles.map((impacto) => (
                        <div key={impacto.id} className="bg-slate-700 text-white p-4 text-center text-xs font-bold border border-slate-600 min-w-[100px] first:rounded-tl-lg last:rounded-tr-lg">
                          <div className="whitespace-nowrap">{impacto.nombre}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Contenedor de la matriz con label lateral */}
                    <div className="relative">
                      {/* Label vertical de probabilidad */}
                      <div className="absolute -left-16 top-0 bottom-0 flex items-center justify-center w-12">
                        <div className="transform -rotate-90 whitespace-nowrap text-xs font-bold text-slate-700 bg-slate-100 px-4 py-2 rounded">
                          PROBABILIDAD DE QUE OCURRA
                        </div>
                      </div>
                      
                      {/* Filas de datos */}
                      <div className="ml-4">
                        {probabilidadNiveles.map((probabilidad, index) => (
                          <div key={probabilidad.id} className="grid grid-cols-6 gap-0">
                            {/* Celdas de la matriz */}
                            {impactoNiveles.map((impacto, impactoIndex) => {
                              const riesgoInfo = obtenerNivelRiesgoMatriz(probabilidad.id, impacto.id);
                              const riesgosEnCelda = obtenerRiesgosEnCelda(probabilidad.id, impacto.id, riesgosFiltrados);
                              
                              return (
                                <div 
                                  key={`${probabilidad.id}-${impacto.id}`}
                                  className={`${riesgoInfo.color} ${riesgoInfo.textColor} p-4 text-center text-sm font-bold border border-gray-400 min-h-[80px] flex flex-col items-center justify-center relative group cursor-pointer hover:opacity-90 transition-all duration-200 hover:scale-105 ${
                                    index === probabilidadNiveles.length - 1 && impactoIndex === 0 ? 'rounded-bl-lg' : ''
                                  } ${
                                    index === probabilidadNiveles.length - 1 && impactoIndex === impactoNiveles.length - 1 ? 'rounded-br-lg' : ''
                                  }`}
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
                                  <span className="text-xs mb-1 drop-shadow-sm">{riesgoInfo.nivel}</span>
                                  {riesgosEnCelda.length > 0 && (
                                    <div className="absolute top-2 right-2">
                                      <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">
                                        {riesgosEnCelda.length}
                                      </span>
                                    </div>
                                  )}
                                  {riesgosEnCelda.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded shadow-xl p-3 z-20 hidden group-hover:block pointer-events-none mt-1">
                                      <div className="space-y-1">
                                        <div className="text-xs font-bold text-gray-800 border-b pb-1">
                                          Riesgos en esta celda:
                                        </div>
                                        {riesgosEnCelda.slice(0, 3).map((riesgo) => (
                                          <div key={riesgo.id} className="text-xs text-gray-700">
                                            <span className="font-medium text-blue-600">{riesgo.codigo}:</span> {riesgo.nombre}
                                          </div>
                                        ))}
                                        {riesgosEnCelda.length > 3 && (
                                          <div className="text-xs text-gray-500 italic">
                                            +{riesgosEnCelda.length - 3} más...
                                          </div>
                                        )}
                                        <div className="text-xs text-blue-600 font-medium mt-2 pt-1 border-t">
                                          🖱️ Click para ver todos
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
                      
                      {/* Labels de probabilidad en el lado izquierdo */}
                      <div className="absolute left-0 top-0">
                        {probabilidadNiveles.map((probabilidad, index) => (
                          <div 
                            key={probabilidad.id} 
                            className="bg-slate-700 text-white text-center text-xs font-bold border border-slate-600 h-[80px] flex items-center justify-center -ml-4 w-20"
                            style={{ 
                              marginTop: index === 0 ? '0' : '0px',
                              borderRadius: index === 0 ? '8px 0 0 0' : index === probabilidadNiveles.length - 1 ? '0 0 0 8px' : '0'
                            }}
                          >
                            <span className="whitespace-nowrap text-[10px] leading-tight px-1">
                              {probabilidad.nombre}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Leyenda mejorada */}
                <div className="flex justify-center">
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <div className="text-center mb-3">
                      <h4 className="text-sm font-semibold text-gray-700">Niveles de Riesgo</h4>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded border"></div>
                        <span className="text-sm font-medium">BAJO</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-400 rounded border"></div>
                        <span className="text-sm font-medium">MEDIO</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-500 rounded border"></div>
                        <span className="text-sm font-medium">ALTO</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-600 rounded border"></div>
                        <span className="text-sm font-medium">MUY ALTO</span>
                      </div>
                    </div>
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