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
import { PlusCircle, CheckCircle, XCircle, PencilIcon, FileX } from "lucide-react";
import { listTypes } from "@/pages/configuracion/maestros/interfaces/periferico";
import { usePeriferico } from "../hooks/use-perifierico";
import { EstadoType } from "../interfaces/sedes";
import { useEquipos } from "@/pages/productos/hooks/use-equipos";
import UpdatePeriferico from "./UpdatePeriferico";

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

  const { equipo } = useEquipos();

  const equiposDisponible = equipo.filter((equipo) => equipo.estado_actual !== "Fuera de servicio");

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
                  {listTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.name}
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
                value={
                  newPeriferico.estado === "Activo"
                    ? "Activo"
                    : newPeriferico.estado === "Inactivo"
                    ? "Inactivo"
                    : ""
                }
                onValueChange={(value: EstadoType) =>
                  setNewPeriferico({ ...newPeriferico, estado: value })
                }
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
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
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
                  <TableCell>{periferico.nombre}</TableCell>
                  <TableCell>{periferico.tipo}</TableCell>
                  <TableCell>
                    {periferico.equipos?.nombre_equipo ?? "No asignado"}
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center">
                      {periferico.estado === "Activo" ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          <span className="text-green-700">Activo</span>
                        </>
                      ) : periferico.estado === "Fuera de servicio" ? (
                        <>
                          <FileX className="mr-2 h-4 w-4 text-orange-500" />
                          <span className="text-orange-700">
                            Fuera de servicio
                          </span>
                        </>
                      ) : periferico.estado === "Inactivo" ? (
                        <>
                          <XCircle className="mr-2 h-4 w-4 text-red-500" />
                          <span className="text-red-700">Inactivo</span>
                        </>
                      ) : (
                        <span>{periferico.estado}</span>
                      )}
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
