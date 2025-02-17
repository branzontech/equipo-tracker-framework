
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
import { PlusCircle, Globe, Phone, CheckCircle, XCircle } from "lucide-react";

interface Periferico {
  id: number;
  descripcion: string;
  estado: "Activo" | "Inactivo";
}

interface Marca {
  id: number;
  descripcion: string;
  telefono: string;
  sitioWeb: string;
  perifericos: Periferico[];
}

type EstadoType = "Activo" | "Inactivo";

const Marcas = () => {
  const [marcas, setMarcas] = useState<Marca[]>([
    {
      id: 1,
      descripcion: "HP",
      telefono: "123-456-7890",
      sitioWeb: "https://www.hp.com",
      perifericos: [
        { id: 1, descripcion: "Teclado Mecánico", estado: "Activo" },
        { id: 2, descripcion: "Mouse Inalámbrico", estado: "Activo" },
      ],
    },
  ]);

  const [newMarca, setNewMarca] = useState<Omit<Marca, "id" | "perifericos">>({
    descripcion: "",
    telefono: "",
    sitioWeb: "",
  });

  const [newPeriferico, setNewPeriferico] = useState<Omit<Periferico, "id">>({
    descripcion: "",
    estado: "Activo",
  });

  const [selectedMarcaId, setSelectedMarcaId] = useState<number | null>(null);

  const handleSubmitMarca = (e: React.FormEvent) => {
    e.preventDefault();
    setMarcas([
      ...marcas,
      {
        id: marcas.length + 1,
        ...newMarca,
        perifericos: [],
      },
    ]);
    setNewMarca({
      descripcion: "",
      telefono: "",
      sitioWeb: "",
    });
  };

  const handleSubmitPeriferico = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMarcaId) return;

    setMarcas(marcas.map(marca => {
      if (marca.id === selectedMarcaId) {
        return {
          ...marca,
          perifericos: [
            ...marca.perifericos,
            {
              id: marca.perifericos.length + 1,
              ...newPeriferico,
            },
          ],
        };
      }
      return marca;
    }));

    setNewPeriferico({
      descripcion: "",
      estado: "Activo",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Registro de Marcas</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitMarca} className="grid gap-4 md:grid-cols-4">
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

      {marcas.map((marca) => (
        <Card key={marca.id} className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">
              {marca.descripcion}
              <div className="flex gap-4 mt-2 text-sm font-normal text-muted-foreground">
                <span className="flex items-center">
                  <Phone className="mr-2 h-4 w-4" /> {marca.telefono}
                </span>
                <span className="flex items-center">
                  <Globe className="mr-2 h-4 w-4" />
                  <a href={marca.sitioWeb} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {marca.sitioWeb}
                  </a>
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <form onSubmit={handleSubmitPeriferico} className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor={`periferico-${marca.id}`}>Periférico</Label>
                  <Input
                    id={`periferico-${marca.id}`}
                    value={newPeriferico.descripcion}
                    onChange={(e) =>
                      setNewPeriferico({ ...newPeriferico, descripcion: e.target.value })
                    }
                    placeholder="Descripción del periférico"
                    onClick={() => setSelectedMarcaId(marca.id)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`estado-${marca.id}`}>Estado</Label>
                  <Select
                    value={newPeriferico.estado}
                    onValueChange={(value: EstadoType) => {
                      setNewPeriferico({ ...newPeriferico, estado: value });
                      setSelectedMarcaId(marca.id);
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
                    Agregar Periférico
                  </Button>
                </div>
              </form>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marca.perifericos.map((periferico) => (
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
      ))}
    </div>
  );
};

export default Marcas;
