import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { AuthGuard, interceptedRequest } from 'src/auth/auth.guard';
import { IsObjectIdPipe } from 'nestjs-object-id';
import { UpdateDictionaryDto, CreateDictionaryDto } from './dto';
import { Dictionary } from './dictionary.schema';

@ApiTags('Dictionaries')
@ApiBearerAuth()
@Controller('projects/:projectId/dictionaries')
@UseGuards(AuthGuard)
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The text has been successfully Translated.',
    type: Dictionary,
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
    @Body() createDictionaryDto: CreateDictionaryDto,
    @Param('projectId', IsObjectIdPipe) projectId: ObjectId,
    @Request() req: interceptedRequest,
  ) {
    const userId = req.user.id;
    return this.dictionaryService.addString(
      projectId,
      createDictionaryDto,
      userId,
    );
  }

  @Get()
  @ApiParam({
    name: 'projectId',
    type: String,
    description: 'The ID of the project',
  })
  findAll(
    @Param('projectId', IsObjectIdPipe) projectId: ObjectId,
    @Request() req: interceptedRequest,
  ) {
    const userId = req.user.id;
    return this.dictionaryService.findAll(projectId, userId);
  }

    @Get(':language')
    @ApiParam({
      name: 'projectId',
      type: String,
      description: 'The ID of the project',
    })
    @ApiParam({ name: 'language', type: String, description: 'The language' })
    findOne(
      @Param('projectId', IsObjectIdPipe) projectId: ObjectId,
      @Param('language') language: string,
      @Request() req: interceptedRequest,
    ) {
      const userId = req.user.id;
      return this.dictionaryService.findByLanguage(language, projectId, userId);
    }

    @Patch(':id')
    @ApiParam({
      name: 'projectId',
      type: String,
      description: 'The ID of the project',
    })
    @ApiParam({ name: 'id', type: String, description: 'The ID of the Text' })
    update(
      @Param('projectId', IsObjectIdPipe) projectId: ObjectId,
      @Param('id', IsObjectIdPipe) dictionaryId: ObjectId,
      @Request() req: interceptedRequest,

      @Body() updateDictionaryDto: UpdateDictionaryDto,
    ) {
      const userId = req.user.id;
      return this.dictionaryService.update(
        dictionaryId,
        updateDictionaryDto,
        userId,
        projectId,
      );
    }

    @Delete(':id')
    @ApiParam({
      name: 'projectId',
      type: String,
      description: 'The ID of the project',
    })
    @ApiParam({ name: 'id', type: String, description: 'The ID of the Text' })
    async remove(
      @Param('projectId', IsObjectIdPipe) projectId: ObjectId,
      @Param('id', IsObjectIdPipe) dictionaryId: ObjectId,
      @Request() req: interceptedRequest,
    ) {
      const userId = req.user.id;
      await this.dictionaryService.remove(dictionaryId, projectId, userId);
      return `This dictionary is removed`;
    }
}
