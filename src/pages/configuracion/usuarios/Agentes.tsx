
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { AgenteForm } from "@/pages/configuracion/usuarios/interfaces/agenteForm";



// Datos de ejemplo - En producción estos vendrían de una API
const SEDES = ["Sede Principal", "Sede Norte", "Sede Sur"];
const BODEGAS = ["Bodega Principal", "Bodega Secundaria", "Almacén Central"];
const AREAS = ["TI", "Mantenimiento", "Soporte", "Infraestructura"];

const Agentes = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [agentes, setAgentes] = useState<AgenteForm[]>([]);

  const form = useForm<AgenteForm>({
    defaultValues: {
      bodegas: [],
      areas: [],
    }
  });

  const onSubmit = (data: AgenteForm) => {
    setAgentes([...agentes, data]);
    setIsOpen(false);
    form.reset();
    toast.success("Agente creado exitosamente");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Agentes</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Nuevo Agente</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Agente</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nivelAcceso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nivel de Acceso</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar nivel" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Tecnico">Técnico</SelectItem>
                            <SelectItem value="Administrador">Administrador</SelectItem>
                            <SelectItem value="Analista">Analista</SelectItem>
                            <SelectItem value="Auxiliar">Auxiliar</SelectItem>
                            <SelectItem value="Auditor">Auditor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cargo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cargo</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sede"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sede</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar sede" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SEDES.map((sede) => (
                              <SelectItem key={sede} value={sede}>
                                {sede}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bodegas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bodegas Asignadas</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange([...field.value || [], value])}
                          value={field.value?.[0] || undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar bodegas" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BODEGAS.map((bodega) => (
                              <SelectItem key={bodega} value={bodega}>
                                {bodega}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="areas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Áreas Asignadas</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange([...field.value || [], value])}
                          value={field.value?.[0] || undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar áreas" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {AREAS.map((area) => (
                              <SelectItem key={area} value={area}>
                                {area}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">Guardar</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Nivel de Acceso</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Sede</TableHead>
              <TableHead>Bodegas</TableHead>
              <TableHead>Áreas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agentes.map((agente, index) => (
              <TableRow key={index}>
                <TableCell>{agente.nombre}</TableCell>
                <TableCell>{agente.email}</TableCell>
                <TableCell>{agente.nivelAcceso}</TableCell>
                <TableCell>{agente.cargo}</TableCell>
                <TableCell>{agente.sede}</TableCell>
                <TableCell>{agente.bodegas.join(", ")}</TableCell>
                <TableCell>{agente.areas.join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Agentes;
