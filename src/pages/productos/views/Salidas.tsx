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
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useUser } from "@/pages/usuarios/hooks/use-user";
import { useEffect, useState } from "react";
import { AccesoriosContainer } from "@/components/AccesorioItem";
import { toast } from "sonner";
import { Equipo } from "../interfaces/equipo";
import { useGlobal } from "@/hooks/use-global";
import { SearchEquipo } from "@/components/SearchEquipo";

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
  const { newPrestamo, setNewPrestamo, addPrestamo } = usePrestamo();
  const {
    newUser,
    setNewUser,
    users,
    selectedEntregaUser,
    setSelectedEntregaUser,
    selectedRecibeUser,
    setSelectedRecibeUser,
  } = useUser();
  const methods = useForm();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-[#01242c] mb-6">
        Salida de Equipos en Condición de Préstamo
      </h1>

      <FormProvider {...methods}>
        <form
          className="space-y-8"
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();

            const firmaFinalEntrega =
              newUser.firma_entrega || selectedEntregaUser?.firma || "";
            const firmaFinalRecibe =
              newUser.firma_recibe || selectedRecibeUser?.firma || "";

            addPrestamo(newPrestamo, firmaFinalEntrega, firmaFinalRecibe);
          }}
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fechaEntrega">Fecha de Entrega</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newPrestamo.fecha_salida ? (
                      format(newPrestamo.fecha_salida, "PPP", {
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
                      typeof newPrestamo.fecha_salida === "string"
                        ? new Date(newPrestamo.fecha_salida)
                        : newPrestamo.fecha_salida
                    }
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
                    <CalendarIcon className="mr-2 h-4 w-4" />
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
                    selected={
                      typeof newPrestamo.fecha_retorno === "string"
                        ? new Date(newPrestamo.fecha_retorno)
                        : newPrestamo.fecha_retorno
                    }
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
              <Select
                value={newUser.nombre}
                onValueChange={(value) =>
                  setNewUser({ ...newUser, nombre: value })
                }
              >
                <SelectTrigger id="nombreUsuario">
                  <SelectValue placeholder="Seleccione un usuario" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id_usuario} value={user.nombre}>
                      {user.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Entregado">Entregado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-4 text-gray-700">
              Señor(a) <span className="font-semibold">{newUser.nombre}</span> a
              continuación se le hace entrega de los siguientes implementos de
              trabajo:
            </p>

            <SearchEquipo
              onEquipoEncontrado={(equipo) => {
                setNewPrestamo((prev) => ({
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripcion del prestamo</Label>
            <Textarea
              id="descripcion"
              placeholder="Ingrese la descripción..."
              rows={4}
              value={newPrestamo.descripcion}
              onChange={(e) => {
                setNewPrestamo({
                  ...newPrestamo,
                  descripcion: e.target.value,
                });
              }}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
            El receptor se compromete a utilizar el equipo exclusivamente para
            propósitos laborales, mantenerlo en óptimas condiciones y reportar
            de manera inmediata cualquier falla o anomalía que se presente.
            Asimismo, se compromete a no instalar ningún tipo de software sin la
            debida autorización, no prestar ni transferir el equipo a terceras
            personas y devolverlo cuando la empresa lo requiera.
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
                setNewPrestamo((prev) => ({
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
                setNewPrestamo((prev) => ({
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
              Generar Acta de Entrega
            </Button>
            {newPrestamo.fecha_salida && (
              <PDFDownloadLink
                document={<ActaEntregaPDF data={newPrestamo} />}
                fileName={`acta-entrega-${format(
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

export default Salidas;
