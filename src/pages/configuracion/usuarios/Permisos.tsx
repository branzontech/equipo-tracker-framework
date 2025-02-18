
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const modulos = {
  inventario: {
    nombre: "Inventario",
    permisos: [
      "Ver lista",
      "Crear equipo",
      "Editar equipo",
      "Eliminar equipo",
      "Exportar datos",
    ],
  },
  mantenimientos: {
    nombre: "Mantenimientos",
    permisos: [
      "Ver calendario",
      "Programar mantenimiento",
      "Ejecutar mantenimiento",
      "Generar reportes",
    ],
  },
  toners: {
    nombre: "Toners",
    permisos: [
      "Ver existencias",
      "Registrar entrada",
      "Registrar salida",
      "Gestionar alertas",
    ],
  },
  configuracion: {
    nombre: "Configuración",
    permisos: [
      "Gestionar maestros",
      "Gestionar usuarios",
      "Gestionar permisos",
      "Configurar sistema",
    ],
  },
};

const Permisos = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [permisos, setPermisos] = useState<Record<string, string[]>>({});

  const handlePermissionChange = (modulo: string, permiso: string) => {
    setPermisos((prev) => {
      const moduloPermisos = prev[modulo] || [];
      const updatedPermisos = moduloPermisos.includes(permiso)
        ? moduloPermisos.filter((p) => p !== permiso)
        : [...moduloPermisos, permiso];

      return {
        ...prev,
        [modulo]: updatedPermisos,
      };
    });
  };

  const guardarPermisos = () => {
    if (!selectedUser) {
      toast.error("Por favor seleccione un usuario");
      return;
    }
    console.log("Permisos guardados:", { usuario: selectedUser, permisos });
    toast.success("Permisos actualizados exitosamente");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Permisos</h2>
        <div className="flex gap-4">
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar usuario" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user1">Juan Pérez (Agente)</SelectItem>
              <SelectItem value="user2">María García (Responsable)</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={guardarPermisos}>Guardar Permisos</Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Módulo</TableHead>
              <TableHead>Permisos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(modulos).map(([moduloKey, modulo]) => (
              <TableRow key={moduloKey}>
                <TableCell className="font-medium">{modulo.nombre}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-4">
                    {modulo.permisos.map((permiso) => (
                      <div key={permiso} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${moduloKey}-${permiso}`}
                          checked={permisos[moduloKey]?.includes(permiso)}
                          onCheckedChange={() =>
                            handlePermissionChange(moduloKey, permiso)
                          }
                        />
                        <label
                          htmlFor={`${moduloKey}-${permiso}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permiso}
                        </label>
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Permisos;
