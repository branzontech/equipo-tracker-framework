
import { useState } from "react";
import { PlusCircle, CheckCircle, XCircle, Pencil, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Periferico {
  id: number;
  descripcion: string;
  estado: "Activo" | "Inactivo";
}

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

  const [newPeriferico, setNewPeriferico] = useState<Omit<Periferico, "id">>({
    descripcion: "",
    estado: "Activo",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [editingEstado, setEditingEstado] = useState<EstadoType>("Activo");

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

    setPerifericos([
      ...perifericos,
      {
        id: perifericos.length > 0 ? Math.max(...perifericos.map(p => p.id)) + 1 : 1,
        ...newPeriferico,
      },
    ]);
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

    setPerifericos(perifericos.map(periferico => 
      periferico.id === id 
        ? { ...periferico, descripcion: editingValue, estado: editingEstado } 
        : periferico
    ));
    
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
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
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
            <div className="flex items-end">
              <Button type="submit" className="w-full">
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
                <TableHead>Estado</TableHead>
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
