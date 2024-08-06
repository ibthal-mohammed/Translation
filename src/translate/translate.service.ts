import {
  BadRequestException,
  Injectable,
  NotFoundException,
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
    id: any,
  ) {
    let newTranslation = new this.translateModel(createTranslateDto);
    let language = await this.projectService.findOne(projectId, id);
    let targetLanguages: string[] = Array.isArray(language.targetLanguage)
      ? language.targetLanguage
      : [language.targetLanguage];
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

  async findAll(projectId: ObjectId) {
    let allValue = await this.translateModel.find({ projectId });
    return allValue;
  }

  async findOne(_id: ObjectId) {
    let value = await this.translateModel.find({ _id });
    return value;
  }

  async update(_id: ObjectId, updateTranslateDto: UpdateTranslateDto) {
    let existingTranslate = await this.translateModel.find({ _id });
    if (!existingTranslate) {
      throw new NotFoundException(`Translate with id ${_id} not found`);
    }
    try {
      const updated = await this.translateModel.findByIdAndUpdate(
        _id,
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

  async remove(_id: ObjectId) {
    let deletedTranslate = await this.translateModel.findByIdAndDelete({ _id });
  }
}
