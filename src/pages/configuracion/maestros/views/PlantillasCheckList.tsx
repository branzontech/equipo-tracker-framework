import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardList, Star } from "lucide-react";
import { useChecklist } from "../../checklist/hooks/use-checklist";

export const PlantillasCheckList = () => {
  const { checklist } = useChecklist();

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#01242c]">
          PLANTILLAS DE LA LISTA DE CHEQUEO
        </h2>
        <p className="text-sm text-gray-500">
          Consulta y gestiona las plantillas disponibles para tus equipos
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {checklist.map((plantilla) => (
          <Card
            key={plantilla.id_plantilla}
            className="hover:shadow-md transition"
          >
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#01242c]">
                  {plantilla.nombre}
                </h3>
                <Badge variant="outline">{plantilla.tipo_equipo}</Badge>
              </div>

              {/* Tipo de calificación */}
              <div className="space-y-1 text-gray-700">
                <span className="font-medium text-sm">
                  Tipo de Calificación: {plantilla.tipo_calificacion}
                </span>

                {plantilla.tipo_calificacion === "ESTRELLAS" ? (
                  <div className="flex space-x-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400" />
                    ))}
                  </div>
                ) : plantilla.tipo_calificacion === "ESCALA" ? (
                  <div className="text-sm text-gray-600">
                    <p>Escala de 1 a 10</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-green-400 h-2 rounded-full"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                ) : plantilla.tipo_calificacion === "CATEGORIA" ? (
                  <div className="flex gap-2">
                    <span className="px-2 py-1 rounded-full bg-red-100 text-red-600 text-xs">
                      Malo
                    </span>
                    <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-600 text-xs">
                      Bueno
                    </span>
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-600 text-xs">
                      Excelente
                    </span>
                  </div>
                ) : (
                  <span className="text-sm capitalize text-gray-600">
                    {plantilla.tipo_calificacion}
                  </span>
                )}
              </div>

              {/* Campos */}
              <div className="space-y-2">
                <div className="flex items-center mb-1 text-gray-700">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  <span className="font-medium text-sm">Campos</span>
                </div>

                <div className="space-y-2">
                  {plantilla.campos.map((campo) => (
                    <div
                      key={campo}
                      className="flex items-center space-x-2 text-gray-600 text-sm"
                    >
                      <Checkbox disabled checked={false} />
                      <span>{campo}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Autor */}
              <div className="text-xs text-gray-500">
                Creado por:{" "}
                <span className="font-medium">
                  {plantilla.usuarios?.nombre ?? "-"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
