/* eslint-disable @typescript-eslint/no-explicit-any */
import { Usuario } from "@/pages/configuracion/usuarios/interfaces/usuarios";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/authSlice";

export const useLogin = () => {
  const [user, setUser] = useState<Usuario | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const getUserData = async () => {
  //     try {
  //       const response = await fetch("http://192.168.1.4:3003/api/usuarios");
  //       if (!response.ok) {
  //         throw new Error("Error al obtener los datos");
  //       }
  //       const data = await response.json();

  //       setUser(data);
  //     } catch (err: any) {
  //       throw new Error(err.message);
  //     }
  //   };
  //   getUserData();
  // }, []);

  const SignIn = async (nombre: string, contraseña: string) => {
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
  
  return { user, SignIn };
};
