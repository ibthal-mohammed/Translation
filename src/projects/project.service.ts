import { Injectable, Delete } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Project } from './project.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel('project') public projectModel: Model<Project>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createProjectDto: CreateProjectDto, id) {
    // console.log(req.header);
    // const authHeader = req.headers['authorization'];
    // const token = authHeader.split(' ')[1];
    // const decoded = await this.jwtService.verify(token, {
    //   secret: process.env.JWT_SECRET,
    // });
    // // console.log(decoded.id);
    // const userId = decoded.id;
    let newProject = new this.projectModel(createProjectDto);
    newProject.userId = id;
    await newProject.save();
    return { data: newProject };
  }

  async findAllprojects(id) {
    let project = await this.projectModel.find({ userId: id });
    return project;
  }

  async findOne(_id: ObjectId, id) {
    let project = await this.projectModel.findOne({
      _id,
      userId: id,
    });
    return project;
  }

  async Delete(_id: ObjectId, id) {
    let project = await this.projectModel.findByIdAndDelete({
      _id,
      userId: id,
    });
  }
}
