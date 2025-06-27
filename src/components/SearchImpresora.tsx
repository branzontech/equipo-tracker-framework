import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Search, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useGlobal } from "@/hooks/use-global";
import { icons } from "./interfaces/icons";
import { Impresora } from "@/pages/toners/interfaces/impresora";
import { useState } from "react";
import { Textarea } from "./ui/textarea";

interface SearchImpresoraProps {
  onSeleccion?: (impresora: {
    id_impresora: number;
    nombre: string;
    modelo: string;
    motivo: string;
  }) => void;
  onMotivoChange?: (id_impresora: number, motivo: string) => void;
  esBaja?: boolean;
}

export const SearchImpresora = ({
  onSeleccion,
  esBaja = false,
  onMotivoChange,
}: SearchImpresoraProps) => {
  const { impresoras, setImpresoras, buscarImpresora } = useGlobal();
  const [motivos, setMotivos] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      {impresoras.map((item, index) => (
        <div key={index} className="p-4 border rounded-lg bg-white">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-medium text-[#01242c]">
              Impresora {index + 1}
            </h3>
            {impresoras.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const nuevos = impresoras.filter((_, i) => i !== index);
                  setImpresoras(nuevos);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            )}
          </div>

          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-12 md:col-span-3">
              <Label>N° Serial impresora</Label>
              <div className="relative">
                <Input
                  placeholder="Ingrese N° serial"
                  onChange={(e) => {
                    const nuevos = [...impresoras];
                    nuevos[index] = {
                      ...nuevos[index],
                      serial: e.target.value,
                    };
                    setImpresoras(nuevos);
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

                    const data = await buscarImpresora(item.serial);

                    if (data) {
                      const actualizado = {
                        ...data,
                        serial: item.serial,
                      };

                      const nuevos = [...impresoras];
                      nuevos[index] = actualizado;
                      setImpresoras(nuevos);

                      if (onSeleccion) {
                        onSeleccion({
                          id_impresora: data.id_impresora,
                          nombre: data.nombre || "",
                          modelo: data.modelo || "",
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

            {item.id_impresora !== 0 && (
              <>
                {console.log(item)}

                <div className="col-span-12 md:col-span-3">
                  <Label>Serial</Label>
                  <Input value={item.serial || "-"} readOnly />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <Label>Nombre</Label>
                  <Input value={item.nombre || "-"} readOnly />
                </div>
                <div className="col-span-12 md:col-span-3">
                  <Label>Modelo</Label>
                  <Input value={item.modelo || "-"} readOnly />
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
                          onMotivoChange(item.id_impresora, e.target.value);
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
        className="mt-2"
        onClick={() => {
          const nuevoImpresora: Impresora = {
            marca_id: 0,
            id_impresora: 0,
            nombre: "",
            modelo: "",
            sucursal_id: 0,
            sucursales: null,
            serial: "",
            estado: null,
            marcas: null,
            tipo: "",
            motivo: "",
          };
          setImpresoras([...impresoras, nuevoImpresora]);
          setMotivos([...motivos, ""]);
        }}
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar impresora
      </Button>
    </div>
  );
};
