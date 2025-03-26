import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";
import ParticleEffect from "@/components/ParticleEffect";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-tr from-[#01242c] to-[#01242c]/70">
      <ParticleEffect />
      
      {/* Blobs difuminados */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#bff036]/30 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#bff036]/20 blur-[100px] translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-white/10 blur-[80px] -translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full bg-[#01242c]/50 blur-[80px] -translate-x-1/2 -translate-y-1/2" />
      
      {/* Contenedor del formulario */}
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-lg shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Smart TI</h1>
          <p className="text-white/80">Gestión de tecnología</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-white" htmlFor="username">Usuario</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#bff036] w-5 h-5" />
              <Input
                id="username"
                className="pl-10 bg-[#01242c]/30 border-[#bff036]/20 text-white placeholder:text-white/50"
                placeholder="Ingrese su usuario"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white" htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#bff036] w-5 h-5" />
              <Input
                id="password"
                type="password"
                className="pl-10 bg-[#01242c]/30 border-[#bff036]/20 text-white placeholder:text-white/50"
                placeholder="Ingrese su contraseña"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="border-[#bff036]/40 data-[state=checked]:bg-[#bff036] data-[state=checked]:text-[#01242c]" />
              <Label htmlFor="remember" className="text-white">Recordarme</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="rememberPassword" className="border-[#bff036]/40 data-[state=checked]:bg-[#bff036] data-[state=checked]:text-[#01242c]" />
              <Label htmlFor="rememberPassword" className="text-white">Recordar contraseña</Label>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
          >
            Ingresar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
