import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const SearchUser = ({
  label = "Usuario",
  nombreInput,
  onInputChange,
  sugerencias,
  onUserSelect,
}) => {
  return (
    <div className="space-y-2 relative">
      <Label>{label}</Label>
      <Input
        type="text"
        value={nombreInput}
        placeholder="Ingrese el nombre del usuario"
        onChange={(e) => onInputChange(e.target.value)}
        autoComplete="off"
      />

      {Array.isArray(sugerencias) && sugerencias.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-md shadow-md mt-1 max-h-60 overflow-y-auto text-sm">
          {sugerencias.map((usuario) => (
            <li
              key={usuario.id_usuario}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => onUserSelect(usuario)}
            >
              {usuario.nombre}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
