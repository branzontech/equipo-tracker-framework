
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Share2,
  FileCog,
  Settings,
  Wrench,
  FileText,
  History,
  ChevronLeft,
  ChevronRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileOutput,
  Building2,
  Box,
  Tag,
  Users,
  Laptop2,
  Cable,
  UserCog,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    submenu: [
      { title: "Total de equipos", path: "/dashboard/total-equipos" },
      { title: "Mantenimientos vencidos", path: "/dashboard/mant-vencidos" },
      { title: "Mantenimientos ejecutados", path: "/dashboard/mant-ejecutados" },
      { title: "Sedes", path: "/dashboard/sedes" },
      { title: "Bodegas", path: "/dashboard/bodegas" },
      { title: "Marcas", path: "/dashboard/marcas" },
    ],
  },
  {
    title: "Lista de Inventario",
    icon: ClipboardList,
    path: "/inventario",
  },
  {
    title: "Productos",
    icon: Package,
    path: "/productos",
    submenu: [
      { title: "Ingreso", icon: ArrowDownToLine, path: "/productos/ingreso" },
      { title: "Salidas", icon: ArrowUpFromLine, path: "/productos/salidas" },
    ],
  },
  {
    title: "Prestamos",
    icon: Share2,
    path: "/prestamos",
  },
  {
    title: "Traslados",
    icon: Share2,
    path: "/traslados",
  },
  {
    title: "Baja de Equipos",
    icon: FileOutput,
    path: "/baja-equipos",
  },
  {
    title: "Actas",
    icon: FileText,
    path: "/actas",
  },
  {
    title: "Configuración",
    icon: Settings,
    path: "/configuracion",
    submenu: [
      { title: "Maestros", icon: FileCog, path: "/configuracion/maestros" },
      { title: "Sedes", icon: Building2, path: "/configuracion/sedes" },
      { title: "Bodegas", icon: Box, path: "/configuracion/bodegas" },
      { title: "Marcas", icon: Tag, path: "/configuracion/marcas" },
      { title: "Periféricos", icon: Cable, path: "/configuracion/perifericos" },
      { title: "Accesorios", icon: Laptop2, path: "/configuracion/accesorios" },
      {
        title: "Categorias",
        icon: Tag,
        path: "/configuracion/categorias",
        submenu: [
          { title: "Usuarios", icon: Users, path: "/configuracion/categorias/usuarios" },
          { title: "Agentes", icon: UserCog, path: "/configuracion/categorias/agentes" },
        ],
      },
    ],
  },
  {
    title: "Mantenimientos",
    icon: Wrench,
    path: "/mantenimientos",
  },
  {
    title: "Hojas de Vida Equipos",
    icon: FileText,
    path: "/hojas-vida",
  },
  {
    title: "Trazabilidad de Inventario",
    icon: History,
    path: "/trazabilidad",
  },
];

const MenuItem = ({ item, isCollapsed }: { item: any; isCollapsed: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-1">
      <Link
        to={item.path}
        className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
        onClick={() => item.submenu && setIsOpen(!isOpen)}
      >
        <item.icon className="w-5 h-5 mr-2" />
        {!isCollapsed && (
          <span className="flex-1 whitespace-nowrap">{item.title}</span>
        )}
        {!isCollapsed && item.submenu && (
          <ChevronRight
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-90" : ""
            }`}
          />
        )}
      </Link>
      {!isCollapsed && isOpen && item.submenu && (
        <div className="ml-4 mt-1 space-y-1">
          {item.submenu.map((subItem: any) => (
            <MenuItem key={subItem.path} item={subItem} isCollapsed={isCollapsed} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`min-h-screen bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <span className="text-xl font-semibold text-gray-800">Smart TI</span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => (
          <MenuItem key={item.path} item={item} isCollapsed={isCollapsed} />
        ))}
      </nav>
    </div>
  );
};
