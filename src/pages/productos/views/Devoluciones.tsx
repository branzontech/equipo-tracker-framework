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
import { useMemo, useState } from "react";
import { Combobox } from "@headlessui/react";

const Devoluciones = () => {
  const {
    equiposEnMovimiento,
    newDevo,
    setNewDevo,
    handleSubmit,
    equiposTrasladoEnMovimiento,
  } = useDevolucion();
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

  const todosLosEquipos = useMemo(
    () => [...equiposEnMovimiento, ...equiposTrasladoEnMovimiento],
    [equiposEnMovimiento, equiposTrasladoEnMovimiento]
  );

  const filteredEquipos =
    query === ""
      ? todosLosEquipos
      : todosLosEquipos.filter((eq) =>
          eq.serial?.toLowerCase().includes(query.toLowerCase())
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
                      const selected = todosLosEquipos.find(
                        (eq) => eq.id === value
                      );

                      let prestamoId = 0;
                      let trasladoId = 0;

                      if (selected?.origin === "PRESTAMO") {
                        if (selected?.tipo === "EQUIPO") {
                          prestamoId =
                            selected.equipo?.prestamo_equipos?.[0]?.prestamos
                              ?.id_prestamo || 0;
                        } else if (selected?.tipo === "PERIFERICO") {
                          prestamoId =
                            selected.periferico?.prestamos?.id_prestamo;
                        } else if (selected?.tipo === "IMPRESORA") {
                          prestamoId =
                            selected.impresora?.prestamos?.id_prestamo;
                        }
                      } else if (selected?.origin === "TRASLADO") {
                        if (selected.tipo === "EQUIPO") {
                          trasladoId =
                            selected.equipo?.traslados_equipos?.[0]?.traslados
                              ?.id_traslado || 0;
                        } else if (selected.tipo === "PERIFERICO") {
                          trasladoId =
                            selected.periferico?.traslados?.id_traslado || 0;
                        } else if (selected.tipo === "IMPRESORA") {
                          trasladoId =
                            selected.impresora?.traslados?.id_traslado || 0;
                        }
                      }
                      setNewDevo({
                        ...newDevo,
                        equipo_id: value,
                        tipo: selected?.tipo,
                        prestamo_id: prestamoId,
                        traslado_id: trasladoId,
                      });
                    }}
                  >
                    <div className="relative">
                      <Combobox.Input
                        className="w-full text-[14px] border border-input rounded-md px-3 py-2"
                        onChange={(event) => setQuery(event.target.value)}
                        displayValue={(id) => {
                          const item = todosLosEquipos.find((e) => e.id === id);
                          return item?.nombre ?? "";
                        }}
                        placeholder="Buscar equipo..."
                        autoComplete="off"
                      />
                      <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white border border-gray-300 shadow-lg">
                        {filteredEquipos.length === 0 ? (
                          <div className="px-4 py-2 text-sm text-muted-foreground">
                            No hay equipos disponibles
                          </div>
                        ) : (
                          filteredEquipos.map((item) => (
                            <Combobox.Option
                              key={item.id}
                              value={item.id}
                              className={({ active }) =>
                                `cursor-pointer select-none px-4 py-2 ${
                                  active ? "bg-blue-100" : ""
                                }`
                              }
                            >
                              {item.nombre}
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
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);

                          return date < today || date < new Date("1900-01-01");
                        }}
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
                      <SelectItem value="Fin de traslado">Fin del Traslado</SelectItem>
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
              <div className="flex justify-end space-x-4 mt-4">
                <Button
                  type="submit"
                  className="bg-[#040d50] hover:bg-[#0a1668] w-full"
                >
                  Registrar Devolución
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default Devoluciones;
