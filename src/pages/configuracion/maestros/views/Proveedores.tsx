import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PencilIcon, PlusCircle, XCircle } from "lucide-react";
import { useProveedor } from "../hooks/use-proveedor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Proveedores = () => {
  const { create, proveedores, newProveedor, setNewProveedor } = useProveedor();
  const mostrarSitioWeb = proveedores.some(
    (p) => p.tipo_proveedor === "Empresa"
  );

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Gestión de Proveedores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-4"
            onSubmit={(e: React.FormEvent) => {
              e.preventDefault();
              create(newProveedor);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Proveedor</Label>
              <Select
                value={newProveedor.tipo_proveedor}
                onValueChange={(value) =>
                  setNewProveedor({ ...newProveedor, tipo_proveedor: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Empresa">Empresa</SelectItem>
                  <SelectItem value="Persona">Persona</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Nombre / Razón Social */}
            {newProveedor.tipo_proveedor && (
              <div className="space-y-2">
                <Label htmlFor="nombre">
                  {newProveedor.tipo_proveedor === "Empresa"
                    ? "Razón Social"
                    : "Nombre Completo"}
                </Label>
                <Input
                  id="nombre"
                  value={newProveedor.nombre}
                  onChange={(e) =>
                    setNewProveedor({ ...newProveedor, nombre: e.target.value })
                  }
                  placeholder={
                    newProveedor.tipo_proveedor === "Empresa"
                      ? "Ej: Soluciones TI S.A.S."
                      : "Ej: Laura Rodríguez"
                  }
                  required
                  autoComplete="off"
                />
              </div>
            )}

            {/* Identificación */}
            {newProveedor.tipo_proveedor && (
              <div className="space-y-2">
                <Label htmlFor="identificacion">
                  {newProveedor.tipo_proveedor === "Empresa" ? "NIT" : "Cédula"}
                </Label>
                <Input
                  id="identificacion"
                  value={newProveedor.identificacion}
                  onChange={(e) =>
                    setNewProveedor({
                      ...newProveedor,
                      identificacion: e.target.value.replace(/\D/g, ""), 
                    })
                  }
                  placeholder={
                    newProveedor.tipo_proveedor === "Empresa"
                      ? "900123456-7"
                      : "1023456789"
                  }
                  required
                  autoComplete="off"
                />
              </div>
            )}

            {/* Contacto solo si es empresa */}
            {newProveedor.tipo_proveedor === "Empresa" && (
              <div className="space-y-2">
                <Label htmlFor="contacto">Persona de Contacto</Label>
                <Input
                  id="contacto"
                  value={newProveedor.contacto}
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

            {/* Teléfono */}
            {newProveedor.tipo_proveedor && (
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={newProveedor.telefono}
                  onChange={(e) =>
                    setNewProveedor({
                      ...newProveedor,
                      telefono: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  placeholder="Ej: 3101234567"
                />
              </div>
            )}

            {/* Correo */}
            {newProveedor.tipo_proveedor && (
              <div className="space-y-2">
                <Label htmlFor="correo">Correo</Label>
                <Input
                  id="correo"
                  value={newProveedor.correo}
                  onChange={(e) =>
                    setNewProveedor({ ...newProveedor, correo: e.target.value })
                  }
                  placeholder="correo@proveedor.com"
                  type="email"
                />
              </div>
            )}

            {/* Dirección */}
            {newProveedor.tipo_proveedor && (
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={newProveedor.direccion}
                  onChange={(e) =>
                    setNewProveedor({
                      ...newProveedor,
                      direccion: e.target.value,
                    })
                  }
                  placeholder="Ej: Cra 12 #45-67, Bogotá"
                />
              </div>
            )}

            {/* Sitio Web solo si es empresa */}
            {newProveedor.tipo_proveedor === "Empresa" && (
              <div className="space-y-2">
                <Label htmlFor="sitio_web">Sitio Web</Label>
                <Input
                  id="sitio_web"
                  value={newProveedor.sitio_web}
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

            {/* Botón submit */}
            {newProveedor.tipo_proveedor && (
              <div className="flex items-end col-span-4">
                <Button type="submit" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Agregar proveedor
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Proveedores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID°</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Identificación</TableHead>
                {mostrarSitioWeb && <TableHead>Sitio Web</TableHead>}
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proveedores.length > 0 ? (
                proveedores.map((proveedor) => (
                  <TableRow key={proveedor.id_proveedor}>
                    <TableCell>{`PROV-${proveedor.id_proveedor
                      .toString()
                      .padStart(3, "0")}`}</TableCell>
                    <TableCell>{proveedor.nombre}</TableCell>
                    <TableCell>{proveedor.tipo_proveedor}</TableCell>
                    <TableCell>{proveedor.identificacion}</TableCell>
                    {mostrarSitioWeb && (
                      <TableCell>
                        {proveedor.tipo_proveedor === "Empresa"
                          ? proveedor.sitio_web || "—"
                          : "No aplica para personas"}
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-slate-100"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-slate-100"
                      >
                        <XCircle className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No hay proveedores registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Proveedores;
