import { useEffect, useState } from "react";
import { Marca } from "../interfaces/marcas";
import { getAllMarcas, createMarca, deleteMarca } from "@/api/axios/marcas.api";

export const useMarcas = () => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [newMarca, setNewMarca] = useState<Marca>({
    id_marca: 0,
    nombre: "",
  });

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
        window.location.reload();
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar esta marca?")) {
      return;
    }
    try {
      const response = await deleteMarca(id);
      if (response.success) {
        window.location.reload();
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    marcas,
    newMarca,
    setNewMarca,
    addMarca,
    handleDelete
  };
};
