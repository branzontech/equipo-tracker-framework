/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createProveedor,
  deleteProveedor,
  getAllProveedores,
  getProveedorById,
  getProveedorByName,
  updateProveedor,
} from "@/api/axios/proveedor.api";
import { useEffect, useState } from "react";
import { Proveedor } from "../interfaces/proveedor";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export const useProveedor = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [newProveedor, setNewProveedor] = useState<Proveedor>({
    id_proveedor: 0,
    tipo_proveedor: "",
    nombre: "",
    identificacion: "",
    contacto: "",
    telefono: "",
    correo: "",
    direccion: "",
    sitio_web: "",
    estado: "Activo",
  });
  const [nombreProvee, setNombreProveedor] = useState("");
  const [proveedorServicio, setProveedorServicio] = useState("");
  const [sugerenciasProveedor, setSugerenciasProveedor] = useState<any[]>([]);
  const [sugerenciasProveedorServicio, setSugerenciasProveedorServicio] =
    useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProveedorId, setSelectedProveedorId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllProveedores();
        setProveedores(response);
      } catch (error) {
        toast.error("Error al obtener los proveedores", {
          icon: icons.error,
        });
      }
    };

    fetchData();
  }, []);

  const getById = async (id: number) => {
    const response = await getProveedorById(id);
    setNewProveedor(response);
  };

  const handleNombre = async (
    name: string,
    tipo: "proveedor" | "proveedor_servicio"
  ) => {
    if (tipo === "proveedor") setNombreProveedor(name);
    else setProveedorServicio(name);

    if (name.length >= 3) {
      try {
        const res = await getProveedorByName(name);
        if (tipo === "proveedor") setSugerenciasProveedor(res);
        else setSugerenciasProveedorServicio(res);
      } catch (err) {
        console.error("Error buscando proveedores:", err);
      }
    } else {
      if (tipo === "proveedor") setSugerenciasProveedor([]);
      else setSugerenciasProveedorServicio([]);
    }
  };

  const create = async (proveedor: Proveedor) => {
    if (!proveedor.tipo_proveedor) {
      toast.error("El campo Tipo de Proveedor es requerido", {
        icon: icons.error,
      });
      return;
    }

    if (!proveedor.nombre) {
      toast.error("El campo Nombre es requerido", {
        icon: icons.error,
      });
      return;
    }

    if (!proveedor.identificacion) {
      toast.error("El campo Identificación es requerido", {
        icon: icons.error,
      });
      return;
    }

    if (proveedor.tipo_proveedor === "Empresa") {
      if (!proveedor.contacto) {
        toast.error("El campo Contacto es requerido", {
          icon: icons.error,
        });
        return;
      }
      if (!proveedor.sitio_web) {
        toast.error("El campo Sitio Web es requerido", {
          icon: icons.error,
        });
        return;
      }
    }

    if (!proveedor.telefono) {
      toast.error("El campo Telefono es requerido", {
        icon: icons.error,
      });
      return;
    }

    if (!proveedor.direccion) {
      toast.error("El campo Dirección es requerido", {
        icon: icons.error,
      });
      return;
    }

    if (proveedor.tipo_proveedor === "Persona") {
      if (!proveedor.correo) {
        toast.error("El campo Correo es requerido", {
          icon: icons.error,
        });
        return;
      }
    }

    try {
      const response = await createProveedor(proveedor);
      if (response.success) {
        toast.success("Se ha creado el proveedor correctamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
    } catch (error) {
      toast.error("Error al crear el proveedor", {
        icon: icons.error,
      });
    }
  };

  const update = async (id: number, proveedor: Proveedor) => {
    if (!proveedor.tipo_proveedor) {
      toast.error("El campo Tipo de Proveedor es requerido", {
        icon: icons.error,
      });
      return;
    }

    if (!proveedor.nombre) {
      toast.error("El campo Nombre es requerido", {
        icon: icons.error,
      });
      return;
    }

    if (!proveedor.identificacion) {
      toast.error("El campo Identificación es requerido", {
        icon: icons.error,
      });
      return;
    }

    if (proveedor.tipo_proveedor === "Empresa") {
      if (!proveedor.contacto) {
        toast.error("El campo Contacto es requerido", {
          icon: icons.error,
        });
        return;
      }
      if (!proveedor.sitio_web) {
        toast.error("El campo Sitio Web es requerido", {
          icon: icons.error,
        });
        return;
      }
    }

    if (!proveedor.telefono) {
      toast.error("El campo Telefono es requerido", {
        icon: icons.error,
      });
      return;
    }

    if (!proveedor.direccion) {
      toast.error("El campo Dirección es requerido", {
        icon: icons.error,
      });
      return;
    }

    if (proveedor.tipo_proveedor === "Persona") {
      if (!proveedor.correo) {
        toast.error("El campo Correo es requerido", {
          icon: icons.error,
        });
        return;
      }
    }

    try {
      const response = await updateProveedor(id, proveedor);
      if (response.success) {
        toast.success("Se ha actualizado el proveedor correctamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
    } catch (error) {
      toast.error("Error al actualizar el proveedor", {
        icon: icons.error,
      });
    }
  };

  const handleDelete = async (id: number) => {
    ConfirmDialog({
      title: "¿Está seguro de que desea eliminar este proveedor?",
      message: "Esta acción no se puede deshacer.",
      onConfirm: async () => {
        try {
          const res = await deleteProveedor(id);
          if (res.success) {
            toast.success(res.message || "Proveedor eliminado exitosamente", {
              icon: icons.success,
            });
            setTimeout(() => window.location.reload(), 4500);
          } else {
            toast.error(res.message || "No se pudo eliminar el proveedor", {
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
    setSelectedProveedorId(id);
    setShowEditModal(true);
  };

  return {
    proveedores,
    newProveedor,
    setNewProveedor,
    create,
    handleNombre,
    nombreProvee,
    sugerenciasProveedor,
    setSugerenciasProveedor,
    setNombreProveedor,
    proveedorServicio,
    setProveedorServicio,
    sugerenciasProveedorServicio,
    setSugerenciasProveedorServicio,
    showEditModal,
    selectedProveedorId,
    setShowEditModal,
    getById,    
    update,
    handleOpenEditModal,
    handleDelete
  };
};
