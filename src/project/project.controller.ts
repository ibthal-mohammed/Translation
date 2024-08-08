import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ObjectId } from 'mongoose';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Project } from './project.model';
import { IsObjectIdPipe } from 'nestjs-object-id';

@ApiTags('project')
@ApiBearerAuth()
@Controller('project')
@UseGuards(AuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UsePipes(ValidationPipe)
  @Post()
  @ApiCreatedResponse({
    description: 'The project has been successfully created.',
    type: Project,
  })
  @ApiBadRequestResponse({
    description: 'The user cannot create project.',
  })
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    const userId = req.user.id;
    return this.projectService.create(createProjectDto, userId);
  }

  @Get()
  // @ApiCreatedResponse(Project)
  findAll(@Request() req) {
    const userId = req.user.id;
    return this.projectService.findAllprojects(userId);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'The ID of the project' })
  findOne(@Param('id', IsObjectIdPipe) projectId: ObjectId, @Request() req) {
    const userId = req.user.id;
    return this.projectService.findOne(projectId, userId);
  }
  @Delete(':id')
  @ApiParam({ name: 'id', type: String, description: 'The ID of the project' })
  remove(@Param('id', IsObjectIdPipe) ptojectId: ObjectId, @Request() req) {
    const userId = req.user.id;
    return this.projectService.Delete(ptojectId, userId);
  }
}
