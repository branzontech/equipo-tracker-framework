import { useEffect, useState } from "react";
import { Contrato } from "../interfaces/contrato";
import { create, getAll } from "@/api/axios/contrato.api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useContrato = () => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("todos");
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [newContrato, setNewContrato] = useState<Contrato>({
    id_contrato: 0,
    nombre: "",
    descripcion: "",
    empresa_nombre: "",
    tipo_contrato: "",
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
    estado: "",
    DocumentoContrato: {
      id_documento: 0,
      id_contrato: 0,
      nombre_documento: "",
      tipo_documento: "",
      archivo: null,
      fecha_subida: new Date(),
    },
  });

  useEffect(() => {
    const fetchContratos = async () => {
      const response = await getAll();

      setContratos(response);
    };
    fetchContratos();
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const createContrato = async (contrato: Contrato) => {
    try {
      if (contrato.DocumentoContrato.archivo instanceof File) {
        const base64Data = await fileToBase64(
          contrato.DocumentoContrato.archivo
        );

        contrato.DocumentoContrato.archivo = base64Data;
      }
      const response = await create(contrato);
      if (response.success) {
        toast.success(response.message || "Contrato creado exitosamente");
        setTimeout(() => {
          navigate("/contratos/lista");
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al crear el contrato");
    }
  };

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case "Activo":
        return "bg-green-500";
      case "Inactivo":
        return "bg-red-500";
      case "Pendiente":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const contratosFiltrados =
    filtro === "todos"
      ? contratos
      : contratos.filter((c) =>
          filtro === "activos"
            ? c.estado === "Activo"
            : filtro === "inactivos"
            ? c.estado === "Inactivo"
            : filtro === "pendientes"
            ? c.estado === "Pendiente"
            : true
        );

  return {
    contratos,
    createContrato,
    newContrato,
    setNewContrato,
    contratosFiltrados,
    getBadgeColor,
    setFiltro,
    filtro,
    navigate,
  };
};
