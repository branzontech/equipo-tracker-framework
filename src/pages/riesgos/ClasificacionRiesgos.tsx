import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tag, Filter, BarChart3, PieChart } from "lucide-react";

interface RiesgoClasificado {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  subcategoria: string;
  probabilidad: number;
  impacto: number;
  nivelRiesgo: number;
  clasificacionCOBIT: string;
  proceso: string;
}

const categoriasCOBIT = {
  "Alinear, Planificar y Organizar": [
    "APO01 - Gestionar el marco de gestión de TI",
    "APO02 - Gestionar la estrategia",
    "APO03 - Gestionar la arquitectura empresarial",
    "APO04 - Gestionar la innovación",
    "APO05 - Gestionar el portafolio",
    "APO06 - Gestionar el presupuesto y los costos",
    "APO07 - Gestionar los recursos humanos",
    "APO08 - Gestionar las relaciones",
    "APO09 - Gestionar los acuerdos de servicio",
    "APO10 - Gestionar los proveedores",
    "APO11 - Gestionar la calidad",
    "APO12 - Gestionar el riesgo",
    "APO13 - Gestionar la seguridad"
  ],
  "Construir, Adquirir e Implementar": [
    "BAI01 - Gestionar programas y proyectos",
    "BAI02 - Gestionar la definición de requisitos",
    "BAI03 - Gestionar la identificación y construcción de soluciones",
    "BAI04 - Gestionar la disponibilidad y capacidad",
    "BAI05 - Gestionar la habilitación del cambio organizacional",
    "BAI06 - Gestionar los cambios",
    "BAI07 - Gestionar la aceptación del cambio y la transición",
    "BAI08 - Gestionar el conocimiento",
    "BAI09 - Gestionar los activos",
    "BAI10 - Gestionar la configuración"
  ],
  "Entregar, Dar Servicio y Soporte": [
    "DSS01 - Gestionar las operaciones",
    "DSS02 - Gestionar las solicitudes e incidentes de servicio",
    "DSS03 - Gestionar los problemas",
    "DSS04 - Gestionar la continuidad",
    "DSS05 - Gestionar los servicios de seguridad",
    "DSS06 - Gestionar los controles de procesos de negocio"
  ],
  "Monitorear, Evaluar y Valorar": [
    "MEA01 - Monitorear, evaluar y valorar el rendimiento y la conformidad",
    "MEA02 - Monitorear, evaluar y valorar el sistema de control interno",
    "MEA03 - Monitorear, evaluar y valorar el cumplimiento de los requisitos externos"
  ]
};

const tiposRiesgo = [
  "Estratégico",
  "Operacional", 
  "Financiero",
  "Cumplimiento",
  "Tecnológico",
  "Reputacional"
];

const mockRiesgos: RiesgoClasificado[] = [
  {
    id: "1",
    codigo: "RG-001",
    nombre: "Falla en sistemas críticos",
    categoria: "Entregar, Dar Servicio y Soporte",
    subcategoria: "DSS01 - Gestionar las operaciones",
    probabilidad: 3,
    impacto: 4,
    nivelRiesgo: 12,
    clasificacionCOBIT: "Operacional",
    proceso: "Operaciones de TI"
  },
  {
    id: "2",
    codigo: "RG-002",
    nombre: "Pérdida de datos confidenciales",
    categoria: "Entregar, Dar Servicio y Soporte",
    subcategoria: "DSS05 - Gestionar los servicios de seguridad",
    probabilidad: 2,
    impacto: 5,
    nivelRiesgo: 10,
    clasificacionCOBIT: "Tecnológico",
    proceso: "Seguridad de la información"
  },
  {
    id: "3",
    codigo: "RG-003",
    nombre: "Incumplimiento normativo",
    categoria: "Monitorear, Evaluar y Valorar",
    subcategoria: "MEA03 - Monitorear, evaluar y valorar el cumplimiento",
    probabilidad: 2,
    impacto: 4,
    nivelRiesgo: 8,
    clasificacionCOBIT: "Cumplimiento",
    proceso: "Gestión de cumplimiento"
  }
];

const obtenerColorRiesgo = (nivel: number): string => {
  if (nivel <= 5) return "bg-green-500";
  if (nivel <= 10) return "bg-yellow-500";
  if (nivel <= 15) return "bg-orange-500";
  if (nivel <= 20) return "bg-red-500";
  return "bg-red-700";
};

const obtenerNivelTexto = (nivel: number): string => {
  if (nivel <= 5) return "Muy Bajo";
  if (nivel <= 10) return "Bajo";
  if (nivel <= 15) return "Medio";
  if (nivel <= 20) return "Alto";
  return "Muy Alto";
};

export default function ClasificacionRiesgos() {
  const [riesgos] = useState<RiesgoClasificado[]>(mockRiesgos);
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");

  const riesgosFiltrados = riesgos.filter(riesgo => {
    const cumpleCategoria = filtroCategoria === "todos" || riesgo.categoria === filtroCategoria;
    const cumpleTipo = filtroTipo === "todos" || riesgo.clasificacionCOBIT === filtroTipo;
    return cumpleCategoria && cumpleTipo;
  });

  const estadisticasPorCategoria = Object.keys(categoriasCOBIT).map(categoria => ({
    categoria,
    cantidad: riesgos.filter(r => r.categoria === categoria).length,
    nivelPromedio: riesgos
      .filter(r => r.categoria === categoria)
      .reduce((acc, r) => acc + r.nivelRiesgo, 0) / 
      Math.max(1, riesgos.filter(r => r.categoria === categoria).length)
  }));

  const estadisticasPorTipo = tiposRiesgo.map(tipo => ({
    tipo,
    cantidad: riesgos.filter(r => r.clasificacionCOBIT === tipo).length,
    porcentaje: (riesgos.filter(r => r.clasificacionCOBIT === tipo).length / riesgos.length) * 100
  }));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Clasificación de Riesgos</h1>
          <p className="text-muted-foreground">Clasificación según el marco COBIT 2019</p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Clasificación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Dominio COBIT</label>
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los dominios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los dominios</SelectItem>
                  {Object.keys(categoriasCOBIT).map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Tipo de Riesgo</label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  {tiposRiesgo.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas por Dominio COBIT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Riesgos por Dominio COBIT
            </CardTitle>
            <CardDescription>
              Distribución de riesgos según los dominios del marco COBIT
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {estadisticasPorCategoria.map((stat) => (
                <div key={stat.categoria} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{stat.categoria}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{stat.cantidad} riesgos</Badge>
                      <Badge className={`${obtenerColorRiesgo(stat.nivelPromedio)} text-white`}>
                        Nivel promedio: {stat.nivelPromedio.toFixed(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Distribución por Tipo
            </CardTitle>
            <CardDescription>
              Porcentaje de riesgos por tipo de clasificación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {estadisticasPorTipo.map((stat) => (
                <div key={stat.tipo} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{stat.tipo}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{stat.cantidad} riesgos</Badge>
                      <span className="text-sm text-muted-foreground">
                        {stat.porcentaje.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${stat.porcentaje}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Riesgos Clasificados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Riesgos Clasificados
          </CardTitle>
          <CardDescription>
            Riesgos organizados según el marco COBIT 2019
          </CardDescription>
        </CardHeader>
        <CardContent>
          {riesgosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron riesgos con los filtros aplicados.
            </div>
          ) : (
            <div className="space-y-4">
              {riesgosFiltrados.map((riesgo) => (
                <div key={riesgo.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{riesgo.codigo}</Badge>
                        <Badge className={`${obtenerColorRiesgo(riesgo.nivelRiesgo)} text-white`}>
                          {obtenerNivelTexto(riesgo.nivelRiesgo)}
                        </Badge>
                      </div>
                      <h3 className="font-semibold mb-2">{riesgo.nombre}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Dominio COBIT:</p>
                          <p className="font-medium">{riesgo.categoria}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Proceso:</p>
                          <p className="font-medium">{riesgo.subcategoria}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Tipo de Riesgo:</p>
                          <Badge>{riesgo.clasificacionCOBIT}</Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Probabilidad x Impacto:</p>
                          <p className="font-medium">{riesgo.probabilidad} x {riesgo.impacto} = {riesgo.nivelRiesgo}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}