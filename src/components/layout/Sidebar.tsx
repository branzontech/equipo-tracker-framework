
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
  LogOut,
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
    path: "/productos/lista",
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
  const hasSubmenu = item.submenu && item.submenu.length > 0;

  return (
    <div className="mb-1">
      <div
        className={`flex items-center px-3 py-2 text-gray-100 hover:bg-[#0a1668] rounded-lg transition-all duration-200 cursor-pointer ${
          isOpen ? "bg-[#0a1668]" : ""
        }`}
        onClick={() => hasSubmenu && setIsOpen(!isOpen)}
      >
        <Link
          to={!hasSubmenu ? item.path : "#"}
          className="flex items-center flex-1"
          onClick={(e) => hasSubmenu && e.preventDefault()}
        >
          <item.icon className={`w-5 h-5 ${!isCollapsed ? "mr-2" : ""} text-[#F49F1C]`} />
          {!isCollapsed && (
            <span className="flex-1 whitespace-nowrap">{item.title}</span>
          )}
        </Link>
        {!isCollapsed && hasSubmenu && (
          <ChevronRight
            className={`w-4 h-4 transition-transform duration-200 text-[#F49F1C] ${
              isOpen ? "rotate-90" : ""
            }`}
          />
        )}
      </div>
      {!isCollapsed && isOpen && hasSubmenu && (
        <div className="ml-4 mt-1 space-y-1">
          {item.submenu.map((subItem: any) => (
            <MenuItem key={subItem.path} item={subItem} isCollapsed={isCollapsed} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar = ({ 
  isCollapsed, 
  onToggle 
}: { 
  isCollapsed: boolean; 
  onToggle: (isCollapsed: boolean) => void;
}) => {
  return (
    <div
      className={`h-screen bg-[#040d50] border-r border-[#0a1668] transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-[#0a1668]">
        {!isCollapsed && (
          <span className="text-xl font-semibold text-[#F49F1C]">Smart TI</span>
        )}
        <button
          onClick={() => onToggle(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-[#0a1668] transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-[#F49F1C]" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-[#F49F1C]" />
          )}
        </button>
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <MenuItem key={item.path} item={item} isCollapsed={isCollapsed} />
        ))}
      </nav>
      <div className="p-2 border-t border-[#0a1668]">
        <button className="w-full flex items-center px-3 py-2 text-gray-100 hover:bg-[#0a1668] rounded-lg transition-all duration-200">
          <LogOut className={`w-5 h-5 ${!isCollapsed ? "mr-2" : ""} text-[#F49F1C]`} />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
};
