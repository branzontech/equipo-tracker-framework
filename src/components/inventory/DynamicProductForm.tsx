
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductTypeSelector, ProductType } from "./ProductTypeSelector";
import { getProductTypeById, productTypesList, FormField as ProductFormField } from "@/utils/productTypes";
import { toast } from "sonner";

export function DynamicProductForm() {
  const [productType, setProductType] = useState<string>("");
  const [formSchema, setFormSchema] = useState<any>(z.object({}));
  const [fieldDefinitions, setFieldDefinitions] = useState<Record<string, ProductFormField>>({});
  const [formSections, setFormSections] = useState<any[]>([]);
  
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  
  // Actualizar el esquema del formulario cuando cambia el tipo de producto
  useEffect(() => {
    if (!productType) return;
    
    const productTypeDefinition = getProductTypeById(productType);
    if (!productTypeDefinition) return;
    
    // Construir el esquema Zod dinámicamente
    const schemaMap: Record<string, any> = {};
    const defaultValues: Record<string, any> = {};
    
    Object.entries(productTypeDefinition.fields).forEach(([key, field]) => {
      // Construir validación Zod según el tipo de campo
      let fieldSchema: any;
      
      switch (field.type) {
        case 'text':
          fieldSchema = z.string();
          if (field.required) fieldSchema = fieldSchema.min(1, `${field.label} es requerido`);
          if (field.validation?.minLength) fieldSchema = fieldSchema.min(field.validation.minLength, `${field.label} debe tener al menos ${field.validation.minLength} caracteres`);
          if (field.validation?.maxLength) fieldSchema = fieldSchema.max(field.validation.maxLength, `${field.label} debe tener como máximo ${field.validation.maxLength} caracteres`);
          defaultValues[key] = field.defaultValue || "";
          break;
        case 'number':
          fieldSchema = z.number();
          if (field.required) fieldSchema = fieldSchema.min(0, `${field.label} es requerido`);
          if (field.validation?.min !== undefined) fieldSchema = fieldSchema.min(field.validation.min, `${field.label} debe ser mayor o igual a ${field.validation.min}`);
          if (field.validation?.max !== undefined) fieldSchema = fieldSchema.max(field.validation.max, `${field.label} debe ser menor o igual a ${field.validation.max}`);
          defaultValues[key] = field.defaultValue || 0;
          break;
        case 'select':
          fieldSchema = z.string();
          if (field.required) fieldSchema = fieldSchema.min(1, `${field.label} es requerido`);
          defaultValues[key] = field.defaultValue || "";
          break;
        case 'date':
          fieldSchema = z.date().optional();
          defaultValues[key] = field.defaultValue || undefined;
          break;
        case 'checkbox':
          fieldSchema = z.boolean().default(false);
          defaultValues[key] = field.defaultValue || false;
          break;
        case 'textarea':
          fieldSchema = z.string();
          if (field.required) fieldSchema = fieldSchema.min(1, `${field.label} es requerido`);
          defaultValues[key] = field.defaultValue || "";
          break;
        case 'file':
          fieldSchema = z.any();
          defaultValues[key] = field.defaultValue || null;
          break;
        default:
          fieldSchema = z.any();
      }
      
      schemaMap[key] = fieldSchema;
    });
    
    const newFormSchema = z.object(schemaMap);
    setFormSchema(newFormSchema);
    setFieldDefinitions(productTypeDefinition.fields);
    setFormSections(productTypeDefinition.sections);
    
    // Resetear el formulario con los nuevos valores por defecto
    form.reset(defaultValues);
    
  }, [productType, form]);
  
  const handleProductTypeChange = (value: string) => {
    setProductType(value);
  };
  
  const onSubmit = (data: any) => {
    console.log("Datos del producto enviados:", data);
    toast.success(`${getProductTypeById(productType)?.name || 'Producto'} registrado exitosamente`);
  };
  
  const renderField = (field: ProductFormField, name: string) => {
    switch (field.type) {
      case 'text':
        return (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input placeholder={field.placeholder || ''} {...formField} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 'number':
        return (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder={field.placeholder || ''} 
                    {...formField} 
                    onChange={e => formField.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 'select':
        return (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <Select onValueChange={formField.onChange} value={formField.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder || `Seleccione ${field.label}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 'checkbox':
        return (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field: formField }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={formField.value}
                    onCheckedChange={formField.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {field.label}
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 'date':
        return (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field: formField }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{field.label}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !formField.value && "text-muted-foreground"
                        )}
                      >
                        {formField.value ? (
                          format(formField.value, "P")
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formField.value}
                      onSelect={formField.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 'textarea':
        return (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={field.placeholder || ''} 
                    className="min-h-[100px]"
                    {...formField} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 'file':
        return (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Click para subir</span>
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={e => formField.onChange(e.target.files ? e.target.files[0] : null)}
                      />
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Tipo de Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductTypeSelector 
            productTypes={productTypesList}
            onChange={handleProductTypeChange}
            defaultValue={productType}
          />
        </CardContent>
      </Card>
      
      {productType && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {formSections.map(section => (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {section.fieldIds.map(fieldId => {
                      const field = fieldDefinitions[fieldId];
                      return field ? renderField(field, fieldId) : null;
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">Cancelar</Button>
              <Button type="submit">Guardar Producto</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
