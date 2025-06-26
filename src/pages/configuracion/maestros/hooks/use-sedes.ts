/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getSedes,
  createSede,
  deleteSede,
  getSedeById,
  updateSede,
} from "@/api/axios/sedes.api";
import { useEffect, useState } from "react";
import { Sede } from "../interfaces/sedes";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { icons } from "@/components/interfaces/icons";

export const useSedes = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [newSede, setNewSede] = useState<Sede>({
    id_sede: 0,
    nombre: "",
    estado: null,
    sucursales: null,
    usuario_sede: [],
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSedeId, setSelectedSedeId] = useState<number | null>(null);

  useEffect(() => {
    const fetchSedesCount = async () => {
      try {
        const sedes = await getSedes();
        setSedes(sedes);

        if (Array.isArray(sedes)) {
          setCount(sedes.length);
        } else {
          throw new Error("Formato inesperado en la respuesta");
        }
      } catch (err: any) {
        throw new Error(
          err.response?.data?.error || "Sedes no pudieron ser obtenidas"
        );
      }
    };
    fetchSedesCount();
  }, []);

  const create = async (sede: Sede) => {
    if (!sede.nombre) {
      toast.error("Debe ingresar un nombre", {
        icon: icons.error,
      });
      return;
    }

    if (
      !sede.usuario_sede ||
      sede.usuario_sede.length === 0 ||
      sede.usuario_sede.some((u) => !u.usuarios || !u.usuarios.id_usuario)
    ) {
      toast.error("Debe seleccionar al menos un usuario válido", {
        icon: icons.error,
      });
      return;
    }

    if (sede.estado === undefined || sede.estado === null) {
      toast.error("Debe seleccionar un estado", {
        icon: icons.error,
      });
      return;
    }

    try {
      const response = await createSede(sede);
      if (response.success) {
        toast.success(response.message || "Sede creada exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return { response };
    } catch (error) {
      toast.error(error.message || "Error al crear la sede", {
        icon: icons.error,
      });
    }
  };

  const handleDelete = (id: number) => {
    ConfirmDialog({
      title: "¿Está seguro de que desea eliminar esta sede?",
      message: "Esta acción no se puede deshacer.",
      onConfirm: async () => {
        try {
          const res = await deleteSede(id);
          if (res.success) {
            toast.success(res.message || "Sede eliminada correctamente", {
              icon: icons.success,
            });
            setTimeout(() => window.location.reload(), 4500);
          } else {
            toast.error(res.message, {
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

  const handleEdit = async (id: number) => {
    navigate(`/configuracion/maestros/update-sede/${id}`);
  };

  const getById = async (id: number) => {
    const response = await getSedeById(id);
    setNewSede(response);
  };

  const update = async (id: number, sede: Sede) => {
    if (!sede.nombre) {
      toast.error("Debe ingresar un nombre", {
        icon: icons.error,
      });
      return;
    }

    if (
      !sede.usuario_sede ||
      sede.usuario_sede.length === 0 ||
      sede.usuario_sede.some((u) => !u.usuarios || !u.usuarios.id_usuario)
    ) {
      toast.error("Debe seleccionar al menos un usuario válido", {
        icon: icons.error,
      });
      return;
    }

    if (sede.estado === undefined || sede.estado === null) {
      toast.error("Debe seleccionar un estado", {
        icon: icons.error,
      });
      return;
    }
    try {
      const response = await updateSede(id, sede);
      if (response.success) {
        toast.success(response.message || "Sede actualizada exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al actualizar la sede", {
        icon: icons.error,
      });
    }
  };

  const handleOpenEditModal = (id: number) => {
    setSelectedSedeId(id);
    setShowEditModal(true);
  };

  return {
    count,
    sedes,
    setSedes,
    create,
    newSede,
    setNewSede,
    handleDelete,
    handleEdit,
    getById,
    update,
    showEditModal,
    handleOpenEditModal,
    selectedSedeId,
    setShowEditModal,
  };
};
