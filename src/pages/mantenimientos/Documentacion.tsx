import { useEffect, useState } from "react";
import {
  ChevronLeft,
  Search,
  Upload,
  FileText,
  Paperclip,
  X,
  Eye,
  Download,
  PencilIcon,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mantenimiento } from "./interfaces/mantenimiento";
import { getFiles } from "@/api/axios/mante.api";
import { useMantenimiento } from "./hooks/use-mantenimiento";
import { formatFecha } from "@/hooks/use-global";

const DocumentacionMantenimiento = () => {
  const navigate = useNavigate();
  const { mantenimientos, getEstadoBadge, openFileInNewTab, downloadFile } =
    useMantenimiento();

  const now = new Date();
  const recientes = mantenimientos.flatMap((mantenimiento) =>
    mantenimiento.archivosmantenimiento.filter((archivo) => {
      if (!archivo.fecha_subida) return false;

      const fecha = new Date(archivo.fecha_subida);
      if (isNaN(fecha.getTime())) return false;

      const diferencia =
        (now.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24);
      return diferencia < 2;
    })
  );

  const archivosConMantenimiento = mantenimientos.flatMap((mantenimiento) =>
    mantenimiento.archivosmantenimiento.map((archivo) => ({
      ...archivo,
      mantenimiento,
    }))
  );

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/mantenimientos")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-[#040d50]">
          Documentación de Mantenimientos
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#040d50]">
              <FileText className="h-5 w-5" />
              Documentos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recientes.map((mantenimiento) => (
                <div
                  key={mantenimiento.id_archivo}
                  className="flex items-center gap-2 border rounded-md p-3 bg-white"
                >
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm truncate max-w-[240px]">
                    {mantenimiento.nombre_archivo || "—"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#040d50]">
                  ID° Mantenimiento
                </TableHead>
                <TableHead className="text-[#040d50]">Equipo</TableHead>
                <TableHead className="text-[#040d50]">Tipo Doc.</TableHead>
                <TableHead className="text-[#040d50]">Fecha</TableHead>
                <TableHead className="text-[#040d50]">Subido por</TableHead>
                <TableHead className="text-[#040d50]">Estado</TableHead>
                <TableHead className="text-[#040d50]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {archivosConMantenimiento.map((archivo) => (
                <TableRow
                  key={archivo.id_archivo}
                  className="border-b border-gray-200 hover:bg-slate-100"
                >
                  <TableCell className="text-[#040d50]">
                    {`MANT${archivo.mantenimiento_id
                      .toString()
                      .padStart(3, "0")}`}
                  </TableCell>
                  <TableCell className="text-[#040d50]">
                    {archivo.mantenimiento.equipos?.nombre_equipo}
                  </TableCell>
                  <TableCell className="text-[#040d50]">
                    {archivo.tipo_archivo}
                  </TableCell>
                  <TableCell className="text-[#040d50]">
                    {formatFecha(archivo.fecha_subida)}
                  </TableCell>
                  <TableCell className="text-[#040d50]">
                    <span className="text-sm">
                      {archivo.mantenimiento.usuarios?.nombre || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-[#040d50]">
                    <span className="text-sm capitalize">
                      {getEstadoBadge(archivo.mantenimiento.estado)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="slate-100"
                        onClick={() => {
                          openFileInNewTab({
                            content: archivo.archivo.content,
                            tipo: archivo.archivo.tipo,
                            nombre: archivo.archivo.nombre,
                          });
                        }}
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="slate-100"
                        onClick={() => {
                          downloadFile({
                            content: archivo.archivo.content,
                            tipo: archivo.archivo.tipo,
                            nombre: archivo.archivo.nombre,
                          });
                        }}
                      >
                        <Download className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="slate-100">
                        <XCircle className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentacionMantenimiento;
