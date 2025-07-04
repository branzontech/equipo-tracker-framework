import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Printer, ArrowUpFromLine } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToners } from "../hooks/use-toners";
import { Label } from "@/components/ui/label";
import { useSucursales } from "@/pages/configuracion/maestros/hooks/use-sucursales";
import { Textarea } from "@/components/ui/textarea";
import { SearchSelect } from "@/components/SearchSelect";
import { useUser } from "@/pages/usuarios/hooks/use-user";
import { SearchToner } from "./SearchToner";
import { useImpresora } from "../hooks/use-impresora";
import { SearchImpresora } from "./SearchImpresora";
import ResponsibleSearch from "@/components/ResponsibleSearch";
import SignatureCanvas from "@/components/SignatureCanvas";

const SalidaToners = () => {
  const {
    newSalidaToner,
    setNewSalidaToner,
    getTonerBySerial,
    serialToner,
    setSerialToner,
    sugerenciasToner,
    setSugerenciasToner,
    createSalida,
    responsableRetiraInput,
    setResponsableRecibeInput,
  } = useToners();
  const {
    handleImpresoraSerialInput,
    impresoraSerial,
    setImpresoraSerial,
    sugerenciasImpresora,
    setSugerenciasImpresora,
  } = useImpresora();
  const { sucursales } = useSucursales();
  const form = useForm();
  const {
    handleNombreInput,
    nombreInput,
    sugerencias,
    setSugerencias,
    setNombreUser,
    userRetira,
    setUserRetira,
    sugerenciasRetira,
    setSugerenciasRetira,
    newUser,
    users,
    selectedEntregaUser,
    setSelectedEntregaUser,
    selectedRecibeUser,
    setSelectedRecibeUser,
  } = useUser();

  const handleUserSelect = (user) => {
    setNombreUser(user.nombre);
    setNewSalidaToner((prev) => ({
      ...prev,
      usuario_id: user.id_usuario,
    }));
    setSugerencias([]);
  };

  const handleUserRetiraSelect = (user) => {
    setUserRetira(user.nombre);
    setNewSalidaToner((prev) => ({
      ...prev,
      usuario_id_retira: user.id_usuario,
    }));
    setSugerenciasRetira([]);
  };

  const handleSerialInput = (toner) => {
    setSerialToner(toner.serial);
    setNewSalidaToner((prev) => ({
      ...prev,
      toner_id: toner.id_toner,
    }));
    setSugerenciasToner([]);
  };

  const handleImpresoraSerial = (impresora) => {
    setImpresoraSerial(impresora.serial);
    setNewSalidaToner((prev) => ({
      ...prev,
      impresora_destino_id: impresora.id_impresora,
    }));
    setSugerenciasImpresora([]);
  };

  const selectedRetiraId = selectedEntregaUser?.id_usuario;
  const selectedRecibeId = selectedRecibeUser?.id_usuario;

  const retiraUsuarios = users.filter((u) => u.id_usuario !== selectedRecibeId);

  const recibeUsuarios = users.filter((u) => u.id_usuario !== selectedRetiraId);

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <Printer className="h-8 w-8 text-[#040d50]" />
        <h1 className="text-2xl font-bold text-[#040d50]">Salida de Toners</h1>
      </div>

      <div className="max-w-2xl bg-white p-6 rounded-lg shadow-sm border">
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={(e: React.FormEvent) => {
              e.preventDefault();
              createSalida(newSalidaToner);
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SearchToner
                label="Toner"
                placeholder="Ingrese el número de serie"
                value={serialToner}
                onInputChange={getTonerBySerial}
                suggestions={sugerenciasToner}
                onSelect={handleSerialInput}
                getKey={(u) => u.id_toner}
                getLabel={(u) =>
                  `${u.serial ?? "Sin serial"} - ${
                    u.modelo ?? "Desconocido"
                  } (${u.color ?? "N/A"})`
                }
              />

              <SearchImpresora
                label="Impresora Destino"
                placeholder="Ingrese el nombre del usuario"
                value={impresoraSerial}
                onInputChange={handleImpresoraSerialInput}
                suggestions={sugerenciasImpresora}
                onSelect={handleImpresoraSerial}
                getKey={(u) => u.id_impresora}
                getLabel={(item) => `${item.nombre} - ${item.serial}`}
              />

              <div className="space-y-2">
                <Label>Cantidad</Label>
                <Input
                  placeholder="Cantidad"
                  value={newSalidaToner.cantidad}
                  onChange={(e) =>
                    setNewSalidaToner({
                      ...newSalidaToner,
                      cantidad: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Sucursal Destino</Label>
                <Select
                  onValueChange={(value) =>
                    setNewSalidaToner({
                      ...newSalidaToner,
                      sucursal_id: Number(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sucursal" />
                  </SelectTrigger>
                  <SelectContent>
                    {sucursales.map((sucursal) => (
                      <SelectItem
                        key={sucursal.id_sucursal}
                        value={sucursal.id_sucursal.toString()}
                      >
                        {sucursal.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Observaciones</Label>
                <Textarea
                  placeholder="Observaciones adicionales"
                  value={newSalidaToner.observaciones}
                  onChange={(e) =>
                    setNewSalidaToner({
                      ...newSalidaToner,
                      observaciones: e.target.value,
                    })
                  }
                  rows={4}
                />
              </div>

              {/* <SearchSelect
                label="Usuario que retira"
                placeholder="Ingrese el nombre del usuario"
                value={userRetira}
                onInputChange={(val) => handleNombreInput(val, "retira")}
                suggestions={sugerenciasRetira}
                onSelect={handleUserRetiraSelect}
                getKey={(u) => u.id_usuario}
                getLabel={(u) => u.nombre}
              /> */}

              <ResponsibleSearch
                name="responsableRetira"
                label="Responsable que retira"
                users={retiraUsuarios}
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
                  setNewSalidaToner((prev) => ({
                    ...prev,
                    responsable_salida_id: Number(person.id),
                  }));
                }}
                onClear={() => {
                  setSelectedEntregaUser(null);
                  setNewSalidaToner((prev) => ({
                    ...prev,
                    responsable_salida_id: null,
                  }));
                }}
              />

              <ResponsibleSearch
                name="responsableRecibe"
                label="Responsable de Recepción"
                users={recibeUsuarios}
                value={responsableRetiraInput}
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
                  setNewSalidaToner((prev) => ({
                    ...prev,
                    responsable_entrada_id: Number(person.id),
                  }));
                }}
                onClear={() => {
                  setSelectedRecibeUser(null);
                  setResponsableRecibeInput(null);
                  setNewSalidaToner((prev) => ({
                    ...prev,
                    responsable_entrada_id: null,
                  }));
                }}
              />
              {/* 
              <SearchSelect
                label="Usuario de recepción"
                placeholder="Ingrese el nombre del usuario"
                value={nombreInput}
                onInputChange={(val) => handleNombreInput(val, "recepcion")}
                suggestions={sugerencias}
                onSelect={handleUserSelect}
                getKey={(u) => u.id_usuario}
                getLabel={(u) => u.nombre}
              /> */}

                <div className="space-y-2">
                  <Label htmlFor="firmaEntrega">Firma de quien retira</Label>
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

            <Button type="submit" className="w-full md:w-auto">
              <ArrowUpFromLine className="mr-2 h-4 w-4" />
              Registrar Salida
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SalidaToners;
