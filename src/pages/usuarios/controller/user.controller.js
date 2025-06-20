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

export const create = async (req, res) => {
  try {
    const usuario = req.body;
    const user = await UserService.create(usuario);
    res.json({ usuario: user, success: true });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};