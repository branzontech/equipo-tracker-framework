
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  fecha: z.date({
    required_error: "La fecha es requerida",
  }),
  serial: z.string().min(1, "El serial es requerido"),
  activoFijo: z.string().min(1, "El número de activo fijo es requerido"),
  motivo: z.string().min(1, "El motivo de la baja es requerido"),
  descripcionEstado: z.string().min(1, "La descripción del estado es requerida"),
  observaciones: z.string().optional(),
  autorizadoPor: z.string().min(1, "El nombre de quien autoriza es requerido"),
  solicitadoPor: z.string().min(1, "El nombre de quien solicita es requerido"),
});

const BajaEquipos = () => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      observaciones: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Aquí iría la lógica para procesar la baja del equipo
      console.log(values);
      
      toast({
        title: "Baja de equipo registrada",
        description: "La baja del equipo ha sido registrada exitosamente.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al registrar la baja del equipo.",
      });
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#0B2559] mb-6">Baja de Equipos</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fecha"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha</FormLabel>
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
                name="serial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial del Equipo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese el serial" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activoFijo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Activo Fijo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese el número de activo fijo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motivo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo de la Baja</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese el motivo de la baja" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6">
              <FormField
                control={form.control}
                name="descripcionEstado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción del Estado</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describa el estado actual del equipo"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6">
              <FormField
                control={form.control}
                name="observaciones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones Adicionales</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ingrese observaciones adicionales (opcional)"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <FormField
                control={form.control}
                name="autorizadoPor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Autorizado Por</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de quien autoriza" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="solicitadoPor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Solicitado Por</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de quien solicita" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              className="bg-white hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-[#0B2559] hover:bg-[#0B2559]/90 text-white"
            >
              Registrar Baja
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BajaEquipos;
