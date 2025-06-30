import { prisma } from "../../../prisma/prismaCliente.js";
import bcrypt from "bcryptjs";
import { permisos } from "./permisos.model.js";

export const AuthModel = {
  findByCredentials: async (email, contraseña) => {
    try {
      const user = await prisma.usuarios.findFirst({
        where: { email },
      });

      if (!user) {
        throw new Error("Correo electronico o contraseña incorrectos");
      }

      const passwordValid = await bcrypt.compare(contraseña, user.contrase_a);

      if (!passwordValid) {
        throw new Error("Correo electronico o contraseña incorrectos");
      }

      const permisosPerfil = await permisos.getPermisosPorPerfil(
        user.perfil_id
      );

      return {
        ...user,
        permisos: permisosPerfil.map((p) => p.nombre_permiso),
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
