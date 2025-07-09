/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { format } from "date-fns";
import { Calendar as CalendarIcon, FileText, Paperclip, X } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEquipos } from "../hooks/use-equipos";
import { useMarcas } from "../../configuracion/maestros/hooks/use-marcas";
import { useCategoria } from "../../configuracion/maestros/hooks/use-categoria";
import { useSucursales } from "../../configuracion/maestros/hooks/use-sucursales";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "@/components/Loading";
import { useEstado } from "@/pages/configuracion/maestros/hooks/use-estado";
import { useTipos } from "@/pages/configuracion/maestros/hooks/use-tipos";
import ImagenEquipoUploader from "../components/ImagenEquipo";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchSelect } from "@/components/SearchSelect";
import { useProveedor } from "@/pages/configuracion/maestros/hooks/use-proveedor";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";
import { useUser } from "@/pages/usuarios/hooks/use-user";

const EditEquipo = () => {
  const { nroSeries } = useParams();
  const {
    handleVolver,
    form,
    setNewEquipo,
    newEquipo,
    getInfoEquipo,
    isLoading,
    setIsLoading,
    update,
    setResponsableRecibeInput,
    setResponsableEntregaInput,
    responsableEntregaInput,
    handleResponsable,
    sugerenciasResponsable,
    formatNumber,
    setSugerenciasResponsable,
    formatearVidaUtil,
  } = useEquipos();
  const {
    handleNombreInput,
    nombreInput,
    sugerencias,
    setSugerencias,
    setNombreUser,
  } = useUser();
  const {
    handleNombre,
    nombreProvee,
    sugerenciasProveedor,
    setNombreProveedor,
    setSugerenciasProveedor,
    proveedorServicio,
    setProveedorServicio,
    sugerenciasProveedorServicio,
    setSugerenciasProveedorServicio,
  } = useProveedor();
  const { marcas } = useMarcas();
  const { categoria } = useCategoria();
  const { sucursales } = useSucursales();
  const { estados } = useEstado();
  const { tipos } = useTipos();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getInfoEquipo(nroSeries);
      setIsLoading(false);
    };

    if (nroSeries) {
      fetchData();
    }
  }, [nroSeries]);

  useEffect(() => {
    const { valor_depreciado } = newEquipo.administrativa;
    const { precio_compra, fecha_compra } = newEquipo.adquisicion;

    if (
      precio_compra &&
      valor_depreciado &&
      fecha_compra &&
      precio_compra > 0 &&
      valor_depreciado >= 0
    ) {
      const fechaCompra = new Date(fecha_compra);
      const hoy = new Date();
      const añosTranscurridos =
        hoy.getFullYear() -
        fechaCompra.getFullYear() +
        (hoy.getMonth() - fechaCompra.getMonth()) / 12;

      const depreciacionAnual = valor_depreciado / añosTranscurridos;
      const vidaUtilTotal = precio_compra / depreciacionAnual;
      const vidaUtilRestante = vidaUtilTotal - añosTranscurridos;

      setNewEquipo((prev) => ({
        ...prev,
        administrativa: {
          ...prev.administrativa,
          vida_util_restante:
            vidaUtilRestante > 0
              ? formatearVidaUtil(vidaUtilRestante)
              : "0 meses",
        },
      }));
    }
  }, [
    newEquipo.adquisicion.precio_compra,
    newEquipo.administrativa.valor_depreciado,
    newEquipo.adquisicion.fecha_compra,
  ]);

  const handleSelect = (
    tipo: "usuario" | "responsable" | "proveedor" | "proveedor_servicio",
    data: any
  ) => {
    const nombre = data.nombre;
    const id =
      tipo === "proveedor" || tipo === "proveedor_servicio"
        ? data.id_proveedor
        : data.id_usuario;

    // Inputs
    if (tipo === "usuario") setNombreUser(nombre);
    if (tipo === "responsable") setResponsableEntregaInput(nombre);
    if (tipo === "proveedor") setNombreProveedor(nombre);
    if (tipo === "proveedor_servicio") setProveedorServicio(nombre);

    setResponsableRecibeInput({ id: id.toString(), name: nombre });

    // newEquipo update
    setNewEquipo((prev) => ({
      ...prev,
      ...(tipo === "usuario" && {
        administrativa: {
          ...prev.administrativa,
          autorizado_por_id: id,
        },
      }),
      ...(tipo === "responsable" && {
        estado_ubicacion: {
          ...prev.estado_ubicacion,
          responsable_id: id,
        },
      }),
      ...(tipo === "proveedor" && {
        adquisicion: {
          ...prev.adquisicion,
          proveedor_id: id,
        },
      }),
      ...(tipo === "proveedor_servicio" && {
        mantenimiento: {
          ...prev.mantenimiento,
          proveedor_servicio_id: id,
        },
      }),
    }));

    // Limpiar sugerencias
    if (tipo === "usuario") setSugerencias([]);
    if (tipo === "responsable") setSugerenciasResponsable([]);
    if (tipo === "proveedor") setSugerenciasProveedor([]);
    if (tipo === "proveedor_servicio") setSugerenciasProveedorServicio([]);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="relative w-full overflow-x-hidden">
          <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-4 max-w-full">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                onClick={handleVolver}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <h1 className="text-2xl font-bold text-[#040d50]">
                Actualización del Equipo:{" "}
                {newEquipo.nombre_equipo || "Cargando..."}
              </h1>
            </div>

            <Form {...form}>
              <form className="space-y-6">
                <div className="grid gap-6 max-w-full">
                  <Card className="max-w-full">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-[#040d50]">
                        Información Básica
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nombre_equipo">
                            Nombre del Equipo
                          </Label>
                          <Input
                            placeholder="Nombre del equipo"
                            value={newEquipo.nombre_equipo}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                nombre_equipo: e.target.value,
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="nro_serie">Número de Serie</Label>
                          <Input
                            placeholder="Número de serie"
                            value={newEquipo.nro_serie}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                nro_serie: e.target.value,
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tipo_activo">Tipo de Activo</Label>
                          <Select
                            value={newEquipo.tipo_activo}
                            onValueChange={(value) =>
                              setNewEquipo({ ...newEquipo, tipo_activo: value })
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar un tipo de activo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="w-full">
                              {tipos.map((tipo) => (
                                <SelectItem
                                  key={tipo.id_tipo}
                                  value={tipo.nombre_tipo}
                                >
                                  {tipo.nombre_tipo}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="marca_id">Marca/Fabricante</Label>
                          <Select
                            value={
                              newEquipo.marca_id
                                ? newEquipo.marca_id.toString()
                                : ""
                            }
                            onValueChange={(value) =>
                              setNewEquipo({
                                ...newEquipo,
                                marca_id: Number(value),
                              })
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar marca" />
                              </SelectTrigger>
                            </FormControl>
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
                          <Label htmlFor="categoria_id">
                            Categoría del Equipo
                          </Label>
                          <Select
                            value={
                              newEquipo.categoria_id
                                ? newEquipo.categoria_id.toString()
                                : ""
                            }
                            onValueChange={(value) =>
                              setNewEquipo({
                                ...newEquipo,
                                categoria_id: Number(value),
                              })
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar categoría" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="w-full">
                              {categoria.map((categoria) => (
                                <SelectItem
                                  key={categoria.id_categoria}
                                  value={categoria.id_categoria.toString()}
                                >
                                  {categoria.nombre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="modelo">Modelo</Label>
                          <Input
                            placeholder="Modelo del equipo"
                            value={newEquipo.modelo}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                modelo: e.target.value,
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <ImagenEquipoUploader
                            value={newEquipo.imagen}
                            onChange={(base64) =>
                              setNewEquipo((prev) => ({
                                ...prev,
                                imagen: base64,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Especificaciones Técnicas */}
                  <Card className="max-w-full">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-[#040d50]">
                        Especificaciones Técnicas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="especificaciones.procesador">
                            Procesador
                          </Label>
                          <Input
                            placeholder="Ej: Intel Core i5 11th Gen"
                            value={newEquipo.especificaciones.procesador}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                especificaciones: {
                                  ...newEquipo.especificaciones,
                                  procesador: e.target.value,
                                },
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="especificaciones.memoria_ram">
                            Memoria RAM
                          </Label>
                          <Input
                            placeholder="Ej: 16 GB"
                            value={newEquipo.especificaciones.memoria_ram}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                especificaciones: {
                                  ...newEquipo.especificaciones,
                                  memoria_ram: e.target.value,
                                },
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="especificaciones.almacenamiento">
                            Almacenamiento
                          </Label>
                          <Input
                            placeholder="Ej: 512 GB"
                            value={newEquipo.especificaciones.almacenamiento}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                especificaciones: {
                                  ...newEquipo.especificaciones,
                                  almacenamiento: e.target.value,
                                },
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="especificaciones.tarjeta_grafica">
                            Tarjeta Gráfica
                          </Label>
                          <Input
                            placeholder="Ej. NVIDIA GeForce GTX 1660"
                            value={newEquipo.especificaciones.tarjeta_grafica}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                especificaciones: {
                                  ...newEquipo.especificaciones,
                                  tarjeta_grafica: e.target.value,
                                },
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="especificaciones.tipo_discoduro">
                            Tipo de Disco Duro
                          </Label>
                          <Input
                            placeholder="Ej: SSD, HDD, NVMe"
                            value={newEquipo.especificaciones.tipo_discoduro}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                especificaciones: {
                                  ...newEquipo.especificaciones,
                                  tipo_discoduro: e.target.value,
                                },
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="especificaciones.pantalla">
                            Pantalla
                          </Label>
                          <Input
                            placeholder="Ej: 15.6 pulgadas Full HD"
                            value={newEquipo.especificaciones.pantalla}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                especificaciones: {
                                  ...newEquipo.especificaciones,
                                  pantalla: e.target.value,
                                },
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="especificaciones.sistema_operativo">
                            Sistema Operativo
                          </Label>
                          <Input
                            placeholder="Ej: Windows 10"
                            value={newEquipo.especificaciones.sistema_operativo}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                especificaciones: {
                                  ...newEquipo.especificaciones,
                                  sistema_operativo: e.target.value,
                                },
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="especificaciones.bateria">
                            Batería
                          </Label>
                          <Input
                            placeholder="Ej: 120 Wh"
                            value={newEquipo.especificaciones.bateria}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                especificaciones: {
                                  ...newEquipo.especificaciones,
                                  bateria: e.target.value,
                                },
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="especificaciones.puertos">
                            Puertos
                          </Label>
                          <Input
                            placeholder="Ej: USB 3.0, HDMI, VGA"
                            value={newEquipo.especificaciones.puertos}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                especificaciones: {
                                  ...newEquipo.especificaciones,
                                  puertos: e.target.value,
                                },
                              });
                            }}
                          />
                        </div>

                        {/* Tiene Cargador */}
                        <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <div className="pt-1">
                            <Checkbox
                              checked={newEquipo.especificaciones.tienecargador}
                              onCheckedChange={(checked) =>
                                setNewEquipo((prev) => ({
                                  ...prev,
                                  especificaciones: {
                                    ...prev.especificaciones,
                                    tienecargador: checked as boolean,
                                  },
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-1 leading-none">
                            <label className="text-sm font-medium">
                              Tiene Cargador
                            </label>
                            <p className="text-sm text-muted-foreground">
                              Marque esta casilla si el equipo incluye cargador
                            </p>
                          </div>
                        </div>

                        {/* Serial del cargador (si aplica) */}
                        {newEquipo.especificaciones.tienecargador && (
                          <div className="mt-4 space-y-2">
                            <label className="text-sm font-medium">
                              Serial del Cargador
                            </label>
                            <Input
                              placeholder="Ingrese el serial del cargador"
                              value={newEquipo.especificaciones.serialcargador}
                              onChange={(e) =>
                                setNewEquipo((prev) => ({
                                  ...prev,
                                  especificaciones: {
                                    ...prev.especificaciones,
                                    serialcargador: e.target.value,
                                  },
                                }))
                              }
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Información de Adquisición */}
                  <Card className="max-w-full">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-[#040d50]">
                        Información de Adquisición
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="adquisicion.fecha_compra">
                            Fecha de Compra
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal"
                                  )}
                                >
                                  {newEquipo.adquisicion.fecha_compra ? (
                                    format(
                                      newEquipo.adquisicion.fecha_compra,
                                      "P"
                                    )
                                  ) : (
                                    <span>Seleccionar fecha</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  newEquipo.adquisicion.fecha_compra
                                    ? new Date(
                                        newEquipo.adquisicion.fecha_compra
                                      )
                                    : undefined
                                }
                                onSelect={(date) =>
                                  setNewEquipo({
                                    ...newEquipo,
                                    adquisicion: {
                                      ...newEquipo.adquisicion,
                                      fecha_compra: date
                                        ? date.toISOString()
                                        : "",
                                    },
                                  })
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <SearchSelect
                            label="Proveedor"
                            placeholder="Ingrese el nombre del proveedor"
                            value={
                              nombreProvee ||
                              newEquipo.adquisicion?.proveedores?.nombre ||
                              ""
                            }
                            onInputChange={handleNombre}
                            suggestions={sugerenciasProveedor}
                            onSelect={(data) => handleSelect("proveedor", data)}
                            getKey={(u) => u.id_proveedor}
                            getLabel={(u) => u.nombre}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="adquisicion.numero_factura">
                            Número de Factura
                          </Label>
                          <Input
                            placeholder="Número de factura"
                            value={newEquipo.adquisicion.numero_factura}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                adquisicion: {
                                  ...newEquipo.adquisicion,
                                  numero_factura: e.target.value,
                                },
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="adquisicion.precio_compra">
                            Precio de Adquisición
                          </Label>
                          <Input
                            placeholder="Precio de Adquisición"
                            type="text"
                            value={formatNumber(
                              newEquipo.adquisicion.precio_compra
                            )}
                            onChange={(e) => {
                              const input = e.target.value;

                              if (/[^0-9.]/.test(input)) {
                                toast.error(
                                  "Solo se permiten números. Se han removido caracteres inválidos.",
                                  {
                                    icon: icons.error,
                                  }
                                );
                              }

                              const raw = input.replace(/\D/g, "");

                              setNewEquipo({
                                ...newEquipo,
                                adquisicion: {
                                  ...newEquipo.adquisicion,
                                  precio_compra: Number(raw),
                                },
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="adquisicion.forma_pago">
                            Forma de Pago
                          </Label>
                          <Select
                            value={newEquipo.adquisicion.forma_pago}
                            onValueChange={(value) =>
                              setNewEquipo({
                                ...newEquipo,
                                adquisicion: {
                                  ...newEquipo.adquisicion,
                                  forma_pago: value,
                                },
                              })
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar forma de pago" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="w-full">
                              <SelectItem value="Efectivo">Efectivo</SelectItem>
                              <SelectItem value="Tarjeta de Crédito">
                                Tarjeta de Crédito
                              </SelectItem>
                              <SelectItem value="Transferencia Bancaria">
                                Transferencia Bancaria
                              </SelectItem>
                              <SelectItem value="Cheque">Cheque</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="adquisicion.plazo_pago">
                            Plazo de Pago
                          </Label>
                          <Input
                            placeholder="Plazo de Pago"
                            value={newEquipo.adquisicion.plazo_pago}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                adquisicion: {
                                  ...newEquipo.adquisicion,
                                  plazo_pago: e.target.value,
                                },
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="adquisicion.orden_compra">
                            Orden de Compra
                          </Label>
                          <Input
                            placeholder="Número de orden de compra"
                            value={newEquipo.adquisicion.orden_compra}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                adquisicion: {
                                  ...newEquipo.adquisicion,
                                  orden_compra: e.target.value,
                                },
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Inicio de Garantia</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal"
                                  )}
                                >
                                  {newEquipo.adquisicion.inicio_garantia ? (
                                    format(
                                      newEquipo.adquisicion.inicio_garantia,
                                      "PP"
                                    )
                                  ) : (
                                    <span>Seleccionar fecha</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  newEquipo.adquisicion.inicio_garantia
                                    ? new Date(
                                        newEquipo.adquisicion.inicio_garantia
                                      )
                                    : undefined
                                }
                                onSelect={(date) =>
                                  setNewEquipo({
                                    ...newEquipo,
                                    adquisicion: {
                                      ...newEquipo.adquisicion,
                                      inicio_garantia: date
                                        ? date.toISOString()
                                        : "",
                                    },
                                  })
                                }
                                disabled={(date) =>
                                  date < new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <Label>Fin de Garantia</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal"
                                  )}
                                >
                                  {newEquipo.adquisicion.garantia_fecha_fin ? (
                                    format(
                                      newEquipo.adquisicion.garantia_fecha_fin,
                                      "PP"
                                    )
                                  ) : (
                                    <span>Seleccionar fecha</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  newEquipo.adquisicion.garantia_fecha_fin
                                    ? new Date(
                                        newEquipo.adquisicion.garantia_fecha_fin
                                      )
                                    : undefined
                                }
                                onSelect={(date) =>
                                  setNewEquipo({
                                    ...newEquipo,
                                    adquisicion: {
                                      ...newEquipo.adquisicion,
                                      garantia_fecha_fin: date
                                        ? date.toISOString()
                                        : "",
                                    },
                                  })
                                }
                                disabled={(date) =>
                                  date < new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Estado y Ubicación */}
                  <Card className="max-w-full">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-[#040d50]">
                        Estado y Ubicación
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="estado_actual">Estado Actual</Label>
                          <Select
                            value={newEquipo.estado_ubicacion.estado_actual}
                            onValueChange={(value) =>
                              setNewEquipo({
                                ...newEquipo,
                                estado_ubicacion: {
                                  ...newEquipo.estado_ubicacion,
                                  estado_actual: value,
                                },
                              })
                            }
                            disabled={
                              newEquipo.estado_ubicacion?.estado_actual !==
                              "Activo"
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar estado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="w-full">
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

                        <div className="space-y-2">
                          <Label htmlFor="sucursal_id">
                            Sucursal del Equipo
                          </Label>
                          <Select
                            value={
                              newEquipo.estado_ubicacion.sucursal_id
                                ? newEquipo.estado_ubicacion.sucursal_id.toString()
                                : ""
                            }
                            onValueChange={(value) =>
                              setNewEquipo({
                                ...newEquipo,
                                estado_ubicacion: {
                                  ...newEquipo.estado_ubicacion,
                                  sucursal_id: Number(value),
                                },
                              })
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar una sucursal" />
                              </SelectTrigger>
                            </FormControl>
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
                          <Label htmlFor="departamento">Departamento</Label>
                          <Input
                            placeholder="Departamento asignado"
                            value={newEquipo.estado_ubicacion.departamento}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                estado_ubicacion: {
                                  ...newEquipo.estado_ubicacion,
                                  departamento: e.target.value,
                                },
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <SearchSelect
                            label="Responsable"
                            placeholder="Ingrese el nombre del responsable"
                            value={
                              responsableEntregaInput ||
                              newEquipo.estado_ubicacion.usuarios?.nombre
                            }
                            onInputChange={handleResponsable}
                            suggestions={sugerenciasResponsable}
                            onSelect={(data) =>
                              handleSelect("responsable", data)
                            }
                            getKey={(u) => u.id_usuario}
                            getLabel={(u) => u.nombre}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="disponibilidad">Disponibilidad</Label>
                          <Select
                            value={newEquipo.estado_ubicacion.disponibilidad}
                            onValueChange={(value) =>
                              setNewEquipo({
                                ...newEquipo,
                                estado_ubicacion: {
                                  ...newEquipo.estado_ubicacion,
                                  disponibilidad: value,
                                },
                              })
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar disponibilidad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="w-full">
                              <SelectItem value="Disponible">
                                Disponible
                              </SelectItem>
                              <SelectItem value="Asignado">Asignado</SelectItem>
                              <SelectItem value="Reservado">
                                Reservado
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="condicionFisica">
                            Condición Física
                          </Label>
                          <Select
                            value={newEquipo.estado_ubicacion.condicion_fisica}
                            onValueChange={(value) =>
                              setNewEquipo({
                                ...newEquipo,
                                estado_ubicacion: {
                                  ...newEquipo.estado_ubicacion,
                                  condicion_fisica: value,
                                },
                              })
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar condición" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="w-full">
                              <SelectItem value="Nuevo">Nuevo</SelectItem>
                              <SelectItem value="Bueno">Bueno</SelectItem>
                              <SelectItem value="Malo">Malo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Mantenimiento */}
                  <Card className="max-w-full">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-[#040d50]">
                        Mantenimiento
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Frecuencia de Mantenimiento</Label>
                          <Select
                            value={
                              newEquipo.mantenimiento.frecuencia_mantenimiento
                            }
                            onValueChange={(value) =>
                              setNewEquipo((prev) => ({
                                ...prev,
                                mantenimiento: {
                                  ...prev.mantenimiento,
                                  frecuencia_mantenimiento: value,
                                },
                              }))
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar frecuencia" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="w-full">
                              <SelectItem value="Diariamente">
                                Diariamente
                              </SelectItem>
                              <SelectItem value="Semanalmente">
                                Semanalmente
                              </SelectItem>
                              <SelectItem value="Mensualmente">
                                Mensualmente
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Fecha de Último Mantenimiento</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal"
                                  )}
                                >
                                  {newEquipo.mantenimiento
                                    .ultima_fecha_mantenimiento ? (
                                    format(
                                      new Date(
                                        newEquipo.mantenimiento.ultima_fecha_mantenimiento
                                      ),
                                      "P"
                                    )
                                  ) : (
                                    <span>Seleccionar fecha</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  newEquipo.mantenimiento
                                    .ultima_fecha_mantenimiento
                                    ? new Date(
                                        newEquipo.mantenimiento.ultima_fecha_mantenimiento
                                      )
                                    : undefined
                                }
                                onSelect={(date) =>
                                  setNewEquipo((prev) => ({
                                    ...prev,
                                    mantenimiento: {
                                      ...prev.mantenimiento,
                                      ultima_fecha_mantenimiento: date
                                        ? date.toISOString()
                                        : "",
                                    },
                                  }))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <SearchSelect
                            label="Proveedor de Servicio"
                            placeholder="Ingrese el nombre del proveedor"
                            value={
                              proveedorServicio ||
                              newEquipo.mantenimiento?.proveedores?.nombre
                            }
                            onInputChange={(name) =>
                              handleNombre(name, "proveedor_servicio")
                            }
                            suggestions={sugerenciasProveedorServicio}
                            onSelect={(data) =>
                              handleSelect("proveedor_servicio", data)
                            }
                            getKey={(u) => u.id_proveedor}
                            getLabel={(u) => u.nombre}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="max-w-full">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-[#040d50]">
                        Documentación Relacionada
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <div
                          className="border border-dashed border-gray-300 rounded-xl p-6 bg-slate-50 relative"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={async (e) => {
                            e.preventDefault();
                            const files = Array.from(
                              e.dataTransfer.files || []
                            );

                            const archivosConvertidos = await Promise.all(
                              files.map(
                                (file) =>
                                  new Promise((resolve, reject) => {
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                      resolve({
                                        nombre_archivo: file.name,
                                        tipo_archivo: file.type,
                                        contenido: reader.result as string,
                                      });
                                    };
                                    reader.onerror = reject;
                                    reader.readAsDataURL(file);
                                  })
                              )
                            );

                            const nuevosArchivos = archivosConvertidos as {
                              nombre_archivo: string;
                              tipo_archivo: string;
                              contenido: string;
                            }[];

                            setNewEquipo((prev) => ({
                              ...prev,
                              archivosequipo: [
                                ...(prev.archivosequipo || []),
                                ...nuevosArchivos,
                              ],
                            }));
                          }}
                        >
                          <div className="flex flex-col items-center justify-center gap-3 text-center">
                            <Paperclip className="h-8 w-8 text-slate-400" />
                            <p className="text-sm text-slate-600">
                              Arrastra y suelta archivos aquí o
                              <label
                                htmlFor="archivosEquipo"
                                className="text-blue-600 cursor-pointer font-semibold ml-1"
                              >
                                haz clic para seleccionarlos
                              </label>
                            </p>

                            <Input
                              id="archivosEquipo"
                              type="file"
                              multiple
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                              className="hidden"
                              onChange={async (e) => {
                                const files = Array.from(e.target.files || []);

                                const archivosConvertidos = await Promise.all(
                                  files.map(
                                    (file) =>
                                      new Promise((resolve, reject) => {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                          resolve({
                                            nombre_archivo: file.name,
                                            tipo_archivo: file.type,
                                            contenido: reader.result as string,
                                          });
                                        };
                                        reader.onerror = reject;
                                        reader.readAsDataURL(file);
                                      })
                                  )
                                );

                                const nuevosArchivos = archivosConvertidos as {
                                  nombre_archivo: string;
                                  tipo_archivo: string;
                                  contenido: string;
                                }[];

                                setNewEquipo((prev) => ({
                                  ...prev,
                                  archivosequipo: [
                                    ...(prev.archivosequipo || []),
                                    ...nuevosArchivos,
                                  ],
                                }));
                              }}
                            />
                          </div>
                        </div>

                        {newEquipo.archivosequipo?.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-sm">
                              Archivos seleccionados
                            </Label>

                            {newEquipo.archivosequipo.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between border rounded-md p-3 bg-white"
                              >
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <FileText className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm truncate">
                                    {file.nombre_archivo}
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => {
                                    const nuevos =
                                      newEquipo.archivosequipo!.filter(
                                        (_, i) => i !== index
                                      );
                                    setNewEquipo((prev) => ({
                                      ...prev,
                                      archivosequipo: nuevos,
                                    }));
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* seguridad */}
                  <Card className="max-w-full">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-[#040d50]">
                        Seguridad
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="seguridad.nivel_acceso">
                            Nivel de Acceso
                          </Label>
                          <Select
                            value={newEquipo.seguridad.nivel_acceso}
                            onValueChange={(value) =>
                              setNewEquipo({
                                ...newEquipo,
                                seguridad: {
                                  ...newEquipo.seguridad,
                                  nivel_acceso: value,
                                },
                              })
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar nivel" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="w-full">
                              <SelectItem value="Confidencial">
                                Confidencial
                              </SelectItem>
                              <SelectItem value="Acceso Completo">
                                Acceso Completo
                              </SelectItem>
                              <SelectItem value="Acceso Medio">
                                Acceso Medio
                              </SelectItem>
                              <SelectItem value="Acceso Mínimo">
                                Acceso Mínimo
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="seguridad.software_seguridad">
                            Software de Seguridad
                          </Label>
                          <Input
                            placeholder="Software de Seguridad"
                            value={newEquipo.seguridad.software_seguridad}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                seguridad: {
                                  ...newEquipo.seguridad,
                                  software_seguridad: e.target.value,
                                },
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="seguridad.cifrado_disco">
                            Cifrado Disco
                          </Label>
                          <Input
                            placeholder="Cifrado Disco"
                            value={newEquipo.seguridad.cifrado_disco}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                seguridad: {
                                  ...newEquipo.seguridad,
                                  cifrado_disco: e.target.value,
                                },
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="seguridad.politicas_aplicadas">
                            Políticas de Aplicación
                          </Label>
                          <Textarea
                            placeholder="Políticas de Aplicación"
                            className="min-h-[100px]"
                            value={
                              Array.isArray(
                                newEquipo.seguridad.politicas_aplicadas
                              )
                                ? newEquipo.seguridad.politicas_aplicadas.join(
                                    ", "
                                  )
                                : newEquipo.seguridad.politicas_aplicadas || ""
                            }
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                seguridad: {
                                  ...newEquipo.seguridad,
                                  politicas_aplicadas: e.target.value,
                                },
                              });
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Información de administrativa  */}
                  <Card className="max-w-full">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-[#040d50]">
                        Información Administrativa
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="administrativa.codigo_inventario">
                            Código de Inventario
                          </Label>
                          <Input
                            placeholder="Código de Inventario"
                            value={newEquipo.administrativa.codigo_inventario}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                administrativa: {
                                  ...newEquipo.administrativa,
                                  codigo_inventario: e.target.value,
                                },
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="administrativa.centro_coste">
                            Centro de Coste
                          </Label>
                          <Input
                            placeholder="Centro de Coste"
                            value={newEquipo.administrativa.centro_coste}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                administrativa: {
                                  ...newEquipo.administrativa,
                                  centro_coste: e.target.value,
                                },
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <SearchSelect
                            label="Autorizado por"
                            placeholder="Ingrese el nombre del usuario"
                            value={
                              nombreInput ||
                              newEquipo.administrativa.usuarios?.nombre
                            }
                            onInputChange={handleNombreInput}
                            suggestions={sugerencias}
                            onSelect={(data) => handleSelect("usuario", data)}
                            getKey={(u) => u.id_usuario}
                            getLabel={(u) => u.nombre}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="administrativa.fecha_activacion">
                            Fecha de Activación
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal"
                                  )}
                                >
                                  {newEquipo.administrativa.fecha_activacion ? (
                                    format(
                                      newEquipo.administrativa.fecha_activacion,
                                      "P"
                                    )
                                  ) : (
                                    <span>Seleccionar fecha</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  newEquipo.administrativa.fecha_activacion
                                    ? new Date(
                                        newEquipo.administrativa.fecha_activacion
                                      )
                                    : undefined
                                }
                                onSelect={(date) =>
                                  setNewEquipo({
                                    ...newEquipo,
                                    administrativa: {
                                      ...newEquipo.administrativa,
                                      fecha_activacion: date
                                        ? date.toISOString()
                                        : "",
                                    },
                                  })
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="administrativa.estado_contable">
                            Estado de Contabilidad
                          </Label>
                          <Select
                            value={newEquipo.administrativa.estado_contable}
                            onValueChange={(value) =>
                              setNewEquipo({
                                ...newEquipo,
                                administrativa: {
                                  ...newEquipo.administrativa,
                                  estado_contable: value,
                                },
                              })
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar estado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="w-full">
                              <SelectItem value="Activo fijo">
                                Activo fijo
                              </SelectItem>
                              <SelectItem value="En Mantenimiento">
                                En Mantenimiento
                              </SelectItem>
                              <SelectItem value="En Reparación">
                                En Reparación
                              </SelectItem>
                              <SelectItem value="Fuera de Servicio">
                                Fuera de Servicio
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="administrativa.valor_depreciado">
                            Valor Depreciado
                          </Label>
                          <Input
                            placeholder="Valor Depreciado"
                            type="text"
                            value={formatNumber(
                              newEquipo.administrativa.valor_depreciado
                            )}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\./g, "");
                              setNewEquipo({
                                ...newEquipo,
                                administrativa: {
                                  ...newEquipo.administrativa,
                                  valor_depreciado: Number(raw),
                                },
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="administrativa.vida_util_restante">
                            Vida Útil Restante
                          </Label>
                          <Input
                            placeholder="Vida Útil Restante"
                            value={newEquipo.administrativa.vida_util_restante}
                            readOnly
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Campos Personalizables */}
                  <Card className="max-w-full">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-[#040d50]">
                        Campos Personalizables
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="observaciones">Observaciones</Label>
                          <Textarea
                            placeholder="Observaciones adicionales"
                            className="min-h-[100px]"
                            value={newEquipo.observaciones}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                observaciones: e.target.value,
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tags">Etiquetas/Tags</Label>
                          <Input
                            placeholder="Etiquetas separadas por comas"
                            value={newEquipo.tags}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                tags: e.target.value,
                              });
                            }}
                          />
                          <FormDescription>
                            Ingrese las etiquetas separadas por comas (ej:
                            impresora, red, oficina)
                          </FormDescription>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end gap-4 sticky bottom-0 bg-white py-4 border-t mt-6 w-full">
                    <Button
                      type="submit"
                      onClick={(e: React.FormEvent) => {
                        e.preventDefault();

                        const equipoFormateado = {
                          ...newEquipo,
                          seguridad: {
                            ...newEquipo.seguridad,
                            politicas_aplicadas:
                              typeof newEquipo.seguridad.politicas_aplicadas ===
                              "string"
                                ? (
                                    (newEquipo.seguridad.politicas_aplicadas ??
                                      "") as string
                                  )
                                    .split(",")
                                    .map((p) => p.trim())
                                    .filter(Boolean)
                                : newEquipo.seguridad.politicas_aplicadas,
                          },
                          tags:
                            typeof newEquipo.tags === "string"
                              ? ((newEquipo.tags ?? "") as string)
                                  .split(",")
                                  .map((t) => t.trim())
                                  .filter(Boolean)
                              : newEquipo.tags,
                        };

                        update(equipoFormateado);
                      }}
                    >
                      Actualizar
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditEquipo;
