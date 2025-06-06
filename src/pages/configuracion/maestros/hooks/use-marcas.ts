import { useEffect, useState } from "react";
import { Marca } from "../interfaces/marcas";
import { getAllMarcas, createMarca, deleteMarca } from "@/api/axios/marcas.api";
import { toast } from "sonner";

export const useMarcas = () => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [newMarca, setNewMarca] = useState<Marca>({
    id_marca: 0,
    nombre: "",
  });

  useEffect(() => {
    const fetchMarcas = async () => {
      const marcas = await getAllMarcas();
      setMarcas(marcas);
    };
    fetchMarcas();
  }, []);

  const addMarca = async (marca: Marca) => {
    try {
      const response = await createMarca(marca);
      if (response.success) {
        toast.success(response.message || "Marca creada exitosamente");
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al crear la marca");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar esta marca?")) {
      return;
    }
    try {
      const response = await deleteMarca(id);
      if (response.success) {
        toast.success(response.message || "Marca eliminada exitosamente");
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al eliminar la marca");
    }
  };

  return {
    marcas,
    newMarca,
    setNewMarca,
    addMarca,
    handleDelete
  };
};
