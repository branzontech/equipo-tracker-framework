import { useState, useEffect, useRef } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { ResponsiblePerson } from "@/components/interfaces/resposiblePerson";
import { Usuario } from "@/pages/configuracion/usuarios/interfaces/usuarios";
import { useUser } from "@/pages/usuarios/hooks/use-user";

interface ResponsibleSearchProps {
  name: string;
  label: string;
  users: Usuario[];
  value?: ResponsiblePerson;
  onSelect?: (person: ResponsiblePerson) => void;
  onClear?: () => void;
}

const ResponsibleSearch = ({
  name,
  label,
  users,
  value,
  onSelect,
  onClear,
}: ResponsibleSearchProps) => {
  const { control, setValue, watch, getValues } = useFormContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<ResponsiblePerson[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const responsibleId = watch(`${name}Id`);
  const responsibleName = watch(`${name}Name`);

  useEffect(() => {
    if (value) {
      // Solo actualizar si aún no se ha seleccionado manualmente un responsable
      if (!responsibleId) {
        setValue(`${name}Id`, value.id);
        setValue(`${name}Name`, value.name);
        setValue(`${name}Position`, value.position);
        setValue(`${name}Department`, value.department);
      }
    }
  }, [value, name, setValue, responsibleId]);

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const mappedUsers: ResponsiblePerson[] = users.map((u) => ({
    id: u.id_usuario.toString(),
    name: u.nombre,
    department: u.sedes?.nombre || "Sin sede",
    position: u.rol,
    firma_entrega: u.firma_entrega,
    firma_recibe: u.firma_recibe,
  }));

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setResults([]);
      return;
    }

    const filtered = mappedUsers.filter(
      (person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setResults(filtered);
    setShowResults(true);
  };

  // Select a responsible
  const selectResponsible = (person: ResponsiblePerson) => {
    setValue(`${name}Id`, person.id);
    setValue(`${name}Name`, person.name);
    setValue(`${name}Position`, person.position);
    setValue(`${name}Department`, person.department);
    setSearchTerm("");
    setShowResults(false);

    if (onSelect) {
      onSelect(person);
    }
  };

  // Clear selected responsible
  const clearResponsible = () => {
    setValue(`${name}Id`, "");
    setValue(`${name}Name`, "");
    setValue(`${name}Position`, "");
    setValue(`${name}Department`, "");

    if (onClear) {
      onClear();
    }
  };

  return (
    <div ref={wrapperRef} className="space-y-2">
      <FormField
        control={control}
        name={`${name}Id`}
        render={() => (
          <FormItem className="space-y-1">
            <FormLabel>{label}</FormLabel>
            <div className="relative">
              {responsibleId ? (
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div>
                    <p className="font-medium">{responsibleName}</p>
                    <p className="text-sm text-gray-500">
                      {watch(`${name}Position`)}, {watch(`${name}Department`)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={clearResponsible}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <FormControl>
                    <div className="flex">
                      <Input
                        placeholder="Buscar responsable..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-r-none"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        className="rounded-l-none"
                        onClick={handleSearch}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>

                  {showResults && results.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
                      <ul className="max-h-60 overflow-auto">
                        {results.map((person) => (
                          <li
                            key={person.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => selectResponsible(person)}
                          >
                            <p className="font-medium">{person.name}</p>
                            <p className="text-sm text-gray-500">
                              {person.position}, {person.department}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ResponsibleSearch;
