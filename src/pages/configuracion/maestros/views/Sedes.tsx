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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, PlusCircle, XCircle } from "lucide-react";
import { useSedes } from "../hooks/use-sedes";

type EstadoType = "Activo" | "Inactivo";

const Sedes = () => {
  const { sedes, setSedes, create, newSede, setNewSede } = useSedes();
  console.log(sedes);

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Gestión de Sedes</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                value={newSede.descripcion || ""}
                onChange={(e) => {
                  setNewSede({ ...newSede, descripcion: e.target.value });
                }}
                placeholder="Ingrese la descripción"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsables">Responsable(s)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione responsables" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Usuario 1</SelectItem>
                  <SelectItem value="2">Usuario 2</SelectItem>
                  <SelectItem value="3">Usuario 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={
                  newSede.estado === true
                    ? "Activo"
                    : newSede.estado === false
                    ? "Inactivo"
                    : ""
                }
                onValueChange={(value: EstadoType) => {
                  setNewSede({ ...newSede, estado: value === "Activo" });
                }}
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
                <TableRow key={sede.id_sede}>
                  <TableCell>{sede.descripcion}</TableCell>
                  <TableCell>
                    {sede.usuarios.length > 0
                      ? sede.usuarios
                          .map((usuario) => usuario.nombre)
                          .join(", ")
                      : "No hay usuarios"}
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center">
                      {sede.estado === true ? (
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="mr-2 h-4 w-4 text-red-500" />
                      )}
                      {sede.estado ? "Activo" : "Inactivo"}
                    </span>
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

export default Sedes;
