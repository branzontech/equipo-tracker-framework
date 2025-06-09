import { prisma } from "../../../prisma/prismaCliente.js";

export const AuthModel = {
  findByCredentials: async (nombre, contraseña) => {
    try {
      const user = await prisma.usuarios.findFirst({
        where: { nombre, contrase_a: contraseña },
      });

      if (!user) {
        throw new Error("Nombre de usuario o contraseña incorrectos");
      }

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
