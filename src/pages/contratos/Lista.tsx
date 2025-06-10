import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileEdit, FileX } from "lucide-react";
import { useContrato } from "./hooks/use-contrato";
import { Contrato } from "./interfaces/contrato";

const ContratoCard = ({ contrato }: { contrato: Contrato }) => {
  const { getBadgeColor } = useContrato();

  const diasRestantes = () => {
    const hoy = new Date();
    const fin = new Date(contrato.fecha_fin);
    const diferencia = fin.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  };

  const restantes = diasRestantes();

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{contrato.nombre}</CardTitle>
          <Badge className={getBadgeColor(contrato.estado)}>
            {contrato.estado.charAt(0).toUpperCase() + contrato.estado.slice(1)}
          </Badge>
        </div>
        <CardDescription>{contrato.empresa_nombre}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Tipo:</span>
            <span className="capitalize">{contrato.tipo_contrato}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Inicio:</span>
            <span>{new Date(contrato.fecha_inicio).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Fin:</span>
            <span>{new Date(contrato.fecha_fin).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Vigencia:</span>
            <span
              className={`${
                restantes < 30
                  ? "text-red-500"
                  : restantes < 90
                  ? "text-yellow-500"
                  : "text-green-500"
              } font-medium`}
            >
              {restantes > 0 ? `${restantes} días` : "Vencido"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button variant="outline" size="sm" className="gap-1">
          <Eye size={16} /> Ver
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <FileEdit size={16} /> Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 text-red-500 hover:text-red-700"
        >
          <FileX size={16} /> Inactivar
        </Button>
      </CardFooter>
    </Card>
  );
};

const ListaContratos = () => {
  const { contratosFiltrados, setFiltro, navigate } = useContrato();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Contratos</h1>
        <Button onClick={() => navigate("/contratos/agregar")}>
          Agregar Contrato
        </Button>
      </div>

      <Tabs defaultValue="todos" className="w-full mb-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto">
          <TabsTrigger value="todos" onClick={() => setFiltro("todos")}>
            Todos
          </TabsTrigger>
          <TabsTrigger value="activos" onClick={() => setFiltro("activos")}>
            Activos
          </TabsTrigger>
          <TabsTrigger value="inactivos" onClick={() => setFiltro("inactivos")}>
            Inactivos
          </TabsTrigger>
          <TabsTrigger
            value="pendientes"
            onClick={() => setFiltro("pendientes")}
          >
            Pendientes
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contratosFiltrados.map((contrato) => (
          <ContratoCard key={contrato.id_contrato} contrato={contrato} />
        ))}

        {contratosFiltrados.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            No se encontraron contratos con el filtro seleccionado.
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaContratos;
