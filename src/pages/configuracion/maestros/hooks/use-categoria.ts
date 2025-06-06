import { useEffect, useState } from "react";
import { Categoria } from "../interfaces/categorias";
import {
  createCategoria,
  deleteCategoria,
  getAllCategorias,
} from "@/api/axios/categoria.api";
import { toast } from "sonner";

export const useCategoria = () => {
  const [categoria, setCategoria] = useState<Categoria[]>([]);
  const [newCategoria, setNewCategoria] = useState<Categoria>({
    id_categoria: 0,
    nombre: "",
  });

  useEffect(() => {
    const fetchCategorias = async () => {
      const categorias = await getAllCategorias();
      setCategoria(categorias);
    };
    fetchCategorias();
  }, []);

  const addCategoria = async (categoria: Categoria) => {
    try {
      const response = await createCategoria(categoria);
      if (response.success) {
        toast.success(response.message || "Categoria creada exitosamente");
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al crear la categoria");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoria?")) {
      return;
    }
    try {
      const response = await deleteCategoria(id);
      if (response.success) {
        toast.success(response.message || "Categoria eliminada exitosamente");
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al eliminar la categoria");
    }
  };
  return {
    categoria,
    newCategoria,
    setNewCategoria,
    addCategoria,
    handleDelete,
  };
};
