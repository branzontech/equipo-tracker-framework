import { useEffect, useState } from "react";
import { Estados } from "../interfaces/estado";
import {
  createEstado,
  getAllEstados,
  getEstadoById,
  updateEstado,
} from "@/api/axios/estado.api";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";

export const useEstado = () => {
  const [estados, setEstados] = useState<Estados[]>([]);
  const [newEstado, setNewEstado] = useState<Estados>({
    id_estado: 0,
    nombre_estado: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEstadoId, setSelectedEstadoId] = useState<number | null>(null);

  useEffect(() => {
    const fetchEstados = async () => {
      const estados = await getAllEstados();
      setEstados(estados);
    };
    fetchEstados();
  }, []);

  const getById = async (id: number) => {
    const response = await getEstadoById(id);
    setNewEstado(response);
  };

  const addEstado = async (estado: Estados) => {
    if (!estado.nombre_estado) {
      toast.error("Debe ingresar un nombre", {
        icon: icons.error,
      });
      return;
    }

    try {
      const response = await createEstado(estado);

      if (response.success) {
        toast.success(response.message || "Estado creado exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al crear el estado", {
        icon: icons.error,
      });
    }
  };

  const update = async (id: number, estado: Estados) => {
    if (!estado.nombre_estado) {
      toast.error("Debe ingresar un nombre", {
        icon: icons.error,
      });
      return;
    }
    try {
      const response = await updateEstado(id, estado);
      if (response.success) {
        toast.success(response.message || "Estado actualizado exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al actualizar el estado", {
        icon: icons.error,
      });
    }
  };

  const handleOpenEditModal = (id: number) => {
    setSelectedEstadoId(id);
    setShowEditModal(true);
  };

  return {
    estados,
    setEstados,
    newEstado,
    setNewEstado,
    addEstado,
    getById,
    update,
    handleOpenEditModal,
    showEditModal,
    selectedEstadoId,
    setShowEditModal,
  };
};
