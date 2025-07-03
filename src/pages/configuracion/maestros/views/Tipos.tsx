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
import { useTipos } from "../hooks/use-tipos";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { PERMISOS_TIPOS } from "../../usuarios/interfaces/permisos";
import { tienePermiso } from "@/utils/permissions";
import { useEstado } from "../hooks/use-estado";
import { useGlobal } from "@/hooks/use-global";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UpdateTipo from "./UpdateTipos";

const Tipos = () => {
  const {
    tipos,
    newTipo,
    setNewTipo,
    addTipo,
    handleDelete,
    handleOpenEditModal,
    showEditModal,
    selectedTipoId,
    setShowEditModal,
  } = useTipos();
  const { estados } = useEstado();
  const { StatusBadge } = useGlobal();
  const user = useSelector((state: RootState) => state.auth.user);

  const puedeEditarEliminar =
    tienePermiso(PERMISOS_TIPOS.edicion, user.permisos) ||
    tienePermiso(PERMISOS_TIPOS.eliminacion, user.permisos);

  return (
    <div className="container mx-auto p-6">
      {tienePermiso(PERMISOS_TIPOS.ingreso, user.permisos) && (
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

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Select
                  value={newTipo.estado || ""}
                  onValueChange={(value) => {
                    setNewTipo({
                      ...newTipo,
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
                <Button type="submit" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Agregar Tipo
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

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
                <TableHead>Estado</TableHead>
                {puedeEditarEliminar && (
                  <TableHead className="text-right">Acciones</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tipos.length > 0 ? (
                tipos.map((tipo) => {
                  const acciones = [
                    {
                      permiso: PERMISOS_TIPOS.edicion,
                      onClick: () => handleOpenEditModal(tipo.id_tipo),
                      icon: <PencilIcon className="h-5 w-5" />,
                    },
                    {
                      permiso: PERMISOS_TIPOS.eliminacion,
                      onClick: () => handleDelete(tipo.id_tipo),
                      icon: <XCircle className="h-5 w-5" />,
                    },
                  ];

                  return (
                    <TableRow key={tipo.id_tipo}>
                      <TableCell>{`TIP-${tipo.id_tipo
                        .toString()
                        .padStart(3, "0")}`}</TableCell>
                      <TableCell>{tipo.nombre_tipo}</TableCell>
                      <TableCell>
                        <StatusBadge status={tipo.estado} />
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
                })
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

      <UpdateTipo
        open={showEditModal}
        onOpenChange={setShowEditModal}
        id={selectedTipoId}
      />
    </div>
  );
};

export default Tipos;
