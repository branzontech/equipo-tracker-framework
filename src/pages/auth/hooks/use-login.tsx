/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useLogin.ts
import Cookies from "js-cookie";
import { loginUser } from "@/api/axios/auth.api";
import { loginSuccess } from "@/redux/authSlice";

export const useLogin = () => {
  const SignIn = async (
    nombre: string,
    contraseña: string,
    dispatch: any,
    navigate: any
  ) => {
    try {
      const { user } = await loginUser(nombre, contraseña);

      dispatch(loginSuccess(user));
      Cookies.set("userId", user.id_usuario, { expires: 1 });
      navigate("/dashboard");

      return { success: true, user };
    } catch (err: any) {
      throw new Error(
        err.response?.data?.error || "Usuario o contraseña incorrectos"
      );
    }
  };

  return { SignIn };
};
