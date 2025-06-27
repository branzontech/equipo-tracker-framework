import { Page, Text, View, Image } from "@react-pdf/renderer";
import { styles } from "./stylesActa";
import { useActa } from "../hooks/use-acta";
import { formatFecha } from "@/hooks/use-global";

export const ActaBaja = ({ data }) => {
  const { getFirmas } = useActa();
  const { firmaEntrega, nombreEntrega, firmaRecibe, nombreRecibe } =
    getFirmas(data);

  const baja = data.bajas?.[0];

  const equipos = [];

  // Equipos
  baja?.bajas_equipos?.forEach((item) => {
    const equipo = item.equipos;
    if (equipo) {
      equipos.push({
        categoria: "Equipo",
        serial: equipo.nro_serie || "-",
        nombre: equipo.nombre_equipo || "-",
        marca: equipo.marcas?.nombre || "-",
        tipo: equipo.tipo_activo || "-",
        motivo: item.motivos || "-",
      });
    }
  });

  // Periféricos directos
  baja?.bajas_perifericos_directos?.forEach((item) => {
    const perif = item.perifericos;
    if (perif) {
      equipos.push({
        categoria: "Periférico",
        serial: perif.serial || "-",
        nombre: perif.nombre || "-",
        marca: perif.marcas?.nombre || "-",
        tipo: perif.tipo || "-",
        motivo: perif.motivo || "-",
      });
    }
  });

  // Impresoras
  baja?.bajas_impresoras?.forEach((item) => {
    const imp = item.impresoras;
    if (imp) {
      equipos.push({
        categoria: "Impresora",
        serial: imp.serial || "-",
        nombre: imp.nombre || "-",
        marca: imp.marcas?.nombre || "-",
        tipo: imp.tipo || "-",
        motivo: item.motivos || "-",
      });
    }
  });

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Acta de Baja de Equipos</Text>

      <Text style={styles.text}>
        Fecha de elaboración: {formatFecha(data.fecha)}
      </Text>
      <Text style={styles.text}>
        Fecha de baja: {formatFecha(baja?.fecha_baja)}
      </Text>

      <Text style={styles.subheader}>
        Por medio del presente documento, se deja constancia de la baja de los
        siguientes equipos del inventario de la entidad.
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
            <Text style={styles.tableCell}>Motivo</Text>
          </View>
        </View>

        {equipos.map((item, i) => (
          <View style={styles.tableRow} key={i}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.serial}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.marca}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.tipo}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.motivo}</Text>
            </View>
          </View>
        ))}
      </View>

      {baja?.observaciones_adicionales && (
        <>
          <Text style={styles.sectionTitle}>Observaciones adicionales:</Text>
          <Text style={styles.text}>{baja.observaciones_adicionales}</Text>
        </>
      )}

      <Text style={styles.sectionTitle}>Ubicación de los equipos bajados:</Text>
      <Text style={styles.text}>
        El equipo bajado se encuentra ubicado en la sede{" "}
        {baja?.bajas_equipos?.[0]?.equipos?.sucursales?.sedes?.nombre ||
          baja?.bajas_perifericos_directos?.[0]?.perifericos?.sucursales?.sedes
            ?.nombre ||
          baja?.bajas_impresoras?.[0]?.impresoras?.sucursales?.sedes?.nombre ||
          "-"}
        , en la sucursal{" "}
        {baja?.bajas_equipos?.[0]?.equipos?.sucursales?.nombre ||
          baja?.bajas_perifericos_directos?.[0]?.perifericos?.sucursales
            ?.nombre ||
          baja?.bajas_impresoras?.[0]?.impresoras?.sucursales?.nombre ||
          "-"}
        .
      </Text>

      <Text style={styles.sectionTitle}>Notas legales:</Text>
      <Text style={styles.text}>
        El proceso de baja ha sido realizado conforme a los lineamientos
        institucionales, autorizando el retiro de estos activos del inventario.
        Cualquier uso posterior no autorizado podrá estar sujeto a medidas
        legales.
      </Text>

      <View style={styles.signatures}>
        <View style={styles.signature}>
          {firmaEntrega && (
            <Image src={firmaEntrega} style={styles.firmaImagen} />
          )}
          <View style={styles.signatureLine} />
          <Text>{nombreEntrega || ""}</Text>
          <Text style={styles.signatureRole}>Autorizado por</Text>
        </View>

        <View style={styles.signature}>
          {firmaRecibe && (
            <Image src={firmaRecibe} style={styles.firmaImagen} />
          )}
          <View style={styles.signatureLine} />
          <Text>{nombreRecibe || ""}</Text>
          <Text style={styles.signatureRole}>Solicitado por</Text>
        </View>
      </View>
    </Page>
  );
};
