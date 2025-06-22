/* eslint-disable @typescript-eslint/no-explicit-any */
import { createUser, getUserByName, getUsers } from "@/api/axios/user.api";
import { icons } from "@/components/interfaces/icons";
import {
  Firma,
  Usuario,
} from "@/pages/configuracion/usuarios/interfaces/usuarios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useUser = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [newUser, setNewUser] = useState<Usuario>({
    id_usuario: 0,
    nombre: "",
    contraseña: "",
    email: "",
    rol: "",
    sede_id: 0,
    sedes: null,
    estado: null,
    firma_entrega: "",
    firma_recibe: "",
    firma: "",
    telefono: "",
    sucursales: null,
  });
  const [count, setCount] = useState(0);
  const [selectedEntregaUser, setSelectedEntregaUser] = useState<Firma | null>(
    null
  );
  const [selectedRecibeUser, setSelectedRecibeUser] = useState<Firma | null>(
    null
  );
  const [nombreInput, setNombreUser] = useState("");
  const [sugerencias, setSugerencias] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const user = await getUsers();
        setUsers(user);
        setCount(user.length);
      } catch (err: any) {
        throw new Error(err.response?.data?.error || "Users not found");
      }
    };
    fetchUsers();
  }, []);

  const handleNombreInput = async (name: string) => {
    setNombreUser(name);

    if (name.length >= 3) {
      try {
        const res = await getUserByName(name);
        setSugerencias(res);
      } catch (err) {
        console.error("Error buscando usuarios:", err);
      }
    } else {
      setSugerencias([]);
    }
  };

  const handleSumbit = async (usuario: Usuario) => {
    if (!usuario.nombre) {
      toast.error("Debe ingresar un nombre", {
        icon: icons.error,
      });
      return;
    }

    if (!usuario.email) {
      toast.error("Debe ingresar un email", {
        icon: icons.error,
      });
      return;
    }

    if (!usuario.contraseña) {
      toast.error("Debe ingresar una contraseña", {
        icon: icons.error,
      });
      return;
    }

    if (!usuario.rol) {
      toast.error("Debe seleccionar un rol", {
        icon: icons.error,
      });
      return;
    }

    if (!usuario.telefono) {
      toast.error("Debe ingresar un número de teléfono", {
        icon: icons.error,
      });
      return;
    }

    if (!/^\d{7,10}$/.test(newUser.telefono)) {
      toast.error("Ingrese un número de teléfono válido (de 7 a 10 dígitos)", {
        icon: icons.error,
      });
      return;
    }

    if (!usuario.estado) {
      toast.error("Debe seleccionar un estado", {
        icon: icons.error,
      });
      return;
    }

    if (!usuario.firma || !usuario.firma.length) {
      toast.error("Debe seleccionar una firma", {
        icon: icons.error,
      });
      return;
    }

    try {
      const response = await createUser(usuario);
      if (response.success) {
        toast.success(response.message || "Usuario creado exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al crear el usuario", {
        icon: icons.error,
      });
    }
  };

  return {
    setNombreUser,
    handleNombreInput,
    nombreInput,
    sugerencias,
    setSugerencias,
    users,
    count,
    setUsers,
    newUser,
    setNewUser,
    selectedEntregaUser,
    setSelectedEntregaUser,
    selectedRecibeUser,
    setSelectedRecibeUser,
    handleSumbit,
  };
};
