import { useEffect, useState } from "react";
import { Tipos } from "../interfaces/tipos";
import {
  createTipo,
  deleteTipo,
  getAllTipos,
  getTipoById,
  updateTipo,
} from "@/api/axios/tipos.api";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export const useTipos = () => {
  const [tipos, setTipos] = useState<Tipos[]>([]);
  const [newTipo, setNewTipo] = useState<Tipos>({
    id_tipo: 0,
    nombre_tipo: "",
    estado: "Activo",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTipoId, setSelectedTipoId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTipos = async () => {
      const tipos = await getAllTipos();
      setTipos(tipos);
    };
    fetchTipos();
  }, []);

  const getById = async (id: number) => {
    const response = await getTipoById(id);
    setNewTipo(response);
  };

  const addTipo = async (tipo: Tipos) => {
    if (!tipo.nombre_tipo) {
      toast.error("Debe ingresar un nombre", {
        icon: icons.error,
      });
      return;
    }

    try {
      const response = await createTipo(tipo);
      if (response.success) {
        toast.success(response.message || "Tipo creado exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al crear el tipo", {
        icon: icons.error,
      });
    }
  };

  const update = async (id: number, tipo: Tipos) => {
    if (!tipo.nombre_tipo) {
      toast.error("Debe ingresar un nombre", {
        icon: icons.error,
      });
      return;
    }
    try {
      const response = await updateTipo(id, tipo);
      if (response.success) {
        toast.success(response.message || "Tipo actualizado exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al actualizar el tipo", {
        icon: icons.error,
      });
    }
  };

  const handleDelete = async (id: number) => {
    ConfirmDialog({
      title: "¿Está seguro de que desea eliminar este tipo?",
      message: "Esta acción no se puede deshacer.",
      onConfirm: async () => {
        try {
          const res = await deleteTipo(id);
          if (res.success) {
            toast.success(res.message || "Tipo eliminado exitosamente", {
              icon: icons.success,
            });
            setTimeout(() => window.location.reload(), 4500);
          } else {
            toast.error(res.message || "No se pudo eliminar el tipo", {
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

  const handleOpenEditModal = (id: number) => {
    setSelectedTipoId(id);
    setShowEditModal(true);
  };

  return {
    tipos,
    setTipos,
    newTipo,
    setNewTipo,
    addTipo,
    getById,
    update,
    handleDelete,
    handleOpenEditModal,
    showEditModal,
    selectedTipoId,
    setShowEditModal,
  };
};
