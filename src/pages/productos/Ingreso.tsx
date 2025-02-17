
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-[#040d50] mb-6">Ingreso de Producto</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Información Básica */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-[#040d50] mb-4">Información Básica</h2>
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
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-[#040d50] mb-4">
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
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-[#040d50] mb-4">
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
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" type="button">
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#040d50] hover:bg-[#0a1668]">
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default IngresoProducto;
