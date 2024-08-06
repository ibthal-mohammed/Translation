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
    const { id } = req.user;
    return this.projectService.create(createProjectDto, id);
  }

  @Get()
  // @ApiCreatedResponse(Project)
  findAll(@Request() req) {
    const { id } = req.user;
    return this.projectService.findAllprojects(id);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'The ID of the project' })
  findOne(@Param('id') _id: ObjectId, @Request() req) {
    const { id } = req.user;
    return this.projectService.findOne(_id, id);
  }
  @Delete(':id')
  @ApiParam({ name: 'id', type: String, description: 'The ID of the project' })
  remove(@Param('id') _id: ObjectId, @Request() req) {
    const { id } = req.user;
    this.projectService.Delete(_id, id);
    return `This project is removed`;
  }
}
