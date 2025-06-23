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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, XCircle, PencilIcon } from "lucide-react";
import { usePeriferico } from "../hooks/use-perifierico";
import { useEquipos } from "@/pages/productos/hooks/use-equipos";
import UpdatePeriferico from "./UpdatePeriferico";
import { useGlobal } from "@/hooks/use-global";
import { useEstado } from "../hooks/use-estado";
import { useMarcas } from "../hooks/use-marcas";
import { useSedes } from "../hooks/use-sedes";
import { useTipos } from "../hooks/use-tipos";

const Perifericos = () => {
  const {
    perifericos,
    newPeriferico,
    setNewPeriferico,
    handleCreatePeriferico,
    handleDeletePeriferico,
    showEditModal,
    setShowEditModal,
    selectedPerifericoId,
    handleOpenEditModal,
  } = usePeriferico();
  const { StatusBadge } = useGlobal();
  const { equipo } = useEquipos();
  const { estados } = useEstado();
  const { marcas } = useMarcas();
  const { sedes } = useSedes();
  const { tipos } = useTipos();

  const equiposDisponible = equipo.filter(
    (equipo) =>
      equipo.estado_ubicacion?.[0]?.estado_actual !== "Fuera de servicio"
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Registro de Periféricos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="descripcion">Nombre</Label>
              <Input
                id="nombre"
                value={newPeriferico.nombre}
                onChange={(e) =>
                  setNewPeriferico({
                    ...newPeriferico,
                    nombre: e.target.value,
                  })
                }
                placeholder="Nombre del periférico"
                autoComplete="off"
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
              <Label htmlFor="equipo_asociado_id">Equipo Asociado</Label>
              <Select
                value={
                  newPeriferico.equipo_asociado_id
                    ? newPeriferico.equipo_asociado_id.toString()
                    : ""
                }
                onValueChange={(value: string) =>
                  setNewPeriferico({
                    ...newPeriferico,
                    equipo_asociado_id: Number(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el equipo asociado" />
                </SelectTrigger>
                <SelectContent>
                  {equiposDisponible.map((equipo) => (
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
                value={newPeriferico.estado || ""}
                onValueChange={(value) =>
                  setNewPeriferico({ ...newPeriferico, estado: value })
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

            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full"
                onClick={(e: React.FormEvent) => {
                  e.preventDefault();
                  handleCreatePeriferico(newPeriferico);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Agregar Periférico
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Periféricos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Serie</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Sede</TableHead>
                <TableHead>Equipo Asociado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...perifericos]
                .sort((a, b) => b.id_periferico - a.id_periferico)
                .map((periferico) => (
                  <TableRow key={periferico.id_periferico}>
                    <TableCell>{periferico.serial}</TableCell>
                    <TableCell>{periferico.nombre}</TableCell>
                    <TableCell>{periferico.tipo}</TableCell>
                    <TableCell>{periferico.marcas?.nombre}</TableCell>
                    <TableCell>{periferico.sedes?.nombre}</TableCell>
                    <TableCell>
                      {periferico.equipos?.nombre_equipo ?? "No asignado"}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center">
                        <StatusBadge status={periferico.estado} />
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-slate-100"
                        onClick={() => {
                          handleOpenEditModal(periferico.id_periferico);
                        }}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-slate-100"
                        onClick={() => {
                          handleDeletePeriferico(periferico.id_periferico);
                        }}
                      >
                        <XCircle className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <UpdatePeriferico
        open={showEditModal}
        onOpenChange={setShowEditModal}
        id={selectedPerifericoId}
      />
    </div>
  );
};

export default Perifericos;
