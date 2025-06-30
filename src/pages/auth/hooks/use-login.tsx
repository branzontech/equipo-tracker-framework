/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from "js-cookie";
import { loginUser } from "@/api/axios/auth.api";
import { loginSuccess } from "@/redux/authSlice";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";
import { Usuario } from "@/pages/configuracion/usuarios/interfaces/usuarios";

export const useLogin = () => {
  const [user, setUser] = useState<Usuario>({
    id_usuario: 0,
    nombre: "",
    contraseña: "",
    email: "",
    rol: "",
    estado: "",
    sucursales: null,
    firma_entrega: "",
    firma_recibe: "",
    firma: "",
    usuario_sede: null,
    telefono: "",
    perfil_id: 0,
    permisos: [],
  });
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("rememberUser");
    const savedPassword = localStorage.getItem("rememberPassword");
    if (savedUser && savedPassword) {
      setUser({ ...user, email: savedUser, contraseña: savedPassword });
    }
  }, []);

  const SignIn = async (
    email: string,
    contraseña: string,
    dispatch: any,
    navigate: any,
    remember
  ) => {
    try {
      if (!email) {
        toast.error("Debe ingresar su correo electronico", {
          icon: icons.error,
        });
        return;
      }

      if (!contraseña) {
        toast.error("Debe ingresar una contraseña", {
          icon: icons.error,
        });
        return;
      }

      const { user } = await loginUser(email, contraseña);

      dispatch(loginSuccess(user));
      Cookies.set("userId", user.id_usuario, { expires: 1 });
      navigate("/dashboard");

      if (remember) {
        rememberAccount(email, contraseña);
      } else {
        localStorage.removeItem("rememberUser");
      }

      return { success: true, user };
    } catch (error) {
      toast.error(error.message, {
        icon: icons.error,
      });
    }
  };

  const rememberAccount = (email, contraseña) => {
    localStorage.setItem("rememberUser", email);
    localStorage.setItem("rememberPassword", contraseña);
  };

  return { SignIn, user, setUser, remember, setRemember };
};
