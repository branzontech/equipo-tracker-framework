
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash, FileX } from "lucide-react";

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
import SignatureCanvas from "@/components/SignatureCanvas";
import { useState } from "react";

const equipoSchema = z.object({
  serial: z.string().min(1, "El serial es requerido"),
  activoFijo: z.string().min(1, "El número de activo fijo es requerido"),
  motivo: z.string().min(1, "El motivo de la baja es requerido"),
  descripcionEstado: z.string().min(1, "La descripción del estado es requerida"),
});

const formSchema = z.object({
  fecha: z.date({
    required_error: "La fecha es requerida",
  }),
  equipos: z.array(equipoSchema).min(1, "Debe agregar al menos un equipo"),
  observaciones: z.string().optional(),
  autorizadoPor: z.string().min(1, "El nombre de quien autoriza es requerido"),
  autorizadoPorFirma: z.string().min(1, "La firma de autorización es requerida"),
  solicitadoPor: z.string().min(1, "El nombre de quien solicita es requerido"),
  solicitadoPorFirma: z.string().min(1, "La firma de solicitud es requerida"),
});

const BajaEquipos = () => {
  const { toast } = useToast();
  const [equipos, setEquipos] = useState([{ id: Date.now().toString() }]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      observaciones: "",
      equipos: [{ serial: "", activoFijo: "", motivo: "", descripcionEstado: "" }],
    },
  });
  
  const agregarEquipo = () => {
    setEquipos([...equipos, { id: Date.now().toString() }]);
    
    const currentEquipos = form.getValues().equipos || [];
    form.setValue("equipos", [
      ...currentEquipos, 
      { serial: "", activoFijo: "", motivo: "", descripcionEstado: "" }
    ]);
  };
  
  const eliminarEquipo = (index: number) => {
    if (equipos.length === 1) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debe tener al menos un equipo en la baja.",
      });
      return;
    }
    
    const nuevosEquipos = [...equipos];
    nuevosEquipos.splice(index, 1);
    setEquipos(nuevosEquipos);
    
    const currentEquipos = form.getValues().equipos || [];
    const updatedEquipos = [...currentEquipos];
    updatedEquipos.splice(index, 1);
    form.setValue("equipos", updatedEquipos);
  };

  // Function to reset the form and start a new equipment withdrawal
  const nuevaBajaEquipo = () => {
    form.reset({
      observaciones: "",
      equipos: [{ serial: "", activoFijo: "", motivo: "", descripcionEstado: "" }],
    });
    setEquipos([{ id: Date.now().toString() }]);
    
    toast({
      title: "Nueva baja de equipos",
      description: "Se ha iniciado un nuevo formulario de baja de equipos.",
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Aquí iría la lógica para procesar la baja del equipo
      console.log(values);
      
      toast({
        title: "Baja de equipos registrada",
        description: `Se ha registrado la baja de ${values.equipos.length} equipo(s) exitosamente.`,
      });
      
      form.reset();
      setEquipos([{ id: Date.now().toString() }]);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0B2559]">Baja de Equipos</h1>
        <Button
          onClick={nuevaBajaEquipo}
          className="bg-[#bff036] hover:bg-[#bff036]/90 text-[#01242c]"
          variant="secondary"
        >
          <FileX className="mr-2 h-4 w-4" />
          Nueva Baja
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            {/* Fecha de baja */}
            <div className="mb-6">
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
                              "w-64 pl-3 text-left font-normal",
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
            </div>

            {/* Lista de equipos para dar de baja */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#0B2559]">Equipos para dar de baja</h2>
                <Button 
                  type="button" 
                  onClick={agregarEquipo}
                  variant="secondary"
                  className="flex items-center"
                >
                  <Plus className="mr-1 h-4 w-4" /> Agregar equipo
                </Button>
              </div>
              
              <div className="space-y-6">
                {equipos.map((equipo, index) => (
                  <div key={equipo.id} className="border border-gray-200 rounded-md p-4 relative">
                    {equipos.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => eliminarEquipo(index)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name={`equipos.${index}.serial`}
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
                        name={`equipos.${index}.activoFijo`}
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
                        name={`equipos.${index}.motivo`}
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
                      
                      <FormField
                        control={form.control}
                        name={`equipos.${index}.descripcionEstado`}
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
                  </div>
                ))}
              </div>
            </div>

            {/* Observaciones adicionales */}
            <div className="mb-6">
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

            {/* Firmas */}
            <div className="grid grid-cols-2 gap-6">
              <div>
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
                <div className="mt-2">
                  <FormField
                    control={form.control}
                    name="autorizadoPorFirma"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Firma de quien autoriza</FormLabel>
                        <FormControl>
                          <SignatureCanvas 
                            value={field.value} 
                            onChange={field.onChange}
                            label="Firma de autorización"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
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
                <div className="mt-2">
                  <FormField
                    control={form.control}
                    name="solicitadoPorFirma"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Firma de quien solicita</FormLabel>
                        <FormControl>
                          <SignatureCanvas 
                            value={field.value} 
                            onChange={field.onChange}
                            label="Firma de solicitud"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setEquipos([{ id: Date.now().toString() }]);
              }}
              className="bg-white hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-[#bff036] hover:bg-[#bff036]/90 text-[#01242c]"
              variant="secondary"
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
