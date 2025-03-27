import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Printer,
  Database,
  Cpu,
  Shield,
  RotateCcw,
  ScrollText,
  BookCheck,
  Building,
  Cog,
  AppWindow,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
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
      { 
        title: "Devoluciones", 
        icon: RotateCcw, 
        path: "/productos/devoluciones" 
      },
      { title: "Actas Generadas", icon: FileText, path: "/productos/actas" },
    ],
  },
  {
    title: "Contratos",
    icon: ScrollText,
    path: "/contratos",
    submenu: [
      { title: "Lista de Contratos", icon: ClipboardList, path: "/contratos/lista" },
      { title: "Agregar Contrato", icon: ArrowDownToLine, path: "/contratos/agregar" },
      { 
        title: "Tipos de Contratos", 
        icon: BookCheck, 
        path: "/contratos/tipos",
        submenu: [
          { title: "Licencias", icon: AppWindow, path: "/contratos/tipos/licencias" },
          { title: "Proveedores", icon: Building, path: "/contratos/tipos/proveedores" },
          { title: "Software", icon: Cog, path: "/contratos/tipos/software" },
        ]
      },
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
    path: "/productos/actas",
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
          { title: "Perfiles de Acceso", icon: Shield, path: "/configuracion/maestros/perfiles-acceso" },
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
      {
        title: "Nivel de Acceso",
        icon: Shield,
        path: "/configuracion/nivel-acceso",
      },
    ],
  },
  {
    title: "Toners",
    icon: Printer,
    path: "/toners",
    submenu: [
      { title: "Ingreso", icon: ArrowDownToLine, path: "/toners/ingreso" },
      { title: "Salida", icon: ArrowUpFromLine, path: "/toners/salida" },
      { title: "Existencia", icon: Database, path: "/toners/existencia" },
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
  const navigate = useNavigate();

  const Icon = item.icon;

  const handleClick = (e: React.MouseEvent) => {
    if (hasSubmenu) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="mb-1">
      <div
        className={`flex items-center px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer ${
          isOpen ? "bg-white/10" : ""
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center flex-1">
          {Icon && <Icon className={`w-5 h-5 ${!isCollapsed ? "mr-2" : ""} text-[#bff036]`} />}
          {!isCollapsed && (
            <span className="flex-1 whitespace-nowrap">{item.title}</span>
          )}
        </div>
        {!isCollapsed && hasSubmenu && (
          <ChevronRight
            className={`w-4 h-4 transition-transform duration-200 text-[#bff036] ${
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
  const [hovering, setHovering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hovering && isCollapsed) {
      onToggle(false);
    }
  }, [hovering, isCollapsed, onToggle]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div
      className={`h-screen bg-[#01242c] border-r border-white/10 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } flex flex-col`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        if (!isCollapsed) {
          onToggle(true);
        }
      }}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
        <div className={`flex items-center gap-2 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
          <Cpu className="w-6 h-6 text-[#bff036] flex-shrink-0" />
          <span className="text-xl font-semibold text-white tracking-wider whitespace-nowrap overflow-hidden">SMART TI</span>
        </div>
        <button
          onClick={() => onToggle(!isCollapsed)}
          className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0 ${isCollapsed ? 'ml-auto' : ''}`}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-[#bff036]" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-[#bff036]" />
          )}
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <nav className="h-full p-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20">
          {menuItems.map((item) => (
            <MenuItem key={item.path} item={item} isCollapsed={isCollapsed} />
          ))}
        </nav>
      </div>
      <div className="p-2 border-t border-white/10 flex-shrink-0">
        <button 
          className="w-full flex items-center px-3 py-2 text-white 
            bg-[#01242c] 
            hover:bg-white/10 
            rounded-lg transition-all duration-200"
          onClick={handleLogout}
        >
          <LogOut className={`w-5 h-5 ${!isCollapsed ? "mr-2" : ""} text-[#bff036]`} />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
};
