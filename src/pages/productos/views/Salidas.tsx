import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Search, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  Image,
} from "@react-pdf/renderer";
import ResponsibleSearch from "@/components/ResponsibleSearch";
import { usePrestamo } from "../hooks/use-prestamo";
import { Label } from "@/components/ui/label";
import { es } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEquipos } from "../hooks/use-equipos";
import SignatureCanvas from "@/components/SignatureCanvas";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  subheader: {
    fontSize: 14,
    marginBottom: 15,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
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
    fontWeight: "bold",
  },
  text: {
    fontSize: 10,
    marginBottom: 10,
  },
  signatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
  },
  signature: {
    width: "40%",
    borderTopWidth: 1,
    borderColor: "#000",
    paddingTop: 5,
    fontSize: 10,
    textAlign: "center",
  },
});

const ActaEntregaPDF = ({ data }) => {
  const formatAccesorios = (equipos) => {
    return equipos.map((equipo) => {
      const accesoriosTexto =
        equipo.accesorios && equipo.accesorios.length > 0
          ? equipo.accesorios
              .map((acc) =>
                acc.serial ? `${acc.nombre} (S/N: ${acc.serial})` : acc.nombre
              )
              .join(", ")
          : "Ninguno";

      return {
        ...equipo,
        accesoriosTexto,
      };
    });
  };

  const equiposConAccesorios = formatAccesorios(data.equipos || []);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>
          Acta de Salida de Equipos en Condición de Préstamo
        </Text>

        <Text style={styles.subheader}>
          Fecha: {data.fechaEntrega ? format(data.fechaEntrega, "PPP") : ""}
        </Text>

        <Text style={styles.text}>
          Señor(a) {data.nombreUsuario || ""} a continuación se le hace entrega
          de los siguientes implementos de trabajo:
        </Text>

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
                <Text style={styles.tableCell}>{equipo.serial || ""}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{equipo.marca || ""}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{equipo.activoFijo || ""}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {equipo.accesoriosTexto || ""}
                </Text>
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

        <Text style={styles.sectionTitle}>Términos y Condiciones:</Text>
        <Text style={styles.text}>
          El receptor se compromete a utilizar el equipo exclusivamente para
          propósitos laborales, mantenerlo en óptimas condiciones y reportar de
          manera inmediata cualquier falla o anomalía que se presente. Asimismo,
          se compromete a no instalar ningún tipo de software sin la debida
          autorización, no prestar ni transferir el equipo a terceras personas y
          devolverlo cuando la empresa lo requiera.
        </Text>

        <View style={styles.signatures}>
          <View style={styles.signature}>
            {data.firmaEntrega && (
              <Image
                src={data.firmaEntrega}
                style={{ width: 150, height: 70 }}
              />
            )}
            <Text>{data.responsableEntregaName || ""}</Text>
            <Text style={{ fontSize: 8 }}>
              {data.responsableEntregaPosition || ""}
            </Text>
            <Text>Entrega</Text>
          </View>
          <View style={styles.signature}>
            {data.firmaRecibe && (
              <Image
                src={data.firmaRecibe}
                style={{ width: 150, height: 70 }}
              />
            )}
            <Text>{data.responsableRecibeName || ""}</Text>
            <Text style={{ fontSize: 8 }}>
              {data.responsableRecibePosition || ""}
            </Text>
            <Text>Recibe</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const Salidas = () => {
  const { newPrestamo, prestamos, setNewPrestamo } = usePrestamo();
  const { equipo, newEquipo, getInfoEquipo } = useEquipos();

  const buscarEquipo = async (serial: string) => {
    try {
      const equipo = await getInfoEquipo(serial);
    } catch (error) {
      console.error("Error al buscar equipo:", error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#01242c] mb-6">
        Salida de Equipos en Condición de Préstamo
      </h1>

      <form className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fechaEntrega">Fecha de Entrega</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  {newPrestamo.fecha_salida ? (
                    format(newPrestamo.fecha_salida, "PPP", {
                      locale: es,
                    })
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={newPrestamo.fecha_salida}
                  onSelect={(date) =>
                    setNewPrestamo({
                      ...newPrestamo,
                      fecha_salida: date as Date,
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaRetorno">Fecha de Retorno</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  {newPrestamo.fecha_retorno ? (
                    format(newPrestamo.fecha_retorno, "PPP", {
                      locale: es,
                    })
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newPrestamo.fecha_retorno}
                  onSelect={(date) =>
                    setNewPrestamo({
                      ...newPrestamo,
                      fecha_retorno: date as Date,
                    })
                  }
                  initialFocus
                  disabled={(date) =>
                    newPrestamo.fecha_retorno
                      ? date < newPrestamo.fecha_retorno
                      : false
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombreUsuario">Nombre del Usuario</Label>
            <Input id="nombreUsuario" placeholder="Nombre completo" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={newPrestamo.estado || ""}
              onValueChange={(value) =>
                setNewPrestamo({ ...newPrestamo, estado: value })
              }
            >
              <SelectTrigger id="estado">
                <SelectValue placeholder="Seleccione un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="entregado">Entregado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="mb-4 text-gray-700">
            Señor(a) <span className="font-semibold"></span> a continuación se
            le hace entrega de los siguientes implementos de trabajo:
          </p>

          <div className="space-y-6">
            {equipo.map((field, index) => (
              <div
                key={field.id_equipo}
                className="p-4 border rounded-lg bg-white"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-[#01242c]">
                    Equipo {index + 1}
                  </h3>
                  {equipo.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-12 md:col-span-3 relative">
                      <Label>Serial</Label>
                      <Input
                        placeholder="Ingrese el serial del equipo"
                        value={field.nro_serie}
                        onChange={(e) => {
                          field.nro_serie = e.target.value;
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0"
                        onClick={() => buscarEquipo(field.nro_serie)}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="col-span-12 md:col-span-3">
                      <Label>Marca</Label>
                      <Input value={field.marcas.nombre || ""} readOnly />
                    </div>

                    <div className="col-span-12 md:col-span-3">
                      <Label>Activo Fijo</Label>
                      <Input value={field.tipo_activo || ""} readOnly />
                    </div>

                    <div className="col-span-12 md:col-span-3">
                      <Label>Nombre</Label>
                      <Input value={field.nombre_equipo || ""} readOnly />
                  </div>
                </div>

                {/* <AccesoriosContainer equipoIndex={index} /> */}
              </div>
            ))}

            <Button type="button" variant="outline" size="sm" className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Agregar equipo
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="observaciones">Observaciones</Label>
          <Textarea
            id="observaciones"
            placeholder="Ingrese las observaciones..."
            rows={4}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
          El receptor se compromete a utilizar el equipo exclusivamente para
          propósitos laborales, mantenerlo en óptimas condiciones y reportar de
          manera inmediata cualquier falla o anomalía que se presente. Asimismo,
          se compromete a no instalar ningún tipo de software sin la debida
          autorización, no prestar ni transferir el equipo a terceras personas y
          devolverlo cuando la empresa lo requiera.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <ResponsibleSearch
            name="responsableEntrega"
            label="Responsable de Entrega"
          />

          <ResponsibleSearch
            name="responsableRecibe"
            label="Responsable de Recepción"
          /> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firmaEntrega">Firma de quien entrega</Label>
            <SignatureCanvas
              value={newPrestamo.firma_entrega}
              onChange={(value: string) => {
                setNewPrestamo({ ...newPrestamo, firma_entrega: value });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="firmaRecibe">Firma de quien recibe</Label>
            <SignatureCanvas
              value={newPrestamo.firma_recibe}
              onChange={(value: string) => {
                setNewPrestamo({ ...newPrestamo, firma_recibe: value });
              }}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="submit" className="w-full">
            Generar Acta de Entrega
          </Button>
          {/* {methods.getValues("fechaEntrega") && (
            <PDFDownloadLink
              document={<ActaEntregaPDF data={methods.getValues()} />}
              fileName={`acta-entrega-${format(new Date(), "yyyy-MM-dd")}.pdf`}
              className="hidden"
            >
              {({ blob, url, loading, error }) =>
                loading ? "Generando documento..." : "Descargar PDF"
              }
            </PDFDownloadLink>
          )} */}
        </div>
      </form>
    </div>
  );
};

export default Salidas;
