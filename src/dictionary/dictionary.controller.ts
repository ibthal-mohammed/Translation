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
import { TranslateService } from './dictionary.service';
import { CreateTranslateDto } from './dto/create-dictionary.dto';
import { UpdateTranslateDto } from './dto/update-dictionary.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { AuthGuard } from 'src/auth/auth.guard';
import { Translate } from './dictionary.model';
import { IsObjectIdPipe } from 'nestjs-object-id';

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
    @Param('projectId', IsObjectIdPipe) projectId: ObjectId,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.translateService.addString(
      projectId,
      createTranslateDto,
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
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.translateService.findAll(projectId, userId);
  }

  @Get(':id')
  @ApiParam({
    name: 'projectId',
    type: String,
    description: 'The ID of the project',
  })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the Text' })
  findOne(
    @Param('projectId', IsObjectIdPipe) projectId: ObjectId,
    @Param('id', IsObjectIdPipe) translateId: ObjectId,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.translateService.findOne(translateId, projectId, userId);
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
    @Param('id', IsObjectIdPipe) translateId: ObjectId,
    @Request() req,

    @Body() updateTranslateDto: UpdateTranslateDto,
  ) {
    const userId = req.user.id;
    return this.translateService.update(
      translateId,
      updateTranslateDto,
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
  remove(
    @Param('projectId', IsObjectIdPipe) projectId: ObjectId,
    @Param('id', IsObjectIdPipe) translateId: ObjectId,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.translateService.remove(translateId, projectId, userId);
  }
}
