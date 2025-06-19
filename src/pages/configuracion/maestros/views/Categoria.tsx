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
import { useCategoria } from "../hooks/use-categoria";
import UpdateCategoria from "./UpdateCategoria";

const Categoria = () => {
  const {
    categoria,
    newCategoria,
    setNewCategoria,
    addCategoria,
    handleDelete,
    setShowEditModal,
    showEditModal,
    handleOpenEditModal,
    selectedCategoriaId,
  } = useCategoria();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Registro de Categorias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={newCategoria.nombre}
                onChange={(e) =>
                  setNewCategoria({ ...newCategoria, nombre: e.target.value })
                }
                placeholder="Nombre de la categoria"
                required
                autoComplete="off"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full"
                onClick={(e: React.FormEvent) => {
                  e.preventDefault();
                  addCategoria(newCategoria);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Agregar Categorias
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorias</CardTitle>
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
              {[...categoria]
              .sort((a, b) => b.id_categoria - a.id_categoria)
              .map((categoria) => (
                <TableRow key={categoria.id_categoria}>
                  <TableCell>
                    {`CAT-${categoria.id_categoria
                      .toString()
                      .padStart(3, "0")}`}
                  </TableCell>
                  <TableCell>{categoria.nombre}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-slate-100"
                      onClick={() => {
                        handleOpenEditModal(categoria.id_categoria);
                      }}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-slate-100"
                      onClick={() => {
                        handleDelete(categoria.id_categoria);
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

      <UpdateCategoria
        open={showEditModal}
        onOpenChange={setShowEditModal}
        id={selectedCategoriaId}
      />
    </div>
  );
};

export default Categoria;
