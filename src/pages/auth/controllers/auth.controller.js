import prisma from "../../../prismaCliente.js";

// Login function
const login = async (req, res) => {
  try {
    // Validate request body fields
    const { nombre, contraseña } = req.body;

    // Find user by username and password in the database with Prisma
    const user = await prisma.usuarios.findFirst({
      where: {
        nombre,
        contrase_a: contraseña,
      },
    });

    // If user is not found, return an error
    if (!user) {
      return res.status(200).json({ error: "Username or password is incorrect" });
    }
    // If user is found, return success response with user data
    // Note: In a real application, you should not return the password or sensitive information
    delete user.contrase_a; // Remove password from response for security
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al iniciar sesión");
  }
};

export default login;