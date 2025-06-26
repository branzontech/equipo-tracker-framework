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
import { CheckCircle, PencilIcon, PlusCircle, XCircle } from "lucide-react";
import { useSedes } from "../hooks/use-sedes";
import { useUser } from "@/pages/usuarios/hooks/use-user";
import { Checkbox } from "@radix-ui/react-checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import UpdateSede from "./UpdateSede";
import { useGlobal } from "@/hooks/use-global";
import { useEstado } from "../hooks/use-estado";

const Sedes = () => {
  const {
    sedes,
    create,
    newSede,
    setNewSede,
    handleDelete,
    setShowEditModal,
    showEditModal,
    handleOpenEditModal,
    selectedSedeId,
  } = useSedes();
  const { users } = useUser();
  const { StatusBadge } = useGlobal();
  const { estados } = useEstado();

  const usuariosDisponibles = users.filter(
    (user) => (user.usuario_sede?.length ?? 0) === 0
  );

  const responsablesSeleccionados =
    newSede.usuario_sede?.map((u) => u.usuarios) || [];

  return (
    <>
      <div className="container mx-auto p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Gestión de Sedes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4 md:grid-cols-4"
              onSubmit={(e) => {
                e.preventDefault();
                create(newSede);
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  autoComplete="off"
                  value={newSede.nombre || ""}
                  onChange={(e) => {
                    setNewSede({ ...newSede, nombre: e.target.value });
                  }}
                  placeholder="Ingrese el nombre"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsables">Responsable(s)</Label>
                <Popover>
                  <PopoverTrigger className="w-full px-3 py-2 border rounded text-left text-sm bg-white">
                    {responsablesSeleccionados.length > 0
                      ? responsablesSeleccionados
                          .map((u) => u.nombre)
                          .join(", ")
                      : "Seleccione responsables"}
                  </PopoverTrigger>

                  <PopoverContent className="w-64 bg-white border rounded shadow">
                    <div className="flex flex-col space-y-2 max-h-60 overflow-y-auto">
                      {usuariosDisponibles.length > 0 ? (
                        usuariosDisponibles.map((user) => {
                          const isChecked = responsablesSeleccionados.some(
                            (u) => u.id_usuario === user.id_usuario
                          );

                          return (
                            <div
                              key={user.id_usuario}
                              className="flex items-center justify-between space-x-2 px-2"
                            >
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`user-${user.id_usuario}`}
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    const updatedUsuarioSede = checked
                                      ? [
                                          ...(newSede.usuario_sede || []),
                                          { usuarios: user },
                                        ]
                                      : (newSede.usuario_sede || []).filter(
                                          (u) =>
                                            u.usuarios.id_usuario !==
                                            user.id_usuario
                                        );

                                    setNewSede({
                                      ...newSede,
                                      usuario_sede: updatedUsuarioSede,
                                    });
                                  }}
                                  required
                                />
                                <label
                                  htmlFor={`user-${user.id_usuario}`}
                                  className="text-sm select-none p-1.5"
                                >
                                  {user.nombre}
                                </label>
                              </div>

                              {isChecked && (
                                <CheckCircle
                                  size={18}
                                  className="text-green-500"
                                  aria-label="Seleccionado"
                                />
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-sm p-2 text-center text-muted-foreground px-2">
                          No hay usuarios disponibles
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={newSede.estado || ""}
                  onValueChange={(value) => {
                    setNewSede({ ...newSede, estado: value });
                  }}
                  required
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

              <div className="flex items-end gap-2">
                <Button type="submit" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Registrar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Sedes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Responsable(s)</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...sedes]
                  .sort((a, b) => b.id_sede - a.id_sede)
                  .map((sede) => (
                    <TableRow key={sede.id_sede}>
                      <TableCell>{sede.nombre}</TableCell>
                      <TableCell>
                        {sede.usuario_sede && sede.usuario_sede.length > 0
                          ? sede.usuario_sede
                              .map((rel) => rel.usuarios?.nombre)
                              .join(", ")
                          : "No hay usuarios"}
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center">
                          <StatusBadge status={sede.estado} />
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-slate-100"
                          onClick={() => {
                            handleOpenEditModal(sede.id_sede);
                          }}
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-slate-100"
                          onClick={() => {
                            handleDelete(sede.id_sede);
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
      </div>

      <UpdateSede
        open={showEditModal}
        onOpenChange={setShowEditModal}
        id={selectedSedeId}
      />
    </>
  );
};

export default Sedes;
