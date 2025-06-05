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
import { useEquipos } from "./hooks/use-equipos";
import { useMarcas } from "../configuracion/maestros/hooks/use-marcas";
import { useCategoria } from "../configuracion/maestros/hooks/use-categoria";
import { useSucursales } from "../configuracion/maestros/hooks/use-sucursales";
import { Label } from "@/components/ui/label";

const IngresoProducto = () => {
  const { handleVolver, form, handleSubmit, formatNumber, setNewEquipo } =
    useEquipos();
  const { marcas } = useMarcas();
  const { categoria } = useCategoria();
  const { sucursales } = useSucursales();

  return (
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
            Ingreso de Producto
          </h1>
        </div>

        <Form {...form}>
          <form className="space-y-6">
            <div className="grid gap-6 max-w-full">
              {/* Información Básica */}
              <Card className="max-w-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-[#040d50]">
                    Información Básica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="nombre_equipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del Equipo</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre del equipo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nro_serie"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Serie</FormLabel>
                          <FormControl>
                            <Input placeholder="Número de serie" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tipo_activo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Activo</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value?.toString() || ""}
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="marca_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marca/Fabricante</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="categoria_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoría del Equipo</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sucursal_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sucursal del Equipo</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar una sucursal" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="w-full">
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="modelo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modelo</FormLabel>
                          <FormControl>
                            <Input placeholder="Modelo del equipo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estado_actual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado Actual</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
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
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="garantia_fecha_fin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Garantía Fin</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "P")
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
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <FormField
                      control={form.control}
                      name="imagen"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Imagen del Equipo</FormLabel>
                          <FormControl>
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                  <p className="text-sm text-gray-500">
                                    <span className="font-semibold">
                                      Click para subir
                                    </span>
                                  </p>
                                </div>
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.files ? e.target.files[0] : null
                                    )
                                  }
                                />
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
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
                    <FormField
                      control={form.control}
                      name="especificaciones.procesador"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Procesador</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: Intel Core i5 11th Gen"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="especificaciones.memoria_ram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Memoria RAM</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: 16 GB" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="especificaciones.almacenamiento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Almacenamiento</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: 512 GB" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="especificaciones.tarjeta_grafica"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tarjeta Gráfica</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: SSD, HDD, NVMe"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <FormField
                      control={form.control}
                      name="tieneCargador"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Tiene Cargador</FormLabel>
                            <FormDescription>
                              Marque esta casilla si el equipo incluye cargador
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch("tieneCargador") && (
                      <FormField
                        control={form.control}
                        name="serialCargador"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Serial del Cargador</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ingrese el serial del cargador"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )} */}

                    <FormField
                      control={form.control}
                      name="especificaciones.pantalla"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pantalla</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: 15.6 pulgadas Full HD"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="especificaciones.sistema_operativo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sistema Operativo</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Windows 10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="especificaciones.bateria"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Batería</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: 120 Wh" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="especificaciones.puertos"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Puertos</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: USB 3.0, HDMI, VGA"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                    <FormField
                      control={form.control}
                      name="adquisicion.fecha_compra"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de Compra</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "P")
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
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="adquisicion.proveedor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Proveedor</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nombre del proveedor"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="adquisicion.numero_factura"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Factura</FormLabel>
                          <FormControl>
                            <Input placeholder="Número de factura" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="adquisicion.precio_compra"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio de Adquisición</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Precio de Adquisición"
                              type="number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="adquisicion.forma_pago"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Forma de Pago</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="adquisicion.plazo_pago"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Plazo de Pago</FormLabel>
                          <FormControl>
                            <Input placeholder="Plazo de Pago" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="adquisicion.orden_compra"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Orden de Compra</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Número de orden de compra"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Estado y Ubicación */}
              {/* <Card className="max-w-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-[#040d50]">
                    Estado y Ubicación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="estado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado Actual</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar estado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="activo">Activo</SelectItem>
                              <SelectItem value="mantenimiento">
                                En Mantenimiento
                              </SelectItem>
                              <SelectItem value="reparacion">
                                En Reparación
                              </SelectItem>
                              <SelectItem value="baja">
                                Fuera de Servicio
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ubicacionFisica"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ubicación Física</FormLabel>
                          <FormControl>
                            <Input placeholder="Ubicación" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="departamento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Departamento</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Departamento asignado"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="responsable"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Responsable</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nombre del responsable"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="disponibilidad"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Disponibilidad</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar disponibilidad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="disponible">
                                Disponible
                              </SelectItem>
                              <SelectItem value="asignado">Asignado</SelectItem>
                              <SelectItem value="reservado">
                                Reservado
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="condicionFisica"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Condición Física</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar condición" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="nuevo">Nuevo</SelectItem>
                              <SelectItem value="bueno">Bueno</SelectItem>
                              <SelectItem value="regular">Regular</SelectItem>
                              <SelectItem value="malo">Malo</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card> */}

              {/* Mantenimiento */}
              {/* <Card className="max-w-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-[#040d50]">
                    Mantenimiento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="frecuenciaMantenimiento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frecuencia de Mantenimiento</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar frecuencia" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="mensual">Mensual</SelectItem>
                              <SelectItem value="trimestral">
                                Trimestral
                              </SelectItem>
                              <SelectItem value="semestral">
                                Semestral
                              </SelectItem>
                              <SelectItem value="anual">Anual</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ultimaFechaMantenimiento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Última Fecha de Mantenimiento</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "P")
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
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="proveedorServicio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Proveedor de Servicio</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nombre del proveedor de servicio"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card> */}

              {/* Documentación Relacionada */}
              {/* <Card className="max-w-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-[#040d50]">
                    Documentación Relacionada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="manualUsuario"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manual de Usuario</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              {...field}
                              value={field.value?.filename}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="manualServicio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manual de Servicio</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              {...field}
                              value={field.value?.filename}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="certificados"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certificados</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              {...field}
                              value={field.value?.filename}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="polizasSeguro"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pólizas de Seguro</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              {...field}
                              value={field.value?.filename}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card> */}

              {/* seguridad */}
              <Card className="max-w-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-[#040d50]">
                    Seguridad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="seguridad.nivel_acceso"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nivel de Acceso</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seguridad.software_seguridad"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Software de Seguridad</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Software de Seguridad"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seguridad.cifrado_disco"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cifrado Disco</FormLabel>
                          <FormControl>
                            <Input placeholder="Cifrado Disco" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seguridad.politicas_aplicadas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Políticas de Aplicación</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Políticas de Aplicación"
                              className="min-h-[100px] "
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Información de informacionAdministrativa  */}
              <Card className="max-w-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-[#040d50]">
                    Información Administrativa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="informacionAdministrativa.codigo_inventario"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código de Inventario</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Código de Inventario"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="informacionAdministrativa.centro_coste"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Centro de Coste</FormLabel>
                          <FormControl>
                            <Input placeholder="Centro de Coste" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="informacionAdministrativa.autorizado_por"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Autorizado por</FormLabel>
                          <FormControl>
                            <Input placeholder="Autorizado por" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="informacionAdministrativa.fecha_activacion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de Activación</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "P")
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
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="informacionAdministrativa.estado_contable"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado de Contabilidad</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="informacionAdministrativa.valor_depreciado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor Depreciado</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Valor Depreciado"
                              type="text"
                              value={formatNumber(field.value)}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/\./g, "");
                                field.onChange(Number(raw));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="informacionAdministrativa.vida_util_restante"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vida Útil Restante</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Vida Útil Restante"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                    <FormField
                      control={form.control}
                      name="observaciones"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observaciones</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Observaciones adicionales"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Etiquetas/Tags</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Etiquetas separadas por comas"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Ingrese las etiquetas separadas por comas (ej:
                            impresora, red, oficina)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                  </div>
                </CardContent>
              </Card>

              {/* Botones de acción */}
              <div className="flex justify-end gap-4 sticky bottom-0 bg-white py-4 border-t mt-6 w-full">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  onClick={(e: React.FormEvent) => {
                    e.preventDefault();
                    handleSubmit(form.getValues());
                  }}
                >
                  Guardar Producto
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default IngresoProducto;
