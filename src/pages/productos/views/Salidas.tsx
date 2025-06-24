import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ResponsibleSearch from "@/components/ResponsibleSearch";
import { usePrestamo } from "../hooks/use-prestamo";
import { Label } from "@/components/ui/label";
import { es } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SignatureCanvas from "@/components/SignatureCanvas";
import { FormProvider, useForm } from "react-hook-form";
import { useUser } from "@/pages/usuarios/hooks/use-user";
import { SearchEquipo } from "@/components/SearchEquipo";
import { SearchSelect } from "@/components/SearchSelect";
import { SearchPeriferico } from "@/components/SearchPeriferico";
import { SearchImpresora } from "@/components/SearchImpresora";

const Salidas = () => {
  const {
    newPrestamo,
    setNewPrestamo,
    addPrestamo,
    responsableRecibeInput,
    setResponsableRecibeInput,
  } = usePrestamo();
  const {
    newUser,
    users,
    selectedEntregaUser,
    setSelectedEntregaUser,
    selectedRecibeUser,
    setSelectedRecibeUser,
    handleNombreInput,
    nombreInput,
    sugerencias,
    setSugerencias,
    setNombreUser,
  } = useUser();
  const methods = useForm();
  const selectedEntregaId = selectedEntregaUser?.id_usuario;
  const selectedRecibeId = selectedRecibeUser?.id_usuario;

  const entregaUsuarios = users.filter(
    (u) => u.id_usuario !== selectedRecibeId
  );

  const recibeUsuarios = users.filter(
    (u) => u.id_usuario !== selectedEntregaId
  );

  const handleUserSelect = (user) => {
    setNombreUser(user.nombre);
    setSelectedRecibeUser(user);
    setResponsableRecibeInput({
      id: user.id_usuario.toString(),
      name: user.nombre,
      position: user.rol,
      department: user.sedes?.nombre || "Sin sede",
    });
    setNewPrestamo((prev) => ({
      ...prev,
      responsable_entrada_id: user.id_usuario,
    }));
    setSugerencias([]);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#01242c] mb-6">
        Salida de Equipos en Condición de Préstamo
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

            addPrestamo(
              newPrestamo,
              firmaFinalEntrega,
              firmaFinalRecibe,
              nombreInput
            );
          }}
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fechaEntrega">Fecha de Entrega</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newPrestamo.fecha_salida ? (
                      format(newPrestamo.fecha_salida, "PPP", {
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
                      typeof newPrestamo.fecha_salida === "string"
                        ? new Date(newPrestamo.fecha_salida)
                        : newPrestamo.fecha_salida
                    }
                    onSelect={(date) =>
                      setNewPrestamo({
                        ...newPrestamo,
                        fecha_salida: date as Date,
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
              <Label htmlFor="fechaRetorno">Fecha de Retorno</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newPrestamo.fecha_retorno ? (
                      format(newPrestamo.fecha_retorno, "PPP", {
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
                      typeof newPrestamo.fecha_retorno === "string"
                        ? new Date(newPrestamo.fecha_retorno)
                        : newPrestamo.fecha_retorno
                    }
                    onSelect={(date) =>
                      setNewPrestamo({
                        ...newPrestamo,
                        fecha_retorno: date as Date,
                      })
                    }
                    initialFocus
                    disabled={(date) => {
                      const today = new Date();
                      return date < today || date < new Date("1900-01-01");
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <SearchSelect
              label="Usuario de recepción"
              placeholder="Ingrese el nombre del usuario"
              value={nombreInput}
              onInputChange={handleNombreInput}
              suggestions={sugerencias}
              onSelect={handleUserSelect}
              getKey={(u) => u.id_usuario}
              getLabel={(u) => u.nombre}
            />

            <div className="space-y-2">
              <Label htmlFor="tipoPrestamo">Tipo de préstamo</Label>
              <Select
                value={newPrestamo.tipo || ""}
                onValueChange={(value) =>
                  setNewPrestamo({
                    ...newPrestamo,
                    tipo: value,
                    equipos: [],
                    perifericos_directos: [],
                    impresoras: [],
                  })
                }
              >
                <SelectTrigger id="tipoPrestamo">
                  <SelectValue placeholder="Seleccione el tipo de préstamo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EQUIPO">Equipo</SelectItem>
                  <SelectItem value="PERIFERICO">Periférico</SelectItem>
                  <SelectItem value="IMPRESORA">Impresora</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-4 text-gray-700">
              Señor(a) <span className="font-semibold">{nombreInput}</span> a
              continuación se le hace entrega de los siguientes implementos de
              trabajo:
            </p>

            {newPrestamo.tipo === "EQUIPO" && (
              <SearchEquipo
                onEquipoEncontrado={(equipo) => {
                  setNewPrestamo((prev) => ({
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

            {newPrestamo.tipo === "PERIFERICO" && (
              <SearchPeriferico
                onSeleccion={(periferico) =>
                  setNewPrestamo((prev) => ({
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

            {newPrestamo.tipo === "IMPRESORA" && (
              <SearchImpresora
                onSeleccion={(impresora) =>
                  setNewPrestamo((prev) => ({
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripcion del prestamo</Label>
            <Textarea
              id="descripcion"
              placeholder="Ingrese la descripción..."
              rows={4}
              value={newPrestamo.descripcion}
              onChange={(e) => {
                setNewPrestamo({
                  ...newPrestamo,
                  descripcion: e.target.value,
                });
              }}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
            El receptor se compromete a utilizar el equipo exclusivamente para
            propósitos laborales, mantenerlo en óptimas condiciones y reportar
            de manera inmediata cualquier falla o anomalía que se presente.
            Asimismo, se compromete a no instalar ningún tipo de software sin la
            debida autorización, no prestar ni transferir el equipo a terceras
            personas y devolverlo cuando la empresa lo requiera.
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
                setNewPrestamo((prev) => ({
                  ...prev,
                  responsable_salida_id: Number(person.id),
                }));
              }}
              onClear={() => {
                setSelectedEntregaUser(null);
                setNewPrestamo((prev) => ({
                  ...prev,
                  responsable_salida_id: null,
                }));
              }}
            />

            <ResponsibleSearch
              name="responsableRecibe"
              label="Responsable de Recepción"
              users={recibeUsuarios}
              value={responsableRecibeInput}
              onSelect={(person) => {
                const user = users.find(
                  (u) => u.id_usuario === Number(person.id)
                );
                if (user) {
                  setSelectedRecibeUser({
                    ...user,
                    firma: user.firma || "",
                  });
                  setResponsableRecibeInput({
                    id: user.id_usuario.toString(),
                    label: user.nombre,
                  });
                } else {
                  setSelectedRecibeUser(null);
                  setResponsableRecibeInput(null);
                }
                setNewPrestamo((prev) => ({
                  ...prev,
                  responsable_entrada_id: Number(person.id),
                }));
              }}
              onClear={() => {
                setSelectedRecibeUser(null);
                setResponsableRecibeInput(null);
                setNewPrestamo((prev) => ({
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
                  newUser.firma = value;
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
              Generar Acta de Entrega
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Salidas;
