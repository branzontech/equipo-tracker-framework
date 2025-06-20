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
  async create(userData) {
    try {
    const user = await UserModel.create(userData);
    return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new UserService();