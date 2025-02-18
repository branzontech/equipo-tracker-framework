import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload } from "lucide-react";
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

const formSchema = z.object({
  // Información Básica
  descripcion: z.string().min(1, "La descripción es requerida"),
  numeroSerie: z.string().min(1, "El número de serie es requerido"),
  numeroActivoFijo: z.string().min(1, "El número de activo fijo es requerido"),
  marca: z.string().min(1, "La marca es requerida"),
  categoria: z.string().min(1, "La categoría es requerida"),
  imagen: z.any(),

  // Especificaciones Técnicas
  procesador: z.string().min(1, "El procesador es requerido"),
  discoDuro: z.string().min(1, "La capacidad del disco duro es requerida"),
  tipoDisco: z.string().min(1, "El tipo de disco duro es requerido"),
  memoriaRam: z.string().min(1, "La memoria RAM es requerida"),
  tieneCargador: z.boolean().default(false),
  serialCargador: z.string().optional(),

  // Información de Adquisición
  fechaCompra: z.date(),
  proveedor: z.string(),
  numeroFactura: z.string(),
  costoAdquisicion: z.string(),
  garantiaInicio: z.date(),
  garantiaFin: z.date(),
  ordenCompra: z.string(),

  // Estado y Ubicación
  estado: z.string(),
  ubicacionFisica: z.string(),
  departamento: z.string(),
  responsable: z.string(),
  disponibilidad: z.string(),
  condicionFisica: z.string(),

  // Mantenimiento
  frecuenciaMantenimiento: z.string(),
  ultimaFechaMantenimiento: z.date().optional(),
  proximaFechaMantenimiento: z.date().optional(),
  proveedorServicio: z.string().optional(),

  // Documentación Relacionada
  manualUsuario: z.any().optional(),
  manualServicio: z.any().optional(),
  certificados: z.any().optional(),
  polizasSeguro: z.any().optional(),
  documentosGarantia: z.any().optional(),
  fotosAdicionales: z.any().optional(),

  // Campos Personalizables
  observaciones: z.string(),
  tags: z.string(),
});

const IngresoProducto = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descripcion: "",
      numeroSerie: "",
      numeroActivoFijo: "",
      marca: "",
      categoria: "",
      procesador: "",
      discoDuro: "",
      tipoDisco: "",
      memoriaRam: "",
      tieneCargador: false,
      serialCargador: "",
      proveedor: "",
      numeroFactura: "",
      costoAdquisicion: "",
      ordenCompra: "",
      estado: "",
      ubicacionFisica: "",
      departamento: "",
      responsable: "",
      disponibilidad: "",
      condicionFisica: "",
      frecuenciaMantenimiento: "",
      proveedorServicio: "",
      observaciones: "",
      tags: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="relative w-full overflow-x-hidden">
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-4 max-w-full">
        <h1 className="text-2xl font-bold text-[#040d50] mb-6">Ingreso de Producto</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 max-w-full">
              {/* Información Básica */}
              <Card className="max-w-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-[#040d50]">Información Básica</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="descripcion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción del Equipo</FormLabel>
                          <FormControl>
                            <Input placeholder="Descripción" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="numeroSerie"
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
                      name="numeroActivoFijo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Activo Fijo</FormLabel>
                          <FormControl>
                            <Input placeholder="Número de activo fijo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="marca"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marca/Fabricante</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar marca" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="hp">HP</SelectItem>
                              <SelectItem value="dell">Dell</SelectItem>
                              <SelectItem value="lenovo">Lenovo</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="categoria"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoría del Equipo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar categoría" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="laptop">Laptop</SelectItem>
                              <SelectItem value="desktop">Desktop</SelectItem>
                              <SelectItem value="printer">Impresora</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
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
                                    <span className="font-semibold">Click para subir</span>
                                  </p>
                                </div>
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) =>
                                    field.onChange(e.target.files ? e.target.files[0] : null)
                                  }
                                />
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                      name="procesador"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Procesador</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Intel Core i5 11th Gen" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="memoriaRam"
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
                      name="discoDuro"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacidad Disco Duro</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: 512 GB" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tipoDisco"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Disco Duro</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: SSD, HDD, NVMe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
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
                            <FormLabel>
                              Tiene Cargador
                            </FormLabel>
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
                              <Input placeholder="Ingrese el serial del cargador" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                    <FormField
                      control={form.control}
                      name="fechaCompra"
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
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
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
                      name="proveedor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Proveedor</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre del proveedor" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="numeroFactura"
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
                      name="costoAdquisicion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Costo de Adquisición</FormLabel>
                          <FormControl>
                            <Input placeholder="Costo" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="garantiaInicio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inicio de Garantía</FormLabel>
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
                                    <span>Fecha inicio</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date("1900-01-01")}
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
                      name="garantiaFin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fin de Garantía</FormLabel>
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
                                    <span>Fecha fin</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date("1900-01-01")}
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
                      name="ordenCompra"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Orden de Compra</FormLabel>
                          <FormControl>
                            <Input placeholder="Número de orden de compra" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                    <FormField
                      control={form.control}
                      name="estado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado Actual</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar estado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="activo">Activo</SelectItem>
                              <SelectItem value="mantenimiento">En Mantenimiento</SelectItem>
                              <SelectItem value="reparacion">En Reparación</SelectItem>
                              <SelectItem value="baja">Fuera de Servicio</SelectItem>
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
                            <Input placeholder="Departamento asignado" {...field} />
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
                            <Input placeholder="Nombre del responsable" {...field} />
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar disponibilidad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="disponible">Disponible</SelectItem>
                              <SelectItem value="asignado">Asignado</SelectItem>
                              <SelectItem value="reservado">Reservado</SelectItem>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormField
                      control={form.control}
                      name="frecuenciaMantenimiento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frecuencia de Mantenimiento</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar frecuencia" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="mensual">Mensual</SelectItem>
                              <SelectItem value="trimestral">Trimestral</SelectItem>
                              <SelectItem value="semestral">Semestral</SelectItem>
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
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
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
                            <Input placeholder="Nombre del proveedor de servicio" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Documentación Relacionada */}
              <Card className="max-w-full">
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
                            <Input type="file" {...field} value={field.value?.filename} />
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
                            <Input type="file" {...field} value={field.value?.filename} />
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
                            <Input type="file" {...field} value={field.value?.filename} />
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
                            <Input type="file" {...field} value={field.value?.filename} />
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

                    <FormField
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
                            Ingrese las etiquetas separadas por comas (ej: impresora, red, oficina)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Botones de acción */}
              <div className="flex justify-end gap-4 sticky bottom-0 bg-white py-4 border-t mt-6 w-full">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#040d50] hover:bg-[#0a1668]">
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
