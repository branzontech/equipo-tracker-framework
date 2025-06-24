import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Search, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useGlobal } from "@/hooks/use-global";
import { icons } from "./interfaces/icons";
import { Impresora } from "@/pages/toners/interfaces/impresora";

interface SearchImpresoraProps {
  onSeleccion?: (id_impresora: number) => void;
}

export const SearchImpresora = ({ onSeleccion }: SearchImpresoraProps) => {
  const { impresoras, setImpresoras, buscarImpresora } = useGlobal();

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

                    const data = await buscarImpresora(item.serial);
                    console.log(data);

                    if (data) {
                      const actualizados = [...impresoras];
                      actualizados[index] = {
                        ...data,
                        id_impresora: data.id_impresora,
                      };
                      setImpresoras(actualizados);

                      if (onSeleccion) {
                        onSeleccion(data.id_impresora);
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
            id_impresora: 0,
            nombre: "",
            modelo: "",
            sucursal_id: 0,
            sucursales: null,
            serial: "",
            estado: null,
          };
          setImpresoras([...impresoras, nuevoImpresora]);
        }}
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar impresora
      </Button>
    </div>
  );
};
