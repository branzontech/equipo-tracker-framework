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

const Auditores = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { users } = useUser();
  const Auditores = users.filter((user) => user.rol === "Auditor");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Auditores</h2>
        <UserForm isOpen={isOpen} rol="Auditor" setIsOpen={setIsOpen} />
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
            {Auditores.length > 0 ? (
              Auditores.map((responsable, index) => (
                <TableRow key={index}>
                  <TableCell>{responsable.nombre}</TableCell>
                  <TableCell>{responsable.email}</TableCell>
                  <TableCell>{responsable.rol}</TableCell>
                  <TableCell>{responsable.telefono ?? "No asignado"}</TableCell>
                  <TableCell>
                    {responsable.usuario_sede &&
                    responsable.usuario_sede.length > 0
                      ? responsable.usuario_sede
                          .map((us) => us.sedes?.nombre)
                          .filter(Boolean)
                          .join(", ")
                      : "No asignado"}
                  </TableCell>

                  <TableCell>
                    {responsable.usuario_sede &&
                    responsable.usuario_sede.length > 0
                      ? responsable.usuario_sede
                          .flatMap((us) => us.sedes?.sucursales || [])
                          .map((suc) => suc.nombre)
                          .join(", ") || "No asignado"
                      : "No asignado"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-6">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <FileText className="h-6 w-6" />
                    <span>No hay auditores registrados.</span>
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

export default Auditores;
