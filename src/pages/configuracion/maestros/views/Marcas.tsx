import React from "react";
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
import { PlusCircle, Globe, Phone, PencilIcon, XCircle } from "lucide-react";
import { useMarcas } from "../hooks/use-marcas";
import UpdateMarca from "./UpdateMarca";

const Marcas = () => {
  const {
    marcas,
    newMarca,
    setNewMarca,
    addMarca,
    handleDelete,
    setShowEditModal,
    showEditModal,
    handleOpenEditModal,
    selectedMarcaId,
  } = useMarcas();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Registro de Marcas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={newMarca.nombre}
                onChange={(e) =>
                  setNewMarca({ ...newMarca, nombre: e.target.value })
                }
                placeholder="Nombre de la marca"
                required
                autoComplete="off"
              />
            </div>
            {/* <div className="space-y-2">
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
            </div> */}
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full"
                onClick={(e: React.FormEvent) => {
                  e.preventDefault();
                  addMarca(newMarca);
                }}
              >
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
                <TableHead>N° Id</TableHead>
                <TableHead>Nombre</TableHead>
                {/* <TableHead>Teléfono</TableHead>
                <TableHead>Sitio Web</TableHead> */}
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marcas.map((marca) => (
                <TableRow key={marca.id_marca}>
                  <TableCell>
                    {`MAR-${marca.id_marca.toString().padStart(3, "0")}`}
                  </TableCell>
                  <TableCell>{marca.nombre}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-slate-100"
                      onClick={() => {
                        handleOpenEditModal(marca.id_marca);
                      }}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-slate-100"
                      onClick={() => {
                        handleDelete(marca.id_marca);
                      }}
                    >
                      <XCircle className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <UpdateMarca
        open={showEditModal}
        onOpenChange={setShowEditModal}
        id={selectedMarcaId}
      />
    </div>
  );
};

export default Marcas;
