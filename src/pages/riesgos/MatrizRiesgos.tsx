import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Riesgo {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  probabilidad: number;
  impacto: number;
  riesgoInherente: number;
  controles: string;
  riesgoResidual: number;
  responsable: string;
  fechaIdentificacion: string;
  estado: "Identificado" | "En Evaluación" | "Controlado" | "Cerrado";
}

const categorias = [
  "Operacional",
  "Tecnológico", 
  "Financiero",
  "Estratégico",
  "Cumplimiento",
  "Reputacional"
];

const niveles = [
  { valor: 1, label: "Muy Bajo", color: "bg-green-500" },
  { valor: 2, label: "Bajo", color: "bg-yellow-500" },
  { valor: 3, label: "Medio", color: "bg-orange-500" },
  { valor: 4, label: "Alto", color: "bg-red-500" },
  { valor: 5, label: "Muy Alto", color: "bg-red-700" }
];

const calcularRiesgo = (probabilidad: number, impacto: number): number => {
  return probabilidad * impacto;
};

const obtenerColorRiesgo = (nivel: number): string => {
  if (nivel <= 5) return "bg-green-500";
  if (nivel <= 10) return "bg-yellow-500";
  if (nivel <= 15) return "bg-orange-500";
  if (nivel <= 20) return "bg-red-500";
  return "bg-red-700";
};

const obtenerNivelRiesgo = (nivel: number): string => {
  if (nivel <= 5) return "Muy Bajo";
  if (nivel <= 10) return "Bajo";
  if (nivel <= 15) return "Medio";
  if (nivel <= 20) return "Alto";
  return "Muy Alto";
};

export default function MatrizRiesgos() {
  const [riesgos, setRiesgos] = useState<Riesgo[]>([]);
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [editando, setEditando] = useState<Riesgo | null>(null);
  const { toast } = useToast();

  const [formulario, setFormulario] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    categoria: "",
    probabilidad: 1,
    impacto: 1,
    controles: "",
    responsable: "",
  });

  const limpiarFormulario = () => {
    setFormulario({
      codigo: "",
      nombre: "",
      descripcion: "",
      categoria: "",
      probabilidad: 1,
      impacto: 1,
      controles: "",
      responsable: "",
    });
  };

  const abrirDialog = (riesgo?: Riesgo) => {
    if (riesgo) {
      setEditando(riesgo);
      setFormulario({
        codigo: riesgo.codigo,
        nombre: riesgo.nombre,
        descripcion: riesgo.descripcion,
        categoria: riesgo.categoria,
        probabilidad: riesgo.probabilidad,
        impacto: riesgo.impacto,
        controles: riesgo.controles,
        responsable: riesgo.responsable,
      });
    } else {
      setEditando(null);
      limpiarFormulario();
    }
    setDialogAbierto(true);
  };

  const guardarRiesgo = () => {
    if (!formulario.codigo || !formulario.nombre || !formulario.categoria || !formulario.responsable) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    const riesgoInherente = calcularRiesgo(formulario.probabilidad, formulario.impacto);
    const riesgoResidual = Math.max(1, riesgoInherente - (formulario.controles ? 2 : 0));

    const nuevoRiesgo: Riesgo = {
      id: editando ? editando.id : Date.now().toString(),
      codigo: formulario.codigo,
      nombre: formulario.nombre,
      descripcion: formulario.descripcion,
      categoria: formulario.categoria,
      probabilidad: formulario.probabilidad,
      impacto: formulario.impacto,
      riesgoInherente,
      controles: formulario.controles,
      riesgoResidual,
      responsable: formulario.responsable,
      fechaIdentificacion: editando ? editando.fechaIdentificacion : new Date().toISOString().split('T')[0],
      estado: editando ? editando.estado : "Identificado",
    };

    if (editando) {
      setRiesgos(riesgos.map(r => r.id === editando.id ? nuevoRiesgo : r));
      toast({
        title: "Riesgo actualizado",
        description: "El riesgo ha sido actualizado exitosamente",
      });
    } else {
      setRiesgos([...riesgos, nuevoRiesgo]);
      toast({
        title: "Riesgo creado",
        description: "El riesgo ha sido creado exitosamente",
      });
    }

    setDialogAbierto(false);
    limpiarFormulario();
    setEditando(null);
  };

  const eliminarRiesgo = (id: string) => {
    setRiesgos(riesgos.filter(r => r.id !== id));
    toast({
      title: "Riesgo eliminado",
      description: "El riesgo ha sido eliminado exitosamente",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Matriz de Riesgos</h1>
          <p className="text-muted-foreground">Gestión y evaluación de riesgos basada en COBIT</p>
        </div>
        <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
          <DialogTrigger asChild>
            <Button onClick={() => abrirDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Riesgo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editando ? "Editar Riesgo" : "Nuevo Riesgo"}
              </DialogTitle>
              <DialogDescription>
                Complete la información del riesgo según los estándares COBIT
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código *</Label>
                  <Input
                    id="codigo"
                    value={formulario.codigo}
                    onChange={(e) => setFormulario({...formulario, codigo: e.target.value})}
                    placeholder="RG-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría *</Label>
                  <Select 
                    value={formulario.categoria} 
                    onValueChange={(value) => setFormulario({...formulario, categoria: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Riesgo *</Label>
                <Input
                  id="nombre"
                  value={formulario.nombre}
                  onChange={(e) => setFormulario({...formulario, nombre: e.target.value})}
                  placeholder="Nombre descriptivo del riesgo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formulario.descripcion}
                  onChange={(e) => setFormulario({...formulario, descripcion: e.target.value})}
                  placeholder="Descripción detallada del riesgo"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="probabilidad">Probabilidad (1-5)</Label>
                  <Select 
                    value={formulario.probabilidad.toString()} 
                    onValueChange={(value) => setFormulario({...formulario, probabilidad: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {niveles.map((nivel) => (
                        <SelectItem key={nivel.valor} value={nivel.valor.toString()}>
                          {nivel.valor} - {nivel.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="impacto">Impacto (1-5)</Label>
                  <Select 
                    value={formulario.impacto.toString()} 
                    onValueChange={(value) => setFormulario({...formulario, impacto: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {niveles.map((nivel) => (
                        <SelectItem key={nivel.valor} value={nivel.valor.toString()}>
                          {nivel.valor} - {nivel.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="controles">Controles Existentes</Label>
                <Textarea
                  id="controles"
                  value={formulario.controles}
                  onChange={(e) => setFormulario({...formulario, controles: e.target.value})}
                  placeholder="Describa los controles existentes para mitigar este riesgo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsable">Responsable *</Label>
                <Input
                  id="responsable"
                  value={formulario.responsable}
                  onChange={(e) => setFormulario({...formulario, responsable: e.target.value})}
                  placeholder="Persona responsable del riesgo"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogAbierto(false)}>
                Cancelar
              </Button>
              <Button onClick={guardarRiesgo}>
                {editando ? "Actualizar" : "Guardar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Matriz de Riesgos
          </CardTitle>
          <CardDescription>
            Lista de riesgos identificados y evaluados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {riesgos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay riesgos registrados. Haga clic en "Nuevo Riesgo" para comenzar.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Probabilidad</TableHead>
                    <TableHead>Impacto</TableHead>
                    <TableHead>Riesgo Inherente</TableHead>
                    <TableHead>Riesgo Residual</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riesgos.map((riesgo) => (
                    <TableRow key={riesgo.id}>
                      <TableCell className="font-medium">{riesgo.codigo}</TableCell>
                      <TableCell>{riesgo.nombre}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{riesgo.categoria}</Badge>
                      </TableCell>
                      <TableCell>{riesgo.probabilidad}</TableCell>
                      <TableCell>{riesgo.impacto}</TableCell>
                      <TableCell>
                        <Badge className={`${obtenerColorRiesgo(riesgo.riesgoInherente)} text-white`}>
                          {riesgo.riesgoInherente} - {obtenerNivelRiesgo(riesgo.riesgoInherente)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${obtenerColorRiesgo(riesgo.riesgoResidual)} text-white`}>
                          {riesgo.riesgoResidual} - {obtenerNivelRiesgo(riesgo.riesgoResidual)}
                        </Badge>
                      </TableCell>
                      <TableCell>{riesgo.responsable}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{riesgo.estado}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => abrirDialog(riesgo)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => eliminarRiesgo(riesgo.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}