import { Label } from "@/components/ui/label";
import { Checklist } from "../interface/checklist";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClipboardList } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

type ListaChequeoSimpleProps = {
  checklist: Checklist[];
  plantillaSeleccionada: Checklist | null;
  onChangePlantilla: (plantilla: Checklist | null) => void;
  itemsSeleccionados: string[];
  onToggleItem: (item: string, checked: boolean) => void;
};

export const ListaChequeoSimple = ({
  checklist,
  plantillaSeleccionada,
  onChangePlantilla,
  itemsSeleccionados,
  onToggleItem,
}: ListaChequeoSimpleProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="mb-1">Seleccionar Plantilla</Label>
        <Select
          value={plantillaSeleccionada?.id_plantilla.toString() ?? ""}
          onValueChange={(id) => {
            const plantilla = checklist.find(
              (p) => p.id_plantilla.toString() === id
            );
            onChangePlantilla(plantilla || null);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccione una plantilla" />
          </SelectTrigger>
          <SelectContent>
            {checklist.map((p) => (
              <SelectItem key={p.id_plantilla} value={p.id_plantilla.toString()}>
                {p.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {plantillaSeleccionada && plantillaSeleccionada.campos.length > 0 && (
        <div>
          <div className="mb-2">
            <div className="flex items-center mb-2">
              <ClipboardList className="h-4 w-4 mr-2 text-gray-500" />
              <Label className="text-base font-medium">Lista de Chequeo</Label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-50 p-4 rounded-lg border">
            {plantillaSeleccionada.campos.map((item) => (
              <div key={item} className="flex items-start space-x-2">
                <Checkbox
                  id={item}
                  className="mt-0.5"
                  checked={itemsSeleccionados.includes(item)}
                  onCheckedChange={(checked) => onToggleItem(item, !!checked)}
                />
                <Label
                  htmlFor={item}
                  className="text-xs sm:text-sm font-medium leading-tight"
                >
                  {item}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};