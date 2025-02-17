
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  PDFViewer,
  PDFDownloadLink 
} from "@react-pdf/renderer";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  fechaTraslado: z.date({
    required_error: "La fecha de traslado es requerida",
  }),
  regionalDestino: z.string().min(1, "La regional de destino es requerida"),
  bodegaDestino: z.string().min(1, "La bodega de destino es requerida"),
  motivoTraslado: z.string().min(1, "El motivo del traslado es requerido"),
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

const buscarEquipoPorSerial = async (serial: string) => {
  return {
    descripcion: "Laptop Dell XPS 13",
    marca: "Dell",
    activoFijo: "AF001",
    accesorios: "Cargador, Mouse inalámbrico, Maletín",
  };
};

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 14,
    marginBottom: 15,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  sectionTitle: {
    fontSize: 12,
    marginTop: 15,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 10,
    marginBottom: 10,
  },
  signatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  signature: {
    width: '40%',
    borderTopWidth: 1,
    borderColor: '#000',
    paddingTop: 5,
    fontSize: 10,
    textAlign: 'center',
  },
});

const ActaEntregaPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Acta de Traslado de Equipos</Text>
      
      <Text style={styles.subheader}>
        Fecha: {data.fechaTraslado ? format(data.fechaTraslado, "PPP") : ''}
      </Text>

      <Text style={styles.text}>
        Se realiza traslado de equipos a la regional {data.regionalDestino || ''}, 
        bodega {data.bodegaDestino || ''}.
      </Text>

      <Text style={styles.sectionTitle}>Motivo del Traslado:</Text>
      <Text style={styles.text}>{data.motivoTraslado || ''}</Text>

      <Text style={styles.sectionTitle}>Equipos a Trasladar:</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Serial</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Marca</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Activo Fijo</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Accesorios</Text>
          </View>
        </View>
        
        {data.equipos && data.equipos.map((equipo, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{equipo.serial || ''}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{equipo.marca || ''}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{equipo.activoFijo || ''}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{equipo.accesorios || ''}</Text>
            </View>
          </View>
        ))}
      </View>

      {data.observaciones && (
        <>
          <Text style={styles.sectionTitle}>Observaciones:</Text>
          <Text style={styles.text}>{data.observaciones}</Text>
        </>
      )}

      <View style={styles.signatures}>
        <View style={styles.signature}>
          <Text>{data.firmaEntrega || ''}</Text>
          <Text>Entrega</Text>
        </View>
        <View style={styles.signature}>
          <Text>{data.firmaRecibe || ''}</Text>
          <Text>Recibe</Text>
        </View>
      </View>
    </Page>
  </Document>
);

const Traslados = () => {
  const { toast } = useToast();
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
    toast({
      title: "Acta de traslado generada",
      description: "El documento PDF se descargará automáticamente",
    });
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#040d50] mb-6">Traslado de Equipos</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fechaTraslado"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Traslado</FormLabel>
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
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="regionalDestino"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regional Destino</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione la regional" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bogota">Bogotá</SelectItem>
                      <SelectItem value="medellin">Medellín</SelectItem>
                      <SelectItem value="cali">Cali</SelectItem>
                      <SelectItem value="barranquilla">Barranquilla</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bodegaDestino"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bodega Destino</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione la bodega" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bodega1">Bodega Principal</SelectItem>
                      <SelectItem value="bodega2">Bodega Secundaria</SelectItem>
                      <SelectItem value="bodega3">Bodega Auxiliar</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="motivoTraslado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motivo del Traslado</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ingrese el motivo del traslado..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-gray-50 p-4 rounded-lg">
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

          <div className="flex justify-end space-x-4">
            <Button type="submit" className="w-full">
              Generar Acta de Traslado
            </Button>
            {form.getValues("fechaTraslado") && (
              <PDFDownloadLink
                document={<ActaEntregaPDF data={form.getValues()} />}
                fileName={`acta-traslado-${format(new Date(), "yyyy-MM-dd")}.pdf`}
                className="hidden"
              >
                {({ blob, url, loading, error }) =>
                  loading ? "Generando documento..." : "Descargar PDF"
                }
              </PDFDownloadLink>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Traslados;
