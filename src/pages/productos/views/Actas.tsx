import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Grid,
  LayoutGrid,
  User,
  Calendar,
  CheckCircle,
  RotateCw,
  XCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Sheet, SheetDescription } from "@/components/ui/sheet";
import { VerActaDialog } from "../components/VerActaDialog";
import { Badge } from "@/components/ui/badge";
import { useActa } from "../hooks/use-acta";
import { useGlobal } from "@/hooks/use-global";
import {
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@radix-ui/react-select";
import { Label } from "@/components/ui/label";

const Actas = () => {
  const {
    PaginationControls,
    currentActas,
    handleManageActa,
    handleVerActa,
    getActaData,
    getTipoIcon,
    getEstadoFromActa,
    getEstadoLabel,
    getEstadoBadge,
    getTipoLabel,
    viewMode,
    setViewMode,
    setBusqueda,
    setTipoFiltro,
    setEstadoFiltro,
    busqueda,
    tipoFiltro,
    estadoFiltro,
    actasFiltradas,
    setDialogOpen,
    dialogOpen,
    selectedActa,
    currentActa,
    managementSheetOpen,
    setManagementSheetOpen,
    handleStatusChange,
    generarYDescargarPDF,
  } = useActa();
  const { formatFecha } = useGlobal();

  // const handleProcessReturn = (acta: Acta) => {
  //   if (
  //     acta.tipo === "prestamo" &&
  //     (acta.estado === "vigente" || acta.estado === "pendiente_devolucion")
  //   ) {
  //     const updatedActas = actasData.map((item) =>
  //       item.id === acta.id
  //         ? { ...item, estado: "finalizada" as EstadoActa }
  //         : item
  //     );

  //     setActasData(updatedActas);

  //     toast({
  //       title: "Devolución procesada",
  //       description: `Los equipos del acta ${acta.id} han sido devueltos correctamente.`,
  //     });

  //     setManagementSheetOpen(false);
  //   }
  // };

  // const handleCancelActa = (acta: Acta) => {
  //   if (
  //     acta.estado === "vigente" ||
  //     acta.estado === "en_proceso" ||
  //     acta.estado === "pendiente_devolucion"
  //   ) {
  //     const updatedActas = actasData.map((item) =>
  //       item.id === acta.id
  //         ? { ...item, estado: "cancelada" as EstadoActa }
  //         : item
  //     );

  //     setActasData(updatedActas);

  //     toast({
  //       title: "Acta cancelada",
  //       description: `El acta ${acta.id} ha sido cancelada.`,
  //     });

  //     setManagementSheetOpen(false);
  //   }
  // };

  // const handleRequestReturn = (acta: Acta) => {
  //   if (acta.tipo === "prestamo" && acta.estado === "vigente") {
  //     const updatedActas = actasData.map((item) =>
  //       item.id === acta.id
  //         ? { ...item, estado: "pendiente_devolucion" as EstadoActa }
  //         : item
  //     );

  //     setActasData(updatedActas);

  //     toast({
  //       title: "Devolución solicitada",
  //       description: `Se ha solicitado la devolución de los equipos del acta ${acta.id}.`,
  //     });

  //     if (currentActa && currentActa.id === acta.id) {
  //       setCurrentActa({ ...acta, estado: "pendiente_devolucion" });
  //     }
  //   }
  // };

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...currentActas]
        .sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        )
        .map((acta) => {
          const { usuario, descripcion } = getActaData(acta);

          return (
            <Card
              key={acta.id_acta}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getTipoIcon(acta.tipo)}
                  {acta.tipo}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  {formatFecha(
                    typeof acta.fecha === "string"
                      ? acta.fecha
                      : acta.fecha.toISOString()
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{usuario}</span>
                  </div>
                  <div>
                    <Badge
                      className={`capitalize ${getEstadoBadge(
                        getEstadoFromActa(acta)
                      )}`}
                    >
                      {getEstadoLabel(getEstadoFromActa(acta))}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                      Tipo:
                    </span>{" "}
                    <span className="capitalize">
                      {getTipoLabel(acta.tipo)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {descripcion}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleVerActa(acta)}
                    >
                      Ver Acta
                    </Button>
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => handleManageActa(acta)}
                    >
                      Gestionar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );

  const TableView = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...currentActas]
            .sort(
              (a, b) =>
                new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
            )
            .map((acta) => {
              const { usuario, descripcion } = getActaData(acta);

              const estado = getEstadoFromActa(acta);

              return (
                <TableRow key={acta.id_acta}>
                  <TableCell className="font-medium">{`ACT${acta.id_acta
                    .toString()
                    .padStart(3, "0")}`}</TableCell>
                  <TableCell>
                    {formatFecha(
                      typeof acta.fecha === "string"
                        ? acta.fecha
                        : acta.fecha.toISOString()
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTipoIcon(acta.tipo)}
                      <span className="capitalize">
                        {getTipoLabel(acta.tipo)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{usuario}</TableCell>
                  <TableCell>
                    {(() => {
                      const estado = getEstadoFromActa(acta);
                      return (
                        <Badge
                          className={`capitalize ${getEstadoBadge(estado)}`}
                        >
                          {getEstadoLabel(estado)}
                        </Badge>
                      );
                    })()}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {descripcion === "" ? "Sin descripción" : descripcion}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerActa(acta)}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleManageActa(acta)}
                    >
                      Gestionar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );

  const ActaManagementSheet = () => {
    if (!currentActa) return null;

    const { usuario } = getActaData(currentActa);
    const estado = getEstadoFromActa(currentActa);

    return (
      <Sheet open={managementSheetOpen} onOpenChange={setManagementSheetOpen}>
        <SheetContent className="w-full md:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {getTipoIcon(currentActa.tipo)}
              Gestionar Acta {currentActa.id_acta}
            </SheetTitle>
            <SheetDescription>
              Aquí puedes revisar y actualizar el estado del acta.
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Información del Acta</h3>
                  <p className="text-sm text-muted-foreground">
                    Detalles generales
                  </p>
                </div>
                <Badge className={`${getEstadoBadge(estado)}`}>
                  {getEstadoLabel(estado)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tipo</p>
                  <p className="font-medium">
                    {getTipoLabel(currentActa.tipo)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-medium">
                    {formatFecha(
                      typeof currentActa.fecha === "string"
                        ? currentActa.fecha
                        : currentActa.fecha.toISOString()
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Usuario</p>
                  <p className="font-medium">{usuario}</p>
                </div>

                {currentActa.tipo === "Prestamo" &&
                  currentActa.prestamos[0].fecha_retorno && (
                    <div>
                      <p className="text-sm text-gray-500">
                        Fecha de devolución
                      </p>
                      <p className="font-medium">
                        {formatFecha(currentActa.prestamos[0].fecha_retorno)}
                      </p>
                    </div>
                  )}

                {currentActa.tipo === "Traslado" &&
                  currentActa.traslados[0].sucursales.sedes.regional && (
                    <div>
                      <p className="text-sm text-gray-500">Destino</p>
                      <p className="font-medium">
                        {currentActa.traslados[0].sucursales.sedes.regional} -{" "}
                        {currentActa.traslados[0].sucursales.nombre}
                      </p>
                    </div>
                  )}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">Cambiar estado</h3>
              <div className="grid grid-cols-1 gap-2">
                {currentActa.tipo === "Devolucion" ? (
                  <>
                    {estado !== "Cancelada" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleStatusChange(currentActa, "Cancelada")
                        }
                      >
                        <XCircle className="h-4 w-4 text-red-500" />
                        <Label className="text-[13px]">
                          Marcar como Cancelada
                        </Label>
                      </Button>
                    )}
                    {estado !== "Satisfactoria" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleStatusChange(currentActa, "Satisfactoria")
                        }
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <Label className="text-[13px]">
                          Marcar como Satisfactoria
                        </Label>
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    {estado !== "Vigente" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleStatusChange(currentActa, "Vigente")
                        }
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <Label className="text-[13px]">
                          Marcar como Vigente
                        </Label>
                      </Button>
                    )}
                    {estado !== "Finalizado" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleStatusChange(currentActa, "Finalizado")
                        }
                      >
                        <CheckCircle className="h-4 w-4 text-gray-500" />
                        <Label className="text-[13px]">
                          Marcar como Finalizado
                        </Label>
                      </Button>
                    )}
                    {estado !== "En proceso" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleStatusChange(currentActa, "En proceso")
                        }
                      >
                        <RotateCw className="h-4 w-4 text-blue-500" />
                        <Label className="text-[13px]">
                          Marcar como En Proceso
                        </Label>
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {currentActa.tipo === "Prestamo" && estado !== "Vigente" && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-semibold">
                    Acciones específicas de préstamo
                  </h3>
                  <div className="space-y-2">
                    {estado === "Pendiente" && (
                      <Button
                        className="w-full flex gap-2"
                        // onClick={() => handleRequestReturn(currentActa)}
                      >
                        <AlertCircle className="h-4 w-4" />
                        Solicitar devolución
                      </Button>
                    )}

                    {(estado === "vigente" ||
                      estado === "pendiente_devolucion") && (
                      <Button
                        variant="secondary"
                        className="w-full flex gap-2"
                        // onClick={() => handleProcessReturn(currentActa)}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Procesar devolución
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}

            {estado === "En proceso" && (
              <>
                <Separator />
                <Button
                  variant="destructive"
                  className="w-full"
                  // onClick={() => handleCancelActa(currentActa)}
                >
                  Cancelar acta
                </Button>
              </>
            )}
          </div>

          <SheetFooter className="mt-6">
            <Button
              className="w-full"
              onClick={() => handleVerActa(currentActa)}
            >
              Ver todos los detalles
            </Button>
            {estado === "Pendiente" || estado === "Cancelada" ? null : (
              <Button
                className="w-full"
                onClick={() => generarYDescargarPDF(currentActa)}
              >
                Generar PDF
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#040d50]">Actas Generadas</h1>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("table")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Buscar usuario o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los tipos</SelectItem>
            <SelectItem value="Prestamo">Préstamos</SelectItem>
            <SelectItem value="Traslado">Traslados</SelectItem>
            <SelectItem value="Baja">Bajas</SelectItem>
          </SelectContent>
        </Select>

        <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="En proceso">En proceso</SelectItem>
            <SelectItem value="Vigente">Vigente</SelectItem>
            <SelectItem value="Finalizado">Finalizada</SelectItem>
            <SelectItem value="Cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {actasFiltradas.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium">No se encontraron actas</h3>
          <p className="text-gray-500 mt-1">
            No hay actas generadas, por favor crea una nueva.
          </p>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? <GridView /> : <TableView />}
          <PaginationControls />
        </>
      )}

      <VerActaDialog
        acta={selectedActa}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <ActaManagementSheet />
    </div>
  );
};

export default Actas;
