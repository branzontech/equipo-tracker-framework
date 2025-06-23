/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { UpdateProps } from "../interfaces/props";
import { usePeriferico } from "../hooks/use-perifierico";
import { useEquipos } from "@/pages/productos/hooks/use-equipos";
import { useEstado } from "../hooks/use-estado";
import { useMarcas } from "../hooks/use-marcas";
import { useTipos } from "../hooks/use-tipos";
import { useSedes } from "../hooks/use-sedes";

const UpdatePeriferico = ({ open, onOpenChange, id }: UpdateProps) => {
  const { getById, newPeriferico, setNewPeriferico, update } = usePeriferico();
  const { equipo } = useEquipos();
  const { estados } = useEstado();
  const { marcas } = useMarcas();
  const { sedes } = useSedes();
  const { tipos } = useTipos();
  
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
                  <Label htmlFor="serial">Serial</Label>
                  <Input
                    id="serial"
                    value={newPeriferico.serial}
                    onChange={(e) =>
                      setNewPeriferico({
                        ...newPeriferico,
                        serial: e.target.value,
                      })
                    }
                    placeholder="Serial del periférico"
                    autoComplete="off"
                  />
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
                      {tipos.map((type) => (
                        <SelectItem key={type.id_tipo} value={type.nombre_tipo}>
                          {type.nombre_tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id_sede">Sede</Label>
                  <Select
                    value={
                      newPeriferico.id_sede
                        ? newPeriferico.id_sede.toString()
                        : ""
                    }
                    onValueChange={(value: string) =>
                      setNewPeriferico({
                        ...newPeriferico,
                        id_sede: Number(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione la sede" />
                    </SelectTrigger>
                    <SelectContent>
                      {sedes.map((sede) => (
                        <SelectItem
                          key={sede.id_sede}
                          value={sede.id_sede.toString()}
                        >
                          {sede.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marca_id">Marca</Label>
                  <Select
                    value={
                      newPeriferico.marca_id
                        ? newPeriferico.marca_id.toString()
                        : ""
                    }
                    onValueChange={(value: string) =>
                      setNewPeriferico({
                        ...newPeriferico,
                        marca_id: Number(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione la marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {marcas.map((marca) => (
                        <SelectItem
                          key={marca.id_marca}
                          value={marca.id_marca.toString()}
                        >
                          {marca.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equipo_asociado">Equipo Asociado</Label>
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
                      <SelectValue placeholder="Seleccione el equipo asociado" />
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

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={newPeriferico.estado}
                    onValueChange={(value) =>
                      setNewPeriferico({ ...newPeriferico, estado: value })
                    }
                    disabled={
                      newPeriferico.estado !== "Activo" &&
                      newPeriferico.estado !== "Inactivo"
                    }
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
