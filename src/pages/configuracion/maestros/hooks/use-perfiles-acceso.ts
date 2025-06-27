import { useEffect, useState } from "react";
import { PerfilAcceso } from "../interfaces/perfilAcceso";
import {
  createPerfilesAcceso,
  deletePerfilesAcceso,
  getPerfilesAcceso,
  getPerfilesAccesoById,
  updatePerfilesAcceso,
} from "@/api/axios/perfilesAcceso.api";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export const usePerfilesAcceso = () => {
  const [perfilesAcceso, setPerfilesAcceso] = useState<PerfilAcceso[]>([]);
  const [newPerfilAcceso, setNewPerfilAcceso] = useState<PerfilAcceso>({
    id: 0,
    nombre_perfil: "",
    estado: "Activo",
    descripcion: "",
    fecha_creacion: new Date(),
  });
  const [isOpen, setIsOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPerfilId, setSelectedPerfilId] = useState<number | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await getPerfilesAcceso();
      setPerfilesAcceso(Array.isArray(res) ? res : []);
    };
    fetch();
  }, []);

  const handleCreatePerfil = async (perfil: PerfilAcceso) => {
    if (!perfil.nombre_perfil) {
      toast.error("El nombre del perfil no puede estar vacío", {
        icon: icons.error,
      });
      return;
    }

    if (!perfil.descripcion) {
      toast.error("La descripción del perfil no puede estar vacía", {
        icon: icons.error,
      });
      return;
    }

    try {
      const res = await createPerfilesAcceso(perfil);
      if (res.success) {
        toast.success("Perfil de acceso creado exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
    } catch (error) {
      toast.error("Error al crear el perfil de acceso", {
        icon: icons.error,
      });
    }
  };

  const getById = async (id: number) => {
    try {
      const res = await getPerfilesAccesoById(id);
      setNewPerfilAcceso(res);
    } catch (error) {
      toast.error("Error al obtener el perfil de acceso", {
        icon: icons.error,
      });
    }
  };

  const update = async (id: number, perfilAcceso: PerfilAcceso) => {
    try {
      const res = await updatePerfilesAcceso(id, perfilAcceso);
      if (res.success) {
        toast.success("Perfil de acceso actualizado exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
    } catch (error) {
      toast.error("Error al actualizar el perfil de acceso", {
        icon: icons.error,
      });
    }
  };

  const handleDelete = async (id: number) => {
    ConfirmDialog({
      title: "¿Está seguro de que desea eliminar este perfil de acceso?",
      message: "Esta acción no se puede deshacer.",
      onConfirm: async () => {
        try {
          const res = await deletePerfilesAcceso(id);
          if (res.success) {
            toast.success(
              res.message || "Perfil de acceso eliminado exitosamente",
              {
                icon: icons.success,
              }
            );
            setTimeout(() => window.location.reload(), 4500);
          } else {
            toast.error(
              res.message || "No se pudo eliminar el perfil de acceso",
              {
                icon: icons.error,
              }
            );
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
    setSelectedPerfilId(id);
    setShowEditModal(true);
  };

  return {
    perfilesAcceso,
    newPerfilAcceso,
    setNewPerfilAcceso,
    isOpen,
    setIsOpen,
    handleCreatePerfil,
    getById,
    update,
    showEditModal,
    handleOpenEditModal,
    selectedPerfilId,
    setShowEditModal,
    handleDelete
  };
};
