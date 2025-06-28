import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Shield, User, Users } from "lucide-react";
import { usePerfilesAcceso } from "../maestros/hooks/use-perfiles-acceso";
import { usePermisos } from "./hooks/use-permisos";

const Permisos = () => {
  const { perfilesAcceso } = usePerfilesAcceso();
  const { permisos, asignarPermisos } = usePermisos();

  const [selectedProfile, setSelectedProfile] = useState("");
  const [permisosPerfiles, setPermisosPerfiles] = useState<
    Record<string, string[]>
  >({});
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

  const modulosBD = useMemo(() => {
    const agrupados: Record<
      string,
      { nombre: string; permisos: typeof permisos }
    > = {};

    permisos.forEach((permiso) => {
      const [moduloPrincipal] = permiso.nombre_permiso.split("."); // toma el primer segmento

      if (!agrupados[moduloPrincipal]) {
        agrupados[moduloPrincipal] = {
          nombre:
            moduloPrincipal.charAt(0).toUpperCase() + moduloPrincipal.slice(1),
          permisos: [],
        };
      }

      agrupados[moduloPrincipal].permisos.push(permiso);
    });

    return agrupados;
  }, [permisos]);

  const guardarPermisos = async () => {
    if (activeTab === "perfiles" && !selectedProfile) {
      toast.error("Por favor seleccione un perfil");
      return;
    }

    // 1. Obtener los nombres de los permisos marcados
    const permisosSeleccionados = Object.values(permisosPerfiles).flat(); // ["productos.ingreso", "productos.salidas"]

    // 2. Obtener los IDs de esos permisos (basado en los traídos del backend)
    const idsSeleccionados = permisos
      .filter((permiso) =>
        permisosSeleccionados.includes(permiso.nombre_permiso)
      )
      .map((permiso) => Number(permiso.id)); // 👈 conversión segura a number

    if (idsSeleccionados.length === 0) {
      toast.warning("No se seleccionaron permisos para asignar");
      return;
    }

    try {
      await asignarPermisos(Number(selectedProfile), idsSeleccionados);
      toast.success("Permisos actualizados correctamente");
    } catch (err) {
      toast.error("Error al guardar permisos");
      console.error(err);
    }
  };

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
                  <SelectItem key={perfil.id} value={perfil.id.toString()}>
                    <div className="flex flex-col">
                      <span>{perfil.nombre_perfil}</span>
                      <span className="text-xs text-gray-500">
                        {perfil.descripcion}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProfile && (
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(modulosBD).map(([moduloKey, modulo]) => (
                <div
                  key={moduloKey}
                  className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{modulo.nombre}</h3>
                  </div>

                  <div className="space-y-2">
                    {" "}
                    {/* Espaciado vertical entre permisos */}
                    {modulo.permisos.map((permiso) => (
                      <div
                        key={permiso.id}
                        className="flex items-center space-x-2 py-1"
                      >
                        <Checkbox
                          id={`${moduloKey}-${permiso.id}`}
                          checked={permisosPerfiles[moduloKey]?.includes(
                            permiso.nombre_permiso
                          )}
                          onCheckedChange={() =>
                            handleProfilePermissionChange(
                              moduloKey,
                              permiso.nombre_permiso
                            )
                          }
                        />
                        <label
                          htmlFor={`${moduloKey}-${permiso.id}`}
                          className="text-sm font-medium leading-none"
                        >
                          {permiso.descripcion}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        {/* 
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
                      <span className="text-xs text-gray-500">
                        {usuario.perfil}
                      </span>
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
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default Permisos;
