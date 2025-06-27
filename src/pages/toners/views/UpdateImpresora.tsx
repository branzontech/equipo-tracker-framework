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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { Checkbox } from "@radix-ui/react-checkbox";
import { useUser } from "@/pages/usuarios/hooks/use-user";
import { DialogDescription } from "@radix-ui/react-dialog";
import { UpdateProps } from "@/pages/configuracion/maestros/interfaces/props";
import { useImpresora } from "../hooks/use-impresora";
import { useSucursales } from "@/pages/configuracion/maestros/hooks/use-sucursales";
import { useMarcas } from "@/pages/configuracion/maestros/hooks/use-marcas";
import { useEstado } from "@/pages/configuracion/maestros/hooks/use-estado";

const UpdateImpresora = ({ open, onOpenChange, id }: UpdateProps) => {
  const { getById, newImpresora, setNewImpresora, update } = useImpresora();
  const { sucursales } = useSucursales();
  const { marcas } = useMarcas();
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
          <DialogTitle>Actualizar Impresora</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Formulario para actualizar los datos de la impresora seleccionada.
        </DialogDescription>
        <form className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={newImpresora.nombre}
                    onChange={(e) =>
                      setNewImpresora({
                        ...newImpresora,
                        nombre: e.target.value,
                      })
                    }
                    autoComplete="off"
                    placeholder="Ingrese el nombre"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serial">N° Serie</Label>
                  <Input
                    id="serial"
                    value={newImpresora.serial}
                    onChange={(e) =>
                      setNewImpresora({
                        ...newImpresora,
                        serial: e.target.value,
                      })
                    }
                    autoComplete="off"
                    placeholder="Ingrese el número de serie"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modelo">Modelo</Label>
                  <Input
                    id="modelo"
                    value={newImpresora.modelo}
                    onChange={(e) =>
                      setNewImpresora({
                        ...newImpresora,
                        modelo: e.target.value,
                      })
                    }
                    autoComplete="off"
                    placeholder="Ingrese el modelo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sucursales">Sucursal</Label>
                  <Select
                    value={
                      newImpresora.sucursal_id
                        ? newImpresora.sucursal_id.toString()
                        : ""
                    }
                    onValueChange={(value) =>
                      setNewImpresora({
                        ...newImpresora,
                        sucursal_id: Number(value),
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione la sucursal" />
                    </SelectTrigger>
                    <SelectContent>
                      {sucursales.map((sucursales) => (
                        <SelectItem
                          key={sucursales.id_sucursal}
                          value={sucursales.id_sucursal.toString()}
                        >
                          {sucursales.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marcas">Marca</Label>
                  <Select
                    value={
                      newImpresora.marca_id
                        ? newImpresora.marca_id.toString()
                        : ""
                    }
                    onValueChange={(value) =>
                      setNewImpresora({
                        ...newImpresora,
                        marca_id: Number(value),
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
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
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={newImpresora.estado}
                    onValueChange={(value) =>
                      setNewImpresora({
                        ...newImpresora,
                        estado: value,
                      })
                    }
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
                  update(id, newImpresora);
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

export default UpdateImpresora;
