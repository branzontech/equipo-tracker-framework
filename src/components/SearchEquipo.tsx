import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, Search, Trash2 } from "lucide-react";
import { AccesoriosContainer } from "./AccesorioItem";
import { Equipo } from "@/pages/productos/interfaces/equipo";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { useGlobal } from "@/hooks/use-global";
import { icons } from "./interfaces/icons";

interface SearchEquipoProps {
  onEquipoEncontrado?: (equipo: Equipo) => void;
  onMotivoChange?: (id_equipo: number, motivo: string) => void;
  esBaja?: boolean;
}

export const SearchEquipo = ({
  onEquipoEncontrado,
  onMotivoChange,
  esBaja = false,
}: SearchEquipoProps) => {
  const { equipo, setEquipo, buscarEquipo, setHaBuscado } = useGlobal();
  const [motivos, setMotivos] = useState<string[]>([]);

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
                  const nuevosMotivos = motivos.filter((_, i) => i !== index);
                  setEquipo(nuevosEquipos);
                  setMotivos(nuevosMotivos);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            )}
          </div>

          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-12 md:col-span-3">
              <Label>N° Serial equipo</Label>
              <div className="relative">
                <Input
                  placeholder="Ingrese N° serial"
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
                      toast.error("Debe ingresar un número de serie", {
                        icon: icons.error,
                      });
                      return;
                    }

                    const data = await buscarEquipo(field.nro_serie);

                    if (data && onEquipoEncontrado) {
                      if (esBaja) {
                        const motivo = motivos[index] || "";
                        onEquipoEncontrado({
                          ...data,
                          id_equipo: data.id_equipo,
                          motivo,
                        });
                      } else {
                        onEquipoEncontrado(data);
                      }
                    }
                  }}
                  className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:text-gray-700"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {field.nombre_equipo && (
              <>
                <div className="col-span-12 md:col-span-3">
                  <Label>N° Serie</Label>
                  <Input value={field.nro_serie || ""} readOnly />
                </div>

                <div className="col-span-12 md:col-span-3">
                  <Label>Tipo de Activo</Label>
                  <Input value={field.tipo_activo || ""} readOnly />
                </div>

                <div className="col-span-12 md:col-span-3">
                  <Label>Nombre</Label>
                  <Input value={field.nombre_equipo || ""} readOnly />
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
                          onMotivoChange(field.id_equipo, e.target.value);
                        }
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {!esBaja && (
            <AccesoriosContainer
              equipoIndex={index}
              accesorios={
                Array.isArray(field.perifericos) ? field.perifericos : []
              }
            />
          )}
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => {
          const nuevoEquipo: Equipo = {
            sedes: null,
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
            perifericos: null,
            motivo: "",
            tags: null,
            observaciones: null,
            imagen: null,
          };
          setEquipo([...equipo, nuevoEquipo]);
          setMotivos([...motivos, ""]);
          setHaBuscado(false);
        }}
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar equipo
      </Button>
    </div>
  );
};
