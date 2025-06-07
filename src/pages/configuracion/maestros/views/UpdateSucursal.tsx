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

const UpdateSucursal = ({ open, onOpenChange, id }: UpdateProps) => {
  const { getById, newSucursal, setNewSucursal, update } = useSucursales();
  const { sedes } = useSedes();

  useEffect(() => {
    if (id !== null) {
      getById(id);
    }
  }, [id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Actualizar Sucursal</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Formulario para actualizar los datos de la sucursal seleccionada.
        </DialogDescription>
        <form className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={newSucursal.nombre}
                    onChange={(e) =>
                      setNewSucursal({ ...newSucursal, nombre: e.target.value })
                    }
                    autoComplete="off"
                    placeholder="Ingrese el nombre"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={newSucursal.tipo}
                    onValueChange={(value) =>
                      setNewSucursal({ ...newSucursal, tipo: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrativa">
                        Administrativa
                      </SelectItem>
                      <SelectItem value="Departamento">Departamento</SelectItem>
                      <SelectItem value="Ubicacion Terciaria">
                        Ubicacion Terciaria
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sedes">Sedes</Label>
                  <Select
                    value={
                      newSucursal.sede_id ? newSucursal.sede_id.toString() : ""
                    }
                    onValueChange={(value) =>
                      setNewSucursal({ ...newSucursal, sede_id: Number(value) })
                    }
                  >
                    <SelectTrigger className="w-full">
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
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={
                      newSucursal.estado === true
                        ? "Activo"
                        : newSucursal.estado === false
                        ? "Inactivo"
                        : ""
                    }
                    onValueChange={(value) =>
                      setNewSucursal({
                        ...newSucursal,
                        estado: value === "Activo" ? true : false,
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
                  update(id, newSucursal);
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

export default UpdateSucursal;
