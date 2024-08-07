import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTranslateDto } from './dto/create-translate.dto';
import { UpdateTranslateDto } from './dto/update-translate.dto';
import { Model, ObjectId } from 'mongoose';
import { translate } from '@vitalets/google-translate-api';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectService } from 'src/projects/project.service';
import { Translate } from './translat.model';

@Injectable()
export class TranslateService {
  constructor(
    @InjectModel('translate') private translateModel: Model<Translate>,
    private readonly projectService: ProjectService,
  ) {}
  async addString(
    projectId: ObjectId,
    createTranslateDto: CreateTranslateDto,
    userId: ObjectId,
  ) {
    let project = await this.projectService.findOne(projectId, userId);
    if (!project)
      throw new UnauthorizedException(
        "you can't have permissionto add in this project",
      );
    let newTranslation = new this.translateModel(createTranslateDto);
    let targetLanguages: string[] = Array.isArray(project.targetLanguage)
      ? project.targetLanguage
      : [project.targetLanguage];
    let translationResults: string[] = [];
    for (const lang of targetLanguages) {
      let result = (await translate(newTranslation.text, { to: lang })).text;
      translationResults.push(result);
      // console.log(translationResults);
    }

    newTranslation.value = [...translationResults];
    // console.log(newTranslation.value);
    newTranslation.projectId = projectId;
    await newTranslation.save();
    return newTranslation;
  }

  async findAll(projectId: ObjectId, userId: ObjectId) {
    let project = await this.projectService.findOne(projectId, userId);
    if (!project)
      throw new UnauthorizedException(
        "you can't have permissionto open this project",
      );
    let allValue = await this.translateModel.find({ projectId });
    return allValue;
  }

  async findOne(translateId: ObjectId, projectId: ObjectId, userId: ObjectId) {
    let project = await this.projectService.findOne(projectId, userId);
    if (!project)
      throw new UnauthorizedException(
        "you can't have permissionto open this project",
      );
    let value = await this.translateModel.findOne({ _id: translateId });
    if (!value)
      throw new NotFoundException(`Translate with id ${translateId} not found`);

    return value;
  }

  async update(
    translateId: ObjectId,
    updateTranslateDto: UpdateTranslateDto,
    userId: ObjectId,
    projectId: ObjectId,
  ) {
    let projectExist = await this.projectService.findOne(projectId, userId);

    if (!projectExist) {
      throw new UnauthorizedException(
        "you can't have permissionto edit this project",
      );
    }
    let existingTranslate = await this.translateModel.findOne({
      _id: translateId,
    });
    // console.log(existingTranslate);
    if (!existingTranslate) {
      throw new NotFoundException(`Translate with id ${translateId} not found`);
    }
    try {
      const updated = await this.translateModel.findByIdAndUpdate(
        { _id: translateId },
        updateTranslateDto,
        {
          new: true,
          runValidators: true,
        },
      );
      return updated;
    } catch (error) {
      throw new BadRequestException('Error occurred while updating translate');
    }
  }

  async remove(translateId: ObjectId, projectId: ObjectId, userId: ObjectId) {
    let projectExist = await this.projectService.findOne(projectId, userId);
    if (!projectExist)
      throw new UnauthorizedException(
        "you can't have permissionto delete this project",
      );
    let existingTranslate = await this.translateModel.find({
      _id: translateId,
    });
    if (!existingTranslate) {
      throw new NotFoundException(`Translate with id ${translateId} not found`);
    }
    let deletedTranslate = await this.translateModel.findByIdAndDelete({
      translateId,
    });
    return `This project is removed`;
  }
}
