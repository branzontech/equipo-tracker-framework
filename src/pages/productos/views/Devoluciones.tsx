import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Form } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useDevolucion } from "../hooks/use-devolucion";
import { Label } from "@/components/ui/label";
import ResponsibleSearch from "@/components/ResponsibleSearch";
import { useUser } from "@/pages/usuarios/hooks/use-user";
import SignatureCanvas from "@/components/SignatureCanvas";
import { useState } from "react";
import { Combobox } from "@headlessui/react";

const Devoluciones = () => {
  const { equiposEnMovimiento, newDevo, setNewDevo, handleSubmit } =
    useDevolucion();
  const {
    newUser,
    users,
    selectedEntregaUser,
    setSelectedEntregaUser,
    selectedRecibeUser,
    setSelectedRecibeUser,
  } = useUser();
  const form = useForm();
  const [query, setQuery] = useState("");

  const selectedEntregaId = selectedEntregaUser?.id_usuario;
  const selectedRecibeId = selectedRecibeUser?.id_usuario;

  const entregaUsuarios = users.filter(
    (u) => u.id_usuario !== selectedRecibeId
  );

  const recibeUsuarios = users.filter(
    (u) => u.id_usuario !== selectedEntregaId
  );

  const filteredEquipos =
    query === ""
      ? equiposEnMovimiento
      : equiposEnMovimiento.filter(
          (eq) => `${eq.nombre_equipo} ${eq.estado_actual} ${eq.nro_serie}`.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="container p-6  max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#040d50] mb-6">
        Devoluciones de Equipos
      </h1>
      <Form {...form}>
        <form
          className="space-y-6"
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            handleSubmit(newDevo);
          }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="equipoId">Equipo</Label>
                  <Combobox
                    value={newDevo.equipo_id}
                    onChange={(value) => {
                      const selectedEquipo = equiposEnMovimiento.find(
                        (eq) => eq.id_equipo === value
                      );
                      const prestamo =
                        selectedEquipo?.prestamo_equipos?.[0]?.prestamos;
                      const traslado =
                        selectedEquipo?.traslados_equipos?.[0]?.traslados;

                      setNewDevo({
                        ...newDevo,
                        equipo_id: value,
                        prestamo_id: prestamo?.id_prestamo || 0,
                        traslado_id: traslado?.id_traslado || 0,
                      });
                    }}
                  >
                    <div className="relative">
                      <Combobox.Input
                        className="w-full text-[14px] border border-input rounded-md px-3 py-2"
                        onChange={(event) => setQuery(event.target.value)}
                        displayValue={(id) => {
                          const eq = equiposEnMovimiento.find(
                            (e) => e.id_equipo === id
                          );
                          return eq
                            ? `${eq.nombre_equipo} - ${eq.estado_actual}`
                            : "";
                        }}
                        placeholder="Buscar equipo..."
                      />
                      <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white border border-gray-300 shadow-lg">
                        {filteredEquipos.length === 0 ? (
                          <div className="px-4 py-2 text-sm text-muted-foreground">
                            No hay equipos disponibles
                          </div>
                        ) : (
                          filteredEquipos.map((equipo) => (
                            <Combobox.Option
                              key={equipo.id_equipo}
                              value={equipo.id_equipo}
                              className={({ active }) =>
                                `cursor-pointer select-none px-4 py-2 ${
                                  active ? "bg-blue-100" : ""
                                }`
                              }
                            >
                              {equipo.nombre_equipo} - {equipo.estado_actual}
                            </Combobox.Option>
                          ))
                        )}
                      </Combobox.Options>
                    </div>
                  </Combobox>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaDevolucion">Fecha de Devolución</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newDevo.fecha_devolucion && "text-muted-foreground"
                        )}
                      >
                        {newDevo.fecha_devolucion
                          ? format(newDevo.fecha_devolucion, "PPP", {
                              locale: es,
                            })
                          : "Seleccionar fecha"}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newDevo.fecha_devolucion}
                        onSelect={(date) =>
                          setNewDevo({
                            ...newDevo,
                            fecha_devolucion: date || new Date(),
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivo">Motivo de Devolución</Label>
                  <Select
                    value={newDevo.motivo}
                    onValueChange={(value) =>
                      setNewDevo({ ...newDevo, motivo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fin de Préstamo">
                        Fin de Préstamo
                      </SelectItem>
                      <SelectItem value="Fin de traslado">Traslado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado del Equipo</Label>
                  <Select
                    value={newDevo.estado_equipo}
                    onValueChange={(value) =>
                      setNewDevo({ ...newDevo, estado_equipo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Óptimo">Óptimo</SelectItem>
                      <SelectItem value="Dañado">Dañado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea
                    placeholder="Observaciones adicionales sobre la devolución"
                    className="min-h-[100px]"
                    value={newDevo.observaciones}
                    onChange={(e) =>
                      setNewDevo({
                        ...newDevo,
                        observaciones: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <ResponsibleSearch
                    name="responsableEntrega"
                    label="Responsable de Entrega"
                    users={entregaUsuarios}
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
                      setNewDevo((prev) => ({
                        ...prev,
                        usuario_entrega_id: Number(person.id),
                      }));
                    }}
                    onClear={() => {
                      setSelectedEntregaUser(null);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <ResponsibleSearch
                    name="responsableRecibe"
                    label="Responsable de Recepción"
                    users={recibeUsuarios}
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
                      setNewDevo((prev) => ({
                        ...prev,
                        usuario_recibe_id: Number(person.id),
                      }));
                    }}
                    onClear={() => {
                      setSelectedRecibeUser(null);
                    }}
                  />
                </div>

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
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button">
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#040d50] hover:bg-[#0a1668]">
              Registrar Devolución
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Devoluciones;
