
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Search, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  fechaEntrega: z.date({
    required_error: "La fecha de entrega es requerida",
  }),
  nombreUsuario: z.string().min(1, "El nombre del usuario es requerido"),
  equipos: z.array(z.object({
    serial: z.string().min(1, "El serial es requerido"),
    descripcion: z.string(),
    marca: z.string(),
    activoFijo: z.string(),
    accesorios: z.string(),
  })),
  observaciones: z.string(),
  firmaEntrega: z.string().min(1, "La firma de quien entrega es requerida"),
  firmaRecibe: z.string().min(1, "La firma de quien recibe es requerida"),
});

// Simular búsqueda de equipo por serial
const buscarEquipoPorSerial = async (serial: string) => {
  // Aquí iría la llamada real a la API
  return {
    descripcion: "Laptop Dell XPS 13",
    marca: "Dell",
    activoFijo: "AF001",
    accesorios: "Cargador, Mouse inalámbrico, Maletín",
  };
};

const Salidas = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equipos: [{ serial: "", descripcion: "", marca: "", activoFijo: "", accesorios: "" }],
      observaciones: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "equipos",
  });

  const buscarEquipo = async (index: number, serial: string) => {
    try {
      const equipo = await buscarEquipoPorSerial(serial);
      form.setValue(`equipos.${index}.descripcion`, equipo.descripcion);
      form.setValue(`equipos.${index}.marca`, equipo.marca);
      form.setValue(`equipos.${index}.activoFijo`, equipo.activoFijo);
      form.setValue(`equipos.${index}.accesorios`, equipo.accesorios);
    } catch (error) {
      console.error("Error al buscar equipo:", error);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#040d50] mb-6">Salida de Equipos</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fechaEntrega"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Entrega</FormLabel>
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
                            format(field.value, "PPP")
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
                          date < new Date()
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
              name="nombreUsuario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Usuario</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-4 text-gray-700">
              Señor(a) <span className="font-semibold">{form.watch("nombreUsuario") || "[nombre del usuario]"}</span> a
              continuación se le hace entrega de los siguientes implementos de trabajo:
            </p>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-3 relative">
                    <FormField
                      control={form.control}
                      name={`equipos.${index}.serial`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Serial</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0"
                              onClick={() => buscarEquipo(index, field.value)}
                            >
                              <Search className="h-4 w-4" />
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`equipos.${index}.marca`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marca</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`equipos.${index}.activoFijo`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activo Fijo</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name={`equipos.${index}.accesorios`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Accesorios</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-1 pt-8">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ serial: "", descripcion: "", marca: "", activoFijo: "", accesorios: "" })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar equipo
              </Button>
            </div>
          </div>

          <FormField
            control={form.control}
            name="observaciones"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observaciones</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ingrese las observaciones..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
            El receptor se compromete a utilizar el equipo exclusivamente para propósitos laborales,
            mantenerlo en óptimas condiciones y reportar de manera inmediata cualquier falla o anomalía que se presente.
            Asimismo, se compromete a no instalar ningún tipo de software sin la debida autorización,
            no prestar ni transferir el equipo a terceras personas y devolverlo cuando la empresa lo requiera.
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firmaEntrega"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firma de quien entrega</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firmaRecibe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firma de quien recibe</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            Generar Acta de Entrega
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Salidas;
