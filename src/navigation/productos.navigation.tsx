import IngresoProducto from "@/pages/productos/Ingreso";
import ListaInventario from "@/pages/productos/Lista";
import Salidas from "@/pages/productos/Salidas";
import Traslados from "@/pages/productos/salidas/Traslados";
import Actas from "@/pages/productos/Actas";
import BajaEquipos from "@/pages/productos/BajaEquipos";
import Devoluciones from "@/pages/productos/Devoluciones";
import HojaDeVida from "@/pages/productos/HojaDeVida";

export const productosNavigation = [
  { path: "/productos/ingreso", element: <IngresoProducto /> },
  { path: "/productos/lista", element: <ListaInventario /> },
  { path: "/productos/salidas/prestamos", element: <Salidas /> },
  { path: "/productos/salidas/traslados", element: <Traslados /> },
  { path: "/productos/actas", element: <Actas /> },
  { path: "/productos/devoluciones", element: <Devoluciones /> },
  { path: "/baja-equipos", element: <BajaEquipos /> },
  { path: "/hojas-vida", element: <HojaDeVida /> },
];
