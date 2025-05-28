
import AuthService from "../services/auth.service.js";

const login = async (req, res) => {
  try {
    const { nombre, contraseña } = req.body;
    if (!nombre || !contraseña) {
      return res
        .status(400)
        .json({ error: "Nombre and contraseña are required" });
    }
    const user = await AuthService.login(nombre, contraseña);
    res.json({ success: true, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export default login;
