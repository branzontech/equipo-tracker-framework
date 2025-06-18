import { Page, Text, View, Image } from "@react-pdf/renderer";
import { styles } from "./stylesActa";
import { useActa } from "../hooks/use-acta";
import { formatFecha } from "@/hooks/use-global";

export const ActaPrestamo = ({ data }) => {
  const { getFirmas } = useActa();
  const { firmaEntrega, nombreEntrega, firmaRecibe, nombreRecibe } =
    getFirmas(data);

  const formatAccesorios = (equipos) => {
    return equipos.map((equipo) => {
      const perifericos = equipo.prestamo_perifericos || [];

      const accesoriosTexto =
        perifericos.length > 0
          ? perifericos
              .map((p) => {
                const acc = p.perifericos;
                return acc?.nombre
                  ? acc?.tipo
                    ? `${acc.nombre} (${acc.tipo})`
                    : acc.nombre
                  : "Desconocido";
              })
              .join(", ")
          : "Ninguno";

      return {
        ...equipo,
        accesoriosTexto,
        serial: equipo.equipos?.nro_serie || "",
        marca: equipo.equipos?.marcas?.nombre || "",
        activoFijo: equipo.equipos?.tipo_activo || "",
      };
    });
  };

  const equiposConAccesorios = formatAccesorios(
    data.prestamos?.[0]?.prestamo_equipos || []
  );

  const prestamo = data.prestamos?.[0];

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>
        ACTA DE SALIDA DE EQUIPOS EN CONDICION DE PRESTAMO
      </Text>

      <Text style={styles.text}>
        Fecha de entrega: {formatFecha(prestamo.fecha_salida)}
      </Text>

      <Text style={styles.text}>
        Fecha de retorno: {formatFecha(prestamo.fecha_retorno)}
      </Text>

      <Text style={styles.subheader}>
        Señor(a){" "}
        {prestamo?.usuarios_prestamos_responsable_entrada_idTousuarios
          ?.nombre || ""}{" "}
        a continuación se le hace entrega de los siguientes implementos de
        trabajo:
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
            <Text style={styles.tableCell}>Tipo de Activo</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Accesorios</Text>
          </View>
        </View>

        {equiposConAccesorios.map((equipo, index) => (
          <View style={[styles.tableRow, styles.tableHeader]} key={index}>
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

      {prestamo.descripcion && (
        <>
          <Text style={styles.sectionTitle}>Observaciones:</Text>
          <Text style={styles.text}>{prestamo.descripcion}</Text>
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
          {firmaEntrega && (
            <Image src={firmaEntrega} style={styles.firmaImagen} />
          )}
          <View style={styles.signatureLine} />
          <Text>{nombreEntrega || ""}</Text>
          <Text style={styles.signatureRole}>Entregado por</Text>
        </View>
        <View style={styles.signature}>
          {firmaRecibe && (
            <Image src={firmaRecibe} style={styles.firmaImagen} />
          )}
          <View style={styles.signatureLine} />
          <Text>{nombreRecibe || ""}</Text>
          <Text style={styles.signatureRole}>Recibido por</Text>
        </View>
      </View>
    </Page>
  );
};
