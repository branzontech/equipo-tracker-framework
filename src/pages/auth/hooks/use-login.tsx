/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import Cookies from "js-cookie";
import { loginSuccess } from "@/redux/authSlice";

export const useLogin = () => {
  const SignIn = async (
    nombre: string,
    contraseña: string,
    dispatch: any,
    navigate: any
  ) => {
    try {
      const response = await axios.post("http://192.168.1.4:3003/api/login", {
        nombre,
        contraseña,
      });

      const { user } = response.data;

      dispatch(loginSuccess(user));
      Cookies.set("userId", user.id_usuario, { expires: 1 });
      navigate("/dashboard");

      return { success: true, user };
    } catch (err: any) {
      throw new Error(
        err.response?.data?.error || "Username or password is incorrect"
      );
    }
  };

  return { SignIn };
};
