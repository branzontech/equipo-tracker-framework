import { FormProvider, useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SignatureCanvas from "@/components/SignatureCanvas";
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
import { SearchPeriferico } from "@/components/SearchPeriferico";
import { SearchImpresora } from "@/components/SearchImpresora";

export function BajaEquiposForm() {
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

  const selectedEntregaId = selectedEntregaUser?.id_usuario;
  const selectedRecibeId = selectedRecibeUser?.id_usuario;

  const entregaUsuarios = users.filter(
    (u) => u.id_usuario !== selectedRecibeId
  );

  const recibeUsuarios = users.filter(
    (u) => u.id_usuario !== selectedEntregaId
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0B2559]">Baja de Equipos</h1>
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
                <Label htmlFor="fechaBaja">Fecha de Baja</Label>
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
                <Label htmlFor="tipoTraslado">Tipo de traslado</Label>
                <Select
                  value={newBaja.tipo || ""}
                  onValueChange={(value) =>
                    setNewBaja({
                      ...newBaja,
                      tipo: value,
                      equipos: [],
                      perifericos_directos: [],
                      impresoras: [],
                    })
                  }
                >
                  <SelectTrigger id="tipoPrestamo">
                    <SelectValue placeholder="Seleccione el tipo de traslado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EQUIPO">Equipo</SelectItem>
                    <SelectItem value="PERIFERICO">Periférico</SelectItem>
                    <SelectItem value="IMPRESORA">Impresora</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#0B2559] mb-5">
                Equipos para dar de baja
              </h2>

              {newBaja.tipo === "EQUIPO" && (
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
              )}

              {newBaja.tipo === "PERIFERICO" && (
                <SearchPeriferico
                  esBaja
                  onSeleccion={(periferico) =>
                    setNewBaja((prev) => {
                      const yaExiste = prev.perifericos_directos.some(
                        (p) => p.id_periferico === periferico.id_periferico
                      );

                      if (yaExiste) return prev;

                      return {
                        ...prev,
                        perifericos_directos: [
                          ...prev.perifericos_directos,
                          {
                            id_periferico: periferico.id_periferico,
                            motivo: "",
                            nombre: "",
                          },
                        ],
                      };
                    })
                  }
                  onMotivoChange={(id_periferico, nuevoMotivo) => {
                    setNewBaja((prev) => ({
                      ...prev,
                      perifericos_directos: prev.perifericos_directos.map((e) =>
                        e.id_periferico === id_periferico
                          ? { ...e, motivo: nuevoMotivo }
                          : e
                      ),
                    }));
                  }}
                />
              )}

              {newBaja.tipo === "IMPRESORA" && (
                <SearchImpresora
                  esBaja
                  onSeleccion={(impresora) =>
                    setNewBaja((prev) => {
                      const yaExiste = prev.impresoras.some(
                        (i) => i.id_impresora === impresora.id_impresora
                      );
                      if (yaExiste) return prev;
                      return {
                        ...prev,
                        impresoras: [
                          ...prev.impresoras,
                          {
                            id_impresora: impresora.id_impresora,
                            nombre: "",
                            motivo: "",
                          },
                        ],
                      };
                    })
                  }
                  onMotivoChange={(id_impresora, nuevoMotivo) => {
                    setNewBaja((prev) => ({
                      ...prev,
                      impresoras: prev.impresoras.map((e) =>
                        e.id_impresora === id_impresora
                          ? { ...e, motivo: nuevoMotivo }
                          : e
                      ),
                    }));
                  }}
                />
              )}
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
                    setNewBaja((prev) => ({
                      ...prev,
                      responsable_autorizacion_id: Number(person.id),
                    }));
                  }}
                  onClear={() => {
                    setSelectedEntregaUser(null);
                    setNewBaja((prev) => ({
                      ...prev,
                      responsable_autorizacion_id: null,
                    }));
                  }}
                />

                <ResponsibleSearch
                  name="responsableRecibe"
                  label="Responsable de Solicitud"
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
                    setNewBaja((prev) => ({
                      ...prev,
                      responsable_solicitud_id: Number(person.id),
                    }));
                  }}
                  onClear={() => {
                    setSelectedRecibeUser(null);
                    setNewBaja((prev) => ({
                      ...prev,
                      responsable_solicitud_id: null,
                    }));
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <div className="space-y-2">
                  <Label htmlFor="firmaEntrega">Firma de quien autoriza</Label>
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
                  <Label htmlFor="firmaRecibe">Firma de quien solicita</Label>
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
