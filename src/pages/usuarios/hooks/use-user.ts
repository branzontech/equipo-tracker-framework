/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUsers } from "@/api/axios/user.api";
import { Firma, Usuario } from "@/pages/configuracion/usuarios/interfaces/usuarios";
import { useEffect, useState } from "react";

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
    activo: false,
    firma_entrega: "",
    firma_recibe: "",
    firma: "",
  });
  const [count, setCount] = useState(0);
  const [selectedEntregaUser, setSelectedEntregaUser] =
    useState<Firma | null>(null);
  const [selectedRecibeUser, setSelectedRecibeUser] = useState<Firma | null>(
    null
  );

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

  return {
    users,
    count,
    setUsers,
    newUser,
    setNewUser,
    selectedEntregaUser,
    setSelectedEntregaUser,
    selectedRecibeUser,
    setSelectedRecibeUser,
  };
};
