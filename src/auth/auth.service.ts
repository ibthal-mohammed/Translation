import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegAuthDto } from './dto/reg-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private usersModel: Model<User>,
    private jwt: JwtService,
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    const foundUser = await this.usersModel.findOne({
      email: loginAuthDto.email,
    });
    if (!foundUser) throw new NotFoundException('Invalid Email Or Password..');
    const isTruePass = await bcrypt.compare(
      loginAuthDto.password,
      foundUser.password,
    ); //true||false
    if (!isTruePass)
      throw new NotFoundException('Invalid Email Or Password !!');
    const token = this.jwt.sign(
      { id: foundUser._id },
      {
        secret: process.env.JWT_SECRET,
      },
    );
    return token;
  }

  async register(regAuthDto: RegAuthDto) {
    const foundUser = await this.usersModel.findOne({
      email: regAuthDto.email,
    });
    if (foundUser)
      throw new ConflictException('Email Already Exists, Please Login');
    const salt = await bcrypt.genSalt(10);
    const HashedPassword = await bcrypt.hash(regAuthDto.password, salt);
    regAuthDto.password = HashedPassword;
    const newUser = new this.usersModel(regAuthDto);
    await newUser.save();
    return newUser;
  }
}
