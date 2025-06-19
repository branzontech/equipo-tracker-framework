import { UserModel } from "../../../db/models/user.model.js";

class UserService {
  async findAll() {
    const users = await UserModel.findAll();
    return users;
  }
  async findByName(name) {
    const user = await UserModel.findByName(name);
    return user;
  }
}

export default new UserService();