import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardList, Pencil, Power, PowerOff, Star } from "lucide-react";
import { useChecklist } from "../../checklist/hooks/use-checklist";
import { UpdateCheckList } from "../../checklist/views/UpdateCheckList";
import { Button } from "@/components/ui/button";

export const PlantillasCheckList = () => {
  const {
    checklist,
    showEditModal,
    handleOpenEditModal,
    selectedChecklistId,
    setShowEditModal,
    enable,
    disable,
  } = useChecklist();

  return (
    <>
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
              className="hover:shadow-md transition h-full"
            >
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div className="space-y-4">
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

                  {/* Estado */}
                  <div className="text-sm text-gray-600">
                    Estado:{" "}
                    <span className="font-semibold">{plantilla.estado}</span>
                  </div>

                  {/* Autor */}
                  <div className="text-xs text-gray-500">
                    Creado por:{" "}
                    <span className="font-medium">
                      {plantilla.usuarios?.nombre ?? "-"}
                    </span>
                  </div>
                </div>

                {/* Acciones abajo */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="ghost"
                    className="hover:bg-gray-100 p-2 rounded-full"
                    onClick={() => handleOpenEditModal(plantilla.id_plantilla)}
                  >
                    <Pencil className="h-5 w-5 text-gray-500 hover:text-blue-600 transition-colors" />
                  </Button>

                  <Button
                    variant="ghost"
                    className="hover:bg-gray-100 p-2 rounded-full"
                    onClick={() =>
                      plantilla.estado === "Habilitado"
                        ? disable(plantilla.id_plantilla)
                        : enable(plantilla.id_plantilla)
                    }
                  >
                    {plantilla.estado === "Habilitado" ? (
                      <Power className="h-5 w-5 text-green-500 hover:text-red-500 transition-colors" />
                    ) : (
                      <PowerOff className="h-5 w-5 text-red-500 hover:text-green-500 transition-colors" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <UpdateCheckList
        open={showEditModal}
        onOpenChange={setShowEditModal}
        id={selectedChecklistId}
      />
    </>
  );
};
