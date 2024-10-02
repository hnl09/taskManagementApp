import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ReponseTaskDto } from './dto/response-task.dto';

@Controller('tasks')
@ApiTags('Tasks')
@UseGuards(AuthGuard('bearer'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, type: ReponseTaskDto, description: 'Create a task for the user.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  @ApiResponse({ status: 500, description: 'Failed to create task'})
  @ApiOperation({ summary: 'Create a task for the user.'})
  create(@Body() createTaskDto: CreateTaskDto, @Headers('authorization') token: string) {
    const splitToken = token.split(' ')[1]
    return this.tasksService.create(splitToken, createTaskDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: [ReponseTaskDto], description: 'Returns all user tasks.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  @ApiResponse({ status: 500, description: 'Failed to retrieve tasks'})
  @ApiOperation({ summary: 'Returns all user tasks.'})
  findAll(@Headers('authorization') token: string) {
    const splitToken = token.split(' ')[1]
    return this.tasksService.findAll(splitToken);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: ReponseTaskDto, description: 'Returns a user task by id.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  @ApiResponse({ status: 404, description: 'Task not found.'})
  @ApiResponse({ status: 500, description: 'Failed to retrieve task'})
  @ApiQuery({ name: 'id', description: 'Returns task based on document id' ,required: true, type: String })
  @ApiOperation({ summary: 'Returns a user task by document id.'})
  findOne(@Param('id') id: string, @Headers('authorization') token: string) {
    const splitToken = token.split(' ')[1]
    return this.tasksService.findOne(id, splitToken);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 200, type: ReponseTaskDto, description: 'Update a user task by document id.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  @ApiResponse({ status: 404, description: 'Task not found.'})
  @ApiResponse({ status: 500, description: 'Failed to update task'})
  @ApiQuery({ name: 'id', description: 'Returns task based on document id' ,required: true, type: String })
  @ApiOperation({ summary: 'Update a user task by document id.'})
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Headers('authorization') token: string) {
    const splitToken = token.split(' ')[1]
    return this.tasksService.update(id, splitToken, updateTaskDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'Delete a user task by document id.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  @ApiResponse({ status: 500, description: 'Failed to delete task'})
  @ApiQuery({ name: 'id', description: 'Returns task based on document id' ,required: true, type: String })
  @ApiOperation({ summary: 'Delete a user task by document id.'})
  remove(@Param('id') id: string, @Headers('authorization') token: string) {
    const splitToken = token.split(' ')[1]
    return this.tasksService.remove(id, splitToken);
  }
}
