
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Shield, User, Users, Lock, ListChecks } from "lucide-react";

const modulos = {
  inventario: {
    nombre: "Inventario",
    icono: ListChecks,
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
    icono: ListChecks,
    permisos: [
      "Ver calendario",
      "Programar mantenimiento",
      "Ejecutar mantenimiento",
      "Generar reportes",
    ],
  },
  toners: {
    nombre: "Toners",
    icono: ListChecks,
    permisos: [
      "Ver existencias",
      "Registrar entrada",
      "Registrar salida",
      "Gestionar alertas",
    ],
  },
  configuracion: {
    nombre: "Configuración",
    icono: Lock,
    permisos: [
      "Gestionar maestros",
      "Gestionar usuarios",
      "Gestionar permisos",
      "Configurar sistema",
    ],
  },
};

const perfilesAcceso = [
  {
    id: "admin",
    nombre: "Administrador",
    descripcion: "Acceso total al sistema",
  },
  {
    id: "tecnico",
    nombre: "Técnico",
    descripcion: "Gestión de mantenimientos e inventario",
  },
  {
    id: "auditor",
    nombre: "Auditor",
    descripcion: "Consulta y reportes",
  },
  {
    id: "auxiliar",
    nombre: "Auxiliar",
    descripcion: "Operaciones básicas",
  },
];

const usuarios = [
  { id: "user1", nombre: "Juan Pérez", perfil: "Técnico" },
  { id: "user2", nombre: "María García", perfil: "Administrador" },
  { id: "user3", nombre: "Carlos López", perfil: "Auditor" },
];

const Permisos = () => {
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [permisosPerfiles, setPermisosPerfiles] = useState<Record<string, string[]>>({});
  const [permisosUsuarios, setPermisosUsuarios] = useState<Record<string, string[]>>({});
  const [activeTab, setActiveTab] = useState("perfiles");

  const handleProfilePermissionChange = (modulo: string, permiso: string) => {
    setPermisosPerfiles((prev) => {
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

  const handleUserPermissionChange = (modulo: string, permiso: string) => {
    setPermisosUsuarios((prev) => {
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
    if (activeTab === "perfiles" && !selectedProfile) {
      toast.error("Por favor seleccione un perfil");
      return;
    }
    if (activeTab === "usuarios" && !selectedUser) {
      toast.error("Por favor seleccione un usuario");
      return;
    }

    toast.success(
      `Permisos de ${activeTab === "perfiles" ? "perfil" : "usuario"} actualizados exitosamente`
    );
  };

  const renderPermisosList = (
    modulo: string,
    permisos: string[],
    checkedPermisos: string[],
    onChange: (modulo: string, permiso: string) => void
  ) => (
    <div className="space-y-2">
      {permisos.map((permiso) => (
        <div key={permiso} className="flex items-center space-x-2">
          <Checkbox
            id={`${modulo}-${permiso}`}
            checked={checkedPermisos?.includes(permiso)}
            onCheckedChange={() => onChange(modulo, permiso)}
          />
          <label
            htmlFor={`${modulo}-${permiso}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {permiso}
          </label>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Permisos</h2>
        <Button onClick={guardarPermisos}>Guardar Permisos</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="perfiles" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Perfiles de Acceso
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Usuarios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="perfiles" className="space-y-4">
          <div className="flex items-center space-x-4">
            <Select value={selectedProfile} onValueChange={setSelectedProfile}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Seleccionar perfil de acceso" />
              </SelectTrigger>
              <SelectContent>
                {perfilesAcceso.map((perfil) => (
                  <SelectItem key={perfil.id} value={perfil.id}>
                    <div className="flex flex-col">
                      <span>{perfil.nombre}</span>
                      <span className="text-xs text-gray-500">{perfil.descripcion}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProfile && (
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(modulos).map(([moduloKey, modulo]) => (
                <div
                  key={moduloKey}
                  className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{modulo.nombre}</h3>
                  </div>
                  {renderPermisosList(
                    moduloKey,
                    modulo.permisos,
                    permisosPerfiles[moduloKey] || [],
                    handleProfilePermissionChange
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="usuarios" className="space-y-4">
          <div className="flex items-center space-x-4">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Seleccionar usuario" />
              </SelectTrigger>
              <SelectContent>
                {usuarios.map((usuario) => (
                  <SelectItem key={usuario.id} value={usuario.id}>
                    <div className="flex flex-col">
                      <span>{usuario.nombre}</span>
                      <span className="text-xs text-gray-500">{usuario.perfil}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedUser && (
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(modulos).map(([moduloKey, modulo]) => (
                <div
                  key={moduloKey}
                  className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{modulo.nombre}</h3>
                  </div>
                  {renderPermisosList(
                    moduloKey,
                    modulo.permisos,
                    permisosUsuarios[moduloKey] || [],
                    handleUserPermissionChange
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Permisos;
