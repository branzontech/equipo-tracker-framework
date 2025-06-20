import { prisma } from "../../../prisma/prismaCliente.js";

export const UserModel = {
  findAll: async () => {
    const users = await prisma.usuarios.findMany({
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        rol: true,
        estado: true,
        sede_id: true,
        firma: true,
        telefono: true,
        sedes: {
          select: {
            id_sede: true,
            nombre: true,
            sucursales: {
              select: {
                id_sucursal: true,
                nombre: true,
              },
            },
          },
        },
      },
    });

    // Convierte firma a base64 si es Uint8Array
    const usersWithFirmaBase64 = users.map((user) => {
      const isBase64 =
        typeof user.firma === "string" &&
        user.firma.startsWith("data:image/png;base64,");

      console.log("User with firma:", user);

      return {
        ...user,
        firma: user.firma
          ? isBase64
            ? user.firma
            : `data:image/png;base64,${Buffer.from(user.firma).toString(
                "base64"
              )}`
          : null,
      };
    });

    return usersWithFirmaBase64;
  },
  findByName: async (name) => {
    const usuarios = await prisma.usuarios.findMany({
      where: {
        OR: [
          {
            nombre: {
              contains: name,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        rol: true,
        estado: true,
        telefono: true,
        sede_id: true,
        firma: true,
        sedes: {
          select: {
            id_sede: true,
            nombre: true,
          },
        },
      },
      take: 10,
    });

    const usersWithFirmaBase64 = usuarios.map((user) => ({
      ...user,
      firma: user.firma
        ? `data:image/png;base64,${Buffer.from(user.firma).toString("base64")}`
        : null,
    }));

    return usersWithFirmaBase64;
  },
  create: async (userData) => {
    try {
      const newUser = await prisma.usuarios.create({
        data: {
          nombre: userData.nombre,
          email: userData.email,
          contrase_a: userData.contraseña,
          rol: userData.rol,
          estado: userData.estado,
          firma: userData.firma
            ? Buffer.from(
                userData.firma.includes(",")
                  ? userData.firma.split(",")[1]
                  : userData.firma,
                "base64"
              )
            : null,
          telefono: userData.telefono,
        },
      });
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);

      if (error.code === "P2002") {
        throw new Error("El email ya está en uso. Por favor, utilice otro.");
      }

      throw new Error(
        "Error al crear el usuario. Verifique los datos ingresados."
      );
    }
  },
};
