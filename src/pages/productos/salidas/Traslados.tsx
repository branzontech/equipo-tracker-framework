import { useForm, FormProvider } from "react-hook-form";
import { format, set } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SignatureCanvas from "@/components/SignatureCanvas";
import ResponsibleSearch from "@/components/ResponsibleSearch";
import { Label } from "@/components/ui/label";
import { useTraslados } from "../hooks/use-traslados";
import { es } from "date-fns/locale";
import { SearchEquipo } from "@/components/SearchEquipo";
import { useUser } from "@/pages/usuarios/hooks/use-user";
import { SearchPeriferico } from "@/components/SearchPeriferico";
import { SearchImpresora } from "@/components/SearchImpresora";
import { useSedes } from "@/pages/configuracion/maestros/hooks/use-sedes";

const Traslados = () => {
  const {
    newTraslado,
    setNewTraslado,
    sucursalesFiltradas,
    setSedesSelect,
    registerTraslado,
  } = useTraslados();
  const {
    newUser,
    users,
    selectedEntregaUser,
    setSelectedEntregaUser,
    selectedRecibeUser,
    setSelectedRecibeUser,
  } = useUser();
  const { sedes } = useSedes();
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
      <h1 className="text-2xl font-bold text-[#01242c] mb-6">
        Traslado de Equipos
      </h1>

      <FormProvider {...methods}>
        <form
          className="space-y-8 p-6 rounded-lg shadow-md border border-gray-200"
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            const firmaFinalEntrega =
              newUser.firma_entrega || selectedEntregaUser?.firma || "";
            const firmaFinalRecibe =
              newUser.firma_recibe || selectedRecibeUser?.firma || "";

            registerTraslado(newTraslado, firmaFinalEntrega, firmaFinalRecibe);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fechaTraslado">Fecha de Traslado</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newTraslado.fecha_traslado ? (
                      format(newTraslado.fecha_traslado, "PPP", {
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
                      typeof newTraslado.fecha_traslado === "string"
                        ? new Date(newTraslado.fecha_traslado)
                        : newTraslado.fecha_traslado
                    }
                    onSelect={(date) =>
                      setNewTraslado({
                        ...newTraslado,
                        fecha_traslado: date as Date,
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
              <Label htmlFor="regionalDestino">Sede Destino</Label>
              <Select onValueChange={(value) => setSedesSelect(Number(value))}>
                <SelectTrigger id="regionalDestino">
                  <SelectValue placeholder="Seleccione un sede" />
                </SelectTrigger>
                <SelectContent>
                  {sedes.map((sede) => (
                    <SelectItem key={sede.id_sede} value={String(sede.id_sede)}>
                      {sede.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bodegaDestino">Sucursal Destino</Label>
              <Select
                onValueChange={(value) => {
                  setNewTraslado((prev) => ({
                    ...prev,
                    sucursal_destino_id: Number(value),
                  }));
                }}
              >
                <SelectTrigger id="bodegaDestino">
                  <SelectValue placeholder="Seleccione una sucursal" />
                </SelectTrigger>
                <SelectContent>
                  {sucursalesFiltradas.map((sucursal) => (
                    <SelectItem
                      key={sucursal.id_sucursal}
                      value={String(sucursal.id_sucursal)}
                    >
                      {sucursal.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoTraslado">Tipo de traslado</Label>
              <Select
                value={newTraslado.tipo || ""}
                onValueChange={(value) =>
                  setNewTraslado({
                    ...newTraslado,
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

          <div className="space-y-6">
            <Label>Motivos del Traslado</Label>
            <Textarea
              placeholder="Ingrese el motivo del traslado..."
              className="resize-none"
              value={newTraslado.motivo}
              onChange={(e) => {
                setNewTraslado({
                  ...newTraslado,
                  motivo: e.target.value,
                });
              }}
            />
          </div>

          {newTraslado.tipo === "EQUIPO" && (
            <SearchEquipo
              onEquipoEncontrado={(equipo) => {
                setNewTraslado((prev) => ({
                  ...prev,
                  equipos: [
                    ...prev.equipos,
                    {
                      id_equipo: equipo.id_equipo,
                      perifericos: Array.isArray(equipo.perifericos)
                        ? equipo.perifericos.map((p) => p.id_periferico)
                        : [],
                    },
                  ],
                }));
              }}
            />
          )}

          {newTraslado.tipo === "PERIFERICO" && (
            <SearchPeriferico
              onSeleccion={(periferico) =>
                setNewTraslado((prev) => ({
                  ...prev,
                  perifericos_directos: [
                    ...(prev.perifericos_directos || []),
                    {
                      id_periferico: periferico,
                      nombre: "",
                    },
                  ],
                }))
              }
            />
          )}

          {newTraslado.tipo === "IMPRESORA" && (
            <SearchImpresora
              onSeleccion={(impresora) =>
                setNewTraslado((prev) => ({
                  ...prev,
                  impresoras: [
                    ...(prev.impresoras || []),
                    {
                      id_impresora: impresora,
                      nombre: "",
                    },
                  ],
                }))
              }
            />
          )}

          <div className="space-y-6">
            <Label>Observaciones</Label>
            <Textarea
              placeholder="Ingrese las observaciones..."
              rows={4}
              value={newTraslado.observaciones}
              onChange={(e) => {
                setNewTraslado({
                  ...newTraslado,
                  observaciones: e.target.value,
                });
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                setNewTraslado((prev) => ({
                  ...prev,
                  responsable_salida_id: Number(person.id),
                }));
              }}
              onClear={() => {
                setSelectedEntregaUser(null);
                setNewTraslado((prev) => ({
                  ...prev,
                  responsable_salida_id: null,
                }));
              }}
            />

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
                setNewTraslado((prev) => ({
                  ...prev,
                  responsable_entrada_id: Number(person.id),
                }));
              }}
              onClear={() => {
                setSelectedRecibeUser(null);
                setNewTraslado((prev) => ({
                  ...prev,
                  responsable_entrada_id: null,
                }));
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="flex justify-end space-x-4">
            <Button type="submit" className="w-full">
              Generar Acta de Traslado
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Traslados;
