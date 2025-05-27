
import { useState } from "react";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Printer, ArrowUpFromLine } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface FormData {
  referencia: string;
  cantidad: string;
  modeloImpresora: string;
  area: string;
  sede: string;
  responsable: string;
  observaciones: string;
}

const SalidaToners = () => {
  const { toast } = useToast();
  const form = useForm<FormData>({
    defaultValues: {
      referencia: "",
      cantidad: "",
      modeloImpresora: "",
      area: "",
      sede: "",
      responsable: "",
      observaciones: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    toast({
      title: "Salida registrada",
      description: "La salida del toner ha sido registrada exitosamente.",
    });
    form.reset();
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <Printer className="h-8 w-8 text-[#040d50]" />
        <h1 className="text-2xl font-bold text-[#040d50]">Salida de Toners</h1>
      </div>

      <div className="max-w-2xl bg-white p-6 rounded-lg shadow-sm border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="referencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referencia del Toner</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar referencia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TN-760">TN-760</SelectItem>
                        <SelectItem value="CF410A">CF410A</SelectItem>
                        <SelectItem value="CF411A">CF411A</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cantidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Cantidad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modeloImpresora"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo de Impresora</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar modelo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="brother-dcp-l2540dw">Brother DCP-L2540DW</SelectItem>
                        <SelectItem value="hp-laserjet-pro-m452dn">HP LaserJet Pro M452dn</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar área" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="contabilidad">Contabilidad</SelectItem>
                        <SelectItem value="rrhh">Recursos Humanos</SelectItem>
                        <SelectItem value="gerencia">Gerencia</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sede"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sede</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar sede" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sede-norte">Sede Norte</SelectItem>
                        <SelectItem value="sede-sur">Sede Sur</SelectItem>
                        <SelectItem value="sede-centro">Sede Centro</SelectItem>
                      </SelectContent>
                    </Select>
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
            </div>

            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Input placeholder="Observaciones adicionales" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full md:w-auto">
              <ArrowUpFromLine className="mr-2 h-4 w-4" />
              Registrar Salida
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SalidaToners;
