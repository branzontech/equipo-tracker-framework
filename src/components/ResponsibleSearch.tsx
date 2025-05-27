
import { useState, useEffect, useRef } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { ResponsiblePerson } from "@/components/interfaces/resposiblePerson";

// Mock data - in a real app, this would come from an API
const mockResponsibles: ResponsiblePerson[] = [
  { id: "1", name: "Juan Pérez", position: "Coordinador IT", department: "Tecnología" },
  { id: "2", name: "María Rodríguez", position: "Analista", department: "Contabilidad" },
  { id: "3", name: "Carlos Gómez", position: "Gerente", department: "Operaciones" },
  { id: "4", name: "Laura Martínez", position: "Supervisor", department: "Recursos Humanos" },
  { id: "5", name: "Diego López", position: "Técnico", department: "Soporte" },
];

interface ResponsibleSearchProps {
  name: string;
  label: string;
}

const ResponsibleSearch = ({ name, label }: ResponsibleSearchProps) => {
  const { control, setValue, watch } = useFormContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<ResponsiblePerson[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const responsibleId = watch(`${name}Id`);
  const responsibleName = watch(`${name}Name`);

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // Search for responsibles
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setResults([]);
      return;
    }

    const filtered = mockResponsibles.filter(person => 
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
  };

  // Clear selected responsible
  const clearResponsible = () => {
    setValue(`${name}Id`, "");
    setValue(`${name}Name`, "");
    setValue(`${name}Position`, "");
    setValue(`${name}Department`, "");
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
