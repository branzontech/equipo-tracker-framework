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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PencilIcon, PlusCircle, XCircle } from "lucide-react";
import { set } from "date-fns";
import { useTipos } from "../hooks/use-tipos";

const Tipos = () => {
  const { tipos, newTipo, setNewTipo, addTipo } = useTipos();
  console.log("tipos", tipos);

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Gestión Tipos de Activos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-4"
            onSubmit={(e: React.FormEvent) => {
              e.preventDefault();
              addTipo(newTipo);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="descripcion"
                value={newTipo.nombre_tipo}
                onChange={(e) =>
                  setNewTipo({ ...newTipo, nombre_tipo: e.target.value })
                }
                placeholder="Ingrese el nombre del tipo"
                required
                autoComplete="off"  
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Agregar Tipo
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tipos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID° Tipo</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tipos.length > 0 ? (
                tipos.map((tipo) => (
                  <TableRow key={tipo.id_tipo}>
                    <TableCell>{`TIP-${tipo.id_tipo
                      .toString()
                      .padStart(3, "0")}`}</TableCell>
                    <TableCell>{tipo.nombre_tipo}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-slate-100"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-slate-100"
                      >
                        <XCircle className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No hay tipos registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tipos;
