/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUsers } from "@/api/axios/user.api";
import { Usuario } from "@/pages/configuracion/usuarios/interfaces/usuarios";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [count, setCount] = useState(0);

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

  return { users, count };
};
