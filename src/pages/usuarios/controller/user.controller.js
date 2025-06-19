import UserService from "../services/user.service.js";

export const findAll = async (req, res) => {
  try {
    const users = await UserService.findAll();
    res.json({ usuarios: users });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const findByName = async (req, res) => {
  try {
    const { name } = req.params;
    const user = await UserService.findByName(name);
    res.json({ usuario: user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};