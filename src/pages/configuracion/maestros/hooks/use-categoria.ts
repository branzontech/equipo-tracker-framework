import { useEffect, useState } from "react";
import { Categoria } from "../interfaces/categorias";
import {
  createCategoria,
  deleteCategoria,
  getAllCategorias,
} from "@/api/axios/categoria.api";

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
        window.location.reload();
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoria?")) {
      return;
    }
    try {
      const response = await deleteCategoria(id);
      if (response.success) {
        window.location.reload();
      }
      return response;
    } catch (error) {
      console.log(error);
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
