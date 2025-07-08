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
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { tienePermiso } from "@/utils/permissions";
import { PERMISOS_PERIFERICOS } from "../../usuarios/interfaces/permisos";
import { useSucursales } from "../hooks/use-sucursales";

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
  const { sucursales } = useSucursales();
  const { tipos } = useTipos();
  const user = useSelector((state: RootState) => state.auth.user);
  const puedeEditarEliminar =
    tienePermiso(PERMISOS_PERIFERICOS.edicion, user.permisos) ||
    tienePermiso(PERMISOS_PERIFERICOS.eliminacion, user.permisos);

  const equiposDisponible = equipo.filter(
    (equipo) =>
      equipo.estado_ubicacion?.[0]?.estado_actual !== "Fuera de servicio"
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {tienePermiso(PERMISOS_PERIFERICOS.ingreso, user.permisos) && (
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
                <Label htmlFor="id_sucursal">Sucursal</Label>
                <Select
                  value={
                    newPeriferico.id_sucursal
                      ? newPeriferico.id_sucursal.toString()
                      : ""
                  }
                  onValueChange={(value: string) =>
                    setNewPeriferico({
                      ...newPeriferico,
                      id_sucursal: Number(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione la sede" />
                  </SelectTrigger>
                  <SelectContent>
                    {sucursales.map((sucursal) => (
                      <SelectItem
                        key={sucursal.id_sucursal}
                        value={sucursal.id_sucursal.toString()}
                      >
                        {sucursal.nombre}
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
      )}

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
                <TableHead>Sucursal</TableHead>
                <TableHead>Equipo Asociado</TableHead>
                <TableHead>Estado</TableHead>
                {puedeEditarEliminar && (
                  <TableHead className="text-right">Acciones</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...perifericos]
                .sort((a, b) => b.id_periferico - a.id_periferico)
                .map((periferico) => {
                  const acciones = [
                    {
                      permiso: PERMISOS_PERIFERICOS.edicion,
                      onClick: () =>
                        handleOpenEditModal(periferico.id_periferico),
                      icon: <PencilIcon className="h-5 w-5" />,
                    },
                    {
                      permiso: PERMISOS_PERIFERICOS.eliminacion,
                      onClick: () =>
                        handleDeletePeriferico(periferico.id_periferico),
                      icon: <XCircle className="h-5 w-5" />,
                    },
                  ];

                  return (
                    <TableRow key={periferico.id_periferico}>
                      <TableCell>{periferico.serial}</TableCell>
                      <TableCell>{periferico.nombre}</TableCell>
                      <TableCell>{periferico.tipo}</TableCell>
                      <TableCell>{periferico.marcas?.nombre}</TableCell>
                      <TableCell>{periferico.sucursales?.nombre}</TableCell>
                      <TableCell>
                        {periferico.equipos?.nombre_equipo ?? "No asignado"}
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center">
                          <StatusBadge status={periferico.estado} />
                        </span>
                      </TableCell>
                      {puedeEditarEliminar && (
                        <TableCell className="text-right">
                          {acciones.map(
                            (accion, idx) =>
                              tienePermiso(accion.permiso, user.permisos) && (
                                <Button
                                  key={idx}
                                  variant="ghost"
                                  size="icon"
                                  className="hover:bg-slate-100"
                                  onClick={accion.onClick}
                                >
                                  {accion.icon}
                                </Button>
                              )
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
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
