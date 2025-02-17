
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, CheckCircle, XCircle } from "lucide-react";

interface Periferico {
  id: number;
  descripcion: string;
  estado: "Activo" | "Inactivo";
}

type EstadoType = "Activo" | "Inactivo";

const Perifericos = () => {
  const [perifericos, setPerifericos] = useState<Periferico[]>([
    { id: 1, descripcion: "Teclado Mecánico", estado: "Activo" },
    { id: 2, descripcion: "Mouse Inalámbrico", estado: "Activo" },
  ]);

  const [newPeriferico, setNewPeriferico] = useState<Omit<Periferico, "id">>({
    descripcion: "",
    estado: "Activo",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPerifericos([
      ...perifericos,
      {
        id: perifericos.length + 1,
        ...newPeriferico,
      },
    ]);
    setNewPeriferico({
      descripcion: "",
      estado: "Activo",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {perifericos.map((periferico) => (
                <TableRow key={periferico.id}>
                  <TableCell>{periferico.descripcion}</TableCell>
                  <TableCell className="flex items-center">
                    {periferico.estado === "Activo" ? (
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4 text-red-500" />
                    )}
                    {periferico.estado}
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

export default Perifericos;
