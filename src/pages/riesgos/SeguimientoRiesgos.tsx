import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, User, Target } from "lucide-react";

interface SeguimientoRiesgo {
  id: string;
  codigo: string;
  nombre: string;
  estado: string;
  fechaCreacion: string;
  ultimaActualizacion: string;
  responsable: string;
  progreso: number;
  acciones: Array<{
    fecha: string;
    descripcion: string;
    responsable: string;
    estado: "Completada" | "En Progreso" | "Pendiente";
  }>;
}

const mockRiesgos: SeguimientoRiesgo[] = [
  {
    id: "1",
    codigo: "RG-001",
    nombre: "Falla en sistemas críticos",
    estado: "En Tratamiento",
    fechaCreacion: "2024-01-01",
    ultimaActualizacion: "2024-01-15",
    responsable: "Juan Pérez",
    progreso: 65,
    acciones: [
      { fecha: "2024-01-15", descripcion: "Implementación de redundancia", responsable: "Juan Pérez", estado: "En Progreso" },
      { fecha: "2024-01-10", descripcion: "Análisis de causas raíz", responsable: "María García", estado: "Completada" },
    ]
  }
];

export default function SeguimientoRiesgos() {
  const [riesgos] = useState<SeguimientoRiesgo[]>(mockRiesgos);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Seguimiento de Riesgos</h1>
          <p className="text-muted-foreground">Monitoreo del progreso de las acciones de mitigación</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Estado de Seguimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riesgos.map((riesgo) => (
              <div key={riesgo.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{riesgo.codigo}</Badge>
                      <Badge>{riesgo.estado}</Badge>
                    </div>
                    <h3 className="font-semibold">{riesgo.nombre}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Progreso</p>
                    <p className="text-2xl font-bold">{riesgo.progreso}%</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <div>
                      <p className="text-muted-foreground">Creado:</p>
                      <p>{riesgo.fechaCreacion}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <div>
                      <p className="text-muted-foreground">Actualizado:</p>
                      <p>{riesgo.ultimaActualizacion}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <div>
                      <p className="text-muted-foreground">Responsable:</p>
                      <p>{riesgo.responsable}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-primary rounded-full h-2"
                    style={{ width: `${riesgo.progreso}%` }}
                  />
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Acciones:</p>
                  {riesgo.acciones.map((accion, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <p className="text-sm">{accion.descripcion}</p>
                        <p className="text-xs text-muted-foreground">{accion.fecha} - {accion.responsable}</p>
                      </div>
                      <Badge variant={accion.estado === "Completada" ? "default" : "secondary"}>
                        {accion.estado}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}