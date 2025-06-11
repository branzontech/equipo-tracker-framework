/* eslint-disable react-hooks/exhaustive-deps */
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { AccesorioItemProps } from "@/components/interfaces/accesorioItemProps";
import { usePrestamo } from "@/pages/productos/hooks/use-prestamo";
import { useEffect } from "react";
import { Perifericos } from "@/pages/configuracion/maestros/interfaces/periferico";

export const AccesorioItem = ({
  equipoIndex,
  accesorioIndex,
  onRemove,
}: AccesorioItemProps) => {
  const form = useFormContext();

  return (
    <div className="grid grid-cols-10 gap-2 mt-2 items-center">
      <div className="col-span-3">
        <FormField
          control={form.control}
          name={`equipos.${equipoIndex}.accesorios.${accesorioIndex}.nombre`}
          render={({ field }) => (
            <FormItem className="mb-0">
              <FormControl>
                <Input placeholder="Nombre del accesorio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-3">
        <FormField
          control={form.control}
          name={`equipos.${equipoIndex}.accesorios.${accesorioIndex}.tipo`}
          render={({ field }) => (
            <FormItem className="mb-0">
              <FormControl>
                <Input placeholder="Tipo de accesorio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-3">
        <FormField
          control={form.control}
          name={`equipos.${equipoIndex}.accesorios.${accesorioIndex}.estado`}
          render={({ field }) => (
            <FormItem className="mb-0">
              <FormControl>
                <Input placeholder="Estado de accesorio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-1 flex justify-end">
        <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const AccesoriosContainer = ({
  equipoIndex,
  accesorios,
}: {
  equipoIndex: number;
  accesorios?: Perifericos[];
}) => {
  const form = useFormContext();

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: `equipos.${equipoIndex}.accesorios`,
  });

  useEffect(() => {
    if (accesorios && accesorios.length > 0 && fields.length === 0) {
      replace(
        accesorios.map((acc) => ({
          nombre: acc.nombre || "",
          tipo: acc.tipo || "",
          estado: acc.estado || "",
        }))
      );
    }
  }, [accesorios]);

  const equipo = form.watch(`equipos.${equipoIndex}`);
  const equipoBuscado = form.watch(`equipos.${equipoIndex}.buscado`);

  if (!equipo?.serial && fields.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic ml-4 mt-4">
        Busca un equipo para mostrar sus accesorios.
      </p>
    );
  }

  return (
    <div className="mt-3 pl-4 border-l-2 border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <FormLabel className="text-sm font-medium">Accesorios</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ nombre: "", tipo: "", estado: "" })}
          className="h-7 px-2 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Añadir
        </Button>
      </div>

      <div className="space-y-2">
        {fields.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            Sin accesorios registrados
          </p>
        )}

        {fields.map((field, index) => (
          <AccesorioItem
            key={field.id}
            equipoIndex={equipoIndex}
            accesorioIndex={index}
            onRemove={() => remove(index)}
          />
        ))}
      </div>
    </div>
  );
};
