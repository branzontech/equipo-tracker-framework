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
import { useSucursales } from "../hooks/use-sucursales";
import { usePeriferico } from "../hooks/use-perifierico";
import { useEquipos } from "@/pages/productos/hooks/use-equipos";
import { listTypes } from "../interfaces/periferico";

const UpdatePeriferico = ({ open, onOpenChange, id }: UpdateProps) => {
  const { getById, newPeriferico, setNewPeriferico, update } = usePeriferico();
  const { equipo } = useEquipos();

  useEffect(() => {
    if (id !== null) {
      getById(id);
    }
  }, [id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Actualizar Periferico</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Formulario para actualizar los datos del periferico seleccionado.
        </DialogDescription>
        <form className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={newPeriferico.nombre}
                    onChange={(e) =>
                      setNewPeriferico({
                        ...newPeriferico,
                        nombre: e.target.value,
                      })
                    }
                    autoComplete="off"
                    placeholder="Ingrese el nombre"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={
                      newPeriferico.estado === "Activo"
                        ? "Activo"
                        : newPeriferico.estado === "Inactivo"
                        ? "Inactivo"
                        : ""
                    }
                    onValueChange={(value) =>
                      setNewPeriferico({ ...newPeriferico, estado: value })
                    }
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

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select
                    value={newPeriferico.tipo}
                    onValueChange={(value: string) =>
                      setNewPeriferico({ ...newPeriferico, tipo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {listTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sedes">Sedes</Label>
                  <Select
                    value={
                      newPeriferico.equipo_asociado_id
                        ? newPeriferico.equipo_asociado_id.toString()
                        : ""
                    }
                    onValueChange={(value) =>
                      setNewPeriferico({
                        ...newPeriferico,
                        equipo_asociado_id: Number(value),
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione la sede" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipo.map((equipo) => (
                        <SelectItem
                          key={equipo.id_equipo}
                          value={equipo.id_equipo.toString()}
                        >
                          {equipo.nombre_equipo}
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
                  update(id, newPeriferico);
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

export default UpdatePeriferico;
