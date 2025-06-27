/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { UpdateProps } from "../interfaces/props";
import { usePerfilesAcceso } from "../hooks/use-perfiles-acceso";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEstado } from "../hooks/use-estado";

const UpdatePerfil = ({ open, onOpenChange, id }: UpdateProps) => {
  const { getById, newPerfilAcceso, setNewPerfilAcceso, update } =
    usePerfilesAcceso();
  const { estados } = useEstado();

  useEffect(() => {
    if (id !== null) {
      getById(id);
    }
  }, [id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Actualizar Perfil de Acceso</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Formulario para actualizar los datos del perfil seleccionada.
        </DialogDescription>
        <form className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Select
                    value={newPerfilAcceso.nombre_perfil}
                    onValueChange={(value) =>
                      setNewPerfilAcceso({
                        ...newPerfilAcceso,
                        nombre_perfil: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar nombre del perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrador">
                        Administrador
                      </SelectItem>
                      <SelectItem value="Agente">Agente</SelectItem>
                      <SelectItem value="Auditor">Auditor</SelectItem>
                      <SelectItem value="Cliente">Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={newPerfilAcceso.descripcion}
                    onChange={(e) =>
                      setNewPerfilAcceso({
                        ...newPerfilAcceso,
                        descripcion: e.target.value,
                      })
                    }
                    autoComplete="off"
                    placeholder="Ingrese la descripción del perfil"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={newPerfilAcceso.estado || ""}
                    onValueChange={(value) =>
                      setNewPerfilAcceso({
                        ...newPerfilAcceso,
                        estado: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
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
                  update(id, newPerfilAcceso);
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

export default UpdatePerfil;
