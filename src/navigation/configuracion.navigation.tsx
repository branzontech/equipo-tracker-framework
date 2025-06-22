import Sedes from "@/pages/configuracion/maestros/views/Sedes";
import Bodegas from "@/pages/configuracion/maestros/views/Tipos";
import Marcas from "@/pages/configuracion/maestros/views/Marcas";
import Perifericos from "@/pages/configuracion/maestros/views/Perifericos";
import PerfilesAcceso from "@/pages/configuracion/maestros/views/PerfilesAcceso";
import Agentes from "@/pages/configuracion/usuarios/Agentes";
import Administradores from "@/pages/configuracion/usuarios/Administradores";
import Permisos from "@/pages/configuracion/usuarios/Permisos";
import Ubicaciones from "@/pages/configuracion/maestros/views/Sucursales";
import Categoria from "@/pages/configuracion/maestros/views/Categoria";
import UpdateSede from "@/pages/configuracion/maestros/views/UpdateSede";
import Auditores from "@/pages/configuracion/usuarios/Auditores";
import Clientes from "@/pages/configuracion/usuarios/Clientes";
import Tipos from "@/pages/configuracion/maestros/views/Tipos";
import Estados from "@/pages/configuracion/maestros/views/Estado";
import Proveedores from "@/pages/configuracion/maestros/views/Proveedores";

export const configuracionNavigation = [
  { path: "/configuracion/maestros/sedes", element: <Sedes /> },
  {
    path: "/configuracion/maestros/update-sede/:id",
    element: (
      <UpdateSede
        open={false}
        onOpenChange={function (open: boolean): void {
          throw new Error("Function not implemented.");
        }}
        id={0}
      />
    ),
  },
  { path: "/configuracion/maestros/sucursales", element: <Ubicaciones /> },
  { path: "/configuracion/maestros/bodegas", element: <Bodegas /> },
  { path: "/configuracion/maestros/marcas", element: <Marcas /> },
  { path: "/configuracion/maestros/perifericos", element: <Perifericos /> },
  { path: "/configuracion/maestros/categorias", element: <Categoria /> },
  { path: "/configuracion/maestros/tipos", element: <Tipos /> },
  { path: "/configuracion/maestros/estados", element: <Estados /> },
  { path: "/configuracion/maestros/proveedores", element: <Proveedores /> },
  {
    path: "/configuracion/maestros/perfiles-acceso",
    element: <PerfilesAcceso />,
  },
  { path: "/configuracion/usuarios/agentes", element: <Agentes /> },
  { path: "/configuracion/usuarios/administradores", element: <Administradores /> },
  { path: "/configuracion/usuarios/auditores", element: <Auditores /> },
  { path: "/configuracion/usuarios/clientes", element: <Clientes /> },
  { path: "/configuracion/nivel-acceso", element: <Permisos /> },
];
