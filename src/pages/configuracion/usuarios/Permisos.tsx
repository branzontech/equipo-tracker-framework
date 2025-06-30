import { useEffect, useMemo, useState } from "react";
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
import { getPermisosPorPerfil } from "@/api/axios/permisos.api";
import { Permiso } from "./interfaces/permisos";

const Permisos = () => {
  const { perfilesAcceso } = usePerfilesAcceso();
  const { permisos, asignarPermisos } = usePermisos();

  const [selectedProfile, setSelectedProfile] = useState("");
  const [permisosPerfiles, setPermisosPerfiles] = useState<
    Record<string, string[]>
  >({});
  const [activeTab, setActiveTab] = useState("perfiles");

  useEffect(() => {
    const cargarPermisosAsignados = async () => {
      if (!selectedProfile) {
        setPermisosPerfiles({});
        return;
      }

      const asignados = await getPermisosPorPerfil(Number(selectedProfile));

      const agrupados: Record<string, string[]> = {};

      asignados.forEach((permiso) => {
        const [modulo] = permiso.nombre_permiso.split(".");
        if (!agrupados[modulo]) agrupados[modulo] = [];
        agrupados[modulo].push(permiso.nombre_permiso);
      });

      setPermisosPerfiles(agrupados);
    };

    cargarPermisosAsignados().catch(console.error);
  }, [selectedProfile]);

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
    type GrupoAccion = { nombre: string; permisos: Permiso[] };
    type GrupoModulo = {
      nombre: string;
      acciones: Permiso[];
      submodulos: Record<string, GrupoAccion>;
    };

    const resultado: Record<string, GrupoModulo> = {};

    permisos.forEach((permiso) => {
      const partes = permiso.nombre_permiso.split(".");
      const modulo = partes[0];

      if (!resultado[modulo]) {
        resultado[modulo] = {
          nombre: modulo.charAt(0).toUpperCase() + modulo.slice(1),
          acciones: [],
          submodulos: {},
        };
      }

      if (partes.length === 1 || partes.length === 2) {
        // acciones directas (perfil, productos.ver, productos.editar…)
        resultado[modulo].acciones.push(permiso);
      } else {
        // length ≥ 3  →  submódulo
        const subKey = partes[1]; // siempre existe aquí
        if (!resultado[modulo].submodulos[subKey]) {
          resultado[modulo].submodulos[subKey] = {
            nombre: subKey.charAt(0).toUpperCase() + subKey.slice(1),
            permisos: [],
          };
        }
        resultado[modulo].submodulos[subKey].permisos.push(permiso);
      }
    });

    return resultado;
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
    } catch (err) {
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
                  className="p-4 rounded-lg border bg-card shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{modulo.nombre}</h3>
                  </div>

                  {/* Acciones directas del módulo */}
                  {modulo.acciones.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {modulo.acciones.map((permiso) => (
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
                            className="text-sm font-medium"
                          >
                            {permiso.descripcion}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Submódulos */}
                  {Object.entries(modulo.submodulos).map(
                    ([submoduloKey, submodulo]) => (
                      <div key={submoduloKey} className="mb-4 ml-4">
                        <h4 className="font-semibold text-sm mb-2">
                          {submodulo.nombre}
                        </h4>
                        <div className="space-y-2">
                          {submodulo.permisos.map((permiso) => (
                            <div
                              key={permiso.id}
                              className="flex items-center space-x-2 py-1"
                            >
                              <Checkbox
                                id={`${submoduloKey}-${permiso.id}`}
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
                                htmlFor={`${submoduloKey}-${permiso.id}`}
                                className="text-sm"
                              >
                                {permiso.descripcion}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
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
