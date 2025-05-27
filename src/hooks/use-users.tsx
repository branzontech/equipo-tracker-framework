import { Usuario } from "@/pages/configuracion/usuarios/interfaces/usuarios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export const useUsers = () => {
  const id = Cookies.get("userId");
  const [users, setUsers] = useState<Usuario>({
    id_usuario: 0,
    nombre: "",
    contraseña: "",
    email: "",
    rol: "",
    sede_id: 0,
    activo: false,
  });

  useEffect(() => {
    if (!id) {
      return;
    }
    const getUserData = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.4:3003/api/usuarios/${id}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        const data = await response.json();

        setUsers(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        throw new Error(err.message);
      }
    };
    getUserData();
  }, [id]);

  return { users };
};
