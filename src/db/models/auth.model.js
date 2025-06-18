import { prisma } from "../../../prisma/prismaCliente.js";

export const AuthModel = {
  findByCredentials: async (email, contraseña) => {
    try {
      const user = await prisma.usuarios.findFirst({
        where: { email, contrase_a: contraseña },
      });

      if (!user) {
        throw new Error("Correo electronico o contraseña incorrectos");
      }

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
