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
import { EstadoType } from "../interfaces/sedes";
import UpdateSede from "./UpdateSede";

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

  const usuariosDisponibles = users.filter((user) => user.sede_id === null);

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
              className="grid gap-4 md:grid-cols-5"
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
                <Label htmlFor="regional">Regional</Label>
                <Input
                  id="regional"
                  autoComplete="off"
                  value={newSede.regional || ""}
                  onChange={(e) => {
                    setNewSede({ ...newSede, regional: e.target.value });
                  }}
                  placeholder="Ingrese la regional"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsables">Responsable(s)</Label>
                <Popover>
                  <PopoverTrigger className="w-full px-3 py-2 border rounded text-left text-sm bg-white">
                    {newSede.usuarios?.length > 0
                      ? newSede.usuarios.map((u) => u.nombre).join(", ")
                      : "Seleccione responsables"}
                  </PopoverTrigger>

                  <PopoverContent className="w-64 bg-white border rounded shadow">
                    <div className="flex flex-col space-y-2 max-h-60 overflow-y-auto">
                      {usuariosDisponibles.length > 0 ? (
                        usuariosDisponibles.map((user) => {
                          const isChecked = newSede.usuarios?.some(
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
                                    const updatedUsuarios = checked
                                      ? [...(newSede.usuarios || []), user]
                                      : (newSede.usuarios || []).filter(
                                          (u) =>
                                            u.id_usuario !== user.id_usuario
                                        );
                                    setNewSede({
                                      ...newSede,
                                      usuarios: updatedUsuarios,
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
                  value={
                    newSede.estado === true
                      ? "Activo"
                      : newSede.estado === false
                      ? "Inactivo"
                      : ""
                  }
                  onValueChange={(value: EstadoType) => {
                    setNewSede({ ...newSede, estado: value === "Activo" });
                  }}
                  required
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
                  <TableHead>Regional</TableHead>
                  <TableHead>Responsable(s)</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sedes.map((sede) => (
                  <TableRow key={sede.id_sede}>
                    <TableCell>{sede.nombre}</TableCell>
                    <TableCell>{sede.regional}</TableCell>
                    <TableCell>
                      {sede.usuarios.length > 0
                        ? sede.usuarios
                            .map((usuario) => usuario.nombre)
                            .join(", ")
                        : "No hay usuarios"}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center">
                        {sede.estado === true ? (
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="mr-2 h-4 w-4 text-red-500" />
                        )}
                        {sede.estado ? "Activo" : "Inactivo"}
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
