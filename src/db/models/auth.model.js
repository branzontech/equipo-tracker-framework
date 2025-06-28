import { prisma } from "../../../prisma/prismaCliente.js";
import bcrypt from "bcryptjs";

export const AuthModel = {
  findByCredentials: async (email, contraseña) => {
    try {
      const user = await prisma.usuarios.findFirst({
        where: { email },
      });

      if (!user) {
        throw new Error("Correo electronico o contraseña incorrectos");
      }

      const passwordValid = bcrypt.compare(contraseña, user.contrase_a);

      if (!passwordValid) {
        throw new Error("Correo electronico o contraseña incorrectos");
      }

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};