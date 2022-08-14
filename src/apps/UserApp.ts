import { v4 as uuid } from 'uuid';

import { Roles } from '../interfaces/Roles';
import {
  InternUser,
  IUserModel,
  LoginDto,
  PassWithId,
  User,
} from '../interfaces/User';
import { UserModel } from '../models/UserModel';
import { authApp } from './AuthApp';

interface UserWithId extends User {
  id: string;
}

class UserApp {
  async register(dto: InternUser): Promise<UserWithId> {
    const { name, lastName, email, password } = dto;
    const hashedPassword = await authApp.hashPassword(password);
    const user: User = {
      name,
      lastName,
      email,
    };
    const newUser: IUserModel = {
      ...user,
      password: hashedPassword,
      role: Roles.user,
      id: uuid(),
    };
    await UserModel.create(newUser);

    return { ...user, id: newUser.id };
  }

  async findByEmail(email: string): Promise<IUserModel> {
    const user = await UserModel.findOne({ email });
    return user as IUserModel;
  }

  async findById(userId: string): Promise<IUserModel> {
    const user = await UserModel.findOne({ id: userId });
    return user as IUserModel;
  }

  async login(dto: LoginDto): Promise<PassWithId> {
    const { email, password } = dto;
    const user = await this.findByEmail(email);
    const isPasswordValid = await authApp.isPasswordValid(
      password,
      user.password
    );

    const { token } = authApp.generateToken(user.id, user.role, user.email);

    return { isPasswordValid, userId: user.id, token };
  }

  async changePassword(id: string, newPassword: string): Promise<void> {
    const hashedPassword = await authApp.hashPassword(newPassword);

    await UserModel.findOneAndUpdate(
      { id },
      { password: hashedPassword },
      { new: true }
    );
  }
}

const userApp = new UserApp();
export { userApp };
