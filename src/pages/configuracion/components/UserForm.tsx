import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/pages/usuarios/hooks/use-user";
import { useState } from "react";
import { useForm } from "react-hook-form";
import SignatureCanvas from "@/components/SignatureCanvas";

interface UserFormProps {
  isOpen: boolean;
  rol: "Agente" | "Administrador" | "Auditor" | "Cliente";
  setIsOpen: (isOpen: boolean) => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  rol,
  setIsOpen,
}) => {
  const {
    newUser,
    setNewUser,
    handleSumbit,
    selectedRecibeUser,
    setSelectedRecibeUser,
  } = useUser();
  const form = useForm();

  return (
    <div className="flex justify-between items-center">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>Nuevo Usuario</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Creación de Usuario</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Formulario para crear nuevos usuarios.
          </DialogDescription>
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSumbit({
                  ...newUser,
                  rol,
                });
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <Input
                    id="nombre"
                    autoComplete="off"
                    required
                    placeholder="Ingrese el nombre"
                    onChange={(e) =>
                      setNewUser({ ...newUser, nombre: e.target.value })
                    }
                    value={newUser.nombre}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="off"
                    required
                    placeholder="Ingrese el correo electrónico"
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    value={newUser.email}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="off"
                    required
                    placeholder="Ingrese la contraseña"
                    onChange={(e) =>
                      setNewUser({ ...newUser, contraseña: e.target.value })
                    }
                    value={newUser.contraseña}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Select
                    value={rol}
                    onValueChange={(value) =>
                      setNewUser({
                        ...newUser,
                        rol,
                      })
                    }
                    disabled
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el cargo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={rol}>{rol}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    autoComplete="off"
                    required
                    placeholder="Ingrese el teléfono"
                    onChange={(e) =>
                      setNewUser({ ...newUser, telefono: e.target.value })
                    }
                    value={newUser.telefono}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activo">Activo</Label>
                  <Select
                    value={newUser.estado || ""}
                    onValueChange={(value) =>
                      setNewUser({
                        ...newUser,
                        estado: value,
                      })
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="firma">Firma</Label>
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
              <Button type="submit" className="w-full">
                Guardar
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
