import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Search, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useGlobal } from "@/hooks/use-global";
import { Perifericos } from "@/pages/configuracion/maestros/interfaces/periferico";
import { icons } from "./interfaces/icons";

interface SearchPerifericoProps {
  onSeleccion?: (id_periferico: number) => void;
}

export const SearchPeriferico = ({ onSeleccion }: SearchPerifericoProps) => {
  const { buscarPeriferico, perifericos, setPerifericos } = useGlobal();

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

                    console.log(item.serial);
                    if (!item.serial?.trim()) {
                      toast.error("Debe ingresar un número de serie", {
                        icon: icons.error,
                      });
                      return;
                    }

                    const data = await buscarPeriferico(item.serial);
                    console.log(data);

                    if (data) {
                      const actualizados = [...perifericos];
                      actualizados[index] = {
                        ...data,
                        id_periferico: data.id_periferico,
                      };
                      setPerifericos(actualizados);

                      if (onSeleccion) {
                        onSeleccion(data.id_periferico);
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
            marcas: null,
          };
          setPerifericos([...perifericos, nuevoPeriferico]);
        }}
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar periférico
      </Button>
    </div>
  );
};
