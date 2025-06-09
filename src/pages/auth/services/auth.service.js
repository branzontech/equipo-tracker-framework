
import { AuthModel } from "../../../db/models/auth.model.js";

class AuthService {
  async login(nombre, contraseña) {
    const user = await AuthModel.findByCredentials(nombre, contraseña);
    delete user.contrase_a;
    return user;
  }
}

export default new AuthService();
