
import { useState } from "react";
import { PlusCircle, CheckCircle, XCircle, Pencil, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Periferico } from "@/pages/configuracion/maestros/interfaces/periferico";

type EstadoType = "Activo" | "Inactivo";

const ListaPerifericos = () => {
  const { toast } = useToast();
  const [perifericos, setPerifericos] = useState<Periferico[]>([
    { id: 1, descripcion: "Teclado Mecánico", estado: "Activo" },
    { id: 2, descripcion: "Mouse Inalámbrico", estado: "Activo" },
    { id: 3, descripcion: "Monitor 24'", estado: "Activo" },
    { id: 4, descripcion: "Webcam HD", estado: "Inactivo" },
    { id: 5, descripcion: "Auriculares Bluetooth", estado: "Activo" },
    { id: 6, descripcion: "Dock Station", estado: "Activo" },
  ]);

  // Estado para campos obligatorios
  const [newPeriferico, setNewPeriferico] = useState<Omit<Periferico, "id">>({
    descripcion: "",
    estado: "Activo",
  });

  // Estados para campos opcionales
  const [mostrarSerial, setMostrarSerial] = useState(false);
  const [mostrarMarca, setMostrarMarca] = useState(false);
  const [mostrarCampoPersonalizado, setMostrarCampoPersonalizado] = useState(false);
  const [mostrarObservacion, setMostrarObservacion] = useState(false);
  const [nombreCampoPersonalizado, setNombreCampoPersonalizado] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [editingEstado, setEditingEstado] = useState<EstadoType>("Activo");
  const [editingSerial, setEditingSerial] = useState<string>("");
  const [editingMarca, setEditingMarca] = useState<string>("");
  const [editingCampoPersonalizadoValor, setEditingCampoPersonalizadoValor] = useState<string>("");
  const [editingObservacion, setEditingObservacion] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPeriferico.descripcion.trim()) {
      toast({
        title: "Error",
        description: "La descripción no puede estar vacía",
        variant: "destructive",
      });
      return;
    }

    const perifecicoCompleto = { ...newPeriferico };
    
    // Agregar campos opcionales solo si están activados
    if (mostrarSerial && newPeriferico.serial) {
      perifecicoCompleto.serial = newPeriferico.serial;
    }
    
    if (mostrarMarca && newPeriferico.marca) {
      perifecicoCompleto.marca = newPeriferico.marca;
    }
    
    if (mostrarCampoPersonalizado && nombreCampoPersonalizado && newPeriferico.campoPersonalizado?.valor) {
      perifecicoCompleto.campoPersonalizado = {
        nombre: nombreCampoPersonalizado,
        valor: newPeriferico.campoPersonalizado.valor
      };
    }
    
    if (mostrarObservacion && newPeriferico.observacion) {
      perifecicoCompleto.observacion = newPeriferico.observacion;
    }

    setPerifericos([
      ...perifericos,
      {
        id: perifericos.length > 0 ? Math.max(...perifericos.map(p => p.id)) + 1 : 1,
        ...perifecicoCompleto,
      },
    ]);

    // Reiniciar el formulario
    setNewPeriferico({
      descripcion: "",
      estado: "Activo",
    });
    
    toast({
      title: "Periférico agregado",
      description: "El periférico fue agregado exitosamente",
    });
  };

  const startEditing = (periferico: Periferico) => {
    setEditingId(periferico.id);
    setEditingValue(periferico.descripcion);
    setEditingEstado(periferico.estado);
    setEditingSerial(periferico.serial || "");
    setEditingMarca(periferico.marca || "");
    setEditingCampoPersonalizadoValor(periferico.campoPersonalizado?.valor || "");
    setEditingObservacion(periferico.observacion || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEdit = (id: number) => {
    if (!editingValue.trim()) {
      toast({
        title: "Error",
        description: "La descripción no puede estar vacía",
        variant: "destructive",
      });
      return;
    }

    setPerifericos(perifericos.map(periferico => {
      if (periferico.id === id) {
        const updatedPeriferico: Periferico = { 
          ...periferico, 
          descripcion: editingValue, 
          estado: editingEstado 
        };

        if (mostrarSerial) {
          updatedPeriferico.serial = editingSerial;
        }
        
        if (mostrarMarca) {
          updatedPeriferico.marca = editingMarca;
        }
        
        if (mostrarCampoPersonalizado && periferico.campoPersonalizado) {
          updatedPeriferico.campoPersonalizado = {
            nombre: periferico.campoPersonalizado.nombre,
            valor: editingCampoPersonalizadoValor
          };
        }
        
        if (mostrarObservacion) {
          updatedPeriferico.observacion = editingObservacion;
        }

        return updatedPeriferico;
      }
      return periferico;
    }));
    
    setEditingId(null);
    toast({
      title: "Periférico actualizado",
      description: "El periférico fue actualizado exitosamente",
    });
  };

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Registro de Periféricos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mostrarSerial" 
                checked={mostrarSerial} 
                onCheckedChange={(checked) => setMostrarSerial(checked === true)} 
              />
              <Label htmlFor="mostrarSerial">Incluir Serial</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mostrarMarca" 
                checked={mostrarMarca} 
                onCheckedChange={(checked) => setMostrarMarca(checked === true)} 
              />
              <Label htmlFor="mostrarMarca">Incluir Marca</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mostrarCampoPersonalizado" 
                checked={mostrarCampoPersonalizado} 
                onCheckedChange={(checked) => setMostrarCampoPersonalizado(checked === true)} 
              />
              <Label htmlFor="mostrarCampoPersonalizado">Campo Personalizado</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mostrarObservacion" 
                checked={mostrarObservacion} 
                onCheckedChange={(checked) => setMostrarObservacion(checked === true)} 
              />
              <Label htmlFor="mostrarObservacion">Incluir Observación</Label>
            </div>
          </div>

          {mostrarCampoPersonalizado && (
            <div className="mb-4">
              <Label htmlFor="nombreCampoPersonalizado">Nombre del campo personalizado</Label>
              <Input
                id="nombreCampoPersonalizado"
                value={nombreCampoPersonalizado}
                onChange={(e) => setNombreCampoPersonalizado(e.target.value)}
                placeholder="Ej: Color, Tamaño, Modelo..."
                className="mt-1"
                required={mostrarCampoPersonalizado}
              />
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                value={newPeriferico.descripcion}
                onChange={(e) =>
                  setNewPeriferico({ ...newPeriferico, descripcion: e.target.value })
                }
                placeholder="Descripción del periférico"
                required
              />
            </div>
            
            {mostrarSerial && (
              <div className="space-y-2">
                <Label htmlFor="serial">Serial</Label>
                <Input
                  id="serial"
                  value={newPeriferico.serial || ""}
                  onChange={(e) =>
                    setNewPeriferico({ ...newPeriferico, serial: e.target.value })
                  }
                  placeholder="Número de serie"
                />
              </div>
            )}
            
            {mostrarMarca && (
              <div className="space-y-2">
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  value={newPeriferico.marca || ""}
                  onChange={(e) =>
                    setNewPeriferico({ ...newPeriferico, marca: e.target.value })
                  }
                  placeholder="Marca del periférico"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={newPeriferico.estado}
                onValueChange={(value: EstadoType) =>
                  setNewPeriferico({ ...newPeriferico, estado: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {mostrarCampoPersonalizado && nombreCampoPersonalizado && (
              <div className="space-y-2">
                <Label htmlFor="campoPersonalizadoValor">{nombreCampoPersonalizado}</Label>
                <Input
                  id="campoPersonalizadoValor"
                  value={newPeriferico.campoPersonalizado?.valor || ""}
                  onChange={(e) =>
                    setNewPeriferico({ 
                      ...newPeriferico, 
                      campoPersonalizado: { 
                        nombre: nombreCampoPersonalizado, 
                        valor: e.target.value 
                      } 
                    })
                  }
                  placeholder={`Valor para ${nombreCampoPersonalizado}`}
                />
              </div>
            )}
            
            {mostrarObservacion && (
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="observacion">Observación</Label>
                <Textarea
                  id="observacion"
                  value={newPeriferico.observacion || ""}
                  onChange={(e) =>
                    setNewPeriferico({ ...newPeriferico, observacion: e.target.value })
                  }
                  placeholder="Observaciones adicionales"
                  className="min-h-[80px]"
                />
              </div>
            )}
            
            <div className="flex items-end md:col-span-2 lg:col-span-3">
              <Button type="submit" className="w-full md:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Agregar Periférico
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Periféricos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                {mostrarSerial && <TableHead>Serial</TableHead>}
                {mostrarMarca && <TableHead>Marca</TableHead>}
                {mostrarCampoPersonalizado && nombreCampoPersonalizado && (
                  <TableHead>{nombreCampoPersonalizado}</TableHead>
                )}
                <TableHead>Estado</TableHead>
                {mostrarObservacion && <TableHead>Observación</TableHead>}
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {perifericos.map((periferico) => (
                <TableRow key={periferico.id}>
                  <TableCell>
                    {editingId === periferico.id ? (
                      <Input
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      periferico.descripcion
                    )}
                  </TableCell>
                  
                  {mostrarSerial && (
                    <TableCell>
                      {editingId === periferico.id ? (
                        <Input
                          value={editingSerial}
                          onChange={(e) => setEditingSerial(e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        periferico.serial || "-"
                      )}
                    </TableCell>
                  )}
                  
                  {mostrarMarca && (
                    <TableCell>
                      {editingId === periferico.id ? (
                        <Input
                          value={editingMarca}
                          onChange={(e) => setEditingMarca(e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        periferico.marca || "-"
                      )}
                    </TableCell>
                  )}
                  
                  {mostrarCampoPersonalizado && nombreCampoPersonalizado && (
                    <TableCell>
                      {editingId === periferico.id ? (
                        <Input
                          value={editingCampoPersonalizadoValor}
                          onChange={(e) => setEditingCampoPersonalizadoValor(e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        periferico.campoPersonalizado?.valor || "-"
                      )}
                    </TableCell>
                  )}
                  
                  <TableCell>
                    {editingId === periferico.id ? (
                      <Select
                        value={editingEstado}
                        onValueChange={(value: EstadoType) => setEditingEstado(value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Seleccione estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Activo">Activo</SelectItem>
                          <SelectItem value="Inactivo">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="flex items-center">
                        {periferico.estado === "Activo" ? (
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="mr-2 h-4 w-4 text-red-500" />
                        )}
                        {periferico.estado}
                      </span>
                    )}
                  </TableCell>
                  
                  {mostrarObservacion && (
                    <TableCell>
                      {editingId === periferico.id ? (
                        <Textarea
                          value={editingObservacion}
                          onChange={(e) => setEditingObservacion(e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        periferico.observacion || "-"
                      )}
                    </TableCell>
                  )}
                  
                  <TableCell className="text-right">
                    {editingId === periferico.id ? (
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => saveEdit(periferico.id)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={cancelEditing}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => startEditing(periferico)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListaPerifericos;
