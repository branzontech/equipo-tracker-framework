import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  FileX,
  Plus,
  Upload,
  Download,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import SignatureCanvas from "@/components/SignatureCanvas";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EquipoForm } from "./EquipoForm";
import { EquiposTable } from "./EquiposTable";
import { useUser } from "@/pages/usuarios/hooks/use-user";
import ResponsibleSearch from "@/components/ResponsibleSearch";
import { Label } from "@/components/ui/label";
import { useBaja } from "../hooks/use-baja";
import { es } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchEquipo } from "@/components/SearchEquipo";

export function BajaEquiposForm() {
  // const agregarEquipo = (nuevoEquipo: EquipoType) => {
  //   const equipoId = { id: Date.now().toString() };
  //   setEquipos([...equipos, equipoId]);

  //   const currentEquipos = form.getValues().equipos || [];
  //   form.setValue("equipos", [...currentEquipos, nuevoEquipo]);

  //   toast({
  //     title: "Equipo agregado",
  //     description: `Se ha agregado el equipo con serial ${nuevoEquipo.serial}`,
  //   });
  // };

  // const eliminarEquipo = (index: number) => {
  //   if (equipos.length === 1) {
  //     toast({
  //       variant: "destructive",
  //       title: "Error",
  //       description: "Debe tener al menos un equipo en la baja.",
  //     });
  //     return;
  //   }

  //   const nuevosEquipos = [...equipos];
  //   nuevosEquipos.splice(index, 1);
  //   setEquipos(nuevosEquipos);

  //   const currentEquipos = form.getValues().equipos || [];
  //   const updatedEquipos = [...currentEquipos];
  //   updatedEquipos.splice(index, 1);
  //   form.setValue("equipos", updatedEquipos);

  //   toast({
  //     title: "Equipo eliminado",
  //     description: "Se ha eliminado el equipo de la lista.",
  //   });
  // };

  // Function to reset the form and start a new equipment withdrawal
  // const nuevaBajaEquipo = () => {
  //   form.reset({
  //     observaciones: "",
  //     equipos: [
  //       { serial: "", activoFijo: "", motivo: "", descripcionEstado: "" },
  //     ],
  //   });
  //   setEquipos([{ id: Date.now().toString() }]);

  //   toast({
  //     title: "Nueva baja de equipos",
  //     description: "Se ha iniciado un nuevo formulario de baja de equipos.",
  //   });
  // };

  // Function to handle bulk import from CSV or Excel
  // const handleBulkImport = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   // This would be implemented with a CSV/Excel parsing library
  //   // For demo purposes, we'll just simulate adding multiple items
  //   const mockData: EquipoType[] = [
  //     {
  //       serial: "SER1001",
  //       activoFijo: "AF2001",
  //       motivo: "Obsolescencia",
  //       descripcionEstado:
  //         "Equipo con 5 años de uso, lento para tareas actuales",
  //     },
  //     {
  //       serial: "SER1002",
  //       activoFijo: "AF2002",
  //       motivo: "Daño irreparable",
  //       descripcionEstado:
  //         "Placa madre dañada, costo de reparación superior al 70% del valor",
  //     },
  //     {
  //       serial: "SER1003",
  //       activoFijo: "AF2003",
  //       motivo: "Actualización tecnológica",
  //       descripcionEstado:
  //         "Se reemplaza por equipos nuevos según política de renovación",
  //     },
  //   ];

  //   const currentEquipos = form.getValues().equipos || [];
  //   const newEquipos = [...currentEquipos, ...mockData];

  //   form.setValue("equipos", newEquipos);

  //   // Update equipos state
  //   const newEquiposState = [
  //     ...equipos,
  //     ...mockData.map(() => ({ id: Date.now().toString() + Math.random() })),
  //   ];
  //   setEquipos(newEquiposState);

  //   toast({
  //     title: "Importación completada",
  //     description: `Se han agregado ${mockData.length} equipos a la lista.`,
  //   });
  // };

  // Function to export template
  // const exportTemplate = () => {
  //   // In a real application, this would generate and download a CSV/Excel template
  //   toast({
  //     title: "Plantilla descargada",
  //     description: "La plantilla para importación ha sido descargada.",
  //   });
  // };

  const {
    newUser,
    users,
    selectedEntregaUser,
    setSelectedEntregaUser,
    selectedRecibeUser,
    setSelectedRecibeUser,
  } = useUser();

  const { newBaja, setNewBaja, addBaja } = useBaja();
  const methods = useForm();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0B2559]">Baja de Equipos</h1>
        {/* <Button
          onClick={nuevaBajaEquipo}
          className="bg-[#bff036] hover:bg-[#bff036]/90 text-[#01242c]"
          variant="secondary"
        >
          <FileX className="mr-2 h-4 w-4" />
          Nueva Baja
        </Button> */}
      </div>

      <FormProvider {...methods}>
        <form
          className="space-y-8"
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            const firmaFinalEntrega =
              newUser.firma_entrega || selectedEntregaUser?.firma || "";
            const firmaFinalRecibe =
              newUser.firma_recibe || selectedRecibeUser?.firma || "";

            addBaja(newBaja, firmaFinalEntrega, firmaFinalRecibe);
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="fechaTraslado">Fecha de Traslado</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newBaja.fecha_baja ? (
                        format(newBaja.fecha_baja, "PPP", {
                          locale: es,
                        })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        typeof newBaja.fecha_baja === "string"
                          ? new Date(newBaja.fecha_baja)
                          : newBaja.fecha_baja
                      }
                      onSelect={(date) =>
                        setNewBaja({
                          ...newBaja,
                          fecha_baja: date as Date,
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={newBaja.estado || ""}
                  onValueChange={(value) =>
                    setNewBaja({ ...newBaja, estado: value })
                  }
                >
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Seleccione un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="En proceso">En proceso</SelectItem>
                    <SelectItem value="Finalizado">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#0B2559] mb-5">
                Equipos para dar de baja
              </h2>
              {/* <Button
                    type="button"
                    variant="outline"
                    className="flex items-center"
                    onClick={exportTemplate}
                  >
                    <Download className="mr-1 h-4 w-4" /> Plantilla
                  </Button> */}

              <SearchEquipo
                esBaja
                onEquipoEncontrado={(equipo) => {
                  setNewBaja((prev) => {
                    const yaExiste = prev.equipos.some(
                      (e) => e.id_equipo === equipo.id_equipo
                    );
                    if (yaExiste) return prev;

                    return {
                      ...prev,
                      equipos: [
                        ...prev.equipos,
                        {
                          id_equipo: equipo.id_equipo,
                          motivo: "", 
                        },
                      ],
                    };
                  });
                }}
                onMotivoChange={(id_equipo, nuevoMotivo) => {
                  setNewBaja((prev) => ({
                    ...prev,
                    equipos: prev.equipos.map((e) =>
                      e.id_equipo === id_equipo
                        ? { ...e, motivo: nuevoMotivo }
                        : e
                    ),
                  }));
                }}
              />

              {/* <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        className="flex items-center bg-[#bff036] hover:bg-[#bff036]/90 text-[#01242c]"
                      >
                        <Plus className="mr-1 h-4 w-4" /> Agregar equipo
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-md">
                      <SheetHeader>
                        <SheetTitle>Agregar Equipo</SheetTitle>
                        <SheetDescription>
                          Complete los datos del equipo que desea dar de baja.
                        </SheetDescription>
                      </SheetHeader>
                      <EquipoForm
                        onAddEquipo={agregarEquipo}
                        handleBulkImport={handleBulkImport}
                        exportTemplate={exportTemplate}
                      />
                    </SheetContent>
                  </Sheet> */}

              {/* Table to display equipos */}
              {/* <EquiposTable
                equipos={form.getValues().equipos}
                onDeleteEquipo={eliminarEquipo}
              /> */}
            </div>

            <div className="mb-6">
              <div className="space-y-2 mb-8">
                <Label htmlFor="observaciones">Observaciones Adicionales</Label>
                <Textarea
                  placeholder="Ingrese observaciones adicionales (opcional)"
                  className="resize-none"
                  value={newBaja.observaciones_adicionales}
                  onChange={(e) => {
                    setNewBaja({
                      ...newBaja,
                      observaciones_adicionales: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResponsibleSearch
                  name="responsableEntrega"
                  label="Responsable de Autorización"
                  onSelect={(person) => {
                    const user = users.find(
                      (u) => u.id_usuario === Number(person.id)
                    );
                    if (user) {
                      setSelectedEntregaUser({
                        ...user,
                        firma: user.firma || "",
                      });
                    } else {
                      setSelectedEntregaUser(null);
                    }
                    setNewBaja((prev) => ({
                      ...prev,
                      responsable_autorizacion_id: Number(person.id),
                    }));
                  }}
                />

                <ResponsibleSearch
                  name="responsableRecibe"
                  label="Responsable de Solicitud"
                  onSelect={(person) => {
                    const user = users.find(
                      (u) => u.id_usuario === Number(person.id)
                    );
                    if (user) {
                      setSelectedRecibeUser({
                        ...user,
                        firma: user.firma || "",
                      });
                    } else {
                      setSelectedRecibeUser(null);
                    }
                    setNewBaja((prev) => ({
                      ...prev,
                      responsable_solicitud_id: Number(person.id),
                    }));
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <div className="space-y-2">
                  <Label htmlFor="firmaEntrega">Firma de quien entrega</Label>
                  <SignatureCanvas
                    value={selectedEntregaUser?.firma || ""}
                    onChange={(value: string) => {
                      newUser.firma_entrega = value;
                      if (selectedEntregaUser) {
                        setSelectedEntregaUser({
                          ...selectedEntregaUser,
                          firma: value,
                        });
                      }
                    }}
                    readOnly={!!selectedEntregaUser?.firma}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firmaRecibe">Firma de quien recibe</Label>
                  <SignatureCanvas
                    value={selectedRecibeUser?.firma || ""}
                    onChange={(value: string) => {
                      newUser.firma_recibe = value;
                      if (selectedRecibeUser) {
                        setSelectedRecibeUser({
                          ...selectedRecibeUser,
                          firma: value,
                        });
                      }
                    }}
                    readOnly={!!selectedRecibeUser?.firma}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                // onClick={() => {
                //   form.reset();
                //   setEquipos([{ id: Date.now().toString() }]);
                // }}
                className="bg-white hover:bg-gray-100 w-full"
              >
                Cancelar
              </Button>
              <Button type="submit" className=" w-full">
                Registrar Baja
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
