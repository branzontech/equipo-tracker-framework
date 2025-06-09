/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from "js-cookie";
import { loginUser } from "@/api/axios/auth.api";
import { loginSuccess } from "@/redux/authSlice";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useLogin = () => {
  const [user, setUser] = useState({
    nombre: "",
    contraseña: "",
  });
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("rememberUser");
    const savedPassword = localStorage.getItem("rememberPassword");
    if (savedUser && savedPassword) {
      setUser({ nombre: savedUser, contraseña: savedPassword });
    }
  }, []);

  const SignIn = async (
    nombre: string,
    contraseña: string,
    dispatch: any,
    navigate: any,
    remember
  ) => {
    try {
      if (!nombre) {
        toast.error("Debe ingresar un nombre de usuario");
        return;
      }

      if (!contraseña) {
        toast.error("Debe ingresar una contraseña");
        return;
      }

      const { user } = await loginUser(nombre, contraseña);

      dispatch(loginSuccess(user));
      Cookies.set("userId", user.id_usuario, { expires: 1 });
      navigate("/dashboard");

      if (remember) {
        rememberAccount(nombre, contraseña);
      } else {
        localStorage.removeItem("rememberUser");
      }

      return { success: true, user };
    } catch (error) {
      toast.info(error.message);
    }
  };

  const rememberAccount = (nombre, contraseña) => {
    localStorage.setItem("rememberUser", nombre);
    localStorage.setItem("rememberPassword", contraseña);
  };

  return { SignIn, user, setUser, rememberAccount, remember, setRemember };
};
