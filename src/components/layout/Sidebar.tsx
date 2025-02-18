
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChevronFirst,
  ChevronLast,
  Box,
  BarChart3,
  Boxes,
  PackageOpen,
  BookOpen,
  Settings,
  Printer,
  Building2,
  Computer,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function Sidebar({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: (collapsed: boolean) => void }) {
  const menuItems = [
    {
      title: "Dashboard",
      icon: <BarChart3 className="w-4 h-4" />,
      to: "/dashboard",
    },
    {
      title: "Productos",
      icon: <Box className="w-4 h-4" />,
      submenu: [
        {
          title: "Ingreso",
          to: "/productos/ingreso",
        },
        {
          title: "Lista de Inventario",
          to: "/productos/lista",
        },
        {
          title: "Salidas",
          to: "/productos/salidas/prestamos",
        },
        {
          title: "Traslados",
          to: "/productos/salidas/traslados",
        },
        {
          title: "Actas",
          to: "/productos/actas",
        },
      ],
    },
    {
      title: "Baja de Equipos",
      icon: <PackageOpen className="w-4 h-4" />,
      to: "/baja-equipos",
    },
    {
      title: "Mantenimientos",
      icon: <Settings className="w-4 h-4" />,
      to: "/mantenimientos",
    },
    {
      title: "Toners",
      icon: <Printer className="w-4 h-4" />,
      submenu: [
        {
          title: "Ingreso",
          to: "/toners/ingreso",
        },
        {
          title: "Existencia",
          to: "/toners/existencia",
        },
        {
          title: "Salida",
          to: "/toners/salida",
        },
      ],
    },
    {
      title: "Configuración",
      icon: <Settings className="w-4 h-4" />,
      submenu: [
        {
          title: "Sedes",
          to: "/configuracion/maestros/sedes",
          icon: <Building2 className="w-4 h-4" />,
        },
        {
          title: "Bodegas",
          to: "/configuracion/maestros/bodegas",
          icon: <Boxes className="w-4 h-4" />,
        },
        {
          title: "Marcas",
          to: "/configuracion/maestros/marcas",
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          title: "Periféricos",
          to: "/configuracion/maestros/perifericos",
          icon: <Computer className="w-4 h-4" />,
        },
      ],
    },
  ];

  return (
    <aside className={`h-full bg-white border-r p-4 ${isCollapsed ? "w-16" : "w-64"} transition-all duration-300`}>
      <nav className="h-full flex flex-col gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="self-end"
          onClick={() => onToggle(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronLast className="w-4 h-4" />
          ) : (
            <ChevronFirst className="w-4 h-4" />
          )}
        </Button>

        {menuItems.map((item, idx) => {
          if (item.submenu) {
            return (
              <NavigationMenu key={idx} orientation="vertical">
                <NavigationMenuList className="flex-col items-start">
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={`w-full justify-start gap-2 px-2 ${
                        isCollapsed ? "justify-center" : ""
                      }`}
                    >
                      {item.icon}
                      {!isCollapsed && item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-48 gap-1 p-2">
                        {item.submenu.map((subItem, subIdx) => (
                          <li key={subIdx}>
                            <NavigationMenuLink asChild>
                              <NavLink
                                to={subItem.to}
                                className={({ isActive }) =>
                                  `block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                                    isActive ? "bg-accent" : ""
                                  }`
                                }
                              >
                                <div className="flex items-center gap-2">
                                  {subItem.icon}
                                  <span>{subItem.title}</span>
                                </div>
                              </NavLink>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            );
          }

          return (
            <NavLink
              key={idx}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-2 rounded hover:bg-accent ${
                  isActive ? "bg-accent" : ""
                } ${isCollapsed ? "justify-center" : ""}`
              }
            >
              {item.icon}
              {!isCollapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
