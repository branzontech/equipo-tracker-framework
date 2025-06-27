import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSucursales } from "@/pages/configuracion/maestros/hooks/use-sucursales";
import { useImpresora } from "../hooks/use-impresora";
import { useTipos } from "@/pages/configuracion/maestros/hooks/use-tipos";
import { useMarcas } from "@/pages/configuracion/maestros/hooks/use-marcas";
import { useEstado } from "@/pages/configuracion/maestros/hooks/use-estado";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Delete, Eye, Pencil, PencilIcon, XCircle } from "lucide-react";
import UpdateImpresora from "./UpdateImpresora";
import { useGlobal } from "@/hooks/use-global";

export default function ImpresoraForm() {
  const {
    create,
    newImpresora,
    setNewImpresora,
    impresora,
    showEditModal,
    setShowEditModal,
    selectedImpresoraId,
    handleOpenEditModal,
    deleteImpresoraById,
  } = useImpresora();
  const { sucursales } = useSucursales();
  const { tipos } = useTipos();
  const { marcas } = useMarcas();
  const { estados } = useEstado();
  const { StatusBadge } = useGlobal();

  return (
    <>
      <div className="p-6 space-y-8">
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
                <Label>N° Serie</Label>
                <Input
                  value={newImpresora.serial}
                  onChange={(e) =>
                    setNewImpresora({ ...newImpresora, serial: e.target.value })
                  }
                  placeholder="Ingrese el número de serie"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={newImpresora.tipo}
                  onValueChange={(value) =>
                    setNewImpresora({ ...newImpresora, tipo: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipos.map((tipo) => (
                      <SelectItem key={tipo.id_tipo} value={tipo.nombre_tipo}>
                        {tipo.nombre_tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

              <div className="space-y-2">
                <Label>Marca</Label>
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
                <Label>Estado</Label>
                <Select
                  value={
                    newImpresora.estado ? newImpresora.estado.toString() : ""
                  }
                  onValueChange={(value) =>
                    setNewImpresora({ ...newImpresora, estado: value })
                  }
                >
                  <SelectTrigger className="w-full">
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

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-xl">Lista de Impresoras</CardTitle>
          </CardHeader>
          <CardContent className="py-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>N° Serie</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {impresora.map((imp) => (
                  <TableRow key={imp.id_impresora}>
                    <TableCell>{imp.nombre}</TableCell>
                    <TableCell>{imp.modelo}</TableCell>
                    <TableCell>{imp.serial}</TableCell>
                    <TableCell>{imp.marcas?.nombre}</TableCell>
                    <TableCell>{imp.sucursales?.nombre}</TableCell>
                    <TableCell>{<StatusBadge status={imp.estado} />}</TableCell>
                    <TableCell className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-slate-100"
                        onClick={() => {
                          handleOpenEditModal(imp.id_impresora);
                        }}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-muted"
                        onClick={() => deleteImpresoraById(imp.id_impresora)}
                      >
                        <XCircle className="w-4 h-4 " />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <UpdateImpresora
        open={showEditModal}
        onOpenChange={setShowEditModal}
        id={selectedImpresoraId}
      />
    </>
  );
}
