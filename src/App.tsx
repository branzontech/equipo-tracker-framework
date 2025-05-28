
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import IngresoProducto from "./pages/productos/Ingreso";
import ListaInventario from "./pages/productos/Lista";
import Salidas from "./pages/productos/Salidas";
import Traslados from "./pages/productos/salidas/Traslados";
import Actas from "./pages/productos/Actas";
import Sedes from "./pages/configuracion/maestros/Sedes";
import Bodegas from "./pages/configuracion/maestros/Bodegas";
import Marcas from "./pages/configuracion/maestros/Marcas";
import Perifericos from "./pages/configuracion/maestros/Perifericos";
import PerfilesAcceso from "./pages/configuracion/maestros/PerfilesAcceso";
import Dashboard from "./pages/dashboard/Index";
import IngresoToner from "./pages/toners/Ingreso";
import ExistenciaToners from "./pages/toners/Existencia";
import SalidaToners from "./pages/toners/Salida";
import BajaEquipos from "./pages/productos/BajaEquipos";
import Login from "./pages/auth/Login";
import Agentes from "./pages/configuracion/usuarios/Agentes";
import Responsables from "./pages/configuracion/usuarios/Responsables";
import Permisos from "./pages/configuracion/usuarios/Permisos";
import { Sidebar } from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import { useState } from "react";
import MantenimientosIndex from "./pages/mantenimientos/Index";
import ProgramacionMantenimiento from "./pages/mantenimientos/Programacion";
import EjecucionMantenimiento from "./pages/mantenimientos/Ejecucion";
import DocumentacionMantenimiento from "./pages/mantenimientos/Documentacion";
import AuditoriaMantenimiento from "./pages/mantenimientos/Auditoria";
import HojaDeVida from "./pages/productos/HojaDeVida";
import Devoluciones from "./pages/productos/Devoluciones";
import ListaContratos from "./pages/contratos/Lista";
import AgregarContrato from "./pages/contratos/Agregar";
import ContratosLicencias from "./pages/contratos/tipos/Licencias";
import ContratosProveedores from "./pages/contratos/tipos/Proveedores";
import ContratosSoftware from "./pages/contratos/interfaces/Software";
import { store, persistor } from "./redux/store";


const queryClient = new QueryClient();

const App = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
              path="*"
              element={
                <div className="h-screen flex">
                  <div className="fixed left-0 top-0 h-screen">
                    <Sidebar isCollapsed={isCollapsed} onToggle={setIsCollapsed} />
                  </div>
                  <div className={`flex-1 flex flex-col ${isCollapsed ? "ml-16" : "ml-64"}`}>
                    <Header className="sticky top-0 z-10" />
                    <main className="flex-1 p-6 overflow-auto">
                      <Routes>
                        {/* Update default route to redirect to login if not authenticated */}
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/productos/ingreso" element={<IngresoProducto />} />
                        <Route path="/productos/lista" element={<ListaInventario />} />
                        <Route path="/productos/salidas/prestamos" element={<Salidas />} />
                        <Route path="/productos/salidas/traslados" element={<Traslados />} />
                        <Route path="/productos/devoluciones" element={<Devoluciones />} />
                        <Route path="/productos/actas" element={<Actas />} />
                        <Route path="/baja-equipos" element={<BajaEquipos />} />
                        
                        {/* Rutas de Contratos */}
                        <Route path="/contratos/lista" element={<ListaContratos />} />
                        <Route path="/contratos/agregar" element={<AgregarContrato />} />
                        <Route path="/contratos/tipos/licencias" element={<ContratosLicencias />} />
                        <Route path="/contratos/tipos/proveedores" element={<ContratosProveedores />} />
                        <Route path="/contratos/tipos/software" element={<ContratosSoftware />} />
                        
                        <Route path="/configuracion/maestros/sedes" element={<Sedes />} />
                        <Route path="/configuracion/maestros/bodegas" element={<Bodegas />} />
                        <Route path="/configuracion/maestros/marcas" element={<Marcas />} />
                        <Route path="/configuracion/maestros/perifericos" element={<Perifericos />} />
                        <Route path="/configuracion/maestros/perfiles-acceso" element={<PerfilesAcceso />} />
                        <Route path="/configuracion/usuarios/agentes" element={<Agentes />} />
                        <Route path="/configuracion/usuarios/responsables" element={<Responsables />} />
                        <Route path="/configuracion/nivel-acceso" element={<Permisos />} />
                        <Route path="/toners/ingreso" element={<IngresoToner />} />
                        <Route path="/toners/existencia" element={<ExistenciaToners />} />
                        <Route path="/toners/salida" element={<SalidaToners />} />
                        <Route path="/mantenimientos" element={<MantenimientosIndex />} />
                        <Route path="/mantenimientos/programacion" element={<ProgramacionMantenimiento />} />
                        <Route path="/mantenimientos/ejecucion" element={<EjecucionMantenimiento />} />
                        <Route path="/mantenimientos/documentacion" element={<DocumentacionMantenimiento />} />
                        <Route path="/mantenimientos/auditoria" element={<AuditoriaMantenimiento />} />
                        <Route path="/hojas-vida" element={<HojaDeVida />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
