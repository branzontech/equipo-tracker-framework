import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { usePerfilesAcceso } from "../hooks/use-perfiles-acceso";
import { Label } from "@/components/ui/label";
import { formatFecha, useGlobal } from "@/hooks/use-global";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, PencilIcon, Trash, XCircle } from "lucide-react";
import UpdatePerfil from "./UpdatePerfilAcceso";
import { useEstado } from "../hooks/use-estado";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { tienePermiso } from "@/utils/permissions";
import { PERMISOS_PERFILES_ACCESO } from "../../usuarios/interfaces/permisos";

const PerfilesAcceso = () => {
  const {
    perfilesAcceso,
    newPerfilAcceso,
    setNewPerfilAcceso,
    isOpen,
    setIsOpen,
    handleCreatePerfil,
    showEditModal,
    handleOpenEditModal,
    selectedPerfilId,
    setShowEditModal,
    handleDelete,
  } = usePerfilesAcceso();
  const { estados } = useEstado();
  const { StatusBadge } = useGlobal();
  const user = useSelector((state: RootState) => state.auth.user);
  const puedeEditarEliminar =
    tienePermiso(PERMISOS_PERFILES_ACCESO.edicion, user.permisos) ||
    tienePermiso(PERMISOS_PERFILES_ACCESO.eliminacion, user.permisos);

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Perfiles de Acceso</h2>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {user.permisos.includes(PERMISOS_PERFILES_ACCESO.ingreso) && (
              <DialogTrigger asChild>
                <Button>Nuevo Perfil</Button>
              </DialogTrigger>
            )}
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Perfil de Acceso</DialogTitle>
                <DialogDescription>
                  Crear un nuevo perfil de acceso para gestionar los permisos de
                  los usuarios
                </DialogDescription>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreatePerfil(newPerfilAcceso);
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Perfil</Label>
                  <Select
                    value={newPerfilAcceso.nombre_perfil}
                    onValueChange={(value) => {
                      setNewPerfilAcceso({
                        ...newPerfilAcceso,
                        nombre_perfil: value,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar nombre del perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrador">
                        Administrador
                      </SelectItem>
                      <SelectItem value="Agente">Agente</SelectItem>
                      <SelectItem value="Auditor">Auditor</SelectItem>
                      <SelectItem value="Cliente">Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    placeholder="Descripción del perfil"
                    value={newPerfilAcceso.descripcion}
                    onChange={(e) => {
                      setNewPerfilAcceso({
                        ...newPerfilAcceso,
                        descripcion: e.target.value,
                      });
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={newPerfilAcceso.estado}
                    onValueChange={(value) =>
                      setNewPerfilAcceso({
                        ...newPerfilAcceso,
                        estado: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
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
                <Button type="submit" className="w-full">
                  Guardar Perfil
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre del Perfil</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha de Creación</TableHead>
                {puedeEditarEliminar && (
                  <TableHead className="text-right">Acciones</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {perfilesAcceso.length > 0 ? (
                perfilesAcceso
                  .filter((p) => p.nombre_perfil && p.descripcion)
                  .map((perfil) => {
                    const acciones = [
                      {
                        permiso: PERMISOS_PERFILES_ACCESO.edicion,
                        onClick: () => handleOpenEditModal(perfil.id),
                        icon: <PencilIcon className="h-5 w-5" />,
                      },
                      {
                        permiso: PERMISOS_PERFILES_ACCESO.eliminacion,
                        onClick: () => handleDelete(perfil.id),
                        icon: <XCircle className="h-5 w-5" />,
                      },
                    ];
                    return (
                      <TableRow key={perfil.id}>
                        <TableCell className="font-medium">
                          {perfil.nombre_perfil}
                        </TableCell>
                        <TableCell>{perfil.descripcion}</TableCell>
                        <TableCell>
                          {<StatusBadge status={perfil.estado} />}
                        </TableCell>
                        <TableCell>
                          {formatFecha(perfil.fecha_creacion)}
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
                  })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground py-8"
                  >
                    No hay perfiles registrados en el sistema.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <UpdatePerfil
        open={showEditModal}
        onOpenChange={setShowEditModal}
        id={selectedPerfilId}
      />
    </>
  );
};

export default PerfilesAcceso;
