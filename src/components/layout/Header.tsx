import { useState, useEffect } from "react";
import { BellRing, Settings, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { HeaderProps } from "@/components/layout/interfaces/header";
// import { RootState } from "../../redux/store"; 
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

const Header = ({ className = "" }: HeaderProps) => {
  // const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  // const user = useSelector((state: RootState) => state.auth.user);

  // useEffect(() => {
  //   if (!user) navigate("/login");
  // }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header
      className={`h-16 bg-white shadow-sm px-6 flex items-center justify-between ${className}`}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="w-5 h-5" />
        <span className="font-medium">
          {format(currentTime, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
        </span>
        <span className="font-bold ml-2">
          {format(currentTime, "HH:mm:ss")}
        </span>
      </div>

      <div></div>

      {/* <div className="flex items-center gap-4">
        <button className="relative hover:bg-gray-100 p-2 rounded-full transition-colors">
          <BellRing className="w-5 h-5 text-gray-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="hover:bg-gray-100 p-2 rounded-full transition-colors">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div> */}

      {/* <div className="flex items-center gap-2">
        <img
          src="https://avatars.githubusercontent.com/u/10198937?v=4"
          alt="Username"
          className="w-8 h-8 rounded-full"
        />
        <span className="font-medium">{user?.nombre}</span>
      </div> */}
    </header>
  );
};

export default Header;
