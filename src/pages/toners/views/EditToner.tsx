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
import { useToners } from "../hooks/use-toners";
import Loading from "@/components/Loading";

const UpdateToner = ({ open, onOpenChange, id }: UpdateProps) => {
  const { getById, newToner, setNewToner, update, isLoading, setIsLoading } =
    useToners();
  const { impresora } = useImpresora();
  const { estados } = useEstado();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getById(id);
      setIsLoading(false);
    };

    if (id && open) {
      fetchData();
    }
  }, [id, open]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Actualizar Toner</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Formulario para actualizar los datos de la toner seleccionada.
            </DialogDescription>
            <form className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="modelo">Modelo</Label>
                      <Input
                        id="nombre"
                        value={newToner.modelo}
                        onChange={(e) =>
                          setNewToner({ ...newToner, modelo: e.target.value })
                        }
                        autoComplete="off"
                        placeholder="Ej: TN-760"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="modeloImpresora">
                        Modelo de Impresora
                      </Label>
                      <Select
                        value={
                          newToner.toner_impresora?.[0]?.impresora_id?.toString() ??
                          ""
                        }
                        onValueChange={(value) =>
                          setNewToner({
                            ...newToner,
                            toner_impresora: [
                              {
                                ...newToner.toner_impresora?.[0],
                                impresora_id: Number(value),
                              },
                            ],
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un modelo" />
                        </SelectTrigger>
                        <SelectContent>
                          {impresora.map((impresora) => (
                            <SelectItem
                              key={impresora.id_impresora}
                              value={impresora.id_impresora.toString()}
                            >
                              {impresora.modelo} - {impresora.serial}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Select
                        value={newToner.color || ""}
                        onValueChange={(value) =>
                          setNewToner({ ...newToner, color: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Negro">Negro</SelectItem>
                          <SelectItem value="Cyan">Cyan</SelectItem>
                          <SelectItem value="Magenta">Magenta</SelectItem>
                          <SelectItem value="Amarillo">Amarillo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stockDisponible">Stock Disponible</Label>
                      <Input
                        type="number"
                        value={newToner.stock_actual || 0}
                        onChange={(e) =>
                          setNewToner({
                            ...newToner,
                            stock_actual: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock_minimo_alerta">
                        Alerta de Stock Mínimo
                      </Label>
                      <Input
                        type="number"
                        value={newToner.stock_minimo_alerta || 0}
                        onChange={(e) =>
                          setNewToner({
                            ...newToner,
                            stock_minimo_alerta: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cantidad">Cantidad</Label>
                      <Input
                        type="number"
                        value={newToner.cantidad || 0}
                        onChange={(e) =>
                          setNewToner({
                            ...newToner,
                            cantidad: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Estado</Label>
                      <Select
                        value={newToner.estado || ""}
                        onValueChange={(value) =>
                          setNewToner({ ...newToner, estado: value })
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
                      update(id, newToner);
                    }
                  }}
                >
                  Actualizar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default UpdateToner;
