
import { useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { AccesorioItemProps } from "@/components/interfaces/accesorioItemProps";

export const AccesorioItem = ({ equipoIndex, accesorioIndex, onRemove }: AccesorioItemProps) => {
  const form = useFormContext();

  return (
    <div className="grid grid-cols-7 gap-2 mt-2 items-center">
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
          name={`equipos.${equipoIndex}.accesorios.${accesorioIndex}.serial`}
          render={({ field }) => (
            <FormItem className="mb-0">
              <FormControl>
                <Input placeholder="Serial (opcional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-1 flex justify-end">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const AccesoriosContainer = ({ equipoIndex }: { equipoIndex: number }) => {
  const form = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `equipos.${equipoIndex}.accesorios`,
  });

  return (
    <div className="mt-3 pl-4 border-l-2 border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <FormLabel className="text-sm font-medium">Accesorios</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ nombre: "", serial: "" })}
          className="h-7 px-2 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Añadir
        </Button>
      </div>
      
      <div className="space-y-2">
        {fields.length === 0 && (
          <p className="text-sm text-gray-500 italic">Sin accesorios registrados</p>
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
