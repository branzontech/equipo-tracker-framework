
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
import { Sidebar } from "./components/layout/Sidebar";
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen w-full">
            <div className="fixed left-0 top-0 h-screen z-50">
              <Sidebar isCollapsed={isCollapsed} onToggle={setIsCollapsed} />
            </div>
            <div className={`flex-1 overflow-auto transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-64"}`}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/productos/ingreso" element={<IngresoProducto />} />
                <Route path="/productos/lista" element={<ListaInventario />} />
                <Route path="/productos/salidas/prestamos" element={<Salidas />} />
                <Route path="/productos/salidas/traslados" element={<Traslados />} />
                <Route path="/productos/actas" element={<Actas />} />
                <Route path="/configuracion/maestros/sedes" element={<Sedes />} />
                <Route path="/configuracion/maestros/bodegas" element={<Bodegas />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
