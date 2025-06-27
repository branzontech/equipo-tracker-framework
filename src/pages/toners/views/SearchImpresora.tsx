import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const SearchImpresora = ({
  label = "Buscar",
  value,
  onInputChange,
  suggestions = [],
  onSelect,
  getKey = (item) => item.id_toner,
  getLabel = (item) => item.modelo,
  placeholder = "Ingrese un valor",
}) => {
  return (
    <div className="space-y-2 relative">
      <Label>{label}</Label>
      <Input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onInputChange(e.target.value)}
        autoComplete="off"
      />

      {Array.isArray(suggestions) && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-md shadow-md mt-1 max-h-60 overflow-y-auto text-sm">
          {suggestions.map((item) => (
            <li
              key={getKey(item)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelect(item)}
            >
              {getLabel(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
