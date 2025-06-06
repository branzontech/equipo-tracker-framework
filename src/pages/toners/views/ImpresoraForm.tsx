import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useImpresora } from "../hooks/use-impresora";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSucursales } from "@/pages/configuracion/maestros/hooks/use-sucursales";

export default function ImpresoraForm() {
  const { create, newImpresora, setNewImpresora } = useImpresora();
  const { sucursales } = useSucursales();

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Registrar Impresora</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                value={newImpresora.nombre}
                onChange={(e) =>
                  setNewImpresora({ ...newImpresora, nombre: e.target.value })
                }
                placeholder="Ingrese el nombre"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                value={newImpresora.modelo}
                onChange={(e) =>
                  setNewImpresora({ ...newImpresora, modelo: e.target.value })
                }
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

            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full"
                onClick={(e: React.FormEvent) => {
                  e.preventDefault();
                  create(newImpresora);
                }}
              >
                Registrar Impresora
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
