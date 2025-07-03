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
import { useEstado } from "../hooks/use-estado";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { tienePermiso } from "@/utils/permissions";
import { PERMISOS_ESTADOS } from "../../usuarios/interfaces/permisos";
import UpdateEstado from "./UpdateEstados";

const Estados = () => {
  const {
    estados,
    newEstado,
    setNewEstado,
    addEstado,
    handleOpenEditModal,
    showEditModal,
    selectedEstadoId,
    setShowEditModal,
  } = useEstado();
  const user = useSelector((state: RootState) => state.auth.user);
  const puedeEditarEliminar =
    tienePermiso(PERMISOS_ESTADOS.edicion, user.permisos) ||
    tienePermiso(PERMISOS_ESTADOS.eliminacion, user.permisos);

  return (
    <div className="container mx-auto p-6">
      {tienePermiso(PERMISOS_ESTADOS.ingreso, user.permisos) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Gestión de Estados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4 md:grid-cols-4"
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                addEstado(newEstado);
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={newEstado.nombre_estado}
                  onChange={(e) =>
                    setNewEstado({
                      ...newEstado,
                      nombre_estado: e.target.value,
                    })
                  }
                  placeholder="Ingrese el nombre del tipo"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Agregar Estado
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Estados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID° Estado</TableHead>
                <TableHead>Nombre</TableHead>
                {puedeEditarEliminar && (
                  <TableHead className="text-right">Acciones</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {estados.length > 0 ? (
                estados.map((tipo) => {
                  const acciones = [
                    {
                      permiso: PERMISOS_ESTADOS.edicion,
                      onClick: () => handleOpenEditModal(tipo.id_estado),
                      icon: <PencilIcon className="h-5 w-5" />,
                    },
                    {
                      permiso: PERMISOS_ESTADOS.eliminacion,
                      onClick: () => console.log("eliminar"),
                      icon: <XCircle className="h-5 w-5" />,
                    },
                  ];

                  return (
                    <TableRow key={tipo.id_estado}>
                      <TableCell>{`TIP-${tipo.id_estado
                        .toString()
                        .padStart(3, "0")}`}</TableCell>
                      <TableCell>{tipo.nombre_estado}</TableCell>
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
                    No hay estados registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <UpdateEstado
        open={showEditModal}
        onOpenChange={setShowEditModal}
        id={selectedEstadoId}
      />
    </div>
  );
};

export default Estados;
