import UserService from "../services/user.service.js";

export const findAll = async (req, res) => {
  try {
    const users = await UserService.findAll();
    res.json({ usuarios: users });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
