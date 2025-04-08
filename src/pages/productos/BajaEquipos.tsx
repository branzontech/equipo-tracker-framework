
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash, FileX, Upload, Download } from "lucide-react";
import { useState } from "react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  const [tempEquipo, setTempEquipo] = useState({
    serial: "",
    activoFijo: "",
    motivo: "",
    descripcionEstado: "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      observaciones: "",
      equipos: [{ serial: "", activoFijo: "", motivo: "", descripcionEstado: "" }],
    },
  });
  
  const agregarEquipo = () => {
    if (!tempEquipo.serial || !tempEquipo.activoFijo || !tempEquipo.motivo || !tempEquipo.descripcionEstado) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor complete todos los campos del equipo.",
      });
      return;
    }
    
    const nuevoEquipo = { id: Date.now().toString() };
    setEquipos([...equipos, nuevoEquipo]);
    
    const currentEquipos = form.getValues().equipos || [];
    form.setValue("equipos", [
      ...currentEquipos, 
      { ...tempEquipo }
    ]);
    
    // Reset temp equipo
    setTempEquipo({
      serial: "",
      activoFijo: "",
      motivo: "",
      descripcionEstado: "",
    });
    
    toast({
      title: "Equipo agregado",
      description: `Se ha agregado el equipo con serial ${tempEquipo.serial}`,
    });
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

    toast({
      title: "Equipo eliminado",
      description: "Se ha eliminado el equipo de la lista.",
    });
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

  // Function to handle bulk import from CSV or Excel
  const handleBulkImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This would be implemented with a CSV/Excel parsing library
    // For demo purposes, we'll just simulate adding multiple items
    const mockData = [
      {
        serial: "SER1001",
        activoFijo: "AF2001",
        motivo: "Obsolescencia",
        descripcionEstado: "Equipo con 5 años de uso, lento para tareas actuales",
      },
      {
        serial: "SER1002",
        activoFijo: "AF2002",
        motivo: "Daño irreparable",
        descripcionEstado: "Placa madre dañada, costo de reparación superior al 70% del valor",
      },
      {
        serial: "SER1003",
        activoFijo: "AF2003",
        motivo: "Actualización tecnológica",
        descripcionEstado: "Se reemplaza por equipos nuevos según política de renovación",
      },
    ];
    
    const currentEquipos = form.getValues().equipos || [];
    const newEquipos = [...currentEquipos, ...mockData];
    
    form.setValue("equipos", newEquipos);
    
    // Update equipos state
    const newEquiposState = [
      ...equipos,
      ...mockData.map(() => ({ id: Date.now().toString() + Math.random() }))
    ];
    setEquipos(newEquiposState);
    
    toast({
      title: "Importación completada",
      description: `Se han agregado ${mockData.length} equipos a la lista.`,
    });
  };

  // Function to export template
  const exportTemplate = () => {
    // In a real application, this would generate and download a CSV/Excel template
    toast({
      title: "Plantilla descargada",
      description: "La plantilla para importación ha sido descargada.",
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
                <div className="flex space-x-2">
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex items-center"
                    onClick={exportTemplate}
                  >
                    <Download className="mr-1 h-4 w-4" /> Plantilla
                  </Button>
                  
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button 
                        type="button" 
                        variant="secondary"
                        className="flex items-center bg-[#bff036] hover:bg-[#bff036]/90 text-[#01242c]"
                      >
                        <Plus className="mr-1 h-4 w-4" /> Agregar equipo
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-md">
                      <SheetHeader>
                        <SheetTitle>Agregar Equipo</SheetTitle>
                        <SheetDescription>
                          Complete los datos del equipo que desea dar de baja.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <FormLabel>Serial del Equipo</FormLabel>
                          <Input 
                            placeholder="Ingrese el serial"
                            value={tempEquipo.serial}
                            onChange={(e) => setTempEquipo({...tempEquipo, serial: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <FormLabel>Número de Activo Fijo</FormLabel>
                          <Input 
                            placeholder="Ingrese el número de activo fijo"
                            value={tempEquipo.activoFijo}
                            onChange={(e) => setTempEquipo({...tempEquipo, activoFijo: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <FormLabel>Motivo de la Baja</FormLabel>
                          <Input 
                            placeholder="Ingrese el motivo de la baja"
                            value={tempEquipo.motivo}
                            onChange={(e) => setTempEquipo({...tempEquipo, motivo: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <FormLabel>Descripción del Estado</FormLabel>
                          <Textarea 
                            placeholder="Describa el estado actual del equipo"
                            className="resize-none"
                            value={tempEquipo.descripcionEstado}
                            onChange={(e) => setTempEquipo({...tempEquipo, descripcionEstado: e.target.value})}
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button 
                            className="bg-[#bff036] hover:bg-[#bff036]/90 text-[#01242c] mt-2"
                            onClick={agregarEquipo}
                            type="button"
                          >
                            Agregar
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <div className="flex items-center space-x-2">
                          <FormLabel>Importar Varios</FormLabel>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            className="relative"
                          >
                            <input
                              type="file"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              accept=".csv,.xlsx"
                              onChange={handleBulkImport}
                            />
                            <Upload className="h-4 w-4 mr-2" />
                            Importar CSV
                          </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
              
              {/* Table to display equipos */}
              {form.getValues().equipos.length > 0 && (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Serial</TableHead>
                        <TableHead>Activo Fijo</TableHead>
                        <TableHead>Motivo</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="w-20">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {form.getValues().equipos.map((equipo, index) => (
                        <TableRow key={index}>
                          <TableCell>{equipo.serial}</TableCell>
                          <TableCell>{equipo.activoFijo}</TableCell>
                          <TableCell>{equipo.motivo}</TableCell>
                          <TableCell className="max-w-[200px] truncate" title={equipo.descripcionEstado}>
                            {equipo.descripcionEstado}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => eliminarEquipo(index)}
                              className="h-8 w-8 text-red-500"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
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
