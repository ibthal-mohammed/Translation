import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LanguageService } from './language.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Language } from './language.schema';
import mongoose, { ObjectId } from 'mongoose';

@ApiTags('Languages')
@ApiBearerAuth()
@Controller('languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The Language has been successfully created.',
    type: Language,
  })
  @ApiBadRequestResponse({
    description: 'The user cannot create language.',
  })
  create(@Body() createLanguageDto: CreateLanguageDto) {
    return this.languageService.create(createLanguageDto);
  }

  @Get()
  findAll() {
    return this.languageService.findAll();
  }

  @Get(':id')
  findById(@Param('id') _id: ObjectId) {
    return this.languageService.findById(_id);
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.languageService.findByCode(code);
  }
}
