import { ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMantenimiento } from "./hooks/use-mantenimiento";
import { CheckListForm } from "../configuracion/checklist/views/CheckListForm";

export const ListaChequeo = () => {
  const { isChecklistDialogOpen, setIsChecklistDialogOpen } =
    useMantenimiento();

  return (
    <Dialog
      open={isChecklistDialogOpen}
      onOpenChange={setIsChecklistDialogOpen}
    >
      <DialogTrigger asChild>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-[#bff036] text-[#01242c]">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-[#01242c]">
              <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-[#01242c]" />
              <span>Lista de Chequeo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs sm:text-sm text-[#01242c] opacity-90">
              Realizar chequeos de mantenimiento con listas personalizables.
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] flex flex-col p-4 sm:p-6 bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Lista de Chequeo de Mantenimiento
          </DialogTitle>
          <DialogDescription>
            Seleccione un equipo y complete la lista de chequeo
          </DialogDescription>
        </DialogHeader>

        <CheckListForm />
      </DialogContent>
    </Dialog>
  );
};
