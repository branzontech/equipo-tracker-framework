
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DynamicProductForm } from "@/components/inventory/DynamicProductForm";

const IngresoProducto = () => {
  const navigate = useNavigate();

  const handleVolver = () => {
    navigate('/productos/lista');
  };

  return (
    <div className="relative w-full overflow-x-hidden">
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-4 max-w-full">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={handleVolver}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-2xl font-bold text-[#040d50]">Ingreso de Producto</h1>
        </div>
        
        <DynamicProductForm />
      </div>
    </div>
  );
};

export default IngresoProducto;
