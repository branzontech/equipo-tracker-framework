/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Perifericos } from "../interfaces/periferico";
import {
  createPeriferico,
  deletePeriferico,
  getPerifericoById,
  getPerifericos,
  updatePeriferico,
} from "@/api/axios/periferico.api";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export const usePeriferico = () => {
  const [perifericos, setPerifericos] = useState<Perifericos[]>([]);
  const [newPeriferico, setNewPeriferico] = useState<Perifericos>({
    id_periferico: 0,
    nombre: "",
    tipo: "",
    estado: null,
    equipo_asociado_id: 0,
    equipos: null,
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPerifericoId, setSelectedPerifericoId] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchPerifericos = async () => {
      try {
        const response = await getPerifericos();
        const perifericos = response.map((periferico: any) => ({
          ...periferico,
          nombre_equipo: periferico.equipos?.nombre_equipo,
        }));
        setPerifericos(perifericos);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchPerifericos();
  }, []);

  const handleCreatePeriferico = async (periferico: Perifericos) => {
    if (!periferico.nombre) {
      toast.error("Debe seleccionar un nombre");
      return;
    }

    if (periferico.estado === undefined || periferico.estado === null) {
      toast.error("Debe seleccionar un estado");
      return;
    }

    if (!periferico.tipo) {
      toast.error("Debe seleccionar un tipo");
      return;
    }

    if (!periferico.equipo_asociado_id) {
      toast.error("Debe seleccionar un equipo");
      return;
    }

    try {
      const response = await createPeriferico(periferico);
      if (response.success) {
        toast.success(response.message || "Periferico creado exitosamente");
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeletePeriferico = async (id: number) => {
    ConfirmDialog({
      title: "¿Está seguro de que desea eliminar este periferico?",
      message: "Esta acción no se puede deshacer.",
      onConfirm: async () => {
        try {
          const res = await deletePeriferico(id);
          if (res.success) {
            toast.success(res.message || "Periferico eliminado exitosamente");
            setTimeout(() => window.location.reload(), 4500);
          } else {
            toast.error(res.message || "No se pudo eliminar el periferico");
          }
        } catch (error: any) {
          toast.error(error.message || "Error al eliminar el periferico");
        }
      },
    });
  };

  const getById = async (id: number) => {
    const response = await getPerifericoById(id);
    setNewPeriferico(response);
  };

  const update = async (id: number, periferico: Perifericos) => {
    try {
      const response = await updatePeriferico(id, periferico);
      if (response.success) {
        toast.success(
          response.message || "Periferico actualizado exitosamente"
        );
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleOpenEditModal = (id: number) => {
    setSelectedPerifericoId(id);
    setShowEditModal(true);
  };

  return {
    handleCreatePeriferico,
    handleDeletePeriferico,
    perifericos,
    setPerifericos,
    newPeriferico,
    setNewPeriferico,
    getById,
    update,
    showEditModal,
    handleOpenEditModal,
    setShowEditModal,
    selectedPerifericoId,
  };
};
