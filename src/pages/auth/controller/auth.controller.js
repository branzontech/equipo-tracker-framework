
import AuthService from "../services/auth.service.js";

const login = async (req, res) => {
  try {
    const { nombre, contraseña } = req.body;
    const user = await AuthService.login(nombre, contraseña);
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default login;
