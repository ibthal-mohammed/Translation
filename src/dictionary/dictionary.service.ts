import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { Model, ObjectId } from 'mongoose';
import { translate } from '@vitalets/google-translate-api';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectService } from 'src/project/project.service';
import { Dictionary } from './dictionary.model';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectModel('dictionary') private DictionaryModel: Model<Dictionary>,
    private readonly projectService: ProjectService,
  ) {}
  async addString(
    projectId: ObjectId,
    createTranslateDto: CreateDictionaryDto,
    userId: ObjectId,
  ) {
    let project = await this.projectService.findOne(projectId, userId);
    if (!project)
      throw new UnauthorizedException(
        "you can't have permissionto add in this project",
      );
    let newTranslation = new this.DictionaryModel(createTranslateDto);
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
    let targetLanguages: string[] = Array.isArray(project.targetLanguage)
      ? project.targetLanguage
      : [project.targetLanguage];
    let allValue = await this.DictionaryModel.find({ projectId });
    // console.log(allValue);

    let response: Record<string, Record<string, string>> = {}; //{"k":{"k":"v"}}
    allValue.forEach((translation) => {
      const { key, text, value } = translation;
      let i = 0;
      targetLanguages.unshift('en');
      targetLanguages.forEach((language) => {
        if (!response[language]) {
          response[language] = {};
        }
        // console.log('Response:', response);
        // console.log('Language:', language);
        // console.log('Text:', text);
        // console.log('Key:', key);
        if (language == 'en') {
          response[language][key] = text;
        } else {
          // console.log('counter ', i);
          // console.log('value ', vale);
          response[language][key] = value[i];
          i++;
        }
      });
    });
    let data = allValue.map((data) => {
      return {
        id: data._id,
        key: data.key,
      };
    });
    return { dictionary: response, data: data };
  }

  async findOne(language: string, projectId: ObjectId, userId: ObjectId) {
    let response = this.findAll(projectId, userId);
    let result = response.then((result) => {
      // console.log(result['dictionary'][language]);
      if (!result['dictionary'][language])
        throw new NotFoundException('this language is not exist');
      return result['dictionary'][language];
    });

    return result;
  }

  async update(
    dictionaryId: ObjectId,
    updateTranslateDto: UpdateDictionaryDto,
    userId: ObjectId,
    projectId: ObjectId,
  ) {
    let projectExist = await this.projectService.findOne(projectId, userId);
    let existingTranslate = await this.DictionaryModel.findOne({
      _id: dictionaryId,
    });
    // console.log(existingTranslate);
    if (!existingTranslate) {
      throw new NotFoundException(
        `Translate with id ${dictionaryId} not found`,
      );
    }
    try {
      const updated = await this.DictionaryModel.findByIdAndUpdate(
        { _id: dictionaryId },
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

  async remove(dictionaryId: ObjectId, projectId: ObjectId, userId: ObjectId) {
    let projectExist = await this.projectService.findOne(projectId, userId);
    let existingTranslate = await this.DictionaryModel.findOne({
      _id: dictionaryId,
    });
    if (!existingTranslate) {
      throw new NotFoundException(
        `Translate with id ${dictionaryId} not found`,
      );
    } else {
      let deletedTranslate = await this.DictionaryModel.findByIdAndDelete({
        _id: dictionaryId,
      });
      return `This translation is removed`;
    }
  }
}
