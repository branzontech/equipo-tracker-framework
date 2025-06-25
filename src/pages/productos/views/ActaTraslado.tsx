import { Page, Text, View, Image } from "@react-pdf/renderer";
import { styles } from "./stylesActa";
import { useActa } from "../hooks/use-acta";
import { formatFecha } from "@/hooks/use-global";

export const ActaTraslado = ({ data }) => {
  const { getFirmas } = useActa();
  const { firmaEntrega, nombreEntrega, firmaRecibe, nombreRecibe } =
    getFirmas(data);

  const formatTodosLosElementos = (traslado) => {
    const equipos =
      traslado?.traslados_equipos?.map((item) => {
        const perifericos = item.traslados_perifericos || [];

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
          serial: item.equipos?.nro_serie || "-",
          marca: item.equipos?.marcas?.nombre || "-",
          tipo: item.equipos?.tipo_activo || "-",
          nombre: item.equipos?.nombre_equipo || "-",
          accesoriosTexto,
          esPerifericoDirecto: false,
        };
      }) || [];

    const perifericosDirectos =
      traslado?.traslado_perifericos_directos?.map((item) => {
        const p = item.perifericos;
        return {
          serial: p?.serial || "-",
          marca: p?.marcas?.nombre || "-",
          tipo: p?.tipo || "-",
          nombre: p?.nombre || "-",
          accesoriosTexto: "-",
          esPerifericoDirecto: true,
        };
      }) || [];

    const impresoras =
      traslado?.traslado_impresoras?.map((item) => {
        const i = item.impresoras;
        return {
          serial: i?.serial || "-",
          marca: i?.marcas?.nombre || "-",
          tipo: i?.tipo || "-",
          nombre: i?.nombre || "-",
          accesoriosTexto: "-",
          esPerifericoDirecto: true,
        };
      }) || [];

    return [...equipos, ...perifericosDirectos, ...impresoras];
  };

  const traslado = data.traslados?.[0];
  const equiposConTodo = formatTodosLosElementos(traslado);

  const mostrarNombreEnVezDeAccesorios = equiposConTodo.every(
    (e) => e.esPerifericoDirecto || e.tipo === "Impresora"
  );

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Acta de Traslado de Equipos</Text>

      <Text style={styles.text}>
        Fecha de traslado: {formatFecha(traslado?.fecha_traslado)}
      </Text>

      <Text style={styles.subheader}>
        Señor(a){" "}
        {traslado?.usuarios_traslados_responsable_salida_idTousuarios?.nombre ||
          ""}
        , a continuación se relacionan los equipos trasladados a la{" "}
        {traslado?.sucursales?.nombre || ""} (
        {traslado?.sucursales?.sedes?.nombre || ""}):
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
            <Text style={styles.tableCell}>
              {mostrarNombreEnVezDeAccesorios ? "Nombre" : "Accesorios"}
            </Text>
          </View>
        </View>

        {equiposConTodo.map((item, index) => (
          <View style={[styles.tableRow, styles.tableHeader]} key={index}>
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
              <Text style={styles.tableCell}>
                {mostrarNombreEnVezDeAccesorios
                  ? item.nombre || "-"
                  : item.accesoriosTexto || "-"}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {traslado?.motivo && (
        <>
          <Text style={styles.sectionTitle}>Motivo del traslado:</Text>
          <Text style={styles.text}>{traslado.motivo}</Text>
        </>
      )}

      {traslado?.observaciones && (
        <>
          <Text style={styles.sectionTitle}>Observaciones:</Text>
          <Text style={styles.text}>{traslado.observaciones}</Text>
        </>
      )}

      <Text style={styles.sectionTitle}>Términos y Condiciones:</Text>
      <Text style={styles.text}>
        El receptor se compromete a utilizar el equipo exclusivamente para
        propósitos laborales, mantenerlo en óptimas condiciones y reportar de
        manera inmediata cualquier falla o anomalía. No se permite instalar
        software sin autorización, prestar el equipo a terceros ni omitir su
        devolución al ser requerido.
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
