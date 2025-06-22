import { createProveedor, getAllProveedores } from "@/api/axios/proveedor.api";
import { useEffect, useState } from "react";
import { Proveedor } from "../interfaces/proveedor";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";

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
  });

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

  return {
    proveedores,
    newProveedor,
    setNewProveedor,
    create,
  };
};
