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
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { tienePermiso } from "@/utils/permissions";
import { PERMISOS_CATEGORIAS } from "../../usuarios/interfaces/permisos";
import { useEstado } from "../hooks/use-estado";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobal } from "@/hooks/use-global";

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
  const { estados } = useEstado();
  const { StatusBadge } = useGlobal();
  const user = useSelector((state: RootState) => state.auth.user);
  const puedeEditarEliminar =
    tienePermiso(PERMISOS_CATEGORIAS.edicion, user.permisos) ||
    tienePermiso(PERMISOS_CATEGORIAS.eliminacion, user.permisos);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {tienePermiso(PERMISOS_CATEGORIAS.ingreso, user.permisos) && (
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
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={newCategoria.estado || ""}
                  onValueChange={(value) => {
                    setNewCategoria({
                      ...newCategoria,
                      estado: value,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estados.map((estado) => (
                      <SelectItem
                        key={estado.id_estado}
                        value={estado.nombre_estado}
                      >
                        {estado.nombre_estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
      )}

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
                <TableHead>Estado</TableHead>
                {puedeEditarEliminar && (
                  <TableHead className="text-right">Acciones</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...categoria]
                .sort((a, b) => b.id_categoria - a.id_categoria)
                .map((categoria) => {
                  const acciones = [
                    {
                      permiso: PERMISOS_CATEGORIAS.edicion,
                      onClick: () =>
                        handleOpenEditModal(categoria.id_categoria),
                      icon: <PencilIcon className="h-5 w-5" />,
                    },
                    {
                      permiso: PERMISOS_CATEGORIAS.eliminacion,
                      onClick: () => handleDelete(categoria.id_categoria),
                      icon: <XCircle className="h-5 w-5" />,
                    },
                  ];
                  return (
                    <TableRow key={categoria.id_categoria}>
                      <TableCell>
                        {`CAT-${categoria.id_categoria
                          .toString()
                          .padStart(3, "0")}`}
                      </TableCell>
                      <TableCell>{categoria.nombre}</TableCell>
                      <TableCell>
                        <StatusBadge status={categoria.estado} />
                      </TableCell>
                      {puedeEditarEliminar && (
                        <TableCell className="text-right">
                          {acciones.map(
                            (accion, idx) =>
                              tienePermiso(accion.permiso, user.permisos) && (
                                <Button
                                  key={idx}
                                  variant="ghost"
                                  size="icon"
                                  className="hover:bg-slate-100"
                                  onClick={accion.onClick}
                                >
                                  {accion.icon}
                                </Button>
                              )
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
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
