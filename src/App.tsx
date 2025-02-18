
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Dashboard from "./pages/dashboard/Index";
import IngresoToner from "./pages/toners/Ingreso";
import ExistenciaToners from "./pages/toners/Existencia";
import SalidaToners from "./pages/toners/Salida";
import BajaEquipos from "./pages/productos/BajaEquipos";
import Login from "./pages/auth/Login";
import { Sidebar } from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import { useState } from "react";
import MantenimientosIndex from "./pages/mantenimientos/Index";
import ProgramacionMantenimiento from "./pages/mantenimientos/Programacion";
import EjecucionMantenimiento from "./pages/mantenimientos/Ejecucion";
import DocumentacionMantenimiento from "./pages/mantenimientos/Documentacion";
import AuditoriaMantenimiento from "./pages/mantenimientos/Auditoria";
import HojaDeVida from "./pages/productos/HojaDeVida";

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
            <Route
              path="*"
              element={
                <div className="h-screen flex select-none">
                  <div className="fixed left-0 top-0 h-screen">
                    <Sidebar isCollapsed={isCollapsed} onToggle={setIsCollapsed} />
                  </div>
                  <div className={`flex-1 flex flex-col fixed left-[${isCollapsed ? '64px' : '256px'}] right-0 top-0 bottom-0`}>
                    <Header className="sticky top-0 z-10" />
                    <main className="flex-1 p-6 overflow-auto">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/productos/ingreso" element={<IngresoProducto />} />
                        <Route path="/productos/lista" element={<ListaInventario />} />
                        <Route path="/productos/salidas/prestamos" element={<Salidas />} />
                        <Route path="/productos/salidas/traslados" element={<Traslados />} />
                        <Route path="/productos/actas" element={<Actas />} />
                        <Route path="/baja-equipos" element={<BajaEquipos />} />
                        <Route path="/configuracion/maestros/sedes" element={<Sedes />} />
                        <Route path="/configuracion/maestros/bodegas" element={<Bodegas />} />
                        <Route path="/configuracion/maestros/marcas" element={<Marcas />} />
                        <Route path="/configuracion/maestros/perifericos" element={<Perifericos />} />
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
