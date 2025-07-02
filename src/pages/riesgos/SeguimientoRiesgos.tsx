import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Calendar, User, Target, Plus, Edit, CheckCircle, Clock, AlertCircle } from "lucide-react";

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
  const [riesgos, setRiesgos] = useState<SeguimientoRiesgo[]>(mockRiesgos);
  const [selectedRiesgo, setSelectedRiesgo] = useState<SeguimientoRiesgo | null>(null);
  const [isAddingAction, setIsAddingAction] = useState(false);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const { toast } = useToast();

  // Form states
  const [newAction, setNewAction] = useState({
    descripcion: "",
    responsable: "",
    estado: "Pendiente" as "Completada" | "En Progreso" | "Pendiente"
  });
  const [progressUpdate, setProgressUpdate] = useState({
    nuevoProgreso: 0,
    observaciones: ""
  });

  const handleAddAction = () => {
    if (!selectedRiesgo || !newAction.descripcion || !newAction.responsable) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive"
      });
      return;
    }

    const updatedRiesgos = riesgos.map(riesgo => {
      if (riesgo.id === selectedRiesgo.id) {
        const nuevaAccion = {
          fecha: new Date().toISOString().split('T')[0],
          descripcion: newAction.descripcion,
          responsable: newAction.responsable,
          estado: newAction.estado
        };
        return {
          ...riesgo,
          acciones: [...riesgo.acciones, nuevaAccion],
          ultimaActualizacion: new Date().toISOString().split('T')[0]
        };
      }
      return riesgo;
    });

    setRiesgos(updatedRiesgos);
    setNewAction({ descripcion: "", responsable: "", estado: "Pendiente" });
    setIsAddingAction(false);
    
    toast({
      title: "Acción agregada",
      description: "La nueva acción de seguimiento se ha registrado correctamente"
    });
  };

  const handleUpdateProgress = () => {
    if (!selectedRiesgo) return;

    const updatedRiesgos = riesgos.map(riesgo => {
      if (riesgo.id === selectedRiesgo.id) {
        return {
          ...riesgo,
          progreso: progressUpdate.nuevoProgreso,
          ultimaActualizacion: new Date().toISOString().split('T')[0]
        };
      }
      return riesgo;
    });

    setRiesgos(updatedRiesgos);
    setProgressUpdate({ nuevoProgreso: 0, observaciones: "" });
    setIsUpdatingProgress(false);
    
    toast({
      title: "Progreso actualizado",
      description: `El progreso se ha actualizado a ${progressUpdate.nuevoProgreso}%`
    });
  };

  const getProgressColor = (progreso: number) => {
    if (progreso < 25) return "bg-red-500";
    if (progreso < 50) return "bg-orange-500";
    if (progreso < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getActionIcon = (estado: string) => {
    switch (estado) {
      case "Completada":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "En Progreso":
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

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
              <div key={riesgo.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
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

                {/* Enhanced Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Progreso del Plan de Acción</span>
                    <span className="text-muted-foreground">{riesgo.progreso}%</span>
                  </div>
                  <Progress value={riesgo.progreso} className="h-3" />
                </div>

                {/* Actions Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Acciones de Seguimiento:</p>
                    <div className="flex gap-2">
                      <Dialog open={isAddingAction} onOpenChange={setIsAddingAction}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedRiesgo(riesgo)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar Acción
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                      <Dialog open={isUpdatingProgress} onOpenChange={setIsUpdatingProgress}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedRiesgo(riesgo);
                              setProgressUpdate({ ...progressUpdate, nuevoProgreso: riesgo.progreso });
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Actualizar Progreso
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </div>
                  </div>
                  
                  {riesgo.acciones.map((accion, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-start gap-3">
                        {getActionIcon(accion.estado)}
                        <div>
                          <p className="text-sm font-medium">{accion.descripcion}</p>
                          <p className="text-xs text-muted-foreground">
                            {accion.fecha} - {accion.responsable}
                          </p>
                        </div>
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

      {/* Dialog for Adding New Action */}
      <Dialog open={isAddingAction} onOpenChange={setIsAddingAction}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nueva Acción de Seguimiento</DialogTitle>
            <DialogDescription>
              Registre una nueva acción para el riesgo: {selectedRiesgo?.codigo} - {selectedRiesgo?.nombre}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="descripcion">Descripción de la Acción</Label>
              <Textarea
                id="descripcion"
                placeholder="Describa la acción a realizar..."
                value={newAction.descripcion}
                onChange={(e) => setNewAction({ ...newAction, descripcion: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="responsable">Responsable</Label>
              <Input
                id="responsable"
                placeholder="Nombre del responsable"
                value={newAction.responsable}
                onChange={(e) => setNewAction({ ...newAction, responsable: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select value={newAction.estado} onValueChange={(value: any) => setNewAction({ ...newAction, estado: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En Progreso">En Progreso</SelectItem>
                  <SelectItem value="Completada">Completada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingAction(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddAction}>
                Registrar Acción
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for Updating Progress */}
      <Dialog open={isUpdatingProgress} onOpenChange={setIsUpdatingProgress}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Progreso</DialogTitle>
            <DialogDescription>
              Actualice el progreso del riesgo: {selectedRiesgo?.codigo} - {selectedRiesgo?.nombre}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="progreso">Nuevo Progreso (%)</Label>
              <div className="space-y-2">
                <Input
                  id="progreso"
                  type="number"
                  min="0"
                  max="100"
                  value={progressUpdate.nuevoProgreso}
                  onChange={(e) => setProgressUpdate({ ...progressUpdate, nuevoProgreso: parseInt(e.target.value) || 0 })}
                />
                <Progress value={progressUpdate.nuevoProgreso} className="h-2" />
              </div>
            </div>
            <div>
              <Label htmlFor="observaciones">Observaciones (Opcional)</Label>
              <Textarea
                id="observaciones"
                placeholder="Comentarios sobre la actualización..."
                value={progressUpdate.observaciones}
                onChange={(e) => setProgressUpdate({ ...progressUpdate, observaciones: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsUpdatingProgress(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateProgress}>
                Actualizar Progreso
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}