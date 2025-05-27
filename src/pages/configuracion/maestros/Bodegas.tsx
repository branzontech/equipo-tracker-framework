
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
import { PlusCircle } from "lucide-react";
import { Bodega } from "@/pages/configuracion/maestros/interfaces/bodegas";

type EstadoType = "Activo" | "Inactivo";

const Bodegas = () => {
  const [bodegas, setBodegas] = useState<Bodega[]>([
    {
      id: 1,
      descripcion: "Bodega Principal",
      responsables: "Carlos Ruiz, Ana Martínez",
      estado: "Activo",
    },
  ]);

  const [newBodega, setNewBodega] = useState<{
    descripcion: string;
    responsables: string;
    estado: EstadoType;
  }>({
    descripcion: "",
    responsables: "",
    estado: "Activo",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBodegas([
      ...bodegas,
      {
        id: bodegas.length + 1,
        ...newBodega,
      },
    ]);
    setNewBodega({
      descripcion: "",
      responsables: "",
      estado: "Activo",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Gestión de Bodegas</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                value={newBodega.descripcion}
                onChange={(e) =>
                  setNewBodega({ ...newBodega, descripcion: e.target.value })
                }
                placeholder="Ingrese la descripción"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsables">Responsable(s)</Label>
              <Input
                id="responsables"
                value={newBodega.responsables}
                onChange={(e) =>
                  setNewBodega({ ...newBodega, responsables: e.target.value })
                }
                placeholder="Ingrese los responsables"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={newBodega.estado}
                onValueChange={(value: EstadoType) =>
                  setNewBodega({ ...newBodega, estado: value })
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
                Agregar Bodega
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Bodegas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Responsable(s)</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bodegas.map((bodega) => (
                <TableRow key={bodega.id}>
                  <TableCell>{bodega.descripcion}</TableCell>
                  <TableCell>{bodega.responsables}</TableCell>
                  <TableCell>{bodega.estado}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Bodegas;
