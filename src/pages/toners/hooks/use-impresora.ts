/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Impresora } from "../interfaces/impresora";
import {
  getImpresora,
  createImpresora,
  getImpresoraById,
  updateImpresora,
  deleteImpresora,
  getImpresoraBySerial,
} from "@/api/axios/impresora.api";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export const useImpresora = () => {
  const [impresora, setImpresa] = useState<Impresora[]>([]);
  const [newImpresora, setNewImpresora] = useState<Impresora>({
    id_impresora: 0,
    nombre: "",
    modelo: "",
    sucursal_id: 0,
    sucursales: null,
    serial: "",
    estado: null,
    marcas: null,
    marca_id: 0,
    tipo: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedImpresoraId, setSelectedImpresoraId] = useState<number | null>(
    null
  );
  const [impresoraSerial, setImpresoraSerial] = useState("");
  const [sugerenciasImpresora, setSugerenciasImpresora] = useState<any[]>([]);

  useEffect(() => {
    const getAllImpresora = async () => {
      try {
        const data = await getImpresora();
        setImpresa(data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    getAllImpresora();
  }, []);

  const create = async (impresora: Impresora) => {
    if (!impresora.nombre) {
      toast.error("Debe ingresar un nombre", {
        icon: icons.error,
      });
      return;
    }

    if (!impresora.modelo) {
      toast.error("Debe ingresar un modelo", {
        icon: icons.error,
      });
      return;
    }

    if (!impresora.sucursal_id) {
      toast.error("Debe seleccionar una sucursal", {
        icon: icons.error,
      });
      return;
    }

    try {
      const response = await createImpresora(impresora);
      if (response.data.success) {
        toast.success(
          response.data.message || "Impresora creada exitosamente",
          {
            icon: icons.success,
          }
        );
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }
      return response;
    } catch (error) {
      toast.error(error.message, {
        icon: icons.error,
      });
    }
  };

  const update = async (id: number, impresora: Impresora) => {
    try {
      const response = await updateImpresora(id, impresora);
      if (response.success) {
        toast.success(
          response.message || "Impresora actualizada exitosamente",
          {
            icon: icons.success,
          }
        );
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message, {
        icon: icons.error,
      });
    }
  };

  const getById = async (id: number) => {
    try {
      const response = await getImpresoraById(id);
      setNewImpresora(response);
    } catch (error) {
      toast.error(error.message, {
        icon: icons.error,
      });
    }
  };

  const deleteImpresoraById = async (id: number) => {
    ConfirmDialog({
      title: "¿Está seguro de que desea eliminar esta impresora?",
      message: "Esta acción no se puede deshacer.",
      onConfirm: async () => {
        try {
          const res = await deleteImpresora(id);
          if (res.success) {
            toast.success(res.message || "Impresora eliminada exitosamente", {
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

  const handleOpenEditModal = (id: number) => {
    setSelectedImpresoraId(id);
    setShowEditModal(true);
  };

  const handleImpresoraSerialInput = async (serial: string) => {
    setImpresoraSerial(serial);

    if (serial.length >= 3) {
      try {
        const response = await getImpresoraBySerial(serial);

        if (response) {
          const result = Array.isArray(response) ? response : [response];
          setSugerenciasImpresora(result);
        } else {
          setSugerenciasImpresora([]);
        }
      } catch (error) {
        toast.error(error.message, { icon: icons.error });
      }
    } else {
      setSugerenciasImpresora(null);
    }
  };

  console.log(sugerenciasImpresora);

  return {
    impresora,
    setImpresa,
    newImpresora,
    setNewImpresora,
    create,
    update,
    getById,
    showEditModal,
    setShowEditModal,
    handleOpenEditModal,
    selectedImpresoraId,
    deleteImpresoraById,
    handleImpresoraSerialInput,
    impresoraSerial,
    setImpresoraSerial,
    sugerenciasImpresora,
    setSugerenciasImpresora,
  };
};
