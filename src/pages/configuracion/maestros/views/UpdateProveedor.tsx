/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UpdateProps } from "../interfaces/props";
import { useEstado } from "../hooks/use-estado";
import { useProveedor } from "../hooks/use-proveedor";

const UpdateProveedor = ({ open, onOpenChange, id }: UpdateProps) => {
  const { getById, newProveedor, setNewProveedor, update } = useProveedor();
  const { estados } = useEstado();

  useEffect(() => {
    if (id !== null) {
      getById(id);
    }
  }, [id]);

  const esEmpresa = newProveedor.tipo_proveedor === "Empresa";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Actualizar Proveedor</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Formulario para actualizar los datos del proveedor seleccionado.
        </DialogDescription>

        <form
          className="grid gap-4 md:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (id !== null) update(id, newProveedor);
          }}
        >
          {/* Mostrar tipo de proveedor como texto */}
          {/* <div className="space-y-2 col-span-2">
            <Label>Tipo de Proveedor</Label>
            <Input
              value={newProveedor.tipo_proveedor}
              disabled
              className="bg-gray-100"
            />
          </div> */}

          <div className="space-y-2 col-span-2">
            <Label>{esEmpresa ? "Razón Social" : "Nombre Completo"}</Label>
            <Input
              value={newProveedor.nombre ?? ""}
              onChange={(e) =>
                setNewProveedor({ ...newProveedor, nombre: e.target.value })
              }
              placeholder={
                esEmpresa ? "Ej: Soluciones TI S.A.S." : "Ej: Laura Rodríguez"
              }
              required
              autoComplete="off"
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>{esEmpresa ? "NIT" : "Cédula"}</Label>
            <Input
              value={newProveedor.identificacion ?? ""}
              onChange={(e) =>
                setNewProveedor({
                  ...newProveedor,
                  identificacion: e.target.value.replace(/\D/g, ""),
                })
              }
              placeholder={esEmpresa ? "900123456-7" : "1023456789"}
              required
              autoComplete="off"
            />
          </div>

          {esEmpresa && (
            <div className="space-y-2">
              <Label>Persona de Contacto</Label>
              <Input
                value={newProveedor.contacto ?? ""}
                onChange={(e) =>
                  setNewProveedor({
                    ...newProveedor,
                    contacto: e.target.value,
                  })
                }
                placeholder="Ej: Carlos Pérez"
              />
            </div>
          )}

          <div className="space-y-2 col-span-2">
            <Label>Teléfono</Label>
            <Input
              value={newProveedor.telefono ?? ""}
              onChange={(e) =>
                setNewProveedor({
                  ...newProveedor,
                  telefono: e.target.value.replace(/\D/g, ""),
                })
              }
              placeholder="Ej: 3101234567"
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Correo</Label>
            <Input
              value={newProveedor.correo ?? ""}
              onChange={(e) =>
                setNewProveedor({
                  ...newProveedor,
                  correo: e.target.value,
                })
              }
              placeholder="correo@proveedor.com"
              type="email"
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Dirección</Label>
            <Input
              value={newProveedor.direccion ?? ""}
              onChange={(e) =>
                setNewProveedor({
                  ...newProveedor,
                  direccion: e.target.value,
                })
              }
              placeholder="Ej: Cra 12 #45-67, Bogotá"
            />
          </div>

          {esEmpresa && (
            <div className="space-y-2">
              <Label>Sitio Web</Label>
              <Input
                value={newProveedor.sitio_web ?? ""}
                onChange={(e) =>
                  setNewProveedor({
                    ...newProveedor,
                    sitio_web: e.target.value,
                  })
                }
                placeholder="https://proveedor.com"
                type="url"
              />
            </div>
          )}

          <div className="space-y-2 col-span-2">
            <Label>Estado</Label>
            <Select
              value={newProveedor.estado || ""}
              onValueChange={(value) => {
                setNewProveedor({
                  ...newProveedor,
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

          {/* Botón */}
          <div className="flex items-end col-span-4">
            <Button type="submit" className="w-full">
              Actualizar proveedor
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProveedor;
