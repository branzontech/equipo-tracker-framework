import ListaContratos from "@/pages/contratos/Lista";
import AgregarContrato from "@/pages/contratos/Agregar";
import ContratosLicencias from "@/pages/contratos/tipos/Licencias";
import ContratosProveedores from "@/pages/contratos/tipos/Proveedores";
import ContratosSoftware from "@/pages/contratos/interfaces/Software";

export const contratosNavigation = [
  { path: "/contratos/lista", element: <ListaContratos /> },
  { path: "/contratos/agregar", element: <AgregarContrato /> },
  { path: "/contratos/tipos/licencias", element: <ContratosLicencias /> },
  { path: "/contratos/tipos/proveedores", element: <ContratosProveedores /> },
  { path: "/contratos/tipos/software", element: <ContratosSoftware /> },
];
