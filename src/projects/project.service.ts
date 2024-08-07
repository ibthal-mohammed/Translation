import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Project } from './project.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel('project') public projectModel: Model<Project>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createProjectDto: CreateProjectDto, userId: ObjectId) {
    let newProject = new this.projectModel(createProjectDto);
    newProject.userId = userId;
    await newProject.save();
    return newProject;
  }

  async findAllprojects(userId: ObjectId) {
    let project = await this.projectModel.find({ userId });
    return project;
  }

  async findOne(projectId: ObjectId, userId: ObjectId) {
    let project = await this.projectModel.findOne({ _id: projectId, userId });
    if (!project)
      throw new NotFoundException(`Project with id ${projectId} not found`);
    return project;
  }

  async Delete(projectId: ObjectId, userId: ObjectId) {
    let project = await this.projectModel.findByIdAndDelete({
      _id: projectId,
      userId,
    });
    if (!project)
      throw new NotFoundException(`Project with id ${projectId} not found`);
    return `This project is removed`;
  }
}
