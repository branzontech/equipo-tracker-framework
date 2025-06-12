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
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { icons } from "@/components/interfaces/icons";

export const useCategoria = () => {
  const [categoria, setCategoria] = useState<Categoria[]>([]);
  const [newCategoria, setNewCategoria] = useState<Categoria>({
    id_categoria: 0,
    nombre: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchCategorias = async () => {
      const categorias = await getAllCategorias();
      setCategoria(categorias);
    };
    fetchCategorias();
  }, []);

  const addCategoria = async (categoria: Categoria) => {
    if (!categoria.nombre) {
      toast.error("Debe ingresar un nombre", {
        icon: icons.error,
      });
      return;
    }

    try {
      const response = await createCategoria(categoria);
      if (response.success) {
        toast.success(response.message || "Categoria creada exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al crear la categoria", {
        icon: icons.error,
      });
    }
  };

  const handleDelete = async (id: number) => {
    ConfirmDialog({
      title: "¿Está seguro de que desea eliminar esta categoria?",
      message: "Esta acción no se puede deshacer.",
      onConfirm: async () => {
        try {
          const res = await deleteCategoria(id);
          if (res.success) {
            toast.success(res.message || "Categoria eliminada correctamente", {
              icon: icons.success,
            });
            setTimeout(() => window.location.reload(), 4500);
          } else {
            toast.error(res.message || "No se pudo eliminar la categoria", {
              icon: icons.error,
            });
          }
        } catch (error) {
          toast.error(error.message, {
            icon: icons.error,
          });
        }
      },
    });
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
