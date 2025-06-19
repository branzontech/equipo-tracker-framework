import IngresoProducto from "@/pages/productos/views/Ingreso";
import ListaInventario from "@/pages/productos/views/Lista";
import Salidas from "@/pages/productos/views/Salidas";
import Traslados from "@/pages/productos/salidas/Traslados";
import Actas from "@/pages/productos/views/Actas";
import BajaEquipos from "@/pages/productos/views/BajaEquipos";
import Devoluciones from "@/pages/productos/views/Devoluciones";
import HojaDeVida from "@/pages/productos/views/HojaDeVida";
import EditEquipo from "@/pages/productos/views/EditEquipo";

export const productosNavigation = [
  { path: "/productos/ingreso", element: <IngresoProducto /> },
  { path: "/productos/lista", element: <ListaInventario /> },
  { path: "/productos/salidas/prestamos", element: <Salidas /> },
  { path: "/productos/salidas/traslados", element: <Traslados /> },
  { path: "/productos/actas", element: <Actas /> },
  { path: "/productos/devoluciones", element: <Devoluciones /> },
  { path: "/baja-equipos", element: <BajaEquipos /> },
  { path: "/hojas-vida/:nroSeries", element: <HojaDeVida /> },
  { path: "/productos/edit/:nroSeries", element: <EditEquipo /> },
];
