
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Globe, Phone } from "lucide-react";
import { Marca } from "@/pages/configuracion/maestros/interfaces/marcas";

const Marcas = () => {
  const [marcas, setMarcas] = useState<Marca[]>([
    {
      id: 1,
      descripcion: "HP",
      telefono: "123-456-7890",
      sitioWeb: "https://www.hp.com",
    },
  ]);

  const [newMarca, setNewMarca] = useState<Omit<Marca, "id">>({
    descripcion: "",
    telefono: "",
    sitioWeb: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMarcas([
      ...marcas,
      {
        id: marcas.length + 1,
        ...newMarca,
      },
    ]);
    setNewMarca({
      descripcion: "",
      telefono: "",
      sitioWeb: "",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Registro de Marcas</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                value={newMarca.descripcion}
                onChange={(e) =>
                  setNewMarca({ ...newMarca, descripcion: e.target.value })
                }
                placeholder="Nombre de la marca"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="telefono"
                  value={newMarca.telefono}
                  onChange={(e) =>
                    setNewMarca({ ...newMarca, telefono: e.target.value })
                  }
                  placeholder="Número de contacto"
                  className="pl-8"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sitioWeb">Sitio Web</Label>
              <div className="relative">
                <Globe className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="sitioWeb"
                  value={newMarca.sitioWeb}
                  onChange={(e) =>
                    setNewMarca({ ...newMarca, sitioWeb: e.target.value })
                  }
                  placeholder="URL del sitio web"
                  className="pl-8"
                  required
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Agregar Marca
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Marcas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Sitio Web</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marcas.map((marca) => (
                <TableRow key={marca.id}>
                  <TableCell>{marca.descripcion}</TableCell>
                  <TableCell>
                    <span className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      {marca.telefono}
                    </span>
                  </TableCell>
                  <TableCell>
                    <a 
                      href={marca.sitioWeb} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center hover:underline"
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      {marca.sitioWeb}
                    </a>
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

export default Marcas;
