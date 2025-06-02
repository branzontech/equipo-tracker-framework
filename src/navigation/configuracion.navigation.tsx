import Sedes from "@/pages/configuracion/maestros/views/Sedes";
import Bodegas from "@/pages/configuracion/maestros/views/Bodegas";
import Marcas from "@/pages/configuracion/maestros/views/Marcas";
import Perifericos from "@/pages/configuracion/maestros/views/Perifericos";
import PerfilesAcceso from "@/pages/configuracion/maestros/views/PerfilesAcceso";
import Agentes from "@/pages/configuracion/usuarios/Agentes";
import Responsables from "@/pages/configuracion/usuarios/Responsables";
import Permisos from "@/pages/configuracion/usuarios/Permisos";
import Ubicaciones from "@/pages/configuracion/maestros/views/Ubicaciones";

export const configuracionNavigation = [
  { path: "/configuracion/maestros/sedes", element: <Sedes /> },
  { path: "/configuracion/maestros/ubicaciones", element: <Ubicaciones /> },
  { path: "/configuracion/maestros/bodegas", element: <Bodegas /> },
  { path: "/configuracion/maestros/marcas", element: <Marcas /> },
  { path: "/configuracion/maestros/perifericos", element: <Perifericos /> },
  { path: "/configuracion/maestros/perfiles-acceso", element: <PerfilesAcceso /> },
  { path: "/configuracion/usuarios/agentes", element: <Agentes /> },
  { path: "/configuracion/usuarios/responsables", element: <Responsables /> },
  { path: "/configuracion/nivel-acceso", element: <Permisos /> },
];
