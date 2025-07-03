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
import { useEstado } from "../hooks/use-estado";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UpdateEstado = ({ open, onOpenChange, id }: UpdateProps) => {
  const { newEstado, setNewEstado, getById, update } = useEstado();

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
                    value={newEstado.nombre_estado}
                    onChange={(e) =>
                      setNewEstado({
                        ...newEstado,
                        nombre_estado: e.target.value,
                      })
                    }
                    autoComplete="off"
                    placeholder="Ingrese el nombre"
                    required
                  />
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
                  update(id, newEstado);
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

export default UpdateEstado;
