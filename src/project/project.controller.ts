import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ObjectId } from 'mongoose';
import { AuthGuard, interceptedRequest } from 'src/auth/auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { IsObjectIdPipe } from 'nestjs-object-id';
import { Project } from './project.schema';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The project has been successfully created.',
    type: Project,
  })
  @ApiBadRequestResponse({
    description: 'The user cannot create project.',
  })
  create(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req: interceptedRequest,
  ) {
    const userId = req.user.id;
    // this.projectService.
    return this.projectService.create(createProjectDto, userId);
  }

  @Get()
  findAll(@Request() req: interceptedRequest) {
    const userId = req.user.id;
    return this.projectService.findAllprojects(userId);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'The ID of the project' })
  findOne(
    @Param('id', IsObjectIdPipe) projectId: ObjectId,
    @Request() req: interceptedRequest,
  ) {
    const userId = req.user.id;
    return this.projectService.findOne(projectId, userId);
  }
  @Delete(':id')
  @ApiParam({ name: 'id', type: String, description: 'The ID of the project' })
  async remove(
    @Param('id', IsObjectIdPipe) projectId: ObjectId,
    @Request() req: interceptedRequest,
  ) {
    const userId = req.user.id;
    await this.projectService.remove(projectId, userId);
    return `This project is removed`;
  }
}
