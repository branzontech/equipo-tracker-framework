import { useEffect, useState } from "react";
import { Marca } from "../interfaces/marcas";
import { getAllMarcas, createMarca, deleteMarca, getMarcaById, updateMarca } from "@/api/axios/marcas.api";
import { toast } from "sonner";

export const useMarcas = () => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [newMarca, setNewMarca] = useState<Marca>({
    id_marca: 0,
    nombre: "",
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
    try {
      const response = await createMarca(marca);
      if (response.success) {
        toast.success(response.message || "Marca creada exitosamente");
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al crear la marca");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar esta marca?")) {
      return;
    }
    try {
      const response = await deleteMarca(id);
      if (response.success) {
        toast.success(response.message || "Marca eliminada exitosamente");
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al eliminar la marca");
    }
  };

  const getById = async (id: number) => {
    const response = await getMarcaById(id);
    setNewMarca(response);
  };

  const update = async (id: number, marca: Marca) => {
    const response = await updateMarca(id, marca);
    if (response.success) {
      toast.success(response.message || "Marca actualizada exitosamente");
      setTimeout(() => {
        window.location.reload();
      }, 4500);
    }
    return response;
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
