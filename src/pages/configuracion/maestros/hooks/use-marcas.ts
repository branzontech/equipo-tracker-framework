import { useEffect, useState } from "react";
import { Marca } from "../interfaces/marcas";
import {
  getAllMarcas,
  createMarca,
  deleteMarca,
  getMarcaById,
  updateMarca,
} from "@/api/axios/marcas.api";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { icons } from "@/components/interfaces/icons";

export const useMarcas = () => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [newMarca, setNewMarca] = useState<Marca>({
    id_marca: 0,
    nombre: "",
    telefono: "",
    sitioweb: "",
    estado: "Activo",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMarcaId, setSelectedMarcaId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMarcas = async () => {
      const marcas = await getAllMarcas();
      setMarcas(marcas);
    };
    fetchMarcas();
  }, []);

  const addMarca = async (marca: Marca) => {
    if (!marca.nombre) {
      toast.error("Debe ingresar un nombre", {
        icon: icons.error,
      });
      return;
    }

    try {
      const response = await createMarca(marca);
      if (response.success) {
        toast.success(response.message || "Marca creada exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al crear la marca", {
        icon: icons.error,
      });
    }
  };

  const handleDelete = async (id: number) => {
    ConfirmDialog({
      title: "¿Está seguro de que desea eliminar esta marca?",
      message: "Esta acción no se puede deshacer.",
      onConfirm: async () => {
        try {
          const res = await deleteMarca(id);
          if (res.success) {
            toast.success(res.message || "Marca eliminada correctamente", {
              icon: icons.success,
            });
            setTimeout(() => window.location.reload(), 4500);
          } else {
            toast.error(res.message || "No se pudo eliminar la marca", {
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
    const response = await getMarcaById(id);
    setNewMarca(response);
  };

  const update = async (id: number, marca: Marca) => {
    if (!marca.nombre) {
      toast.error("Debe ingresar un nombre", {
        icon: icons.error,
      });
      return;
    }
    try {
      const response = await updateMarca(id, marca);
      if (response.success) {
        toast.success(response.message || "Marca actualizada exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al actualizar la marca", {
        icon: icons.error,
      });
    }
  };

  const handleOpenEditModal = (id: number) => {
    setSelectedMarcaId(id);
    setShowEditModal(true);
  };

  return {
    marcas,
    newMarca,
    setNewMarca,
    addMarca,
    handleDelete,
    getById,
    handleOpenEditModal,
    selectedMarcaId,
    setShowEditModal,
    update,
    showEditModal,
  };
};
