import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { CalendarIcon, Save, X, Paperclip, FileText } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ContratoFormValues } from "@/pages/contratos/interfaces/contratoFormValues";
import { useContrato } from "./hooks/use-contrato";

const AgregarContrato = () => {
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     const newFiles = Array.from(e.target.files);
  //     setDocumentos(prev => [...prev, ...newFiles]);
  //     setValue('documentos', [...documentos, ...newFiles]);
  //   }
  // };

  // const removeFile = (index: number) => {
  //   const updatedFiles = [...documentos];
  //   updatedFiles.splice(index, 1);
  //   setDocumentos(updatedFiles);
  //   setValue('documentos', updatedFiles);
  // };

  const { createContrato, newContrato, setNewContrato } = useContrato();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Agregar Nuevo Contrato</h1>

      <Card>
        <CardHeader>
          <CardTitle>Información del Contrato</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e: React.FormEvent) => {
              e.preventDefault();
              createContrato(newContrato);
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Contrato</Label>
                <Input
                  id="nombre"
                  placeholder="Ingrese el nombre del contrato"
                  autoComplete="off"
                  value={newContrato.nombre || ""}
                  onChange={(e) => {
                    setNewContrato({ ...newContrato, nombre: e.target.value });
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="empresa">Empresa</Label>
                <Input
                  id="empresa"
                  placeholder="Nombre de la empresa"
                  autoComplete="off"
                  value={newContrato.empresa_nombre || ""}
                  onChange={(e) => {
                    setNewContrato({
                      ...newContrato,
                      empresa_nombre: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Contrato</Label>
                <Select
                  value={newContrato.tipo_contrato || ""}
                  onValueChange={(value) =>
                    setNewContrato({ ...newContrato, tipo_contrato: value })
                  }
                >
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Licencia">Licencia</SelectItem>
                    <SelectItem value="Proveedores">Proveedores</SelectItem>
                    <SelectItem value="Software">Software</SelectItem>
                    {/* <SelectItem value="soporte">Soporte Técnico</SelectItem>
                    <SelectItem value="servicios">Servicios</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={newContrato.estado || ""}
                  onValueChange={(value) =>
                    setNewContrato({ ...newContrato, estado: value })
                  }
                >
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Seleccione un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
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
                      {newContrato.fecha_inicio ? (
                        format(newContrato.fecha_inicio, "PPP", { locale: es })
                      ) : (
                        <span>Seleccione una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newContrato.fecha_inicio}
                      onSelect={(date) =>
                        setNewContrato({
                          ...newContrato,
                          fecha_inicio: date as Date,
                        })
                      }
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
                      {newContrato.fecha_fin ? (
                        format(newContrato.fecha_fin, "PPP", { locale: es })
                      ) : (
                        <span>Seleccione una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newContrato.fecha_fin}
                      onSelect={(date) =>
                        setNewContrato({
                          ...newContrato,
                          fecha_fin: date as Date,
                        })
                      }
                      initialFocus
                      disabled={(date) =>
                        newContrato.fecha_inicio
                          ? date < newContrato.fecha_inicio
                          : false
                      }
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
                autoComplete="off"
                value={newContrato.descripcion || ""}
                onChange={(e) => {
                  setNewContrato({
                    ...newContrato,
                    descripcion: e.target.value,
                  });
                }}
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
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setNewContrato({
                          ...newContrato,
                          DocumentoContrato: {
                            ...newContrato.DocumentoContrato,
                            nombre_documento: file.name,
                            tipo_documento: file.type,
                            archivo: file, // se guarda el objeto File
                          },
                        });
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("documentos")?.click()
                    }
                    className="mt-2"
                  >
                    Seleccionar archivos
                  </Button>
                </div>
              </div>

              {newContrato.DocumentoContrato.archivo && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Archivo seleccionado:</p>
                  <div className="flex items-center justify-between bg-white border rounded-md p-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="text-sm truncate max-w-[240px]">
                        {newContrato.DocumentoContrato.archivo instanceof File
                          ? newContrato.DocumentoContrato.archivo.name
                          : ""}
                      </span>
                      {/* <span className="text-xs text-gray-500">
                        (
                        {(
                          newContrato.DocumentoContrato.archivo.size / 1024
                        ).toFixed(0)}{" "}
                        KB)
                      </span> */}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() =>
                        setNewContrato({
                          ...newContrato,
                          DocumentoContrato: {
                            ...newContrato.DocumentoContrato,
                            archivo: null,
                            nombre_documento: "",
                            tipo_documento: "",
                          },
                        })
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
              <Button type="submit" className="gap-2">
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
