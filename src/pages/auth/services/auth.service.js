
import { AuthModel } from "../../../db/models/auth.model.js";

class AuthService {
  async login(email, contraseña) {
    const user = await AuthModel.findByCredentials(email, contraseña);
    delete user.contrase_a;
    return user;
  }
}

export default new AuthService();
