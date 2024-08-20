import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { Language } from './language.schema';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LanguageService {
  constructor(
    @InjectModel('language') protected languageModel: Model<Language>,
  ) {}

  async create(createLanguageDto: CreateLanguageDto) {
    const language = await this.languageModel.create(createLanguageDto);
    return language;
  }

  async findAll() {
    const languages = await this.languageModel.find();
    return languages;
  }

  async findById(id: ObjectId) {
    const language = await this.languageModel.findById(id);
    if (!language) {
      throw new NotFoundException('Language not found');
    }
    return language;
  }
  async findByCode(code:string) {
    const language = await this.languageModel.findOne({code});
    if (!language) {
      throw new NotFoundException('Language not found');
    }
    return language;
  }
}
