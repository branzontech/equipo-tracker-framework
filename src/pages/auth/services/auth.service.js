
import { UserModel } from "../../../db/models/user.model.js";

class AuthService {
  async login(nombre, contraseña) {
    const user = await UserModel.findByCredentials(nombre, contraseña);

    if (!user) throw new Error("User and password are incorrect");

    delete user.contrase_a;
    return user;
  }
}

export default new AuthService();
