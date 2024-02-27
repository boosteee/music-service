import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Roles, User } from './schemas/user.schema';
import { Model, ObjectId } from 'mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { compareSync } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async addUser(dto: CreateUserDto): Promise<User> {
    const isUserExist = await this.findUserByEmail(dto.email);
    if (isUserExist)
      throw new HttpException(
        'User with such email already exists',
        HttpStatus.UNAUTHORIZED,
      );

    const salt = genSaltSync(10);

    const user = await this.userModel.create({
      ...dto,
      role: Roles.User,
      isBlocked: false,
      password: hashSync(dto.password, salt),
    });
    return user;
  }

  async changeUser(
    email: string,
    username: string,
    password: string,
    newPassword: string,
  ): Promise<User> {
    const salt = genSaltSync(10);
    console.log(email);
    const user = await this.userModel.findOne({ email });
    console.log(user.password);
    if (compareSync(password, user.password)) {
      user.password = hashSync(newPassword, salt);
      user.username = username;
      console.log(user);
      user.save();
      return user;
    } else {
      throw new HttpException('Wrong passswod', HttpStatus.NOT_ACCEPTABLE);
    }
  }

  async getById(userId: ObjectId): Promise<User> {
    const user = await this.userModel.findById(userId);
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async searchUsers(query: string): Promise<User[]> {
    const users = await this.userModel.find({
      username: { $regex: new RegExp(query, 'i') },
      role: 1,
    });
    return users;
  }

  async blockUser(userId: ObjectId): Promise<User> {
    const user = await this.userModel.findById(userId);
    user.isBlocked = !user.isBlocked;
    await user.save();
    return user;
  }
}
