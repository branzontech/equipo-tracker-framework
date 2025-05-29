
import { prisma } from "../../../prisma/prismaCliente.js";

export const AuthModel = {
  findByCredentials: async (nombre, contraseña) => {
    return await prisma.usuarios.findFirst({
      where: { nombre, contrase_a: contraseña },
    });
  },
};
