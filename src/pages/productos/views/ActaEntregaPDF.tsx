import { Document, Page, Text } from "@react-pdf/renderer";
import { ActaPrestamo } from "./ActaPrestamo";
import { ActaTraslado } from "./ActaTraslado";
import { ActaBaja } from "./ActaBaja";

export const ActaEntregaPDF = ({ data }) => {
  if (!data?.tipo) {
    return (
      <Document>
        <Page>
          <Text>Acta no válida</Text>
        </Page>
      </Document>
    );
  }
  if (data.tipo === "Prestamo") {
    return (
      <Document>
        <ActaPrestamo data={data} />
      </Document>
    );
  }

  if (data.tipo === "Traslado") {
    return (
      <Document>
        <ActaTraslado data={data} />
      </Document>
    );
  }

  if (data.tipo === "Baja") {
    return (
      <Document>
        <ActaBaja data={data} />
      </Document>
    );
  }

  return (
    <Document>
      <Page>
        <Text>Tipo de acta no soportado: {data.tipo}</Text>
      </Page>
    </Document>
  );
};
