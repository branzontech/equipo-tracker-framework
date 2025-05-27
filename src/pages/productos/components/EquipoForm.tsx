
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface EquipoFormProps {
  onAddEquipo: (equipo: {
    serial: string;
    activoFijo: string;
    motivo: string;
    descripcionEstado: string;
  }) => void;
  handleBulkImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  exportTemplate: () => void;
}

export function EquipoForm({
  onAddEquipo,
  handleBulkImport,
  exportTemplate,
}: EquipoFormProps) {
  const { toast } = useToast();
  const [tempEquipo, setTempEquipo] = useState({
    serial: "",
    activoFijo: "",
    motivo: "",
    descripcionEstado: "",
  });

  const handleAddEquipo = () => {
    if (!tempEquipo.serial || !tempEquipo.activoFijo || !tempEquipo.motivo || !tempEquipo.descripcionEstado) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor complete todos los campos del equipo.",
      });
      return;
    }

    onAddEquipo(tempEquipo);
    
    // Reset form
    setTempEquipo({
      serial: "",
      activoFijo: "",
      motivo: "",
      descripcionEstado: "",
    });
  };

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <FormLabel>Serial del Equipo</FormLabel>
          <Input 
            placeholder="Ingrese el serial"
            value={tempEquipo.serial}
            onChange={(e) => setTempEquipo({...tempEquipo, serial: e.target.value})}
          />
        </div>
        <div className="grid gap-2">
          <FormLabel>Número de Activo Fijo</FormLabel>
          <Input 
            placeholder="Ingrese el número de activo fijo"
            value={tempEquipo.activoFijo}
            onChange={(e) => setTempEquipo({...tempEquipo, activoFijo: e.target.value})}
          />
        </div>
        <div className="grid gap-2">
          <FormLabel>Motivo de la Baja</FormLabel>
          <Input 
            placeholder="Ingrese el motivo de la baja"
            value={tempEquipo.motivo}
            onChange={(e) => setTempEquipo({...tempEquipo, motivo: e.target.value})}
          />
        </div>
        <div className="grid gap-2">
          <FormLabel>Descripción del Estado</FormLabel>
          <Textarea 
            placeholder="Describa el estado actual del equipo"
            className="resize-none"
            value={tempEquipo.descripcionEstado}
            onChange={(e) => setTempEquipo({...tempEquipo, descripcionEstado: e.target.value})}
          />
        </div>
        <div className="flex justify-end">
          <Button 
            className="bg-[#bff036] hover:bg-[#bff036]/90 text-[#01242c] mt-2"
            onClick={handleAddEquipo}
            type="button"
          >
            Agregar
          </Button>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center space-x-2">
          <FormLabel>Importar Varios</FormLabel>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            className="relative"
            onClick={exportTemplate}
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".csv,.xlsx"
              onChange={handleBulkImport}
            />
            <span>Importar CSV</span>
          </Button>
        </div>
      </div>
    </>
  );
}
