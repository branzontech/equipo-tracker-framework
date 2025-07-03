/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { UpdateProps } from "../interfaces/props";
import { useMarcas } from "../hooks/use-marcas";
import { useEstado } from "../hooks/use-estado";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const UpdateMarca = ({ open, onOpenChange, id }: UpdateProps) => {
  const { getById, newMarca, setNewMarca, update } = useMarcas();
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
          <DialogTitle>Actualizar Marca</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Formulario para actualizar los datos de la marca seleccionada.
        </DialogDescription>
        <form className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={newMarca.nombre}
                    onChange={(e) =>
                      setNewMarca({ ...newMarca, nombre: e.target.value })
                    }
                    autoComplete="off"
                    placeholder="Ingrese el nombre"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={newMarca.telefono}
                    onChange={(e) =>
                      setNewMarca({ ...newMarca, telefono: e.target.value })
                    }
                    placeholder="Ingrese el teléfono"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sitioWeb">Sitio Web</Label>
                  <Input
                    id="sitioWeb"
                    value={newMarca.sitioweb}
                    onChange={(e) =>
                      setNewMarca({ ...newMarca, sitioweb: e.target.value })
                    }
                    placeholder="Ingrese el sitio web"
                    required
                  />
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
                  update(id, newMarca);
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

export default UpdateMarca;
