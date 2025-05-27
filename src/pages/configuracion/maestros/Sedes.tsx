
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
import { Sede } from "@/pages/configuracion/maestros/interfaces/sedes";

type EstadoType = "Activo" | "Inactivo";

const Sedes = () => {
  const [sedes, setSedes] = useState<Sede[]>([
    {
      id: 1,
      descripcion: "Sede Principal",
      responsables: "Juan Pérez, María González",
      estado: "Activo",
    },
  ]);

  const [newSede, setNewSede] = useState<{
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
    setSedes([
      ...sedes,
      {
        id: sedes.length + 1,
        ...newSede,
      },
    ]);
    setNewSede({
      descripcion: "",
      responsables: "",
      estado: "Activo",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Gestión de Sedes</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                value={newSede.descripcion}
                onChange={(e) =>
                  setNewSede({ ...newSede, descripcion: e.target.value })
                }
                placeholder="Ingrese la descripción"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsables">Responsable(s)</Label>
              <Input
                id="responsables"
                value={newSede.responsables}
                onChange={(e) =>
                  setNewSede({ ...newSede, responsables: e.target.value })
                }
                placeholder="Ingrese los responsables"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={newSede.estado}
                onValueChange={(value: EstadoType) =>
                  setNewSede({ ...newSede, estado: value })
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
                Agregar Sede
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Sedes</CardTitle>
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
              {sedes.map((sede) => (
                <TableRow key={sede.id}>
                  <TableCell>{sede.descripcion}</TableCell>
                  <TableCell>{sede.responsables}</TableCell>
                  <TableCell>{sede.estado}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sedes;
