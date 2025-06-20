import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/pages/usuarios/hooks/use-user";
import { UserForm } from "../components/UserForm";
import { FileText } from "lucide-react";

const Agentes = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { users } = useUser();
  const agentes = users.filter((user) => user.rol === "Agente");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Agentes</h2>
        <UserForm isOpen={isOpen} rol="Agente" setIsOpen={setIsOpen} />
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Sede</TableHead>
              <TableHead>Sucursales</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agentes.length > 0 ? (
              agentes.map((agente, index) => (
                <TableRow key={index}>
                  <TableCell>{agente.nombre}</TableCell>
                  <TableCell>{agente.email}</TableCell>
                  <TableCell>{agente.rol}</TableCell>
                  <TableCell>{agente.telefono ?? "No asignado"}</TableCell>
                  <TableCell>{agente.sedes?.nombre ?? "No asignado"}</TableCell>
                  <TableCell>
                    {agente.sedes?.sucursales?.length
                      ? agente.sedes.sucursales
                          .map((suc) => suc.nombre)
                          .join(", ")
                      : "No asignado"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-6">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <FileText className="h-6 w-6" />
                    <span>No hay agentes registrados.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Agentes;
