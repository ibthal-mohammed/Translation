import {
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
import { Dictionary } from './dictionary.schema';
import { LanguageService } from 'src/language/language.service';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectModel('dictionary') private DictionaryModel: Model<Dictionary>,
    private readonly projectService: ProjectService,
    private readonly languageService: LanguageService,
  ) {}
  async addString(
    projectId: ObjectId,
    createDictionaryDto: CreateDictionaryDto,
    userId: ObjectId,
  ) {
    const project = await this.projectService.findOne(projectId, userId);
    if (!project)
      throw new UnauthorizedException(
        "you can't have permissionto add in this project",
      );
    const languages = project.targetLanguages;
    const translationResults: string[] = [];
    const newTranslation = new this.DictionaryModel(createDictionaryDto);
    const languageCode: string[] = [];
    for (const language of languages) {
      const code = (await this.languageService.findById(language)).code;
      languageCode.push(code);
    }
    for (const language of languageCode) {
      const result = (await translate(newTranslation.text, { to: language }))
        .text;
      translationResults.push(result);
    }
    newTranslation.value = [...translationResults];
    newTranslation.projectId = projectId;
    await newTranslation.save();
    return newTranslation;
  }

  async findAll(projectId: ObjectId, userId: ObjectId) {
    const project = await this.projectService.findOne(projectId, userId);
    const Language = project.targetLanguages;
    const targetLanguages: string[] = [];
    for (const lang of Language) {
      const code = (await this.languageService.findById(lang)).code;
      targetLanguages.push(code);
    }
    const allValue = await this.DictionaryModel.find({ projectId });

    const response: Record<string, Record<string, string>> = {}; //{"k":{"k":"v"}}
    allValue.forEach((translation) => {
      const { key, text, value } = translation;
      let i = 0;
      targetLanguages.unshift('en');
      targetLanguages.forEach((language) => {
        if (!response[language]) {
          response[language] = {};
        }
        if (language == 'en') {
          response[language][key] = text;
        } else {
          response[language][key] = value[i];
          i++;
        }
      });
    });
    const data = allValue.map((data) => {
      return {
        id: data._id,
        key: data.key,
      };
    });
    return { dictionary: response, data: data };
  }

  async findByLanguage(
    language: string,
    projectId: ObjectId,
    userId: ObjectId,
  ) {
    const result = await this.findAll(projectId, userId);
    if (!result['dictionary'][language])
      throw new NotFoundException('this language is not exist');
    return result['dictionary'][language];
  }

  async update(
    dictionaryId: ObjectId,
    updateTranslateDto: UpdateDictionaryDto,
    userId: ObjectId,
    projectId: ObjectId,
  ) {
    await this.projectService.findOne(projectId, userId);
    const existingTranslate = await this.DictionaryModel.findById(dictionaryId);
    if (!existingTranslate) {
      throw new NotFoundException(
        `Translate with id ${dictionaryId} not found`,
      );
    }

    const updated = await this.DictionaryModel.findByIdAndUpdate(
      dictionaryId,
      updateTranslateDto,
      {
        new: true,
        runValidators: true,
      },
    );
    return updated;
  }

  async remove(dictionaryId: ObjectId, projectId: ObjectId, userId: ObjectId) {
    await this.projectService.findOne(projectId, userId);
    const existingTranslate = await this.DictionaryModel.findOne({
      _id: dictionaryId,
    });
    if (!existingTranslate) {
      throw new NotFoundException(
        `Translate with id ${dictionaryId} not found`,
      );
    }
    const deletedDictioary =
      await this.DictionaryModel.findByIdAndDelete(dictionaryId);
    return deletedDictioary;
  }
}
