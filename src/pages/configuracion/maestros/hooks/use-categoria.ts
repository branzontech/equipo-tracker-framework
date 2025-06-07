import { useEffect, useState } from "react";
import { Categoria } from "../interfaces/categorias";
import {
  createCategoria,
  deleteCategoria,
  getAllCategorias,
  getCategoriaById,
  updateCategoria,
} from "@/api/axios/categoria.api";
import { toast } from "sonner";

export const useCategoria = () => {
  const [categoria, setCategoria] = useState<Categoria[]>([]);
  const [newCategoria, setNewCategoria] = useState<Categoria>({
    id_categoria: 0,
    nombre: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | null>(null);

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
        }, 4500);
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
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al eliminar la categoria");
    }
  };

  const getById = async (id: number) => {
    const response = await getCategoriaById(id);
    setNewCategoria(response);
  };

  const update = async (id: number, categoria: Categoria) => {
    const response = await updateCategoria(id, categoria);
    if (response.success) {
      toast.success(response.message || "Categoria actualizada exitosamente");
      setTimeout(() => {
        window.location.reload();
      }, 4500);
    }
    return response;
  };

  const handleOpenEditModal = (id: number) => {
    setSelectedCategoriaId(id);
    setShowEditModal(true);
  };

  return {
    categoria,
    newCategoria,
    setNewCategoria,
    addCategoria,
    handleDelete,
    getById,
    handleOpenEditModal,
    selectedCategoriaId,
    setShowEditModal,
    update,
    showEditModal,
  };
};
