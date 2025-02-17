import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
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

const formSchema = z.object({
  // Información Básica
  descripcion: z.string().min(1, "La descripción es requerida"),
  numeroSerie: z.string().min(1, "El número de serie es requerido"),
  numeroActivoFijo: z.string().min(1, "El número de activo fijo es requerido"),
  marca: z.string().min(1, "La marca es requerida"),
  categoria: z.string().min(1, "La categoría es requerida"),
  imagen: z.any(),

  // Especificaciones Técnicas
  descripcionTecnica: z.string(),
  especificacionesFabricante: z.string(),
  accesoriosIncluidos: z.string(),

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
      descripcionTecnica: "",
      especificacionesFabricante: "",
      accesoriosIncluidos: "",
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
    <div className="p-8">
      <h1 className="text-2xl font-bold text-lightship-4 mb-6">Ingreso de Producto</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Información Básica */}
          <div className="bg-lightship-2 p-6 rounded-lg shadow-md border border-lightship-3/20">
            <h2 className="text-xl font-semibold text-lightship-4 mb-4">Información Básica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="imagen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagen del Equipo</FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-4 text-gray-500" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click para subir</span> o
                                arrastrar y soltar
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG or JPEG
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
            </div>
          </div>

          {/* Especificaciones Técnicas */}
          <div className="bg-lightship-2 p-6 rounded-lg shadow-md border border-lightship-3/20">
            <h2 className="text-xl font-semibold text-lightship-4 mb-4">
              Especificaciones Técnicas
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="descripcionTecnica"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción Técnica</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ingrese la descripción técnica"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Información de Adquisición */}
          <div className="bg-lightship-2 p-6 rounded-lg shadow-md border border-lightship-3/20">
            <h2 className="text-xl font-semibold text-lightship-4 mb-4">
              Información de Adquisición
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fechaCompra"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
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
                  <FormItem className="flex flex-col">
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
                  <FormItem className="flex flex-col">
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
          </div>

          {/* Estado y Ubicación */}
          <div className="bg-lightship-2 p-6 rounded-lg shadow-md border border-lightship-3/20">
            <h2 className="text-xl font-semibold text-lightship-4 mb-4">
              Estado y Ubicación
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          {/* Mantenimiento */}
          <div className="bg-lightship-2 p-6 rounded-lg shadow-md border border-lightship-3/20">
            <h2 className="text-xl font-semibold text-lightship-4 mb-4">
              Mantenimiento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <FormItem className="flex flex-col">
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
          </div>

          {/* Documentación Relacionada */}
          <div className="bg-lightship-2 p-6 rounded-lg shadow-md border border-lightship-3/20">
            <h2 className="text-xl font-semibold text-lightship-4 mb-4">
              Documentación Relacionada
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          {/* Campos Personalizables */}
          <div className="bg-lightship-2 p-6 rounded-lg shadow-md border border-lightship-3/20">
            <h2 className="text-xl font-semibold text-lightship-4 mb-4">
              Campos Personalizables
            </h2>
            <div className="grid grid-cols-1 gap-6">
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
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              type="button"
              className="bg-transparent border-lightship-3 text-lightship-4 hover:bg-lightship-3/20"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-lightship-1 hover:bg-lightship-1/90 text-white"
            >
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default IngresoProducto;
