import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { TranslateService } from './translate.service';
import { CreateTranslateDto } from './dto/create-translate.dto';
import { UpdateTranslateDto } from './dto/update-translate.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { AuthGuard } from 'src/auth/auth.guard';
import { Translate } from './translat.model';

@ApiTags('translate')
@ApiBearerAuth()
@Controller('projects/:projectId/translate')
@UseGuards(AuthGuard)
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @UsePipes(ValidationPipe)
  @Post()
  @ApiCreatedResponse({
    description: 'The text has been successfully Translated.',
    type: Translate,
  })
  @ApiBadRequestResponse({
    description: 'The user cannot add text.',
  })
  @ApiParam({
    name: 'projectId',
    type: String,
    description: 'The ID of the project',
  })
  create(
    @Body() createTranslateDto: CreateTranslateDto,
    @Param('projectId') projectId: ObjectId,
    @Request() req,
  ) {
    const { id } = req.user;

    return this.translateService.addString(projectId, createTranslateDto, id);
  }

  @Get()
  @ApiParam({
    name: 'projectId',
    type: String,
    description: 'The ID of the project',
  })
  findAll(@Param('projectId') projectId: ObjectId) {
    return this.translateService.findAll(projectId);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'The ID of the Text' })
  findOne(@Param('id') _id: ObjectId) {
    return this.translateService.findOne(_id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String, description: 'The ID of the Text' })
  update(
    @Param('id') _id: ObjectId,
    @Body() updateTranslateDto: UpdateTranslateDto,
  ) {
    return this.translateService.update(_id, updateTranslateDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String, description: 'The ID of the Text' })
  remove(@Param('id') _id: ObjectId) {
    this.translateService.remove(_id);
    return `This project is removed`;
  }
}
