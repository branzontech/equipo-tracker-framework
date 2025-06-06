/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Computer
} from "lucide-react";
import { menuItems } from "@/components/layout/interfaces/menuItems";
import { logout } from "@/redux/authSlice";
import { useDispatch } from "react-redux";


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
          {Icon && <Icon className={`w-5 h-5 ${!isCollapsed ? "mr-2" : ""} text-white`} />}
          {!isCollapsed && (
            <span className="flex-1 whitespace-nowrap">{item.title}</span>
          )}
        </div>
        {!isCollapsed && hasSubmenu && (
          <ChevronRight
            className={`w-4 h-4 transition-transform duration-200 text-white ${
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
  const dispatch = useDispatch();

  useEffect(() => {
    if (hovering && isCollapsed) {
      onToggle(false);
    }
  }, [hovering, isCollapsed, onToggle]);

  const handleLogout = () => {
    dispatch(logout());
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
          <Computer className="w-6 h-6 text-white flex-shrink-0" />
          <span className="text-xl font-semibold text-white tracking-wider whitespace-nowrap overflow-hidden">SMART TI</span>
        </div>
        <button
          onClick={() => onToggle(!isCollapsed)}
          className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0 ${isCollapsed ? 'ml-auto' : ''}`}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-white" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-white" />
          )}
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <nav className="h-full p-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20 scrollbar-hide">
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
          <LogOut className={`w-5 h-5 ${!isCollapsed ? "mr-2" : ""} text-white`} />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
};

