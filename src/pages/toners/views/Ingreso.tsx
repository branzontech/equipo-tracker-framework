import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import ImpresoraForm from "./ImpresoraForm";

const formSchema = z.object({
  referencia: z.string().min(1, "La referencia es requerida"),
  modeloImpresora: z.string().min(1, "El modelo de impresora es requerido"),
  color: z.string().min(1, "El color es requerido"),
  stockDisponible: z.number().min(0, "El stock no puede ser negativo"),
  alertaStockMinimo: z
    .number()
    .min(1, "La alerta de stock mínimo debe ser mayor a 0"),
  areas: z.string().min(1, "Debe seleccionar al menos un área"),
  sede: z.string().min(1, "La sede es requerida"),
  cantidad: z.number().min(1, "La cantidad debe ser mayor a 0"),
});

export default function IngresoToner() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      referencia: "",
      modeloImpresora: "",
      color: "",
      stockDisponible: 0,
      alertaStockMinimo: 1,
      areas: "",
      sede: "",
      cantidad: 1,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success("Toner registrado exitosamente");
  }

  return (
    <>
      <ImpresoraForm />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Ingreso de Toner</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="referencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referencia</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: TN-760" {...field} />
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
                        <FormControl>
                          <Input
                            placeholder="Ej: Brother DCP-L2540DW"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un color" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="negro">Negro</SelectItem>
                            <SelectItem value="cyan">Cyan</SelectItem>
                            <SelectItem value="magenta">Magenta</SelectItem>
                            <SelectItem value="amarillo">Amarillo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stockDisponible"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Disponible</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alertaStockMinimo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alerta de Stock Mínimo</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <FormField
      control={form.control}
      name="areas"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Áreas</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione las áreas" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="contabilidad">Contabilidad</SelectItem>
              <SelectItem value="rrhh">Recursos Humanos</SelectItem>
              <SelectItem value="sistemas">Sistemas</SelectItem>
              <SelectItem value="ventas">Ventas</SelectItem>
              <SelectItem value="gerencia">Gerencia</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    /> */}

                  {/* <FormField
      control={form.control}
      name="sede"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Sede</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una sede" />
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
    /> */}

                  <FormField
                    control={form.control}
                    name="cantidad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cantidad</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Registrar Toner</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
