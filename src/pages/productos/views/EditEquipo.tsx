/* eslint-disable react-hooks/exhaustive-deps */
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "@/components/Loading";

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
  } = useEquipos();
  const { marcas } = useMarcas();
  const { categoria } = useCategoria();
  const { sucursales } = useSucursales();

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
                              <SelectItem value="Equipo de Cómputo">
                                Equipo de Cómputo
                              </SelectItem>
                              <SelectItem value="Impresora">
                                Impresora
                              </SelectItem>
                              <SelectItem value="Escáner">Escáner</SelectItem>
                              <SelectItem value="Proyector">
                                Proyector
                              </SelectItem>
                              <SelectItem value="Otro">Otro</SelectItem>
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
                          <Label htmlFor="sucursal_id">
                            Sucursal del Equipo
                          </Label>
                          <Select
                            value={
                              newEquipo.sucursal_id
                                ? newEquipo.sucursal_id.toString()
                                : ""
                            }
                            onValueChange={(value) =>
                              setNewEquipo({
                                ...newEquipo,
                                sucursal_id: Number(value),
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
                          <Label htmlFor="estado_actual">Estado Actual</Label>
                          <Select
                            value={newEquipo.estado_actual}
                            onValueChange={(value) =>
                              setNewEquipo({
                                ...newEquipo,
                                estado_actual: value,
                              })
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar estado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="w-full">
                              <SelectItem value="Activo">Activo</SelectItem>
                              <SelectItem value="En Mantenimiento">
                                En Mantenimiento
                              </SelectItem>
                              <SelectItem value="En Reparación">
                                En Reparación
                              </SelectItem>
                              <SelectItem value="Fuera de Servicio">
                                Fuera de Servicio
                              </SelectItem>
                              <SelectItem value="En Préstamo">
                                En Préstamo{" "}
                                <span className="text-xs text-gray-500">
                                  (Se encuentra en préstamo)
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <FormLabel>Garantía Fin</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal"
                                  )}
                                >
                                  {newEquipo.garantia_fecha_fin ? (
                                    format(newEquipo.garantia_fecha_fin, "PP")
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
                                  newEquipo.garantia_fecha_fin
                                    ? new Date(newEquipo.garantia_fecha_fin)
                                    : undefined
                                }
                                onSelect={(date) =>
                                  setNewEquipo({
                                    ...newEquipo,
                                    garantia_fecha_fin: date
                                      ? date.toISOString()
                                      : "",
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
                            value={newEquipo.especificaciones?.procesador || ""}
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
                            value={newEquipo.especificaciones?.memoria_ram}
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
                            value={newEquipo.especificaciones?.almacenamiento}
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
                            placeholder="Ej: SSD, HDD, NVMe"
                            value={newEquipo.especificaciones?.tarjeta_grafica}
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
                          <Label htmlFor="especificaciones.pantalla">
                            Pantalla
                          </Label>
                          <Input
                            placeholder="Ej: 15.6 pulgadas Full HD"
                            value={newEquipo.especificaciones?.pantalla}
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
                            value={
                              newEquipo.especificaciones?.sistema_operativo
                            }
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
                            value={newEquipo.especificaciones?.bateria}
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
                            value={newEquipo.especificaciones?.puertos}
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
                                  {newEquipo.adquisicion?.fecha_compra ? (
                                    format(
                                      newEquipo.adquisicion?.fecha_compra,
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
                                  newEquipo.adquisicion?.fecha_compra
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
                          <Label htmlFor="adquisicion.proveedor">
                            Proveedor
                          </Label>
                          <Input
                            placeholder="Nombre del proveedor"
                            value={newEquipo.adquisicion?.proveedor}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                adquisicion: {
                                  ...newEquipo.adquisicion,
                                  proveedor: e.target.value,
                                },
                              });
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="adquisicion.numero_factura">
                            Número de Factura
                          </Label>
                          <Input
                            placeholder="Número de factura"
                            value={newEquipo.adquisicion?.numero_factura}
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
                            value={newEquipo.adquisicion?.precio_compra}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\./g, "");
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
                            value={newEquipo.adquisicion?.forma_pago}
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
                            value={newEquipo.adquisicion?.plazo_pago}
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
                            value={newEquipo.adquisicion?.orden_compra}
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
                            value={newEquipo.seguridad?.nivel_acceso}
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
                            value={newEquipo.seguridad?.software_seguridad}
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
                            value={newEquipo.seguridad?.cifrado_disco}
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
                              newEquipo.seguridad?.politicas_aplicadas?.join(
                                ", "
                              ) || ""
                            }
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                seguridad: {
                                  ...newEquipo.seguridad,
                                  politicas_aplicadas: e.target.value
                                    .split(",")
                                    .map((item) => item.trim())
                                    .filter((item) => item.length > 0),
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
                            value={newEquipo.administrativa?.codigo_inventario}
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
                            value={newEquipo.administrativa?.centro_coste}
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
                          <Label htmlFor="administrativa.autorizado_por">
                            Autorizado por
                          </Label>
                          <Input
                            placeholder="Autorizado por"
                            value={newEquipo.administrativa?.autorizado_por}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                administrativa: {
                                  ...newEquipo.administrativa,
                                  autorizado_por: e.target.value,
                                },
                              });
                            }}
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
                                  {newEquipo.administrativa
                                    ?.fecha_activacion ? (
                                    format(
                                      newEquipo.administrativa
                                        ?.fecha_activacion,
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
                                  newEquipo.administrativa?.fecha_activacion
                                    ? new Date(
                                        newEquipo.administrativa?.fecha_activacion
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
                            value={newEquipo.administrativa?.estado_contable}
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
                            value={newEquipo.administrativa?.valor_depreciado}
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
                            value={newEquipo.administrativa?.vida_util_restante}
                            onChange={(e) => {
                              setNewEquipo({
                                ...newEquipo,
                                administrativa: {
                                  ...newEquipo.administrativa,
                                  vida_util_restante: e.target.value,
                                },
                              });
                            }}
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
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end gap-4 sticky bottom-0 bg-white py-4 border-t mt-6 w-full">
                    <Button
                      type="submit"
                      onClick={(e: React.FormEvent) => {
                        e.preventDefault();
                        update(newEquipo);
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
