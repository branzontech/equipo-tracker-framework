/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckCircle, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSedes } from "../hooks/use-sedes";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Checkbox } from "@radix-ui/react-checkbox";
import { useUser } from "@/pages/usuarios/hooks/use-user";
import { DialogDescription } from "@radix-ui/react-dialog";
import { UpdateProps } from "../interfaces/props";

const UpdateSede = ({ open, onOpenChange, id }: UpdateProps) => {
  const { getById, newSede, setNewSede, update } = useSedes();
  const { users } = useUser();

  useEffect(() => {
    if (id !== null) {
      getById(id);
    }
  }, [id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Actualizar Sede</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Formulario para actualizar los datos de la sede seleccionada.
        </DialogDescription>
        <form className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={newSede.nombre}
                    onChange={(e) =>
                      setNewSede({ ...newSede, nombre: e.target.value })
                    }
                    autoComplete="off"
                    placeholder="Ingrese el nombre"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="regional">Regional</Label>
                  <Input
                    id="regional"
                    value={newSede.regional}
                    onChange={(e) =>
                      setNewSede({ ...newSede, regional: e.target.value })
                    }
                    autoComplete="off"
                    placeholder="Ingrese la regional"
                    required
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
                        {users.map((user) => {
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
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={newSede.estado}
                    onValueChange={(value) =>
                      setNewSede({
                        ...newSede,
                        estado: value,
                      })
                    }
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
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#040d50] hover:bg-[#0a1668]"
              onClick={(e: React.FormEvent) => {
                e.preventDefault();
                if (id !== null) {
                  update(id, newSede);
                }
              }}
            >
              Actualizar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSede;
