
import { Sidebar } from "@/components/layout/Sidebar";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-semibold text-gray-800">Bienvenido a Smart TI</h1>
      </div>
    </div>
  );
};

export default Index;
