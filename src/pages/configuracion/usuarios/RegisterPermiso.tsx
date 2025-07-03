import { usePermisos } from "./hooks/use-permisos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export const RegisterPermiso = () => {
  const { newPermiso, setNewPermiso, create } = usePermisos();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Registro de Permisos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={newPermiso.nombre_permiso}
              onChange={(e) =>
                setNewPermiso({ ...newPermiso, nombre_permiso: e.target.value })
              }
              placeholder="Nombre del permiso"
              required
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              value={newPermiso.descripcion}
              onChange={(e) =>
                setNewPermiso({
                  ...newPermiso,
                  descripcion: e.target.value,
                })
              }
              placeholder="ej: Permite registrar sedes"
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ruta_opcional">Ruta Opcional</Label>
            <Input
              id="ruta_opcional"
              value={newPermiso.ruta_opcional}
              onChange={(e) =>
                setNewPermiso({ ...newPermiso, ruta_opcional: e.target.value })
              }
              placeholder="ej: /configuracion/sedes"
              autoComplete="off"
            />
          </div>

          <div className="flex items-end">
            <Button
              type="submit"
              className="w-full"
              onClick={(e: React.FormEvent) => {
                e.preventDefault();
                create(newPermiso);
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Permiso
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
