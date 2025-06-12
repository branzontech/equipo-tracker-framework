import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, Search, Trash2 } from "lucide-react";
import { AccesoriosContainer } from "./AccesorioItem";
import { useGlobal } from "@/hooks/use-global";
import { Equipo } from "@/pages/productos/interfaces/equipo";

interface SearchEquipoProps {
  onEquipoEncontrado?: (equipo: Equipo) => void;
}

export const SearchEquipo = ({ onEquipoEncontrado }: SearchEquipoProps) => {
  const { haBuscado, accesorios, equipo, setEquipo, buscarEquipo } =
    useGlobal();

  return (
    <div className="space-y-6">
      {equipo.map((field, index) => (
        <div key={field.id_equipo} className="p-4 border rounded-lg bg-white">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-medium text-[#01242c]">Equipo {index + 1}</h3>
            {equipo.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  const nuevosEquipos = equipo.filter((_, i) => i !== index);
                  setEquipo(nuevosEquipos);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            )}
          </div>

          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-12 md:col-span-3">
              <Label>Serial</Label>
              <div className="relative">
                <Input
                  placeholder="Ingrese el serial del equipo"
                  onChange={(e) => {
                    field.nro_serie = e.target.value;
                  }}
                  className="pr-10 rounded-l-none"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={async (e: React.FormEvent) => {
                    e.preventDefault();
                    if (!field.nro_serie.trim()) {
                      toast.error("Debe ingresar un número de serie");
                      return;
                    }

                    const data = await buscarEquipo(field.nro_serie);
                    if (data && onEquipoEncontrado) {
                      onEquipoEncontrado(data); // ✅ Aquí notificas al padre
                    }
                  }}
                  className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:text-gray-700"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {haBuscado && (
              <>
                <div className="col-span-12 md:col-span-3">
                  <Label>Marca</Label>
                  <Input
                    value={
                      typeof field.marcas === "string"
                        ? field.marcas
                        : field.marcas?.nombre || ""
                    }
                    readOnly
                  />
                </div>

                <div className="col-span-12 md:col-span-3">
                  <Label>Tipo de Activo Fijo</Label>
                  <Input value={field.tipo_activo || ""} readOnly />
                </div>

                <div className="col-span-12 md:col-span-3">
                  <Label>Nombre</Label>
                  <Input value={field.nombre_equipo || ""} readOnly />
                </div>
              </>
            )}
          </div>

          <AccesoriosContainer
            equipoIndex={index}
            accesorios={Array.isArray(accesorios) ? accesorios : [accesorios]}
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => {
          const nuevoEquipo: Equipo = {
            id_equipo: Date.now(),
            nombre_equipo: "",
            nro_serie: "",
            modelo: "",
            marca_id: 0,
            marcas: null,
            categoria_id: 0,
            categorias: null,
            tipo_activo: "",
            fecha_registro: "",
            sucursal_id: 0,
            sucursales: null,
            garantia_fecha_fin: "",
            estado_actual: "",
            perifericos: null,
          };
          setEquipo([...equipo, nuevoEquipo]);
        }}
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar equipo
      </Button>
    </div>
  );
};
