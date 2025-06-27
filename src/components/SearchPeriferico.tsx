import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Search, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useGlobal } from "@/hooks/use-global";
import { Perifericos } from "@/pages/configuracion/maestros/interfaces/periferico";
import { icons } from "./interfaces/icons";
import { Textarea } from "./ui/textarea";
import { useState } from "react";

interface SearchPerifericoProps {
  onSeleccion?: (periferico: {
    id_periferico: number;
    nombre: string;
    motivo: string;
  }) => void;
  onMotivoChange?: (id_periferico: number, motivo: string) => void;
  esBaja?: boolean;
}

export const SearchPeriferico = ({
  onSeleccion,
  esBaja = false,
  onMotivoChange,
}: SearchPerifericoProps) => {
  const { buscarPeriferico, perifericos, setPerifericos } = useGlobal();
  const [motivos, setMotivos] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      {perifericos.map((item, index) => (
        <div key={index} className="p-4 border rounded-lg bg-white">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-medium text-[#01242c]">
              Periférico {index + 1}
            </h3>
            {perifericos.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const nuevos = perifericos.filter((_, i) => i !== index);
                  setPerifericos(nuevos);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            )}
          </div>

          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-12 md:col-span-3">
              <Label>N° Serial periférico</Label>
              <div className="relative">
                <Input
                  placeholder="Ingrese N° serial"
                  onChange={(e) => {
                    item.serial = e.target.value;
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={async (e: React.FormEvent) => {
                    e.preventDefault();
                    if (!item.serial?.trim()) {
                      toast.error("Debe ingresar un número de serie", {
                        icon: icons.error,
                      });
                      return;
                    }

                    const data = await buscarPeriferico(item.serial);

                    if (data) {
                      const actualizado = {
                        ...data,
                        serial: item.serial,
                      };

                      const nuevos = [...perifericos];
                      nuevos[index] = actualizado;
                      setPerifericos(nuevos);

                      if (onSeleccion) {
                        onSeleccion({
                          id_periferico: data.id_periferico,
                          nombre: data.nombre || "",
                          motivo: motivos[index] || "",
                        });
                      }
                    }
                  }}
                  className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:text-gray-700"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {item.nombre && (
              <>
                <div className="col-span-12 md:col-span-3">
                  <Label>N° Serie</Label>
                  <Input value={item.serial || ""} readOnly />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <Label>Nombre</Label>
                  <Input value={item.nombre || ""} readOnly />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <Label>Tipo</Label>
                  <Input value={item.tipo || ""} readOnly />
                </div>

                {esBaja && (
                  <div className="col-span-12 mt-4">
                    <Label>Motivo de la baja</Label>
                    <Textarea
                      placeholder="Escribe el motivo"
                      value={motivos[index] || ""}
                      onChange={(e) => {
                        const nuevos = [...motivos];
                        nuevos[index] = e.target.value;
                        setMotivos(nuevos);

                        if (onMotivoChange) {
                          onMotivoChange(item.id_periferico, e.target.value);
                        }
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          const nuevoPeriferico: Perifericos = {
            id_periferico: 0,
            nombre: "",
            estado: "",
            serial: "",
            tipo: "",
            equipo_asociado_id: 0,
            equipos: null,
            id_sede: 0,
            sedes: null,
            marca_id: 0,
            motivo: "",
            marcas: null,
          };
          setPerifericos([...perifericos, nuevoPeriferico]);
          setMotivos([...motivos, ""]);
        }}
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar periférico
      </Button>
    </div>
  );
};
