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
import { PlusCircle, PencilIcon, XCircle, Phone, Globe } from "lucide-react";
import { useMarcas } from "../hooks/use-marcas";
import UpdateMarca from "./UpdateMarca";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { tienePermiso } from "@/utils/permissions";
import { PERMISOS_MARCAS } from "../../usuarios/interfaces/permisos";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEstado } from "../hooks/use-estado";
import { useGlobal } from "@/hooks/use-global";

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
  const { estados } = useEstado();
  const { StatusBadge } = useGlobal();
  const user = useSelector((state: RootState) => state.auth.user);
  const puedeEditarEliminar =
    tienePermiso(PERMISOS_MARCAS.edicion, user.permisos) ||
    tienePermiso(PERMISOS_MARCAS.eliminacion, user.permisos);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {tienePermiso(PERMISOS_MARCAS.ingreso, user.permisos) && (
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
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sitioWeb">Sitio Web</Label>
                <div className="relative">
                  <Globe className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="sitioWeb"
                    value={newMarca.sitioweb}
                    onChange={(e) =>
                      setNewMarca({ ...newMarca, sitioweb: e.target.value })
                    }
                    placeholder="URL del sitio web"
                    className="pl-8"
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={newMarca.estado || ""}
                  onValueChange={(value) => {
                    setNewMarca({
                      ...newMarca,
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
      )}

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
                <TableHead>Teléfono</TableHead>
                <TableHead>Sitio Web</TableHead>
                <TableHead>Estado</TableHead>
                {puedeEditarEliminar && (
                  <TableHead className="text-right">Acciones</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...marcas]
                .sort((a, b) => b.id_marca - a.id_marca)
                .map((marca) => {
                  const acciones = [
                    {
                      permiso: PERMISOS_MARCAS.edicion,
                      onClick: () => handleOpenEditModal(marca.id_marca),
                      icon: <PencilIcon className="h-5 w-5" />,
                    },
                    {
                      permiso: PERMISOS_MARCAS.eliminacion,
                      onClick: () => handleDelete(marca.id_marca),
                      icon: <XCircle className="h-5 w-5" />,
                    },
                  ];

                  return (
                    <TableRow key={marca.id_marca}>
                      <TableCell>
                        {`MAR-${marca.id_marca.toString().padStart(3, "0")}`}
                      </TableCell>
                      <TableCell>{marca.nombre}</TableCell>
                      <TableCell>{marca.telefono}</TableCell>
                      <TableCell>{marca.sitioweb}</TableCell>
                      <TableCell>
                        <StatusBadge status={marca.estado} />
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

      <UpdateMarca
        open={showEditModal}
        onOpenChange={setShowEditModal}
        id={selectedMarcaId}
      />
    </div>
  );
};

export default Marcas;
