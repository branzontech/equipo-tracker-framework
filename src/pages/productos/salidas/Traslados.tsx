import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import * as z from "zod";
import { format, set } from "date-fns";
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
  Image,
} from "@react-pdf/renderer";
import { useToast } from "@/components/ui/use-toast";
import { AccesoriosContainer } from "@/components/AccesorioItem";
import SignatureCanvas from "@/components/SignatureCanvas";
import ResponsibleSearch from "@/components/ResponsibleSearch";
import { Label } from "@/components/ui/label";
import { useTraslados } from "../hooks/use-traslados";
import { es } from "date-fns/locale";
import { useSedes } from "@/pages/configuracion/maestros/hooks/use-sedes";
import { useSucursales } from "@/pages/configuracion/maestros/hooks/use-sucursales";
import { SearchEquipo } from "@/components/SearchEquipo";
import { useUser } from "@/pages/usuarios/hooks/use-user";
import { useState } from "react";

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
        <Text style={styles.header}>Acta de Traslado de Equipos</Text>

        <Text style={styles.subheader}>
          Fecha: {data.fechaTraslado ? format(data.fechaTraslado, "PPP") : ""}
        </Text>

        <Text style={styles.text}>
          Se realiza traslado de equipos a la regional{" "}
          {data.regionalDestino || ""}, bodega {data.bodegaDestino || ""}.
        </Text>

        <Text style={styles.sectionTitle}>Motivo del Traslado:</Text>
        <Text style={styles.text}>{data.motivoTraslado || ""}</Text>

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

const Traslados = () => {
  const {
    newTraslado,
    setNewTraslado,
    sedesFiltradas,
    setRegionalSeleccionado,
    sucursalesFiltradas,
    setSedesSelect,
    registerTraslado,
  } = useTraslados();
  const {
    newUser,
    users,
    selectedEntregaUser,
    setSelectedEntregaUser,
    selectedRecibeUser,
    setSelectedRecibeUser,
  } = useUser();
  const methods = useForm();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#01242c] mb-6">
        Traslado de Equipos
      </h1>

      <FormProvider {...methods}>
        <form
          className="space-y-8 p-6 rounded-lg shadow-md border border-gray-200"
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            const firmaFinalEntrega =
              newUser.firma_entrega || selectedEntregaUser?.firma || "";
            const firmaFinalRecibe =
              newUser.firma_recibe || selectedRecibeUser?.firma || "";

            registerTraslado(newTraslado, firmaFinalEntrega, firmaFinalRecibe);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fechaTraslado">Fecha de Traslado</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newTraslado.fecha_traslado ? (
                      format(newTraslado.fecha_traslado, "PPP", {
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
                    selected={
                      typeof newTraslado.fecha_traslado === "string"
                        ? new Date(newTraslado.fecha_traslado)
                        : newTraslado.fecha_traslado
                    }
                    onSelect={(date) =>
                      setNewTraslado({
                        ...newTraslado,
                        fecha_traslado: date as Date,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="regionalDestino">Regional Destino</Label>
              <Select onValueChange={setRegionalSeleccionado}>
                <SelectTrigger id="regionalDestino">
                  <SelectValue placeholder="Seleccione un regional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bogota">Bogotá</SelectItem>
                  <SelectItem value="medellin">Medellín</SelectItem>
                  <SelectItem value="cali">Cali</SelectItem>
                  <SelectItem value="barranquilla">Barranquilla</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="regionalDestino">Sede Destino</Label>
              <Select onValueChange={(value) => setSedesSelect(Number(value))}>
                <SelectTrigger id="regionalDestino">
                  <SelectValue placeholder="Seleccione un sede" />
                </SelectTrigger>
                <SelectContent>
                  {sedesFiltradas.map((sede) => (
                    <SelectItem key={sede.id_sede} value={String(sede.id_sede)}>
                      {sede.nombre} - {sede.regional}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bodegaDestino">Sucursal Destino</Label>
              <Select
                onValueChange={(value) => {
                  setNewTraslado((prev) => ({
                    ...prev,
                    sucursal_destino_id: Number(value),
                  }));
                }}
              >
                <SelectTrigger id="bodegaDestino">
                  <SelectValue placeholder="Seleccione una sucursal" />
                </SelectTrigger>
                <SelectContent>
                  {sucursalesFiltradas.map((sucursal) => (
                    <SelectItem
                      key={sucursal.id_sucursal}
                      value={String(sucursal.id_sucursal)}
                    >
                      {sucursal.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-6">
            <Label>Motivos del Traslado</Label>
            <Textarea
              placeholder="Ingrese el motivo del traslado..."
              className="resize-none"
              value={newTraslado.motivo}
              onChange={(e) => {
                setNewTraslado({
                  ...newTraslado,
                  motivo: e.target.value,
                });
              }}
            />
          </div>

          <SearchEquipo
            onEquipoEncontrado={(equipo) => {
              setNewTraslado((prev) => ({
                ...prev,
                equipos: [
                  ...prev.equipos,
                  {
                    id_equipo: equipo.id_equipo,
                    perifericos: Array.isArray(equipo.perifericos)
                      ? equipo.perifericos.map((p) => p.id_periferico)
                      : [],
                  },
                ],
              }));
            }}
          />

          <div className="space-y-6">
            <Label>Observaciones</Label>
            <Textarea
              placeholder="Ingrese las observaciones..."
              rows={4}
              value={newTraslado.observaciones}
              onChange={(e) => {
                setNewTraslado({
                  ...newTraslado,
                  observaciones: e.target.value,
                });
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsibleSearch
              name="responsableEntrega"
              label="Responsable de Entrega"
              onSelect={(person) => {
                const user = users.find(
                  (u) => u.id_usuario === Number(person.id)
                );
                if (user) {
                  setSelectedEntregaUser({
                    ...user,
                    firma: user.firma || "",
                  });
                } else {
                  setSelectedEntregaUser(null);
                }
                setNewTraslado((prev) => ({
                  ...prev,
                  responsable_salida_id: Number(person.id),
                }));
              }}
            />

            <ResponsibleSearch
              name="responsableRecibe"
              label="Responsable de Recepción"
              onSelect={(person) => {
                const user = users.find(
                  (u) => u.id_usuario === Number(person.id)
                );
                if (user) {
                  setSelectedRecibeUser({
                    ...user,
                    firma: user.firma || "",
                  });
                } else {
                  setSelectedRecibeUser(null);
                }
                setNewTraslado((prev) => ({
                  ...prev,
                  responsable_entrada_id: Number(person.id),
                }));
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firmaEntrega">Firma de quien entrega</Label>
              <SignatureCanvas
                value={selectedEntregaUser?.firma || ""}
                onChange={(value: string) => {
                  newUser.firma_entrega = value;
                  if (selectedEntregaUser) {
                    setSelectedEntregaUser({
                      ...selectedEntregaUser,
                      firma: value,
                    });
                  }
                }}
                readOnly={!!selectedEntregaUser?.firma}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firmaRecibe">Firma de quien recibe</Label>
              <SignatureCanvas
                value={selectedRecibeUser?.firma || ""}
                onChange={(value: string) => {
                  newUser.firma_recibe = value;
                  if (selectedRecibeUser) {
                    setSelectedRecibeUser({
                      ...selectedRecibeUser,
                      firma: value,
                    });
                  }
                }}
                readOnly={!!selectedRecibeUser?.firma}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="submit" className="w-full">
              Generar Acta de Traslado
            </Button>
            {methods.getValues("fechaTraslado") && (
              <PDFDownloadLink
                document={<ActaEntregaPDF data={methods.getValues()} />}
                fileName={`acta-traslado-${format(
                  new Date(),
                  "yyyy-MM-dd"
                )}.pdf`}
                className="hidden"
              >
                {({ blob, url, loading, error }) =>
                  loading ? "Generando documento..." : "Descargar PDF"
                }
              </PDFDownloadLink>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Traslados;
