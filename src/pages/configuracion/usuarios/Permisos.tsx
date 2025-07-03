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
import {
  CheckSquare,
  ChevronDown,
  Shield,
  Square,
  User,
  Users,
} from "lucide-react";
import { usePerfilesAcceso } from "../maestros/hooks/use-perfiles-acceso";
import { usePermisos } from "./hooks/use-permisos";
import { getPermisosPorPerfil } from "@/api/axios/permisos.api";
import { Permiso } from "./interfaces/permisos";
import { icons } from "@/components/interfaces/icons";
import { RegisterPermiso } from "./RegisterPermiso";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

      // Inicializar módulo si no existe
      if (!resultado[modulo]) {
        resultado[modulo] = {
          nombre: modulo.charAt(0).toUpperCase() + modulo.slice(1),
          acciones: [],
          submodulos: {},
        };
      }

      if (partes.length === 1) {
        // Permisos planos como 'dashboard', 'perfil', etc.
        resultado[modulo].acciones.push(permiso);
      } else if (partes.length === 2) {
        // Ej: productos.lista
        resultado[modulo].acciones.push(permiso);
      } else if (partes.length >= 3) {
        // Submódulo: antepenúltima parte
        const submoduloKey = partes[partes.length - 2];

        if (!resultado[modulo].submodulos[submoduloKey]) {
          resultado[modulo].submodulos[submoduloKey] = {
            nombre: submoduloKey
              .replace(/_/g, " ")
              .replace(/^\w/, (l) => l.toUpperCase()),
            permisos: [],
          };
        }

        resultado[modulo].submodulos[submoduloKey].permisos.push(permiso);
      }
    });

    const ordenado = Object.entries(resultado)
      .map(([moduloKey, modulo]) => {
        const totalPermisos =
          modulo.acciones.length +
          Object.values(modulo.submodulos).reduce(
            (acc, sub) => acc + sub.permisos.length,
            0
          );
        return { key: moduloKey, modulo, totalPermisos };
      })
      .sort((a, b) => a.totalPermisos - b.totalPermisos);

    return ordenado;
  }, [permisos]);

  const guardarPermisos = async () => {
    if (activeTab === "perfiles" && !selectedProfile) {
      toast.error("Por favor seleccione un perfil", {
        icon: icons.error,
      });
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
        {activeTab === "perfiles" && (
          <Button onClick={guardarPermisos}>Guardar Permisos</Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="perfiles" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Perfiles de Acceso
          </TabsTrigger>
          <TabsTrigger value="permisos" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Permisos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="perfiles" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Select
                value={selectedProfile}
                onValueChange={setSelectedProfile}
              >
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

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Agrupar todos los permisos por módulo
                const agrupados: Record<string, string[]> = {};
                let totalPermisos = 0;
                let totalSeleccionados = 0;

                modulosBD.forEach(({ key: moduloKey, modulo }) => {
                  const permisosModulo: string[] = [
                    ...modulo.acciones.map((p) => p.nombre_permiso),
                    ...Object.values(modulo.submodulos).flatMap((s) =>
                      s.permisos.map((p) => p.nombre_permiso)
                    ),
                  ];

                  const seleccionados = permisosPerfiles[moduloKey] || [];
                  totalPermisos += permisosModulo.length;
                  totalSeleccionados += seleccionados.length;

                  agrupados[moduloKey] = permisosModulo;
                });

                const todosEstanSeleccionados =
                  totalSeleccionados === totalPermisos;

                // Nuevo estado: todos o ninguno
                const nuevoEstado: Record<string, string[]> = {};

                modulosBD.forEach(({ key: moduloKey, modulo }) => {
                  const permisosModulo: string[] = [
                    ...modulo.acciones.map((p) => p.nombre_permiso),
                    ...Object.values(modulo.submodulos).flatMap((s) =>
                      s.permisos.map((p) => p.nombre_permiso)
                    ),
                  ];

                  nuevoEstado[moduloKey] = todosEstanSeleccionados
                    ? []
                    : permisosModulo;
                });

                setPermisosPerfiles(nuevoEstado);
              }}
            >
              {(() => {
                // Verificar si ya están todos seleccionados
                const total = modulosBD.reduce(
                  (acc, { key, modulo }) => {
                    const permisosModulo = [
                      ...modulo.acciones.map((p) => p.nombre_permiso),
                      ...Object.values(modulo.submodulos).flatMap((s) =>
                        s.permisos.map((p) => p.nombre_permiso)
                      ),
                    ];
                    const seleccionados = permisosPerfiles[key]?.length || 0;
                    return {
                      total: acc.total + permisosModulo.length,
                      seleccionados: acc.seleccionados + seleccionados,
                    };
                  },
                  { total: 0, seleccionados: 0 }
                );

                return total.seleccionados === total.total
                  ? "Deseleccionar todo"
                  : "Seleccionar todo";
              })()}
            </Button>
          </div>

          {selectedProfile && (
            <div className="grid grid-cols-2 gap-6">
              {modulosBD.map(({ key: moduloKey, modulo }) => (
                <Collapsible
                  key={moduloKey}
                  className="border rounded-lg bg-card shadow-sm"
                >
                  <CollapsibleTrigger asChild>
                    <button className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold hover:bg-muted transition">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <span>{modulo.nombre}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation(); // evita que se abra/cierre el colapsable al hacer clic
                                  const permisosModulo: string[] = [
                                    ...modulo.acciones.map(
                                      (p) => p.nombre_permiso
                                    ),
                                    ...Object.values(modulo.submodulos).flatMap(
                                      (s) =>
                                        s.permisos.map((p) => p.nombre_permiso)
                                    ),
                                  ];
                                  const todosSeleccionados =
                                    permisosModulo.every((permiso) =>
                                      permisosPerfiles[moduloKey]?.includes(
                                        permiso
                                      )
                                    );

                                  const nuevos = todosSeleccionados
                                    ? []
                                    : permisosModulo;
                                  setPermisosPerfiles((prev) => ({
                                    ...prev,
                                    [moduloKey]: nuevos,
                                  }));
                                }}
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1 px-2 py-1 text-sm"
                              >
                                {(() => {
                                  const permisosModulo: string[] = [
                                    ...modulo.acciones.map(
                                      (p) => p.nombre_permiso
                                    ),
                                    ...Object.values(modulo.submodulos).flatMap(
                                      (s) =>
                                        s.permisos.map((p) => p.nombre_permiso)
                                    ),
                                  ];
                                  const todosSeleccionados =
                                    permisosModulo.every((permiso) =>
                                      permisosPerfiles[moduloKey]?.includes(
                                        permiso
                                      )
                                    );

                                  return (
                                    <>
                                      {todosSeleccionados ? (
                                        <CheckSquare className="w-4 h-4 text-green-600" />
                                      ) : (
                                        <Square className="w-4 h-4 text-muted-foreground" />
                                      )}
                                      <span>
                                        {todosSeleccionados
                                          ? "Todo"
                                          : "Ninguno"}
                                      </span>
                                    </>
                                  );
                                })()}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {(() => {
                                const permisosModulo: string[] = [
                                  ...modulo.acciones.map(
                                    (p) => p.nombre_permiso
                                  ),
                                  ...Object.values(modulo.submodulos).flatMap(
                                    (s) =>
                                      s.permisos.map((p) => p.nombre_permiso)
                                  ),
                                ];
                                const todosSeleccionados = permisosModulo.every(
                                  (permiso) =>
                                    permisosPerfiles[moduloKey]?.includes(
                                      permiso
                                    )
                                );
                                return todosSeleccionados
                                  ? "Deseleccionar todos los permisos"
                                  : "Seleccionar todos los permisos";
                              })()}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                      </div>
                    </button>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="px-4 pb-4 pt-2 space-y-4">
                    {/* Acciones directas del módulo */}
                    {modulo.acciones.length > 0 && (
                      <div className="space-y-2">
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
                        <div key={submoduloKey}>
                          <h4 className="font-semibold text-sm mb-2">
                            {submodulo.nombre}
                          </h4>
                          <div className="space-y-2 ml-4">
                            {submodulo.permisos.map((permiso) => (
                              <div
                                key={permiso.id}
                                className="flex items-center space-x-2 py-1"
                              >
                                <Checkbox
                                  id={`${submoduloKey}-${permiso.id}`}
                                  checked={permisosPerfiles[
                                    moduloKey
                                  ]?.includes(permiso.nombre_permiso)}
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
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="permisos">
          <RegisterPermiso />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Permisos;
