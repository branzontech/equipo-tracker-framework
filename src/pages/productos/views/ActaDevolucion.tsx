import { Page, Text, View, Image } from "@react-pdf/renderer";
import { styles } from "./stylesActa";
import { useActa } from "../hooks/use-acta";
import { formatFecha } from "@/hooks/use-global";

export const ActaDevolucion = ({ data }) => {
  const { getFirmas } = useActa();
  const { firmaEntrega, nombreEntrega, firmaRecibe, nombreRecibe } =
    getFirmas(data);

  const devolucion = data.devoluciones?.[0];
  const equipos: {
    serial: string;
    marca: string;
    activoFijo: string;
    accesorios: string;
  }[] = [];

  if (devolucion?.prestamos) {
    devolucion.prestamos.prestamo_equipos.forEach((item) => {
      const equipo = item.equipos;
      const perifericos = item.prestamo_perifericos
        .map((p) => p.perifericos?.nombre)
        .filter(Boolean)
        .join(", ");

      if (equipo) {
        equipos.push({
          serial: equipo.nro_serie || "N/A",
          marca: equipo.marcas?.nombre || "N/A",
          activoFijo: equipo.tipo_activo || "N/A",
          accesorios: perifericos || "N/A",
        });
      }
    });
  }

  if (devolucion?.traslados) {
    devolucion.traslados.traslados_equipos.forEach((item) => {
      const equipo = item.equipos;
      const perifericos = item.traslados_perifericos
        .map((p) => p.perifericos?.nombre)
        .filter(Boolean)
        .join(", ");

      if (equipo) {
        equipos.push({
          serial: equipo.nro_serie || "N/A",
          marca: equipo.marcas?.nombre || "N/A",
          activoFijo: equipo.tipo_activo || "N/A",
          accesorios: perifericos || "N/A",
        });
      }
    });
  }

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Acta de Devolución de Equipos</Text>

      <Text style={styles.text}>
        Fecha de elaboración: {formatFecha(data.fecha)}
      </Text>
      <Text style={styles.text}>
        Fecha de devolución: {formatFecha(devolucion?.fecha_devolucion)}
      </Text>

      <Text style={styles.subheader}>
        Por medio del presente documento, se deja constancia de la devolución de
        los siguientes equipos por parte del responsable.
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

        {equipos.map((equipo, i) => (
          <View style={[styles.tableRow, styles.tableHeader]} key={i}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{equipo.serial}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{equipo.marca}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{equipo.activoFijo}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{equipo.accesorios}</Text>
            </View>
          </View>
        ))}
      </View>

      {devolucion?.observaciones && (
        <>
          <Text style={styles.sectionTitle}>Observaciones:</Text>
          <Text style={styles.text}>{devolucion.observaciones}</Text>
        </>
      )}

      <Text style={styles.sectionTitle}>Motivo de devolución:</Text>
      <Text style={styles.text}>{devolucion?.motivo || "No especificado"}</Text>

      <Text style={styles.sectionTitle}>Notas legales:</Text>
      <Text style={styles.text}>
        La devolución ha sido realizada conforme a los lineamientos de la
        institución. Los equipos quedan bajo revisión técnica para su posterior
        uso, mantenimiento o baja definitiva.
      </Text>

      <View style={styles.signatures}>
        <View style={styles.signature}>
          {firmaEntrega && (
            <Image src={firmaEntrega} style={styles.firmaImagen} />
          )}
          <View style={styles.signatureLine} />
          <Text>{nombreEntrega || ""}</Text>
          <Text style={styles.signatureRole}>Entrega</Text>
        </View>

        <View style={styles.signature}>
          {firmaRecibe && (
            <Image src={firmaRecibe} style={styles.firmaImagen} />
          )}
          <View style={styles.signatureLine} />
          <Text>{nombreRecibe || ""}</Text>
          <Text style={styles.signatureRole}>Recepción</Text>
        </View>
      </View>
    </Page>
  );
};