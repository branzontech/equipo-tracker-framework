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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDownIcon, PlusCircle } from "lucide-react";
import { Ubicacion } from "../interfaces/ubicaciones";
import { SelectIcon } from "@radix-ui/react-select";
import { useSedes } from "../hooks/use-sedes";

const Ubicaciones = () => {
  const { sedes } = useSedes();
  const [bodegas, setBodegas] = useState<Ubicacion[]>([
    {
      id: 1,
      nombre: "Bodega Principal",
      sede_id: 1,
      tipo: "Bodega Principal",
    },
  ]);

  const [newBodega, setNewBodega] = useState<{
    nombre: string;
    tipo: string;
    sede_id: string;
  }>({
    nombre: "",
    tipo: "",
    sede_id: "",
  });

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Gestión de Ubicaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="descripcion">Nombre</Label>
              <Input
                value={newBodega.nombre}
                onChange={(e) =>
                  setNewBodega({ ...newBodega, nombre: e.target.value })
                }
                placeholder="Ingrese el nombre"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsables">Tipo</Label>
              <Select
                value={newBodega.tipo}
                onValueChange={(value) =>
                  setNewBodega({ ...newBodega, tipo: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bodega Principal">
                    Bodega Principal
                  </SelectItem>
                  <SelectItem value="Bodega Secundaria">
                    Bodega Secundaria
                  </SelectItem>
                  <SelectItem value="Bodega Terciaria">
                    Bodega Terciaria
                  </SelectItem>
                  <SelectItem value="Bodega Cuarta">Bodega Cuarta</SelectItem>
                  <SelectItem value="Bodega Quinta">Bodega Quinta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sedes">Sedes</Label>
              <Select
                value={newBodega.sede_id}
                onValueChange={(value) =>
                  setNewBodega({ ...newBodega, sede_id: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione el tipo" />
                </SelectTrigger>
                <SelectContent>
                  {sedes.map((sede) => (
                    <SelectItem key={sede.id_sede} value={sede.descripcion}>
                      {sede.descripcion}
                    </SelectItem>
                  ))}
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
          <CardTitle>Lista de Ubicaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Sede</TableHead>
                <TableHead>Tipo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bodegas.map((bodega) => (
                <TableRow key={bodega.id}>
                  <TableCell>{bodega.nombre}</TableCell>
                  <TableCell>{bodega.sede_id}</TableCell>
                  <TableCell>{bodega.tipo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Ubicaciones;
