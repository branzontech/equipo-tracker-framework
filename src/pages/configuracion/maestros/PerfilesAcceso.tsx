
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PerfilAcceso } from "@/pages/configuracion/maestros/interfaces/perfilAcceso";


const PerfilesAcceso = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [perfiles, setPerfiles] = useState<PerfilAcceso[]>([
    {
      id: "1",
      nombre: "Administrador",
      descripcion: "Control total del sistema",
      fechaCreacion: "2024-02-20",
    },
    {
      id: "2",
      nombre: "Técnico",
      descripcion: "Gestión de mantenimientos e inventario",
      fechaCreacion: "2024-02-20",
    },
    {
      id: "3",
      nombre: "Auxiliar",
      descripcion: "Operaciones básicas del sistema",
      fechaCreacion: "2024-02-20",
    },
  ]);

  const form = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  });

  const onSubmit = (data: { nombre: string; descripcion: string }) => {
    const newPerfil = {
      id: (perfiles.length + 1).toString(),
      nombre: data.nombre,
      descripcion: data.descripcion,
      fechaCreacion: new Date().toISOString().split("T")[0],
    };

    setPerfiles([...perfiles, newPerfil]);
    setIsOpen(false);
    form.reset();
    toast.success("Perfil de acceso creado exitosamente");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Perfiles de Acceso</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Nuevo Perfil</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Perfil de Acceso</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Perfil</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Auxiliar, Pasante, etc." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe las responsabilidades y alcance de este perfil"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Guardar Perfil
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre del Perfil</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Fecha de Creación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {perfiles.map((perfil) => (
              <TableRow key={perfil.id}>
                <TableCell className="font-medium">{perfil.nombre}</TableCell>
                <TableCell>{perfil.descripcion}</TableCell>
                <TableCell>{perfil.fechaCreacion}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PerfilesAcceso;
