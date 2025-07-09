import {
  Calendar,
  ClipboardList,
  FileText,
  Settings,
  Plus,
  Search,
  UserRound,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEquipos } from "../productos/hooks/use-equipos";
import { Equipo } from "../productos/interfaces/equipo";
import { useUser } from "../usuarios/hooks/use-user";
import { useMantenimiento } from "./hooks/use-mantenimiento";
import { SearchSelect } from "../../components/SearchSelect";
import { Separator } from "@/components/ui/separator";
import { useSedes } from "../configuracion/maestros/hooks/use-sedes";
import { ListaChequeo } from "./ListaChequeo";
import { Checkbox } from "@/components/ui/checkbox";
import { useChecklist } from "../configuracion/checklist/hooks/use-checklist";
import { ListaChequeoSimple } from "../configuracion/checklist/views/CheckListSimple";
import { useEffect, useState } from "react";
import { Checklist } from "../configuracion/checklist/interface/checklist";
import { useImpresora } from "../toners/hooks/use-impresora";
import { usePeriferico } from "../configuracion/maestros/hooks/use-perifierico";
import { Impresora } from "../toners/interfaces/impresora";
import { Perifericos } from "../configuracion/maestros/interfaces/periferico";

const MantenimientosIndex = () => {
  const {
    newMante,
    setNewMante,
    currentTab,
    isDialogOpen,
    setIsDialogOpen,
    nextTab,
    previousTab,
    handleTabChange,
    equiposSeleccionados,
    setEquiposSeleccionados,
    onSubmit,
    setTecnicoResponsable,
    validEquipo,
    validDetalles,
    navigate,
    itemsChequeo,
    setItemsChequeo,
    toggleItem,
  } = useMantenimiento();
  const {
    setSelectedRecibeUser,
    handleNombreInput,
    nombreInput,
    sugerencias,
    setSugerencias,
    setNombreUser,
    users,
  } = useUser();
  const { equipo, newEquipo, setNewEquipo, setEquipo } = useEquipos();
  const { perifericos, newPeriferico, setNewPeriferico, setPerifericos } =
    usePeriferico();
  const { impresora, newImpresora, setNewImpresora, setImpresa } =
    useImpresora();
  const { sedes } = useSedes();
  const { checklist } = useChecklist();
  const [plantillaSeleccionada, setPlantillaSeleccionada] =
    useState<Checklist | null>(null);

  const [modoSeleccion, setModoSeleccion] = useState("");
  const [sedeFilter, setSedeFilter] = useState("");
  const [equiposPorSede, setEquiposPorSede] = useState([]);

  useEffect(() => {
    const allEquipos = equipo
      .filter(
        (e) => e.estado_ubicacion?.[0]?.estado_actual !== "En mantenimiento"
      )
      .map((e) => ({
        id: e.id_equipo,
        nombre: e.nombre_equipo,
        serial: e.nro_serie,

        sede: e.estado_ubicacion?.[0]?.sucursales?.sedes?.nombre || "Sin sede",
        tipo: "equipo",
      }));

    const allImpresoras = impresora
      .filter((i) => i.estado !== "En mantenimiento")
      .map((i) => ({
        id: i.id_impresora,
        nombre: i.nombre,
        serial: i.serial,
        sede: i.sucursales?.sedes?.nombre || "Sin sede",
        tipo: "impresora",
      }));

    const allPerifericos = perifericos
      .filter((p) => p.estado !== "En mantenimiento")
      .map((p) => ({
        id: p.id_periferico,
        nombre: p.nombre,
        serial: p.serial,
        sede: p.sucursales?.sedes?.nombre || "Sin sede",
        tipo: "periferico",
      }));

    setEquiposPorSede([...allEquipos, ...allImpresoras, ...allPerifericos]);
  }, [equipo, impresora, perifericos]);

  const handleChangePlantilla = (plantilla: Checklist | null) => {
    setPlantillaSeleccionada(plantilla);
    setItemsChequeo([]);
  };

  const handleUserSelect = (user) => {
    setNombreUser(user.nombre);
    setSelectedRecibeUser(user);
    setTecnicoResponsable({
      id: user.id_usuario.toString(),
      name: user.nombre,
      position: user.rol,
      department: user.sedes?.nombre || "Sin sede",
    });
    setNewMante((prev) => ({
      ...prev,
      tecnico_id: user.id_usuario,
    }));
    setSugerencias([]);
  };

  const selectEquipo = (equipo: Equipo) => {
    setNewMante((prev) => ({
      ...prev,
      mantenimiento_detalle: [
        ...prev.mantenimiento_detalle,
        { equipos: equipo, impresoras: null, perifericos: null },
      ],
    }));

    setNewEquipo((prev) => ({ ...prev, nro_serie: "" }));
  };

  const selectPeriferico = (periferico: Perifericos) => {
    setNewMante((prev) => ({
      ...prev,
      mantenimiento_detalle: [
        ...prev.mantenimiento_detalle,
        { equipos: null, perifericos: periferico, impresoras: null },
      ],
    }));

    setNewPeriferico({ ...newPeriferico, serial: "" });
  };

  const selectImpresora = (impresora: Impresora) => {
    setNewMante((prev) => ({
      ...prev,
      mantenimiento_detalle: [
        ...prev.mantenimiento_detalle,
        { equipos: null, perifericos: null, impresoras: impresora },
      ],
    }));

    setNewImpresora({ ...newImpresora, serial: "" });
  };

  const idsSeleccionadosEquipos = newMante.mantenimiento_detalle
    .map((d) => d.equipos?.id_equipo)
    .filter(Boolean);

  const equiposFiltrados = equipo.filter(
    (eq) =>
      `${eq.nombre_equipo} ${eq.nro_serie}`
        .toLowerCase()
        .includes(newEquipo.nro_serie.toLowerCase()) &&
      !idsSeleccionadosEquipos.includes(eq.id_equipo)
  );

  const idsSeleccionadosPerifericos = newMante.mantenimiento_detalle
    .map((d) => d.perifericos?.id_periferico)
    .filter(Boolean);

  const perifericosFiltrados = perifericos.filter(
    (p) =>
      `${p.nombre} ${p.serial}`
        .toLowerCase()
        .includes(newEquipo.nro_serie.toLowerCase()) &&
      !idsSeleccionadosPerifericos.includes(p.id_periferico)
  );

  const idsSeleccionadosImpresoras = newMante.mantenimiento_detalle
    .map((d) => d.impresoras?.id_impresora)
    .filter(Boolean);

  const impresorasFiltradas = impresora.filter(
    (i) =>
      `${i.nombre} ${i.serial}`
        .toLowerCase()
        .includes(newImpresora.serial.toLowerCase()) &&
      !idsSeleccionadosImpresoras.includes(i.id_impresora)
  );

  const equiposFiltradosPorSede = equiposPorSede.filter(
    (item) =>
      sedeFilter === "todas" ||
      item.sede ===
        sedes.find((s) => s.id_sede.toString() === sedeFilter)?.nombre
  );

  const toggleSeleccionEquipo = (item) => {
    const existe = equiposSeleccionados.some(
      (eq) => eq.tipo === item.tipo && eq.id === item.id
    );

    if (existe) {
      setEquiposSeleccionados((prev) =>
        prev.filter((eq) => !(eq.tipo === item.tipo && eq.id === item.id))
      );
      setNewMante((prev) => ({
        ...prev,
        mantenimiento_detalle: prev.mantenimiento_detalle.filter((detalle) => {
          if (item.tipo === "equipo")
            return detalle.equipos?.id_equipo !== item.id;
          if (item.tipo === "impresora")
            return detalle.impresoras?.id_impresora !== item.id;
          if (item.tipo === "periferico")
            return detalle.perifericos?.id_periferico !== item.id;
          return true;
        }),
      }));
    } else {
      setEquiposSeleccionados((prev) => [...prev, item]);

      setNewMante((prev) => {
        const updated = {
          ...prev,
          mantenimiento_detalle: [
            ...prev.mantenimiento_detalle,
            {
              equipos: item.tipo === "equipo" ? { id_equipo: item.id } : null,
              impresoras:
                item.tipo === "impresora" ? { id_impresora: item.id } : null,
              perifericos:
                item.tipo === "periferico" ? { id_periferico: item.id } : null,
            },
          ],
        };
        return updated;
      });
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-xl sm:text-2xl font-bold text-[#01242c] mb-4 sm:mb-6">
        Gestión de Mantenimientos
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-[#bff036] text-[#01242c]">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-[#01242c]">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-[#01242c]" />
                  <span>Nuevo Mantenimiento</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm text-[#01242c] opacity-90">
                  Crear un nuevo registro de mantenimiento para un equipo.
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-white">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
                Nuevo Mantenimiento
              </DialogTitle>
              <DialogDescription>
                Complete la información para programar un nuevo mantenimiento
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4 sm:space-y-6 mt-4"
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                const mantenimiento = {
                  ...newMante,
                  checklist_campos: itemsChequeo,
                  plantilla_id: plantillaSeleccionada?.id_plantilla,
                };
                onSubmit(mantenimiento);
              }}
            >
              <Tabs
                defaultValue="equipo"
                value={currentTab}
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="equipo">Equipo</TabsTrigger>
                  <TabsTrigger value="detalles" disabled={!validEquipo}>
                    Detalles
                  </TabsTrigger>
                  <TabsTrigger value="programacion" disabled={!validDetalles}>
                    Programación
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="equipo" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="relative space-y-4">
                      <div className="space-y-1">
                        <Label>Modo de selección</Label>
                        <Select onValueChange={(v) => setModoSeleccion(v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar modo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sedes">Por Sede</SelectItem>
                            <SelectItem value="equipos">Por Equipo</SelectItem>
                            <SelectItem value="perifericos">
                              Por Periférico
                            </SelectItem>
                            <SelectItem value="impresoras">
                              Por Impresora
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Si elige por sede */}
                      {modoSeleccion === "sedes" && (
                        <>
                          <div className="space-y-2">
                            <Label>Filtrar por sede</Label>
                            <Select
                              value={sedeFilter}
                              onValueChange={setSedeFilter}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar sede" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="todas">
                                  Todas las sedes
                                </SelectItem>
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

                          {equiposFiltradosPorSede.length > 0 ? (
                            <div className="border rounded-lg max-h-52 overflow-y-auto divide-y">
                              {equiposFiltradosPorSede.map((item) => (
                                <div
                                  key={`${item.tipo}-${item.id}`}
                                  className="flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                >
                                  <input
                                    type="checkbox"
                                    checked={equiposSeleccionados.some(
                                      (eq) =>
                                        eq.tipo === item.tipo &&
                                        eq.id === item.id
                                    )}
                                    onChange={() => toggleSeleccionEquipo(item)}
                                    className="mr-3"
                                  />
                                  <div>
                                    <div className="font-medium">
                                      {item.tipo === "equipo"
                                        ? "Equipo"
                                        : item.tipo === "impresora"
                                        ? "Impresora"
                                        : "Periférico"}
                                      : {item.nombre}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Serial: {item.serial} | Sede: {item.sede}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No hay resultados para esta sede.
                            </p>
                          )}
                        </>
                      )}

                      {/* Si elige por equipo */}
                      {modoSeleccion === "equipos" && (
                        <>
                          <div className="flex items-center mb-2">
                            <UserRound className="h-4 w-4 mr-2 text-gray-500" />
                            <Label className="text-sm sm:text-base font-medium">
                              Buscar Equipo
                            </Label>
                          </div>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Buscar por número de serie o nombre"
                              value={newEquipo.nro_serie}
                              onChange={(e) =>
                                setNewEquipo({
                                  ...newEquipo,
                                  nro_serie: e.target.value,
                                })
                              }
                              className="w-full pl-10 mt-1"
                            />
                          </div>

                          {newEquipo.nro_serie.trim() !== "" &&
                            equiposFiltrados.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                                {equiposFiltrados.map((equipo) => (
                                  <div
                                    key={equipo.id_equipo}
                                    className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                    onClick={() => selectEquipo(equipo)}
                                  >
                                    <div className="font-medium text-sm sm:text-base">
                                      {equipo.nombre_equipo}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600 mt-1">
                                      <div className="grid grid-cols-2 gap-2">
                                        <span>
                                          <span className="font-semibold">
                                            Serial:
                                          </span>{" "}
                                          {equipo.nro_serie}
                                        </span>
                                        <span>
                                          <span className="font-semibold">
                                            Tipo de activo:
                                          </span>{" "}
                                          {equipo.tipo_activo}
                                        </span>
                                        <span>
                                          <span className="font-semibold">
                                            Marca:
                                          </span>{" "}
                                          {equipo.marcas}
                                        </span>
                                        <span>
                                          <span className="font-semibold">
                                            Modelo:
                                          </span>{" "}
                                          {equipo.modelo}
                                        </span>
                                        <span>
                                          <span className="font-semibold">
                                            Sede:
                                          </span>{" "}
                                          {equipo.sedes}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                        </>
                      )}

                      {modoSeleccion === "perifericos" && (
                        <>
                          <div className="flex items-center mb-2">
                            <UserRound className="h-4 w-4 mr-2 text-gray-500" />
                            <Label className="text-sm sm:text-base font-medium">
                              Buscar Periférico
                            </Label>
                          </div>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Buscar por número de serie o nombre"
                              value={newPeriferico.serial}
                              onChange={(e) =>
                                setNewPeriferico({
                                  ...newPeriferico,
                                  serial: e.target.value,
                                })
                              }
                              className="w-full pl-10 mt-1"
                            />
                          </div>

                          {newPeriferico.serial.trim() !== "" &&
                            perifericosFiltrados.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                                {perifericosFiltrados.map((periferico) => (
                                  <div
                                    key={periferico.id_periferico}
                                    className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                    onClick={() => selectPeriferico(periferico)}
                                  >
                                    <div className="font-medium text-sm sm:text-base">
                                      {periferico.nombre}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600 mt-1">
                                      <div className="grid grid-cols-2 gap-2">
                                        <span>
                                          <span className="font-semibold">
                                            Serial:
                                          </span>{" "}
                                          {periferico.serial}
                                        </span>
                                        <span>
                                          <span className="font-semibold">
                                            Tipo de activo:
                                          </span>{" "}
                                          {periferico.tipo}
                                        </span>
                                        <span>
                                          <span className="font-semibold">
                                            Marca:
                                          </span>{" "}
                                          {periferico.marcas?.nombre}
                                        </span>
                                        <span>
                                          <span className="font-semibold">
                                            Sede:
                                          </span>{" "}
                                          {periferico.sucursales?.sedes?.nombre}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                        </>
                      )}

                      {modoSeleccion === "impresoras" && (
                        <>
                          <div className="flex items-center mb-2">
                            <UserRound className="h-4 w-4 mr-2 text-gray-500" />
                            <Label className="text-sm sm:text-base font-medium">
                              Buscar Impresora
                            </Label>
                          </div>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Buscar por número de serie o nombre"
                              value={newImpresora.serial}
                              onChange={(e) =>
                                setNewImpresora({
                                  ...newImpresora,
                                  serial: e.target.value,
                                })
                              }
                              className="w-full pl-10 mt-1"
                            />
                          </div>

                          {newImpresora.serial.trim() !== "" &&
                            impresorasFiltradas.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                                {impresorasFiltradas.map((impresora) => (
                                  <div
                                    key={impresora.id_impresora}
                                    className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                    onClick={() => selectImpresora(impresora)}
                                  >
                                    <div className="font-medium text-sm sm:text-base">
                                      {impresora.nombre}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600 mt-1">
                                      <div className="grid grid-cols-2 gap-2">
                                        <span>
                                          <span className="font-semibold">
                                            Serial:
                                          </span>{" "}
                                          {impresora.serial}{" "}
                                        </span>
                                        <span>
                                          <span className="font-semibold">
                                            Tipo de activo:
                                          </span>{" "}
                                          {impresora.tipo}
                                        </span>
                                        <span>
                                          <span className="font-semibold">
                                            Marca:
                                          </span>{" "}
                                          {impresora.marcas?.nombre}
                                        </span>
                                        <span>
                                          <span className="font-semibold">
                                            Sede:
                                          </span>{" "}
                                          {impresora.sucursales?.sedes?.nombre}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                        </>
                      )}
                    </div>

                    {modoSeleccion === "equipos" &&
                      newMante.mantenimiento_detalle.length > 0 && (
                        <div className="space-y-4">
                          {newMante.mantenimiento_detalle.map(
                            (detalle, index) => (
                              <div
                                key={detalle.equipos?.id_equipo || index}
                                className="bg-gray-50 rounded-lg p-4 border space-y-3"
                              >
                                <h4 className="font-semibold text-sm sm:text-base flex items-center">
                                  <UserRound className="h-4 w-4 mr-2 text-gray-500" />
                                  Equipo Seleccionado
                                </h4>
                                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-500">Nombre</p>
                                    <p className="font-medium">
                                      {detalle.equipos?.nombre_equipo}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Serial</p>
                                    <p className="font-medium">
                                      {detalle.equipos?.nro_serie}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">
                                      Marca / Modelo
                                    </p>
                                    <p className="font-medium">
                                      {detalle.equipos?.marcas} /{" "}
                                      {detalle.equipos?.modelo}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Responsable</p>
                                    <p className="font-medium">
                                      {
                                        detalle.equipos?.estado_ubicacion?.[0]
                                          ?.usuarios?.nombre
                                      }
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Área</p>
                                    <p className="font-medium">
                                      {
                                        detalle.equipos?.estado_ubicacion?.[0]
                                          ?.sucursales?.area
                                      }
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Sede</p>
                                    <p className="font-medium">
                                      {detalle.equipos?.sedes}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}

                    {modoSeleccion === "perifericos" &&
                      newMante.mantenimiento_detalle.length > 0 && (
                        <div className="space-y-4">
                          {newMante.mantenimiento_detalle
                            .filter((d) => d.perifericos)
                            .map((detalle, index) => (
                              <div
                                key={
                                  detalle.perifericos?.id_periferico || index
                                }
                                className="bg-gray-50 rounded-lg p-4 border space-y-3"
                              >
                                <h4 className="font-semibold text-sm sm:text-base flex items-center">
                                  <UserRound className="h-4 w-4 mr-2 text-gray-500" />
                                  Periférico Seleccionado
                                </h4>
                                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-500">Nombre</p>
                                    <p className="font-medium">
                                      {detalle.perifericos?.nombre}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Serial</p>
                                    <p className="font-medium">
                                      {detalle.perifericos?.serial}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">
                                      Tipo de activo
                                    </p>
                                    <p className="font-medium">
                                      {detalle.perifericos?.tipo}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Marca</p>
                                    <p className="font-medium">
                                      {detalle.perifericos?.marcas?.nombre}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Sede</p>
                                    <p className="font-medium">
                                      {
                                        detalle.perifericos?.sucursales?.sedes
                                          ?.nombre
                                      }
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}

                    {modoSeleccion === "impresoras" &&
                      newMante.mantenimiento_detalle.length > 0 && (
                        <div className="space-y-4">
                          {newMante.mantenimiento_detalle
                            .filter((d) => d.impresoras)
                            .map((detalle, index) => (
                              <div
                                key={detalle.impresoras?.id_impresora || index}
                                className="bg-gray-50 rounded-lg p-4 border space-y-3"
                              >
                                <h4 className="font-semibold text-sm sm:text-base flex items-center">
                                  <UserRound className="h-4 w-4 mr-2 text-gray-500" />
                                  Impresora Seleccionada
                                </h4>
                                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-500">Nombre</p>
                                    <p className="font-medium">
                                      {detalle.impresoras?.nombre}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Serial</p>
                                    <p className="font-medium">
                                      {detalle.impresoras?.serial}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">
                                      Tipo de activo
                                    </p>
                                    <p className="font-medium">
                                      {detalle.impresoras?.tipo}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Marca</p>
                                    <p className="font-medium">
                                      {detalle.impresoras?.marcas?.nombre}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Sede</p>
                                    <p className="font-medium">
                                      {
                                        detalle.impresoras?.sucursales?.sedes
                                          ?.nombre
                                      }
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={nextTab}
                        className="bg-[#bff036] text-[#01242c] hover:bg-[#a8d72f]"
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="detalles" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo de mantenimiento</Label>
                      <Select
                        value={newMante.tipo ? newMante.tipo : ""}
                        onValueChange={(value) =>
                          setNewMante({ ...newMante, tipo: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Preventivo">Preventivo</SelectItem>
                          <SelectItem value="Correctivo">Correctivo</SelectItem>
                          <SelectItem value="Predictivo">Predictivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prioridad">Prioridad</Label>
                      <Select
                        value={newMante.prioridad ? newMante.prioridad : ""}
                        onValueChange={(value) =>
                          setNewMante({ ...newMante, prioridad: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="baja">Baja</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <SearchSelect
                    label="Técnico asignado"
                    value={nombreInput}
                    onInputChange={handleNombreInput}
                    suggestions={sugerencias.filter(
                      (user) => user.rol === "Agente"
                    )}
                    onSelect={handleUserSelect}
                    getKey={(u) => u.id_usuario}
                    getLabel={(u) => u.nombre}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="descripcion">
                      Descripción del mantenimiento
                    </Label>
                    <Textarea
                      id="descripcion"
                      placeholder="Describa detalladamente el mantenimiento a realizar"
                      rows={4}
                      value={newMante.descripcion}
                      onChange={(e) => {
                        setNewMante({
                          ...newMante,
                          descripcion: e.target.value,
                        });
                      }}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={previousTab}
                    >
                      Anterior
                    </Button>
                    <Button
                      type="button"
                      onClick={nextTab}
                      className="bg-[#bff036] text-[#01242c] hover:bg-[#a8d72f]"
                    >
                      Siguiente
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="programacion" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center mb-2">
                        <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                        <Label>Fecha programada</Label>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newMante.fecha_programada
                              ? format(newMante.fecha_programada, "PPP")
                              : "Seleccionar fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={newMante.fecha_programada as Date}
                            onSelect={(date) =>
                              setNewMante({
                                ...newMante,
                                fecha_programada: date as Date,
                              })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center mb-4">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <Label>Tiempo estimado (horas)</Label>
                      </div>
                      <Select
                        value={
                          newMante.tiempo_estimado != null
                            ? newMante.tiempo_estimado.toString()
                            : ""
                        }
                        onValueChange={(value) =>
                          setNewMante({
                            ...newMante,
                            tiempo_estimado: Number(value),
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tiempo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="8">8</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recomendaciones">Recomendaciones</Label>
                    <Textarea
                      id="recomendaciones"
                      placeholder="Ingrese recomendaciones para el mantenimiento"
                      rows={4}
                      value={newMante.recomendaciones}
                      onChange={(e) => {
                        setNewMante({
                          ...newMante,
                          recomendaciones: e.target.value,
                        });
                      }}
                    />
                  </div>

                  <ListaChequeoSimple
                    checklist={checklist}
                    plantillaSeleccionada={plantillaSeleccionada}
                    onChangePlantilla={handleChangePlantilla}
                    itemsSeleccionados={itemsChequeo}
                    onToggleItem={toggleItem}
                  />

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="observaciones">
                      Observaciones adicionales
                    </Label>
                    <Textarea
                      id="observaciones"
                      placeholder="Ingrese observaciones adicionales"
                      rows={4}
                      value={newMante.observaciones_adi}
                      onChange={(e) => {
                        setNewMante({
                          ...newMante,
                          observaciones_adi: e.target.value,
                        });
                      }}
                    />
                  </div>

                  <div className="flex justify-between pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={previousTab}
                    >
                      Anterior
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#bff036] text-[#01242c] hover:bg-[#a8d72f]"
                    >
                      Crear Mantenimiento
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </DialogContent>
        </Dialog>

        <ListaChequeo />

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer bg-[#bff036]"
          onClick={() => navigate("/mantenimientos/programacion")}
        >
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-[#01242c]">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-[#01242c]" />
              <span>Programación</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs sm:text-sm text-[#01242c] opacity-90">
              Programa y gestiona los mantenimientos preventivos y correctivos.
            </p>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer bg-[#bff036]"
          onClick={() => navigate("/mantenimientos/ejecucion")}
        >
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-[#01242c]">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-[#01242c]" />
              <span>Ejecución</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs sm:text-sm text-[#01242c] opacity-90">
              Registra y actualiza los mantenimientos en curso.
            </p>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer bg-[#bff036]"
          onClick={() => navigate("/mantenimientos/documentacion")}
        >
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-[#01242c]">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-[#01242c]" />
              <span>Documentación</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs sm:text-sm text-[#01242c] opacity-90">
              Gestiona la documentación y evidencias de los mantenimientos.
            </p>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer bg-[#bff036]"
          onClick={() => navigate("/mantenimientos/auditoria")}
        >
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-[#01242c]">
              <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-[#01242c]" />
              <span>Auditoría</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs sm:text-sm text-[#01242c] opacity-90">
              Revisa y audita los mantenimientos realizados.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MantenimientosIndex;
