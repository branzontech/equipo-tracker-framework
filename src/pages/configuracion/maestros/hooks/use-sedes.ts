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

export const useSedes = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [newSede, setNewSede] = useState<Sede>({
    id_sede: 0,
    nombre: "",
    usuarios: [],
    estado: null,
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
    try {
      const response = await createSede(sede);
      if (response.success) {
        toast.success(response.message || "Sede creada exitosamente");
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return { response };
    } catch (error) {
      toast.error(error.message || "Error al crear la sede");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Está seguro de que desea eliminar esta sede?"))
      return;
    try {
      const response = await deleteSede(id);

      if (response.success) {
        toast.success(response.message || "Sede eliminada exitosamente");
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al eliminar la sede");
    }
  };

  const handleEdit = async (id: number) => {
    navigate(`/configuracion/maestros/update-sede/${id}`);
  };

  const getById = async (id: number) => {
    const response = await getSedeById(id);
    setNewSede(response);
  };

  const update = async (id: number, sede: Sede) => {
    const response = await updateSede(id, sede);
    if (response.success) {
      toast.success(response.message || "Sede actualizada exitosamente");
      setTimeout(() => {
        window.location.reload();
      }, 4500);
    }
    return response;
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
