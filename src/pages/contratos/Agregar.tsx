
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { CalendarIcon, Save, X, Paperclip, FileText } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ContratoFormValues } from '@/pages/contratos/interfaces/contratoFormValues';


const AgregarContrato = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentos, setDocumentos] = useState<File[]>([]);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ContratoFormValues>({
    defaultValues: {
      nombre: '',
      empresa: '',
      tipo: '',
      estado: 'activo',
      descripcion: '',
      documentos: [],
    }
  });

  const fechaInicio = watch('fechaInicio');
  const fechaFin = watch('fechaFin');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setDocumentos(prev => [...prev, ...newFiles]);
      setValue('documentos', [...documentos, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...documentos];
    updatedFiles.splice(index, 1);
    setDocumentos(updatedFiles);
    setValue('documentos', updatedFiles);
  };

  const onSubmit = (data: ContratoFormValues) => {
    setIsSubmitting(true);
    // Simulamos una petición al servidor
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Contrato guardado",
        description: "El contrato ha sido guardado exitosamente.",
      });
      navigate('/contratos/lista');
    }, 1500);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Agregar Nuevo Contrato</h1>

      <Card>
        <CardHeader>
          <CardTitle>Información del Contrato</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Contrato</Label>
                <Input
                  id="nombre"
                  placeholder="Ingrese el nombre del contrato"
                  {...register('nombre', { required: 'El nombre es obligatorio' })}
                />
                {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="empresa">Empresa</Label>
                <Input
                  id="empresa"
                  placeholder="Nombre de la empresa"
                  {...register('empresa', { required: 'La empresa es obligatoria' })}
                />
                {errors.empresa && <p className="text-red-500 text-sm">{errors.empresa.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Contrato</Label>
                <Select 
                  onValueChange={(value) => setValue('tipo', value)}
                  defaultValue={watch('tipo')}
                >
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="licencia">Licencia</SelectItem>
                    <SelectItem value="proveedores">Proveedores</SelectItem>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="soporte">Soporte Técnico</SelectItem>
                    <SelectItem value="servicios">Servicios</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipo && <p className="text-red-500 text-sm">{errors.tipo.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select 
                  onValueChange={(value) => setValue('estado', value)}
                  defaultValue={watch('estado')}
                >
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Seleccione un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fecha de Inicio</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaInicio ? format(fechaInicio, 'PPP', { locale: es }) : <span>Seleccione una fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fechaInicio}
                      onSelect={(date) => setValue('fechaInicio', date as Date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Fecha de Fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaFin ? format(fechaFin, 'PPP', { locale: es }) : <span>Seleccione una fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fechaFin}
                      onSelect={(date) => setValue('fechaFin', date as Date)}
                      initialFocus
                      disabled={(date) => fechaInicio ? date < fechaInicio : false}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Descripción del contrato"
                rows={4}
                {...register('descripcion')}
              />
            </div>

            <div className="space-y-2">
              <Label>Documentos del Contrato</Label>
              <div className="border border-dashed rounded-md p-6 bg-slate-50">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Paperclip className="h-8 w-8 text-slate-400" />
                  <p className="text-sm text-center text-slate-600">
                    Arrastre aquí sus documentos o haga clic para seleccionarlos
                  </p>
                  <Input
                    id="documentos"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('documentos')?.click()}
                    className="mt-2"
                  >
                    Seleccionar archivos
                  </Button>
                </div>
              </div>
              
              {documentos.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Archivos seleccionados:</p>
                  <div className="space-y-2">
                    {documentos.map((file, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between bg-white border rounded-md p-2"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <span className="text-sm truncate max-w-[240px]">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/contratos/lista')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="gap-2"
              >
                <Save size={16} />
                Guardar Contrato
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgregarContrato;
