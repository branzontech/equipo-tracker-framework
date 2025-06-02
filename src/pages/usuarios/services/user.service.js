import { UserModel } from "../../../db/models/user.model.js";

class UserService {
  async findAll() {
    const users = await UserModel.findAll();
    return users;
  }
}

export default new UserService();