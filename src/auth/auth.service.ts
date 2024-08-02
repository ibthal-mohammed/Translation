import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegAuthDto } from './dto/reg-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from 'src/users/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private usersModel: Model<User>,
    private jwt: JwtService,
  ) {}

  async Login(loginAuthDto: LoginAuthDto) {
    let foundUser = await this.usersModel.findOne({
      email: loginAuthDto.email,
    });
    if (!foundUser) throw new NotFoundException('Invalid Email Or Password..');
    let isTruePass = await bcrypt.compare(
      loginAuthDto.password,
      foundUser.password,
    ); //true||false
    if (!isTruePass)
      throw new NotFoundException('Invalid Email Or Password !!');
    let token = await this.jwt.sign(
      { id: foundUser._id },
      {
        secret: process.env.JWT_SECRET,
      },
    );
    return token;
  }

  async Register(regAuthDto: RegAuthDto) {
    let foundUser = await this.usersModel.findOne({ email: regAuthDto.email });
    if (foundUser) throw new Error('Email Already Exists, Please Login');

    let salt = await bcrypt.genSalt(10);
    let HashedPassword = await bcrypt.hash(regAuthDto.password, salt);
    regAuthDto.password = HashedPassword;
    let newUser = new this.usersModel(regAuthDto);
    await newUser.save();
    return { data: newUser };
  }
}
