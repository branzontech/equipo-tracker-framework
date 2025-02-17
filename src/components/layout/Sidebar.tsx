
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
      { title: "Total de equipos", icon: Package, path: "/dashboard/total-equipos" },
      { title: "Mantenimientos vencidos", icon: Wrench, path: "/dashboard/mant-vencidos" },
      { title: "Mantenimientos ejecutados", icon: FileText, path: "/dashboard/mant-ejecutados" },
      { title: "Sedes", icon: Building2, path: "/dashboard/sedes" },
      { title: "Bodegas", icon: Box, path: "/dashboard/bodegas" },
      { title: "Marcas", icon: Tag, path: "/dashboard/marcas" },
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
      { 
        title: "Salidas", 
        icon: ArrowUpFromLine, 
        path: "/productos/salidas",
        submenu: [
          { title: "Préstamos", icon: Share2, path: "/productos/salidas/prestamos" },
          { title: "Traslados", icon: Share2, path: "/productos/salidas/traslados" },
        ]
      },
      { title: "Actas Generadas", icon: FileText, path: "/productos/actas" },
    ],
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
      { 
        title: "Maestros", 
        icon: FileCog, 
        path: "/configuracion/maestros",
        submenu: [
          { title: "Sedes", icon: Building2, path: "/configuracion/maestros/sedes" },
          { title: "Bodegas", icon: Box, path: "/configuracion/maestros/bodegas" },
          { title: "Marcas", icon: Tag, path: "/configuracion/maestros/marcas" },
          { title: "Periféricos", icon: Cable, path: "/configuracion/maestros/perifericos" },
          { title: "Accesorios", icon: Laptop2, path: "/configuracion/maestros/accesorios" },
          { title: "Categorias", icon: Tag, path: "/configuracion/maestros/categorias" },
        ]
      },
      {
        title: "Usuarios",
        icon: Users,
        path: "/configuracion/usuarios",
        submenu: [
          { title: "Agentes", icon: UserCog, path: "/configuracion/usuarios/agentes" },
          { title: "Responsables", icon: UserCog, path: "/configuracion/usuarios/responsables" },
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

  const Icon = item.icon;

  return (
    <div className="mb-1">
      <div
        className={`flex items-center px-3 py-2 text-gray-100 hover:bg-[#3d2a40] rounded-lg transition-all duration-200 cursor-pointer ${
          isOpen ? "bg-[#3d2a40]" : ""
        }`}
        onClick={() => hasSubmenu && setIsOpen(!isOpen)}
      >
        <Link
          to={item.path}
          className="flex items-center flex-1"
          onClick={(e) => hasSubmenu && e.preventDefault()}
        >
          {Icon && <Icon className={`w-5 h-5 ${!isCollapsed ? "mr-2" : ""} text-[#E6E8E6]`} />}
          {!isCollapsed && (
            <span className="flex-1 whitespace-nowrap">{item.title}</span>
          )}
        </Link>
        {!isCollapsed && hasSubmenu && (
          <ChevronRight
            className={`w-4 h-4 transition-transform duration-200 text-[#E6E8E6] ${
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
      className={`h-screen bg-[#2d1e2f] border-r border-[#3d2a40] transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-[#3d2a40]">
        {!isCollapsed && (
          <span className="text-xl font-semibold text-[#E6E8E6]">Smart TI</span>
        )}
        <button
          onClick={() => onToggle(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-[#3d2a40] transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-[#E6E8E6]" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-[#E6E8E6]" />
          )}
        </button>
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <MenuItem key={item.path} item={item} isCollapsed={isCollapsed} />
        ))}
      </nav>
      <div className="p-2 border-t border-[#3d2a40]">
        <button className="w-full flex items-center px-3 py-2 text-gray-100 hover:bg-[#3d2a40] rounded-lg transition-all duration-200">
          <LogOut className={`w-5 h-5 ${!isCollapsed ? "mr-2" : ""} text-[#E6E8E6]`} />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
};
