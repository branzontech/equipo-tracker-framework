
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Plus } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const formSchema = z.object({
  equipoId: z.string().min(1, "Seleccione un equipo"),
  fechaDevolucion: z.date({
    required_error: "La fecha de devolución es requerida",
  }),
  motivo: z.string().min(1, "El motivo de devolución es requerido"),
  estado: z.string().min(1, "El estado del equipo es requerido"),
  observaciones: z.string(),
  usuarioEntrega: z.string().min(1, "El usuario que entrega es requerido"),
  usuarioRecibe: z.string().min(1, "El usuario que recibe es requerido"),
});

const Devoluciones = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      observaciones: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success("Devolución registrada exitosamente");
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#040d50]">Devoluciones de Equipos</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#040d50] hover:bg-[#0a1668]">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Devolución
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Nueva Devolución</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="equipoId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Equipo</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar equipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">Laptop HP ProBook</SelectItem>
                                <SelectItem value="2">Desktop Dell OptiPlex</SelectItem>
                                <SelectItem value="3">Monitor LG 24"</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fechaDevolucion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha de Devolución</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP", { locale: es })
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
                        name="motivo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Motivo de Devolución</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar motivo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="fin_prestamo">Fin de Préstamo</SelectItem>
                                <SelectItem value="traslado">Traslado</SelectItem>
                                <SelectItem value="mantenimiento">Requiere Mantenimiento</SelectItem>
                                <SelectItem value="cambio">Cambio de Equipo</SelectItem>
                                <SelectItem value="baja">Baja del Equipo</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="estado"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado del Equipo</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="optimo">Óptimo</SelectItem>
                                <SelectItem value="bueno">Bueno</SelectItem>
                                <SelectItem value="regular">Regular</SelectItem>
                                <SelectItem value="malo">Malo</SelectItem>
                                <SelectItem value="danado">Dañado</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="usuarioEntrega"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Usuario que Entrega</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre del usuario que entrega" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="usuarioRecibe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Usuario que Recibe</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre del usuario que recibe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="observaciones"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Observaciones</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Observaciones adicionales sobre la devolución"
                                className="min-h-[100px]"
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

                <div className="flex justify-end gap-4">
                  <Button variant="outline" type="button">
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-[#040d50] hover:bg-[#0a1668]">
                    Registrar Devolución
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de devoluciones */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Devoluciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No hay devoluciones registradas aún.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Devoluciones;
