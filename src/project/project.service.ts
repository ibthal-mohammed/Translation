import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './project.schema';
import { LanguageService } from 'src/language/language.service';
@Injectable()
export class ProjectService {
  constructor(
    @InjectModel('project') protected projectModel: Model<Project>,
    private readonly languageService: LanguageService,
  ) {}
  async create(createProjectDto: CreateProjectDto, userId: ObjectId) {
    const languages = createProjectDto.targetLanguages;
    const targetLanguagesPromises = languages.map(async (lang) => {
      const langId = await this.languageService.findByCode(lang);
      if (!langId || !langId._id) {
        throw new NotFoundException(`Language code ${lang} not found`);
      }
      return langId._id;
    });
    const targetLanguages = await Promise.all(targetLanguagesPromises);
    const newProject = new this.projectModel({
      ...createProjectDto,
      userId,
      targetLanguages,
    });
    newProject.userId = userId;
    await newProject.save();
    return newProject;
  }

  async findAllprojects(userId: ObjectId) {
    const project = await this.projectModel.find({ userId });
    return project;
  }

  async findOne(projectId: ObjectId, userId: ObjectId) {
    const project = await this.projectModel.findOne({ _id: projectId, userId });
    if (!project)
      throw new NotFoundException(`Project with id ${projectId} not found`);
    return project.populate({
      path: 'targetLanguages',
      select: '-_id __v'
    })
  }

  async remove(projectId: ObjectId, userId: ObjectId) {
    const project = await this.projectModel.findOneAndDelete({
      _id: projectId,
      userId,
    });
    if (!project)
      throw new NotFoundException(`Project with id ${projectId} not found`);
    return project;
  }
}
