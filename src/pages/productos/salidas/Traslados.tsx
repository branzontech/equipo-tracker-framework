
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
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
  PDFDownloadLink,
  Image
} from "@react-pdf/renderer";
import { useToast } from "@/components/ui/use-toast";
import { AccesoriosContainer } from "@/components/AccesorioItem";
import SignatureCanvas from "@/components/SignatureCanvas";
import ResponsibleSearch from "@/components/ResponsibleSearch";

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
    accesorios: z.array(z.object({
      nombre: z.string().min(1, "El nombre del accesorio es requerido"),
      serial: z.string().optional(),
    })).optional().default([]),
  })),
  observaciones: z.string(),
  responsableEntregaId: z.string().min(1, "El responsable de entrega es requerido"),
  responsableEntregaName: z.string(),
  responsableEntregaPosition: z.string(),
  responsableEntregaDepartment: z.string(),
  responsableRecibeId: z.string().min(1, "El responsable de recepción es requerido"),
  responsableRecibeName: z.string(),
  responsableRecibePosition: z.string(),
  responsableRecibeDepartment: z.string(),
  firmaEntrega: z.string().min(1, "La firma de quien entrega es requerida"),
  firmaRecibe: z.string().min(1, "La firma de quien recibe es requerida"),
});

const buscarEquipoPorSerial = async (serial: string) => {
  return {
    descripcion: "Laptop Dell XPS 13",
    marca: "Dell",
    activoFijo: "AF001",
    accesorios: [],
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

const ActaEntregaPDF = ({ data }) => {
  const formatAccesorios = (equipos) => {
    return equipos.map(equipo => {
      const accesoriosTexto = equipo.accesorios && equipo.accesorios.length > 0 
        ? equipo.accesorios.map(acc => 
            acc.serial 
              ? `${acc.nombre} (S/N: ${acc.serial})` 
              : acc.nombre
          ).join(", ")
        : "Ninguno";
      
      return {
        ...equipo,
        accesoriosTexto
      };
    });
  };

  const equiposConAccesorios = formatAccesorios(data.equipos || []);

  return (
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
          
          {equiposConAccesorios.map((equipo, index) => (
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
                <Text style={styles.tableCell}>{equipo.accesoriosTexto || ''}</Text>
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
            {data.firmaEntrega && <Image src={data.firmaEntrega} style={{ width: 150, height: 70 }} />}
            <Text>{data.responsableEntregaName || ''}</Text>
            <Text style={{ fontSize: 8 }}>{data.responsableEntregaPosition || ''}</Text>
            <Text>Entrega</Text>
          </View>
          <View style={styles.signature}>
            {data.firmaRecibe && <Image src={data.firmaRecibe} style={{ width: 150, height: 70 }} />}
            <Text>{data.responsableRecibeName || ''}</Text>
            <Text style={{ fontSize: 8 }}>{data.responsableRecibePosition || ''}</Text>
            <Text>Recibe</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const Traslados = () => {
  const { toast } = useToast();
  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equipos: [{ 
        serial: "", 
        descripcion: "", 
        marca: "", 
        activoFijo: "", 
        accesorios: [] 
      }],
      observaciones: "",
      responsableEntregaId: "",
      responsableEntregaName: "",
      responsableEntregaPosition: "",
      responsableEntregaDepartment: "",
      responsableRecibeId: "",
      responsableRecibeName: "",
      responsableRecibePosition: "",
      responsableRecibeDepartment: "",
      firmaEntrega: "",
      firmaRecibe: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "equipos",
  });

  const buscarEquipo = async (index: number, serial: string) => {
    try {
      const equipo = await buscarEquipoPorSerial(serial);
      methods.setValue(`equipos.${index}.descripcion`, equipo.descripcion);
      methods.setValue(`equipos.${index}.marca`, equipo.marca);
      methods.setValue(`equipos.${index}.activoFijo`, equipo.activoFijo);
    } catch (error) {
      console.error("Error al buscar equipo:", error);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Datos completos:", values);
    toast({
      title: "Acta de traslado generada",
      description: "El documento PDF se descargará automáticamente",
    });
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#01242c] mb-6">Traslado de Equipos</h1>
      
      <FormProvider {...methods}>
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={methods.control}
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={methods.control}
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
                control={methods.control}
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
              control={methods.control}
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
              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg bg-white">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium text-[#01242c]">Equipo {index + 1}</h3>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-red-500"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-12 gap-4 items-start">
                      <div className="col-span-12 md:col-span-3 relative">
                        <FormField
                          control={methods.control}
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

                      <div className="col-span-12 md:col-span-3">
                        <FormField
                          control={methods.control}
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

                      <div className="col-span-12 md:col-span-3">
                        <FormField
                          control={methods.control}
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

                      <div className="col-span-12 md:col-span-3">
                        <FormField
                          control={methods.control}
                          name={`equipos.${index}.descripcion`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descripción</FormLabel>
                              <FormControl>
                                <Input {...field} readOnly />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <AccesoriosContainer equipoIndex={index} />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => append({ serial: "", descripcion: "", marca: "", activoFijo: "", accesorios: [] })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar equipo
                </Button>
              </div>
            </div>

            <FormField
              control={methods.control}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResponsibleSearch 
                name="responsableEntrega" 
                label="Responsable de Entrega" 
              />
              
              <ResponsibleSearch 
                name="responsableRecibe" 
                label="Responsable de Recepción" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={methods.control}
                name="firmaEntrega"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firma de quien entrega</FormLabel>
                    <FormControl>
                      <SignatureCanvas
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="firmaRecibe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firma de quien recibe</FormLabel>
                    <FormControl>
                      <SignatureCanvas
                        value={field.value}
                        onChange={field.onChange}
                      />
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
              {methods.getValues("fechaTraslado") && (
                <PDFDownloadLink
                  document={<ActaEntregaPDF data={methods.getValues()} />}
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
      </FormProvider>
    </div>
  );
};

export default Traslados;
